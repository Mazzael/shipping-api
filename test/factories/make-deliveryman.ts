import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Deliveryman,
  DeliverymanProps,
} from '@/domain/shipping/enterprise/entities/deliveryman'
import { PrismaDeliverymanMapper } from '@/infra/database/prisma/mappers/prisma-deliveryman-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeDeliveryman(
  override: Partial<DeliverymanProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryman = Deliveryman.create(
    {
      name: faker.person.fullName(),
      cpf: faker.internet.userName(),
      password: faker.internet.password(),
      role: 'delivery-personnel',
      ...override,
    },
    id,
  )

  return deliveryman
}

@Injectable()
export class DeliverymanFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryman(
    data: Partial<DeliverymanProps> = {},
  ): Promise<Deliveryman> {
    const deliveryman = makeDeliveryman(data)

    await this.prisma.user.create({
      data: PrismaDeliverymanMapper.toPrisma(deliveryman),
    })

    return deliveryman
  }
}
