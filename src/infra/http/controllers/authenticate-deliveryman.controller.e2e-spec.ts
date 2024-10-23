import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Auth deliveryman (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  test('[POST] /auth', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer()).post('/auth').send({
      cpf: deliveryman.cpf,
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
  })
})
