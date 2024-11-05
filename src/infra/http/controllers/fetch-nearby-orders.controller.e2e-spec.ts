import { OrderList } from '@/domain/shipping/enterprise/entities/order-list'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe.only('Fetch Nearby Orders (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test.only('[GET] /deliveryman/orders/nearby', async () => {
    const recipient = await recipientFactory.makePrismaRecipient({
      addressLatitude: -21.263227,
      addressLongitude: -47.828325,
    })

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

    order1.pickUpOrder()
    order2.pickUpOrder()

    await prisma.order.update({
      where: {
        id: order1.id.toString(),
      },
      data: {
        status: 'PICKED_UP',
      },
    })

    await prisma.order.update({
      where: {
        id: order2.id.toString(),
      },
      data: {
        status: 'PICKED_UP',
      },
    })

    const authResponse = await request(app.getHttpServer()).post('/auth').send({
      cpf: deliveryman.cpf,
      password: '123456',
    })

    const { accessToken } = authResponse.body

    const response = await request(app.getHttpServer())
      .get(`/deliveryman/orders/nearby`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        deliverymanLatitude: -21.262895,
        deliverymanLongitude: -47.827572,
      })

    expect(response.statusCode).toBe(200)

    const expectedOrders = [order1, order2].map((order) => ({
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
      id: order._id.value,
      recipientId: order.props.recipientId.value,
      deliverymanId: order.props.deliverymanId.value,
      status: order.props.status,
      totalInCents: order.props.totalInCents,
      createdAt: order.props.createdAt,
    }))

    expect(responseOrders).toEqual(expect.arrayContaining(expectedOrders))
  })
})
