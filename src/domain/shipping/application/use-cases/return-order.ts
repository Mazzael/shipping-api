import { Either, left, right } from '@/core/either'
import { NotAllowedError } from './errors/not-allowed-error'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { DomainEvents } from '@/core/events/domain-events'

interface ReturnOrderUseCaseRequest {
  deliverymanId: string
  orderId: string
}

type ReturnOrderUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    order: Order
  }
>

export class ReturnOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    deliverymanId,
    orderId,
  }: ReturnOrderUseCaseRequest): Promise<ReturnOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order || !order.deliverymanId) {
      return left(new ResourceNotFoundError())
    }

    if (deliverymanId !== order.deliverymanId.toString()) {
      return left(new NotAllowedError())
    }

    order.returnOrder()

    await this.ordersRepository.save(order)

    DomainEvents.dispatchEventsForAggregate(order.id)

    return right({ order })
  }
}
