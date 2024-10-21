import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /recipient', async () => {
    const response = await request(app.getHttpServer())
      .post('/recipient')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        addressLatitude: 123,
        addressLongitude: 321,
      })

    expect(response.statusCode).toBe(201)

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
  })
})
