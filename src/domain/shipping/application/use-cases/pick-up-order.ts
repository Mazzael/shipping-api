import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Order } from '../../enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { OrdersRepository } from '../repositories/orders-repository'
import { DeliverymansRepository } from '../repositories/deliveryman-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface PickUpOrderUseCaseRequest {
  orderId: string
  deliverymanId: string
}

type PickUpOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class PickUpOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private deliverymansRepository: DeliverymansRepository,
  ) {}

  async execute({
    orderId,
    deliverymanId,
  }: PickUpOrderUseCaseRequest): Promise<PickUpOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const deliveryman =
      await this.deliverymansRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    order.deliverymanId = new UniqueEntityID(deliverymanId)

    deliveryman.orders.add(order)

    order.pickUpOrder()

    return right({ order })
  }
}
