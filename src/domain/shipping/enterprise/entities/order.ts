import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItem } from './order-item'
import { OrderPickedUpEvent } from '../events/order-picked-up-event'
import { OrderCreatedEvent } from '../events/order-created-event'

export type OrderStatus = 'PENDING' | 'DELIVERED' | 'RETURNED' | 'PICKED-UP'

export interface OrderProps {
  recipientId: UniqueEntityID
  deliverymanId?: UniqueEntityID
  status: OrderStatus
  items: OrderItem[]
  createdAt: Date
  updatedAt?: Date
}

export class Order extends AggregateRoot<OrderProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get deliverymanId() {
    return this.props.deliverymanId
  }

  get status() {
    return this.props.status
  }

  get items() {
    return this.props.items
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  pickUpOrder() {
    this.props.status = 'PICKED-UP'
    this.addDomainEvent(new OrderPickedUpEvent(this))
    this.touch()
  }

  deliverOrder() {
    this.props.status = 'DELIVERED'
    this.touch()
  }

  returnOrder() {
    this.props.status = 'RETURNED'
    this.touch()
  }

  set deliverymanId(deliverymanId: UniqueEntityID) {
    this.props.deliverymanId = deliverymanId
    this.touch()
  }

  static create(props: OrderProps, id?: UniqueEntityID) {
    const order = new Order(props, id)

    const isNewOrder = !id

    if (isNewOrder) {
      order.addDomainEvent(new OrderCreatedEvent(order))
    }

    return order
  }
}
