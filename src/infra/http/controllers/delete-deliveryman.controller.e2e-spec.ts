import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Delete Deliveryman (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let deliverymanFactory: DeliverymanFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  test('[DELETE] /deliveryman', async () => {
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

    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const response = await request(app.getHttpServer())
      .delete(`/deliveryman/${deliveryman.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const deliverymanOnDatabase = await prisma.user.findUnique({
      where: {
        id: deliveryman.id.toString(),
      },
    })

    expect(deliverymanOnDatabase).toBeNull()
  })
})
