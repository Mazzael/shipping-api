import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'
import { OrderDeliveredEvent } from '@/domain/shipping/enterprise/events/order-delivered-event'

@Injectable()
export class OnOrderDelivered implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderDeliveredNotification.bind(this),
      OrderDeliveredEvent.name,
    )
  }

  private async sendOrderDeliveredNotification({ order }: OrderDeliveredEvent) {
    console.log('chega aqui')
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: 'Order delivered',
      content: `Your order was delivered on your address!`,
    })
  }
}
