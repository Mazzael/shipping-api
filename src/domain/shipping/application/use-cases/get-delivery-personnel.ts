import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymansRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetDeliverymanUseCaseRequest {
  id: string
}

type GetDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class GetDeliverymanUseCase {
  constructor(private deliverymansRepository: DeliverymansRepository) {}

  async execute({
    id,
  }: GetDeliverymanUseCaseRequest): Promise<GetDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymansRepository.findById(id)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    return right({ deliveryman })
  }
}
