import { OrderList } from '@/domain/shipping/enterprise/entities/order-list'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { OrderItemFactory } from 'test/factories/make-order-item'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Create Recipient Order (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let orderItemFactory: OrderItemFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, OrderItemFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderItemFactory = moduleRef.get(OrderItemFactory)

    await app.init()
  })

  test('[POST] /order', async () => {
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

    const recipient = await recipientFactory.makePrismaRecipient({
      orders: new OrderList([]),
    })

    const orderItem1 = await orderItemFactory.makePrismaOrderItem({
      price: 10,
      quantity: 2,
    })

    const orderItem2 = await orderItemFactory.makePrismaOrderItem({
      price: 15,
      quantity: 1,
    })

    const orderItem3 = await orderItemFactory.makePrismaOrderItem({
      price: 30,
      quantity: 4,
    })

    const response = await request(app.getHttpServer())
      .post('/order')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient.id.toString(),
        items: [
          {
            id: orderItem1.id.toString(),
            productName: orderItem1.productName,
            quantity: orderItem1.quantity,
            price: orderItem1.price,
          },
          {
            id: orderItem2.id.toString(),
            productName: orderItem2.productName,
            quantity: orderItem2.quantity,
            price: orderItem2.price,
          },
          {
            id: orderItem3.id.toString(),
            productName: orderItem3.productName,
            quantity: orderItem3.quantity,
            price: orderItem3.price,
          },
        ],
      })

    expect(response.statusCode).toBe(201)

    const orderOnDatabase = await prisma.order.findUnique({
      where: {
        id: response.body.order.id,
      },
    })

    expect(orderOnDatabase).toBeTruthy()
    expect(orderOnDatabase?.recipientId).toBe(recipient.id.toString())
  })
})
