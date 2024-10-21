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
        role: raw.role === 'ADMIN' ? 'admin' : 'delivery-personnel',
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
      role: deliveryman.role === 'admin' ? 'ADMIN' : 'DELIVERYMAN',
      createdAt: deliveryman.createdAt,
      updatedAt: deliveryman.updatedAt ?? null,
    }
  }
}
