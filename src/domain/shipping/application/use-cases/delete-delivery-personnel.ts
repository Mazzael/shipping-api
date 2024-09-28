import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { DeliverymansRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteDeliverymanUseCaseRequest {
  id: string
}

type DeleteDeliverymanUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteDeliverymanUseCase {
  constructor(private deliverymansRepository: DeliverymansRepository) {}

  async execute({
    id,
  }: DeleteDeliverymanUseCaseRequest): Promise<DeleteDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymansRepository.findById(id)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    await this.deliverymansRepository.delete(deliveryman)

    return right(null)
  }
}
