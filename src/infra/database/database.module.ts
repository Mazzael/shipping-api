import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { RecipientsRepository } from '@/domain/shipping/application/repositories/recipients-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipents-repository'
import { DeliverymansRepository } from '@/domain/shipping/application/repositories/deliveryman-repository'
import { PrismaDeliverymansRepository } from './prisma/repositories/prisma-deliverymans-repository'
import { AdminsRepository } from '@/domain/shipping/application/repositories/admins-repository'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { OrdersRepository } from '@/domain/shipping/application/repositories/orders-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: DeliverymansRepository,
      useClass: PrismaDeliverymansRepository,
    },
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    RecipientsRepository,
    DeliverymansRepository,
    AdminsRepository,
    OrdersRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
