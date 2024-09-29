import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from '@/core/entities/entity'
import { OrderList } from './order-list'

export interface RecipientProps {
  name: string
  email: string
  addressLatitude: number
  addressLongitude: number
  orders: OrderList
  createdAt: Date
  updatedAt?: Date | null
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get addressLatitude() {
    return this.props.addressLatitude
  }

  get addressLongitude() {
    return this.props.addressLongitude
  }

  get orders() {
    return this.props.orders
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  changeAddress(addressLatitude: number, addressLongitude: number) {
    this.props.addressLatitude = addressLatitude
    this.props.addressLongitude = addressLongitude
    this.touch()
  }

  static create(
    props: Optional<RecipientProps, 'createdAt' | 'orders'>,
    id?: UniqueEntityID,
  ) {
    const recipient = new Recipient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        orders: props.orders ?? new OrderList(),
      },
      id,
    )

    return recipient
  }
}
