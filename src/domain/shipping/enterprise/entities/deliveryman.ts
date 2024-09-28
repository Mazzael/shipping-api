import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderList } from './order-list'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'

export interface DeliverymanProps {
  name: string
  cpf: string
  password: string
  orders: OrderList
  createdAt: Date
  updatedAt?: Date | null
}

export class Deliveryman extends Entity<DeliverymanProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  get orders() {
    return this.props.orders
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

  changePassword(newPassword: string) {
    this.props.password = newPassword
    this.touch()
  }

  static create(
    props: Optional<DeliverymanProps, 'orders' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const deliveryman = new Deliveryman(
      {
        ...props,
        orders: props.orders ?? new OrderList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return deliveryman
  }
}
