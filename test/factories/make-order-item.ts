import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  OrderItem,
  OrderItemProps,
} from '@/domain/shipping/enterprise/entities/order-item'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class OrderItemFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrderItem(
    data: Partial<OrderItemProps> = {},
  ): Promise<OrderItem> {
    const orderitem = makeOrderItem(data)

    await this.prisma.item.create({
      data: {
        id: orderitem.id.toString(),
        productName: orderitem.productName,
        priceInCents: orderitem.price,
      },
    })

    return orderitem
  }
}
