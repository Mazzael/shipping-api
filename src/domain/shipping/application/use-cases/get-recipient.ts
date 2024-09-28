import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Recipient } from '../../enterprise/entities/recipient'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface GetRecipientUseCaseRequest {
  id: string
}

type GetRecipientUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class GetRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    id,
  }: GetRecipientUseCaseRequest): Promise<GetRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(id)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    return right({ recipient })
  }
}
