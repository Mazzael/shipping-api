import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles'
import { JwtRoleGuard } from '@/infra/auth/jwt-role-guard'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ReturnOrderUseCase } from '@/domain/shipping/application/use-cases/return-order'

const returnOrderBodySchema = z.object({
  orderId: z.string(),
})

type ReturnOrderBodySchema = z.infer<typeof returnOrderBodySchema>

const bodyValidationPipe = new ZodValidationPipe(returnOrderBodySchema)

@Controller('/orders/return')
@Roles('deliveryman')
@UseGuards(JwtRoleGuard)
export class ReturnOrderController {
  constructor(private returnOrderUseCase: ReturnOrderUseCase) {}

  @Patch()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: ReturnOrderBodySchema,
  ) {
    const { orderId } = body

    const userId = user.sub

    const result = await this.returnOrderUseCase.execute({
      orderId,
      deliverymanId: userId,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return {
      order: {
        orderId: result.value.order.id.toString(),
        deliverymanId: result.value.order.deliverymanId?.toString(),
        status: result.value.order.status,
        totalInCents: result.value.order.totalInCents,
      },
    }
  }
}
