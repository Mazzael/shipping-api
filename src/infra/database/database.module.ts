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
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    RecipientsRepository,
    DeliverymansRepository,
    AdminsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
