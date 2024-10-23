import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Admin } from '@/domain/shipping/enterprise/entities/admin'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'
import { AdminsRepository } from '@/domain/shipping/application/repositories/admins-repository'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private prisma: PrismaService) {}

  async create(admin: Admin) {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.create({
      data: {
        ...data,
        role: 'ADMIN',
      },
    })
  }

  async findById(id: string) {
    const admin = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async findByCPF(cpf: string) {
    const admin = await this.prisma.user.findUnique({
      where: {
        cpf,
        role: 'ADMIN',
      },
    })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async save(admin: Admin) {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.recipient.update({
      where: {
        id: data.id,
      },

      data,
    })
  }

  async delete(admin: Admin) {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.recipient.delete({
      where: {
        id: data.id,
      },
    })
  }
}
