import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { compare, hash } from 'bcryptjs'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Change Deliveryman Password (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let adminFactory: AdminFactory
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    adminFactory = moduleRef.get(AdminFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[PATCH] /deliveryman', async () => {
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

    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      password: await hash('123123', 8),
    })

    const response = await request(app.getHttpServer())
      .patch(`/deliveryman`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        cpf: deliveryman.cpf,
        newPassword: '123456789',
      })

    const updatedDeliveryman = await prisma.user.findUnique({
      where: {
        id: deliveryman.id.toString(),
      },
    })

    expect(response.statusCode).toBe(204)

    if (!updatedDeliveryman) {
      return
    }

    expect(await compare('123456789', updatedDeliveryman?.password)).toBe(true)
  })
})
