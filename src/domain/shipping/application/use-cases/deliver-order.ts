import { Either, left, right } from '@/core/either'
import { NotAllowedError } from './errors/not-allowed-error'
import { Order } from '../../enterprise/entities/order'
import { PhotosRepository } from '../repositories/photos-repository'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvents } from '@/core/events/domain-events'
import { Injectable } from '@nestjs/common'

interface DeliverOrderUseCaseRequest {
  deliverymanId: string
  orderId: string
  photoId: string
}

type DeliverOrderUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class DeliverOrderUseCase {
  constructor(
    private photosRepository: PhotosRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    deliverymanId,
    orderId,
    photoId,
  }: DeliverOrderUseCaseRequest): Promise<DeliverOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order || !order.deliverymanId) {
      return left(new ResourceNotFoundError())
    }

    if (deliverymanId !== order.deliverymanId.toString()) {
      return left(new NotAllowedError())
    }

    const photo = await this.photosRepository.findById(photoId)

    if (!photo) {
      return left(new ResourceNotFoundError())
    }

    photo.orderId = new UniqueEntityID(orderId)

    await this.photosRepository.save(photo)

    order.deliverOrder()

    await this.ordersRepository.save(order)

    DomainEvents.dispatchEventsForAggregate(order.id)

    return right({ order })
  }
}
