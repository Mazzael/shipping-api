import { DomainEvents } from '@/core/events/domain-events'
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
import { waitFor } from 'test/utils/wait-for'

describe('On Answer Created (E2E)', () => {
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

    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderItemFactory = moduleRef.get(OrderItemFactory)
    prisma = moduleRef.get(PrismaService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when an order is created', async () => {
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

    const result = await request(app.getHttpServer())
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

    const orderId = result.body.order._id.value

    await request(app.getHttpServer())
      .patch(`/order/deliver/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: recipient.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
