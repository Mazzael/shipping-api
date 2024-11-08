import { OrdersRepository } from '@/domain/shipping/application/repositories/orders-repository'
import { PrismaService } from '../prisma.service'
import { Order } from '@/domain/shipping/enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order) {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })

    order.items.forEach(async (item) => {
      await this.prisma.orderItems.create({
        data: {
          orderId: order.id.toString(),
          itemId: item.id.toString(),
          quantity: item.quantity.toString(),
          priceInCents: item.quantity * item.price,
        },
      })
    })

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async findById(id: string) {
    const prismaOrder = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })

    if (!prismaOrder) {
      return null
    }

    const order = await PrismaOrderMapper.toDomain(prismaOrder, this.prisma)

    return order
  }

  async findManyByRecipientId(recipientId: string, { page }: PaginationParams) {
    const prismaOrders = await this.prisma.order.findMany({
      where: {
        recipientId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 20,
      skip: (page - 1) * 20,
    })

    const orders = await Promise.all(
      prismaOrders.map((prismaOrder) =>
        PrismaOrderMapper.toDomain(prismaOrder, this.prisma),
      ),
    )

    return orders
  }

  async findManyByDeliverymanId(
    deliverymanId: string,
    { page }: PaginationParams,
  ) {
    const prismaOrders = await this.prisma.order.findMany({
      where: {
        userId: deliverymanId,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 20,
      skip: (page - 1) * 20,
    })

    const orders = await Promise.all(
      prismaOrders.map((prismaOrder) =>
        PrismaOrderMapper.toDomain(prismaOrder, this.prisma),
      ),
    )

    return orders
  }

  async save(order: Order) {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: data.id,
      },

      data,
    })

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async delete(order: Order) {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.delete({
      where: {
        id: data.id,
      },
    })
  }
}
