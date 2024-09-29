import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'
import { OrderReturnedEvent } from '@/domain/shipping/enterprise/events/order-returned-event'

@Injectable()
export class OnOrderReturned implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderReturnedNotification.bind(this),
      OrderReturnedEvent.name,
    )
  }

  private async sendOrderReturnedNotification({ order }: OrderReturnedEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: 'Order returned',
      content: `Your order was returned because no one was at your address when we attempt to deliver it.`,
    })
  }
}
