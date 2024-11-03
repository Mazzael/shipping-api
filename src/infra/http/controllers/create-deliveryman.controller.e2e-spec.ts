import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

describe('Create Deliveryman (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[POST] /deliveryman', async () => {
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

    const response = await request(app.getHttpServer())
      .post('/deliveryman')
      .set('Authorization', `Bearer ${accessToken}`)
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
