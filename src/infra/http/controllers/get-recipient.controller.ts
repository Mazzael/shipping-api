import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles'
import { JwtRoleGuard } from '@/infra/auth/jwt-role-guard'
import { GetRecipientUseCase } from '@/domain/shipping/application/use-cases/get-recipient'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const getRecipientBodySchema = z.object({
  recipientId: z.string(),
})

type GetRecipientBodySchema = z.infer<typeof getRecipientBodySchema>

const bodyValidationPipe = new ZodValidationPipe(getRecipientBodySchema)

@Controller('/recipient/profile')
@Roles('admin')
@UseGuards(JwtRoleGuard)
export class GetRecipientController {
  constructor(private getRecipientUseCase: GetRecipientUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Body(bodyValidationPipe) body: GetRecipientBodySchema) {
    const { recipientId } = body

    const result = await this.getRecipientUseCase.execute({
      id: recipientId,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return {
      recipient: result.value.recipient,
    }
  }
}
