import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { PhotoFactory } from 'test/factories/make-photo'
import { RecipientFactory } from 'test/factories/make-recipient'
import { waitFor } from 'test/utils/wait-for'

describe('On Answer Created (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let photoFactory: PhotoFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, RecipientFactory, PhotoFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    photoFactory = moduleRef.get(PhotoFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when an order is delivered', async () => {
    const photo = await photoFactory.makePrismaPhoto()

    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await prisma.order.create({
      data: {
        recipientId: recipient.id.toString(),
        userId: deliveryman.id.toString(),
        total_in_cents: 15,
      },
    })

    const orderId = order.id.toString()

    await request(app.getHttpServer())
      .patch(`/order/deliver/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        photoId: photo.id.toString(),
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: recipient.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
