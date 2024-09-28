import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists-error'

interface RegisterRecipientUseCaseRequest {
  name: string
  email: string
  addressLatitude: number
  addressLongitude: number
}

type RegisterRecipientUseCaseResponse = Either<
  RecipientAlreadyExistsError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class RegisterRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    name,
    email,
    addressLatitude,
    addressLongitude,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
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
