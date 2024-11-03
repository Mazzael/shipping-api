import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/shipping/enterprise/entities/order'
import { Order as PrismaOrder } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { OrderItem } from '@/domain/shipping/enterprise/entities/order-item'

export class PrismaOrderMapper {
  static async toDomain(
    raw: PrismaOrder,
    prisma: PrismaService,
  ): Promise<Order> {
    const orderItems = await prisma.orderItems.findMany({
      where: { orderId: raw.id },
      include: { item: true },
    })

    const items = orderItems.map((orderItem) => {
      return OrderItem.create(
        {
          productName: orderItem.item.productName,
          price: orderItem.item.priceInCents,
          quantity: Number(orderItem.quantity),
        },
        new UniqueEntityID(orderItem.itemId),
      )
    })

    return Order.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        items,
        totalInCents: raw.total_in_cents,
        status: raw.status === 'PICKED_UP' ? 'PICKED-UP' : raw.status,
        createdAt: raw.createdAt,
        deliverymanId: raw.userId ? new UniqueEntityID(raw.userId) : undefined,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(order: Order): PrismaOrder {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      userId: order.deliverymanId ? order.deliverymanId?.toString() : null,
      status: order.status === 'PICKED-UP' ? 'PICKED_UP' : order.status,
      total_in_cents: order.totalInCents,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt ?? null,
    }
  }
}
