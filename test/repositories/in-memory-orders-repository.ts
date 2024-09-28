import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrdersRepository } from '@/domain/shipping/application/repositories/orders-repository'
import { Order } from '@/domain/shipping/enterprise/entities/order'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  async findById(id: string): Promise<Order> {
    const order = await this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findManyByDeliverymanId(deliverymanId: string) {
    const orders = await this.items.filter((order) => {
      return order.deliverymanId === new UniqueEntityID(deliverymanId)
    })

    return orders
  }

  async findManyByRecipientId(recipientId: string, { page }: PaginationParams) {
    const orders = await this.items.filter((order) => {
      return order.deliverymanId === new UniqueEntityID(recipientId)
    })

    return orders.slice((page - 1) * 20, page * 20)
  }

  async create(order: Order): Promise<void> {
    await this.items.push(order)
  }

  async delete(order: Order) {
    this.items = await this.items.filter((item) => {
      return item.id !== order.id
    })
  }
}
