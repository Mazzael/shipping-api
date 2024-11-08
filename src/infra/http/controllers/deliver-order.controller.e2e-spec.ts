import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { PhotoFactory } from 'test/factories/make-photo'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Deliver Order (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let photoFactory: PhotoFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliverymanFactory,
        RecipientFactory,
        OrderFactory,
        PhotoFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    photoFactory = moduleRef.get(PhotoFactory)

    await app.init()
  })

  test('[PATCH] /order', async () => {
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
      recipientId: recipient.id,
      deliverymanId: deliveryman.id,
    })

    const photo = await photoFactory.makePrismaPhoto()

    const response = await request(app.getHttpServer())
      .patch(`/order/deliver/${order.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        photoId: photo.id.toString(),
      })

    expect(response.statusCode).toBe(204)

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: order.id.toString(),
      },
    })

    expect(orderOnDatabase).toBeTruthy()
    expect(order.status).toBe('DELIVERED')

    const photoOnDatabase = await prisma.photo.findUnique({
      where: {
        id: photo.id.toString(),
      },
    })

    expect(photoOnDatabase).toBeTruthy()
    expect(photoOnDatabase?.orderId).toBe(order.id.toString())
  })
})
