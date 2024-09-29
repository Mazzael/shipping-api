import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'
import { OrderPickedUpEvent } from '@/domain/shipping/enterprise/events/order-picked-up-event'

@Injectable()
export class OnOrderPickUp implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderPickedUpNotification.bind(this),
      OrderPickedUpEvent.name,
    )
  }

  private async sendOrderPickedUpNotification({ order }: OrderPickedUpEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: 'Order picked up',
      content: `Your order with these items: ${order.items} has been picked up`,
    })
  }
}
