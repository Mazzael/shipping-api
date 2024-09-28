import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { DeliverymansRepository } from '../repositories/deliveryman-repository'

interface AuthenticateDeliverymanUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateDeliverymanUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateDeliverymanUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateDeliverymanUseCaseRequest): Promise<AuthenticateDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymansRepository.findByCPF(cpf)

    if (!deliveryman) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      deliveryman.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: deliveryman.id.toString(),
    })

    return right({ accessToken })
  }
}
