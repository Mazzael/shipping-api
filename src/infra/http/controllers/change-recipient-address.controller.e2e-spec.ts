import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Change Recipient Address (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let deliverymanFactory: DeliverymanFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[PATCH] /recipient', async () => {
    const admin = await deliverymanFactory.makePrismaDeliveryman({
      password: await hash('123456', 8),
      role: 'admin',
    })

    const authResponse = await request(app.getHttpServer()).post('/auth').send({
      cpf: admin.cpf,
      password: '123456',
    })

    const { accessToken } = authResponse.body

    const recipient = await recipientFactory.makePrismaRecipient({
      addressLatitude: 789,
      addressLongitude: 987,
    })

    const recipientId = recipient.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/recipient/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        addressLatitude: 123,
        addressLongitude: 321,
      })

    const updatedRecipient = await prisma.recipient.findUnique({
      where: {
        email: recipient.email,
      },
    })

    expect(response.statusCode).toBe(204)

    expect(updatedRecipient?.addressLatitude.toNumber()).toBe(123)
    expect(updatedRecipient?.addressLongitude.toNumber()).toBe(321)
  })
})
