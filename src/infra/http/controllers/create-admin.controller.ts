import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Public } from '@/infra/auth/public'
import { CreateAdminUseCase } from '@/domain/shipping/application/use-cases/create-admin'

const createAdminBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
})

type CreateAdminBodySchema = z.infer<typeof createAdminBodySchema>
@Controller('/admin')
@Public()
export class CreateAdminController {
  constructor(private createAdminUseCase: CreateAdminUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAdminBodySchema))
  async handle(@Body() body: CreateAdminBodySchema) {
    const { name, cpf, password } = body

    const result = await this.createAdminUseCase.execute({
      name,
      cpf,
      password,
    })

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }
  }
}
