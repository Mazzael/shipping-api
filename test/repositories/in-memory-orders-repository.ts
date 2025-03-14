import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrdersRepository } from '@/domain/shipping/application/repositories/orders-repository'
import { Order } from '@/domain/shipping/enterprise/entities/order'

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = []

  async findById(id: string) {
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

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async save(order: Order): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order
  }

  async delete(order: Order) {
    this.items = await this.items.filter((item) => {
      return item.id !== order.id
    })
  }
}
