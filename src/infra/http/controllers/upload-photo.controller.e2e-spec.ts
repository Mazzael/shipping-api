import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe(
  'Upload Photo (E2E)',
  () => {
    let app: INestApplication
    let deliverymanFactory: DeliverymanFactory
    let jwt: JwtService

    beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AppModule, DatabaseModule],
        providers: [DeliverymanFactory],
      }).compile()

      app = moduleRef.createNestApplication()

      deliverymanFactory = moduleRef.get(DeliverymanFactory)
      jwt = moduleRef.get(JwtService)

      await app.init()
    })

    test.skip('[POST] /photos', async () => {
      const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

      const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

      const response = await request(app.getHttpServer())
        .post('/photos')
        .set('Authorization', `Bearer ${accessToken}`)
        .attach('file', './test/e2e/sample.png')

      expect(response.statusCode).toBe(201)
      expect(response.body).toEqual({
        photoId: expect.any(String),
      })
    })
  },
  { timeout: 7000 },
)
