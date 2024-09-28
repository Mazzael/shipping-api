import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  OrderItem,
  OrderItemProps,
} from '@/domain/shipping/enterprise/entities/order-item'

export function makeOrderItem(
  override: Partial<OrderItemProps> = {},
  id?: UniqueEntityID,
) {
  const order = OrderItem.create(
    {
      price: 10,
      productName: 'desk',
      quantity: 1,
      ...override,
    },
    id,
  )

  return order
}
