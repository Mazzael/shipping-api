import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DeliverymansRepository } from '@/domain/shipping/application/repositories/deliveryman-repository'
import { Deliveryman } from '@/domain/shipping/enterprise/entities/deliveryman'
import { PrismaDeliverymanMapper } from '../mappers/prisma-deliveryman-mapper'

@Injectable()
export class PrismaDeliverymansRepository implements DeliverymansRepository {
  constructor(private prisma: PrismaService) {}

  async create(deliveryman: Deliveryman) {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.create({
      data: {
        ...data,
      },
    })
  }

  async findById(id: string) {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman, this.prisma)
  }

  async findByCPF(cpf: string) {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        cpf,
        role: 'DELIVERYMAN',
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman, this.prisma)
  }

  async save(deliveryman: Deliveryman) {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },

      data,
    })
  }

  async delete(deliveryman: Deliveryman) {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.delete({
      where: {
        id: data.id,
      },
    })
  }
}
