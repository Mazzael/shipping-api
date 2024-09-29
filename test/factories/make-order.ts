import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Order, OrderProps } from '@/domain/shipping/enterprise/entities/order'
import { randomInt } from 'node:crypto'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      recipientId: new UniqueEntityID(),
      items: [],
      totalInCents: randomInt(100),
      createdAt: new Date(),
      status: 'DELIVERED',
      ...override,
    },
    id,
  )

  return order
}
