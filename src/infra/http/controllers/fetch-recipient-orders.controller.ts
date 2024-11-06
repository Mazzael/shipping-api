import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchRecipientOrdersUseCase } from '@/domain/shipping/application/use-cases/fetch-recipient-orders'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles'
import { JwtRoleGuard } from '@/infra/auth/jwt-role-guard'

const fetchRecipientOrdersBodySchema = z.object({
  recipientId: z.string(),
})

type FetchRecipientOrdersBodySchema = z.infer<
  typeof fetchRecipientOrdersBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(fetchRecipientOrdersBodySchema)

@Controller('/recipient/orders')
@Roles('admin')
@UseGuards(JwtRoleGuard)
export class FetchRecipientOrdersController {
  constructor(
    private fetchRecipientOrdersUseCase: FetchRecipientOrdersUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: FetchRecipientOrdersBodySchema,
  ) {
    const { recipientId } = body

    const result = await this.fetchRecipientOrdersUseCase.execute({
      id: recipientId,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return {
      orders: result.value.orders,
    }
  }
}
