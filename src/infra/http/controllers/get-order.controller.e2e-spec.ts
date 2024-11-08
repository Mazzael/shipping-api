import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Get Order (E2E)', () => {
  let app: INestApplication
  let orderFactory: OrderFactory
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, OrderFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    orderFactory = moduleRef.get(OrderFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[GET] /order/profile', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()

    await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })

    const orderToBeReturned = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })

    await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })

    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      password: await hash('123456', 8),
    })

    const authResponse = await request(app.getHttpServer()).post('/auth').send({
      cpf: deliveryman.cpf,
      password: '123456',
    })

    const { accessToken } = authResponse.body

    const response = await request(app.getHttpServer())
      .get(`/order/${orderToBeReturned.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      order: expect.objectContaining({
        props: expect.objectContaining({
          totalInCents: orderToBeReturned.totalInCents,
          status: orderToBeReturned.status,
          createdAt: orderToBeReturned.createdAt.toISOString(), // Converte o `createdAt` para string
        }),
      }),
    })
  })
})
