import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Pick Up Order (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let deliverymanFactory: DeliverymanFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, DeliverymanFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('[PATCH] /orders/pick-up', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      password: await hash('123456', 8),
    })

    const authResponse = await request(app.getHttpServer()).post('/auth').send({
      cpf: deliveryman.cpf,
      password: '123456',
    })

    const { accessToken } = authResponse.body

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      deliverymanId: deliveryman.id,
      recipientId: recipient.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/pick-up/${order.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      order: expect.objectContaining({
        id: order.id.toString(),
        deliverymanId: deliveryman.id.toString(),
        totalInCents: order.totalInCents,
        status: 'PICKED-UP',
      }),
    })
  })
})
