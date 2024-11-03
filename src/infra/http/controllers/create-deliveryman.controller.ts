import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateDeliverymanUseCase } from '@/domain/shipping/application/use-cases/create-delivery-personnel'
import { Roles } from '@/infra/auth/roles'
import { JwtRoleGuard } from '@/infra/auth/jwt-role-guard'

const createDeliverymanBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
})

type CreateDeliverymanBodySchema = z.infer<typeof createDeliverymanBodySchema>
@Controller('/deliveryman')
@Roles('admin')
@UseGuards(JwtRoleGuard)
export class CreateDeliverymanController {
  constructor(private createDeliverymanUseCase: CreateDeliverymanUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createDeliverymanBodySchema))
  async handle(@Body() body: CreateDeliverymanBodySchema) {
    const { name, cpf, password } = body

    const result = await this.createDeliverymanUseCase.execute({
      name,
      cpf,
      password,
    })

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }
  }
}
