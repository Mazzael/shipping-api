import { Recipient } from '@/domain/shipping/enterprise/entities/recipient'
import { OrderPresenter } from './order-presenter'

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      addressLatitude: recipient.addressLatitude,
      addressLongitude: recipient.addressLongitude,
      orders: recipient.orders.currentItems.map((order) => {
        return OrderPresenter.toHTTP(order)
      }),
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    }
  }
}
