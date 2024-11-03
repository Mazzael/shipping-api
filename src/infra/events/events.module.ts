import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnOrderCreated } from '@/domain/notification/application/subscribers/on-order-created'
import { OnOrderDelivered } from '@/domain/notification/application/subscribers/on-order-delivered'
import { OnOrderPickUp } from '@/domain/notification/application/subscribers/on-order-pickup'
import { OnOrderReturned } from '@/domain/notification/application/subscribers/on-order-returned'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnOrderCreated,
    OnOrderDelivered,
    OnOrderPickUp,
    OnOrderReturned,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
