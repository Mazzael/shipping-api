import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles'
import { JwtRoleGuard } from '@/infra/auth/jwt-role-guard'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { PickUpOrderUseCase } from '@/domain/shipping/application/use-cases/pick-up-order'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const pickUpOrderBodySchema = z.object({
  orderId: z.string(),
})

type PickUpOrderBodySchema = z.infer<typeof pickUpOrderBodySchema>

const bodyValidationPipe = new ZodValidationPipe(pickUpOrderBodySchema)

@Controller('/orders/pick-up')
@Roles('deliveryman')
@UseGuards(JwtRoleGuard)
export class PickUpOrderController {
  constructor(private pickUpOrderUseCase: PickUpOrderUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: PickUpOrderBodySchema,
  ) {
    const { orderId } = body

    const userId = user.sub

    const result = await this.pickUpOrderUseCase.execute({
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
