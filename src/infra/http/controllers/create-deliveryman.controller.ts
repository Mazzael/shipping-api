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
import { CreateDeliverymanUseCase } from '@/domain/shipping/application/use-cases/create-delivery-personnel'

const createDeliverymanBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
  role: z.enum(['admin', 'delivery-personnel']).default('delivery-personnel'),
})

type CreateDeliverymanBodySchema = z.infer<typeof createDeliverymanBodySchema>
@Controller('/deliveryman')
@Public()
export class CreateDeliverymanController {
  constructor(private createDeliverymanUseCase: CreateDeliverymanUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createDeliverymanBodySchema))
  async handle(@Body() body: CreateDeliverymanBodySchema) {
    const { name, cpf, password, role } = body

    const result = await this.createDeliverymanUseCase.execute({
      name,
      cpf,
      password,
      role,
    })

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }
  }
}
