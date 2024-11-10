import { OrderList } from '@/domain/shipping/enterprise/entities/order-list'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Get Deliveryman (E2E)', () => {
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

  test('[GET] /deliveryman/profile', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      password: await hash('123456', 8),
      orders: new OrderList(),
    })

    const authResponse = await request(app.getHttpServer()).post('/auth').send({
      cpf: deliveryman.cpf,
      password: '123456',
    })

    const { accessToken } = authResponse.body

    const response = await request(app.getHttpServer())
      .get(`/deliveryman/profile`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)

    const expectedDeliveryman = {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      createdAt: deliveryman.createdAt.toISOString(),
      updatedAt: deliveryman.updatedAt
        ? deliveryman.updatedAt.toISOString()
        : null,
    }

    const responseDeliveryman = {
      id: response.body.deliveryman.id,
      name: response.body.deliveryman.name,
      createdAt: response.body.deliveryman.createdAt,
      updatedAt: response.body.deliveryman.updatedAt,
    }

    expect(responseDeliveryman).toEqual(expectedDeliveryman)
  })
})
