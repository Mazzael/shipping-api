import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

export interface PhotoProps {
  title: string
  url: string
  orderId?: UniqueEntityID
  createdAt: Date
}

export class Photo extends Entity<PhotoProps> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  get orderId(): UniqueEntityID | null {
    return this.props.orderId ?? null
  }

  set orderId(id: UniqueEntityID) {
    this.props.orderId = id
  }

  static create(props: PhotoProps, id?: UniqueEntityID) {
    const photo = new Photo(props, id)

    return photo
  }
}
