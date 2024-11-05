import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/shipping/enterprise/entities/recipient'
import { Recipient as PrismaRecipient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { PrismaService } from '../prisma.service'
import { OrderList } from '@/domain/shipping/enterprise/entities/order-list'
import { PrismaOrderMapper } from './prisma-order-mapper'

export class PrismaRecipientMapper {
  static async toDomain(
    raw: PrismaRecipient,
    prisma: PrismaService,
  ): Promise<Recipient> {
    const prismaRecpientOrders = await prisma.order.findMany({
      where: {
        recipientId: raw.id,
      },
    })

    const recpientOrders = await Promise.all(
      prismaRecpientOrders.map((order) =>
        PrismaOrderMapper.toDomain(order, prisma),
      ),
    )


    return Recipient.create(
      {
        name: raw.name,
        email: raw.email,
        addressLatitude: raw.addressLatitude.toNumber(),
        addressLongitude: raw.addressLongitude.toNumber(),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        orders: new OrderList(recpientOrders),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): PrismaRecipient {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      addressLatitude: new Decimal(recipient.addressLatitude),
      addressLongitude: new Decimal(recipient.addressLongitude),
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt ?? null,
    }
  }
}
