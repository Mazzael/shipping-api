import { OrderList } from '@/domain/shipping/enterprise/entities/order-list'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Fetch Deliveryman Orders (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('[GET] /deliveryman/orders', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()

    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      password: await hash('123456', 8),
      orders: new OrderList(),
    })

    const order1 = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      deliverymanId: deliveryman.id,
    })
    const order2 = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      deliverymanId: deliveryman.id,
    })
    const order3 = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
      deliverymanId: deliveryman.id,
    })

    deliveryman.orders.update([order1, order2, order3])

    const authResponse = await request(app.getHttpServer()).post('/auth').send({
      cpf: deliveryman.cpf,
      password: '123456',
    })

    const { accessToken } = authResponse.body

    const response = await request(app.getHttpServer())
      .get(`/deliveryman/orders`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const expectedOrders = [order1, order2, order3].map((order) => ({
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      deliverymanId: order.deliverymanId
        ? order.deliverymanId.toString()
        : null,
      status: order.status,
      totalInCents: order.totalInCents,
      createdAt: order.createdAt.toISOString(),
    }))

    const responseOrders = response.body.orders.map((order) => ({
      id: order.id,
      recipientId: order.recipientId,
      deliverymanId: order.deliverymanId,
      status: order.status,
      totalInCents: order.totalInCents,
      createdAt: order.createdAt,
    }))

    expect(responseOrders).toEqual(expect.arrayContaining(expectedOrders))
  })
})
