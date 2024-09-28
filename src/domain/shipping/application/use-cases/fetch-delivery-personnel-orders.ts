import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Order } from '../../enterprise/entities/order'
import { DeliverymansRepository } from '../repositories/deliveryman-repository'

interface FetchDeliverymanOrdersUseCaseRequest {
  id: string
}

type FetchDeliverymanOrdersUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchDeliverymanOrdersUseCase {
  constructor(private deliverymansRepository: DeliverymansRepository) {}

  async execute({
    id,
  }: FetchDeliverymanOrdersUseCaseRequest): Promise<FetchDeliverymanOrdersUseCaseResponse> {
    const deliveryman = await this.deliverymansRepository.findById(id)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    return right({ orders: deliveryman.orders.currentItems })
  }
}
