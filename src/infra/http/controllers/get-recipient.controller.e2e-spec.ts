import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Get Recipient (E2E)', () => {
  let app: INestApplication
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[GET] /recipient/profile', async () => {
    const admin = await adminFactory.makePrismaAdmin({
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

    const response = await request(app.getHttpServer())
      .get(`/recipient/${recipient.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      recipient: expect.objectContaining({
        name: recipient.name,
        email: recipient.email,
        addressLatitude: recipient.addressLatitude,
        addressLongitude: recipient.addressLongitude,
      }),
    })
  })
})
