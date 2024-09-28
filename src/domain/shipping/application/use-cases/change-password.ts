import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymansRepository } from '../repositories/deliveryman-repository'

interface ChangePasswordUseCaseRequest {
  cpf: string
  newPassword: string
}

type ChangePasswordUseCaseResponse = Either<
  WrongCredentialsError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf,
    newPassword,
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const deliveryman = await this.deliverymansRepository.findByCPF(cpf)

    if (!deliveryman) {
      return left(new WrongCredentialsError())
    }

    const hashedPassword = await this.hashGenerator.hash(newPassword)

    deliveryman.changePassword(hashedPassword)

    await this.deliverymansRepository.save(deliveryman)

    return right({ deliveryman })
  }
}
