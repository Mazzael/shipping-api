import { DeliverymansRepository } from '@/domain/shipping/application/repositories/deliveryman-repository'
import { Deliveryman } from '@/domain/shipping/enterprise/entities/deliveryman'

export class InMemoryDeliverymansRepository implements DeliverymansRepository {
  public items: Deliveryman[] = []

  async findById(id: string) {
    const deliveryman = this.items.find((item) => item.id.toString() === id)

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async findByCPF(cpf: string) {
    const deliveryman = this.items.find((item) => item.cpf.toString() === cpf)

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async create(deliveryman: Deliveryman) {
    this.items.push(deliveryman)
  }

  async save(deliveryman: Deliveryman) {
    const itemIndex = this.items.findIndex((item) => item.id === deliveryman.id)

    this.items[itemIndex] = deliveryman
  }

  async delete(deliveryman: Deliveryman) {
    const itemIndex = this.items.findIndex((item) => item.id === deliveryman.id)

    this.items.splice(itemIndex, 1)
  }
}
