import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { RecipientFactory } from 'test/factories/make-recipient'
import { OrderFactory } from 'test/factories/make-order'
import { AdminFactory } from 'test/factories/make-admin'

describe('Fetch Recipient Orders (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        RecipientFactory,
        RecipientFactory,
        OrderFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('[GET] /recipient/orders', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      cpf: '123456789',
      password: await hash('123456', 8),
    })

    const authResponse = await request(app.getHttpServer())
      .post('/admin/auth')
      .send({
        cpf: admin.cpf,
        password: '123456',
      })

    const { accessToken } = authResponse.body

    const recipient = await recipientFactory.makePrismaRecipient()

    const order1 = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })
    const order2 = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })
    const order3 = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })

    recipient.orders.update([order1, order2, order3])

    const recipient2 = await recipientFactory.makePrismaRecipient()

    const orderToNotAppear = await orderFactory.makePrismaOrder({
      recipientId: recipient2.id,
    })

    recipient2.orders.update([orderToNotAppear])

    const response = await request(app.getHttpServer())
      .get(`/recipient/orders`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id.toString(),
      })

    expect(response.statusCode).toBe(200)

    const expectedOrders = [order1, order2, order3].map((order) => ({
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      status: order.status,
      totalInCents: order.totalInCents,
      createdAt: order.createdAt.toISOString(),
    }))

    const responseOrders = response.body.orders.map((order) => ({
      id: order._id.value,
      recipientId: order.props.recipientId.value,
      status: order.props.status,
      totalInCents: order.props.totalInCents,
      createdAt: order.props.createdAt,
    }))

    expect(responseOrders).toEqual(expect.arrayContaining(expectedOrders))
    expect(responseOrders).not.toEqual(
      expect.arrayContaining([
        {
          id: orderToNotAppear.id.toString(),
          recipientId: orderToNotAppear.recipientId.toString(),
          status: orderToNotAppear.status,
          totalInCents: orderToNotAppear.totalInCents,
          createdAt: orderToNotAppear.createdAt.toISOString(),
        },
      ]),
    )
  })
})
