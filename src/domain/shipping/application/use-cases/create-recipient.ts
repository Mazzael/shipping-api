import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists-error'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface CreateRecipientUseCaseRequest {
  name: string
  email: string
  addressLatitude: number
  addressLongitude: number
}

type CreateRecipientUseCaseResponse = Either<
  RecipientAlreadyExistsError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    name,
    email,
    addressLatitude,
    addressLongitude,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipientWithSameEmail =
      await this.recipientsRepository.findByEmail(email)

    if (recipientWithSameEmail) {
      return left(new RecipientAlreadyExistsError(email))
    }

    const recipient = Recipient.create({
      name,
      email,
      addressLatitude,
      addressLongitude,
    })

    await this.recipientsRepository.create(recipient)

    return right({ recipient })
  }
}
