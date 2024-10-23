import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Admin } from '../../enterprise/entities/admin'
import { HashGenerator } from '../cryptography/hash-generator'
import { AdminsRepository } from '../repositories/admins-repository'
import { AdminAlreadyExistsError } from './errors/admin-already-exists-error'

interface CreateAdminUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type CreateAdminUseCaseResponse = Either<
  AdminAlreadyExistsError,
  {
    admin: Admin
  }
>

@Injectable()
export class CreateAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: CreateAdminUseCaseRequest): Promise<CreateAdminUseCaseResponse> {
    const adminWithSameCPF = await this.adminsRepository.findByCPF(cpf)

    if (adminWithSameCPF) {
      return left(new AdminAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const admin = Admin.create({
      name,
      cpf,
      password: hashedPassword,
    })

    await this.adminsRepository.create(admin)

    return right({ admin })
  }
}
