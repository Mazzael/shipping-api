import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface OrderItemProps {
  productName: string
  quantity: number
  price: number
}

export class OrderItem extends Entity<OrderItemProps> {
  get productName() {
    return this.props.productName
  }

  get quantity() {
    return this.props.quantity
  }

  get price() {
    return this.props.price
  }

  static create(props: OrderItemProps, id?: UniqueEntityID) {
    const orderItem = new OrderItem(
      {
        price: props.price,
        productName: props.productName,
        quantity: props.quantity,
      },
      id,
    )

    return orderItem
  }
}
