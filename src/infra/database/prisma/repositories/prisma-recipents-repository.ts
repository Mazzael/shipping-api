import {
  FindManyNearbyParams,
  RecipientsRepository,
} from '@/domain/shipping/application/repositories/recipients-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Recipient } from '@/domain/shipping/enterprise/entities/recipient'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'
import { Order } from '@/domain/shipping/enterprise/entities/order'
import { Recipient as PrismaRecipient } from '@prisma/client'

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient) {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.create({
      data,
    })
  }

  async findById(id: string) {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient, this.prisma)
  }

  async findByEmail(email: string) {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        email,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient, this.prisma)
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Order[]> {
    const prismaRecipients = await this.prisma.$queryRaw<PrismaRecipient[]>`
        SELECT * from recipients
        WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( address_latitude ) ) * cos( radians( address_longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( address_latitude ) ) ) ) <= 10
    `

    const addaptedPrismaRecipients: PrismaRecipient[] = []

    prismaRecipients.forEach((prismaRecipient) => {
      addaptedPrismaRecipients.push({
        id: prismaRecipient.id,
        email: prismaRecipient.email,
        name: prismaRecipient.name,
        // @ts-ignore
        addressLatitude: prismaRecipient.address_latitude, 
        // @ts-ignore
        addressLongitude: prismaRecipient.address_longitude,
        createdAt: prismaRecipient.createdAt,
        updatedAt: prismaRecipient.updatedAt,
      })
    })

    const recipients = await Promise.all(
      addaptedPrismaRecipients.map((prismaRecipient) =>
        PrismaRecipientMapper.toDomain(prismaRecipient, this.prisma),
      ),
    )

    const nearbyOrders: Order[] = []

    recipients.forEach((recipient) => {
      recipient.orders.currentItems.forEach((order) => {
        if (order.status === 'PICKED-UP') {
          nearbyOrders.push(order)
        }
      })
    })

    return nearbyOrders
  }

  async save(recipient: Recipient) {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.update({
      where: {
        id: data.id,
      },

      data,
    })
  }

  async delete(recipient: Recipient) {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.delete({
      where: {
        id: data.id,
      },
    })
  }
}
