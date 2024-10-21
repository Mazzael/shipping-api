import {
  Body,
  ConflictException,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateRecipientUseCase } from '@/domain/shipping/application/use-cases/create-recipient'
import { Public } from '@/infra/auth/public'

const createRecipientBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  addressLatitude: z.number(),
  addressLongitude: z.number(),
})

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>
@Controller('/recipient')
@Public()
export class CreateRecipientController {
  constructor(private createRecipientUseCase: CreateRecipientUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createRecipientBodySchema))
  async handle(@Body() body: CreateRecipientBodySchema) {
    const { name, email, addressLatitude, addressLongitude } = body

    const result = await this.createRecipientUseCase.execute({
      name,
      email,
      addressLatitude,
      addressLongitude,
    })

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }
  }
}
