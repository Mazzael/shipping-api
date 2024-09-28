import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Order } from './order'
import { Entity } from '@/core/entities/entity'

export interface RecipientProps {
  name: string
  email: string
  addressLatitude: number
  addressLongitude: number
  orders: Order[]
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

  set addressLatitude(addressLatitude: number) {
    this.props.addressLatitude = addressLatitude
    this.touch()
  }

  set addressLongitude(addressLongitude: number) {
    this.props.addressLongitude = addressLongitude
    this.touch()
  }

  set orders(orders: Order[]) {
    this.props.orders = orders
    this.touch()
  }

  static create(
    props: Optional<RecipientProps, 'orders'>,
    id?: UniqueEntityID,
  ) {
    const recipient = new Recipient(
      {
        ...props,
        orders: props.orders ?? [],
      },
      id,
    )

    return recipient
  }
}
