import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { Order } from '../../enterprise/entities/order'

interface FetchRecipientOrdersUseCaseRequest {
  id: string
}

type FetchRecipientOrdersUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchRecipientOrdersUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    id,
  }: FetchRecipientOrdersUseCaseRequest): Promise<FetchRecipientOrdersUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(id)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    return right({ orders: recipient.orders.currentItems })
  }
}
