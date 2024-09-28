import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface DeleteRecipientUseCaseRequest {
  id: string
}

type DeleteRecipientUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    id,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(id)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    await this.recipientsRepository.delete(recipient)

    return right(null)
  }
}
