import { Either, left, right } from '@/core/either'
import { NotAllowedError } from './errors/not-allowed-error'
import { Order } from '../../enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

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

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (deliverymanId !== order.deliverymanId.toString()) {
      return left(new NotAllowedError())
    }

    order.returnOrder()

    return right({ order })
  }
}
