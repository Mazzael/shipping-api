import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymansRepository } from '../repositories/deliveryman-repository'
import { DeliverymanAlreadyExistsError } from './errors/deliveryman-already-exists-error'
import { HashGenerator } from '../cryptography/hash-generator'

interface CreateDeliverymanUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type CreateDeliverymanUseCaseResponse = Either<
  DeliverymanAlreadyExistsError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class CreateDeliverymanUseCase {
  constructor(
    private deliverymansRepository: DeliverymansRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: CreateDeliverymanUseCaseRequest): Promise<CreateDeliverymanUseCaseResponse> {
    const deliverymanWithSameCPF =
      await this.deliverymansRepository.findByCPF(cpf)

    if (deliverymanWithSameCPF) {
      return left(new DeliverymanAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryman = Deliveryman.create({
      name,
      cpf,
      password: hashedPassword,
    })

    await this.deliverymansRepository.create(deliveryman)

    return right({ deliveryman })
  }
}
