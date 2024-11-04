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
import { PhotosRepository } from '@/domain/shipping/application/repositories/photos-repository'
import { PrismaPhotosRepository } from './prisma/repositories/prisma-photos-repository'

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
    {
      provide: PhotosRepository,
      useClass: PrismaPhotosRepository,
    },
  ],
  exports: [
    PrismaService,
    RecipientsRepository,
    DeliverymansRepository,
    AdminsRepository,
    OrdersRepository,
    PhotosRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
