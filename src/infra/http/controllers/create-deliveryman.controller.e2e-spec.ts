import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Deliveryman (E2E)', () => {
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

  test('[POST] /deliveryman', async () => {
    const response = await request(app.getHttpServer())
      .post('/deliveryman')
      .send({
        name: 'John Doe',
        cpf: '12345678955',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)

    const deliverymanOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '12345678955',
      },
    })

    expect(deliverymanOnDatabase).toBeTruthy()
    expect(deliverymanOnDatabase?.role).toBe('DELIVERYMAN')
  })
})
