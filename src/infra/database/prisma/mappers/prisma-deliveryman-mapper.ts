import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Deliveryman } from '@/domain/shipping/enterprise/entities/deliveryman'
import { User as PrismaDeliveryman } from '@prisma/client'
import { PrismaService } from '../prisma.service'
import { PrismaOrderMapper } from './prisma-order-mapper'
import { OrderList } from '@/domain/shipping/enterprise/entities/order-list'

export class PrismaDeliverymanMapper {
  static async toDomain(
    raw: PrismaDeliveryman,
    prisma: PrismaService,
  ): Promise<Deliveryman> {
    const prismaDeliverymanOrders = await prisma.order.findMany({
      where: {
        userId: raw.id,
      },
    })

    const deliverymanOrders = await Promise.all(
      prismaDeliverymanOrders.map((order) =>
        PrismaOrderMapper.toDomain(order, prisma),
      ),
    )

    return Deliveryman.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        orders: new OrderList(deliverymanOrders),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(deliveryman: Deliveryman): PrismaDeliveryman {
    return {
      id: deliveryman.id.toString(),
      cpf: deliveryman.cpf,
      name: deliveryman.name,
      password: deliveryman.password,
      role: 'DELIVERYMAN',
      createdAt: deliveryman.createdAt,
      updatedAt: deliveryman.updatedAt ?? null,
    }
  }
}
