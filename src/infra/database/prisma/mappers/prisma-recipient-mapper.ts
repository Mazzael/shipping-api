import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/shipping/enterprise/entities/recipient'
import { Recipient as PrismaRecipient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        email: raw.email,
        addressLatitude: raw.addressLatitude.toNumber(),
        addressLongitude: raw.addressLongitude.toNumber(),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
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
