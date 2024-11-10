import { Deliveryman } from '@/domain/shipping/enterprise/entities/deliveryman'
import { OrderPresenter } from './order-presenter'

export class DeliverymanPresenter {
  static toHTTP(deliveryman: Deliveryman) {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      orders: deliveryman.orders.currentItems.map((order) => {
        return OrderPresenter.toHTTP(order)
      }),
      createdAt: deliveryman.createdAt,
      updatedAt: deliveryman.updatedAt,
    }
  }
}
