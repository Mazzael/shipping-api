import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Deliveryman } from '@/domain/shipping/enterprise/entities/deliveryman'
import { User as PrismaDeliveryman } from '@prisma/client'

export class PrismaDeliverymanMapper {
  static toDomain(raw: PrismaDeliveryman): Deliveryman {
    return Deliveryman.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
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
