import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'
import { OrderCreatedEvent } from '@/domain/shipping/enterprise/events/order-created-event'

@Injectable()
export class OnOrderCreated implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderCreatedNotification.bind(this),
      OrderCreatedEvent.name,
    )
  }

  private async sendOrderCreatedNotification({ order }: OrderCreatedEvent) {
    await this.sendNotification.execute({
      recipientId: order.recipientId.toString(),
      title: 'Order is pending',
      content: `Your order was successfully registered and is now waiting for a deliveryman to pick it up!`,
    })
  }
}
