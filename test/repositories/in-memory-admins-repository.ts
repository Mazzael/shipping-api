import { AdminsRepository } from '@/domain/shipping/application/repositories/admins-repository'
import { Admin } from '@/domain/shipping/enterprise/entities/admin'

export class InMemoryAdminsRepository implements AdminsRepository {
  public items: Admin[] = []

  async findById(id: string) {
    const admin = this.items.find((item) => item.id.toString() === id)

    if (!admin) {
      return null
    }

    return admin
  }

  async findByCPF(cpf: string) {
    const admin = this.items.find((item) => item.cpf.toString() === cpf)

    if (!admin) {
      return null
    }

    return admin
  }

  async create(admin: Admin) {
    this.items.push(admin)
  }

  async save(admin: Admin) {
    const itemIndex = this.items.findIndex((item) => item.id === admin.id)

    this.items[itemIndex] = admin
  }

  async delete(admin: Admin) {
    const itemIndex = this.items.findIndex((item) => item.id === admin.id)

    this.items.splice(itemIndex, 1)
  }
}
