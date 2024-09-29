import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientDoesntExistError } from './errors/recipient-doesnt-exist-error'
import { Recipient } from '../../enterprise/entities/recipient'

interface ChangeRecipientAddressUseCaseRequest {
  recipientId: string
  addressLatitude: number
  addressLongitude: number
}

type ChangeRecipientAddressUseCaseResponse = Either<
  RecipientDoesntExistError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class ChangeRecipientAddressUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    addressLatitude,
    addressLongitude,
  }: ChangeRecipientAddressUseCaseRequest): Promise<ChangeRecipientAddressUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new RecipientDoesntExistError(recipientId))
    }

    recipient.changeAddress(addressLatitude, addressLongitude)

    await this.recipientsRepository.save(recipient)

    return right({ recipient })
  }
}
