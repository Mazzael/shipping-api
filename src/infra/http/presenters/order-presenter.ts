import { Order } from '@/domain/shipping/enterprise/entities/order'

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      deliverymanId: order.deliverymanId?.toString(),
      status: order.status,
      totalInCents: order.totalInCents,
      items: order.items,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
