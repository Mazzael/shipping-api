import {
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles'
import { JwtRoleGuard } from '@/infra/auth/jwt-role-guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ReturnOrderUseCase } from '@/domain/shipping/application/use-cases/return-order'

@Controller('/orders/return/:id')
@Roles('deliveryman')
@UseGuards(JwtRoleGuard)
export class ReturnOrderController {
  constructor(private returnOrderUseCase: ReturnOrderUseCase) {}

  @Patch()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload, @Param('id') orderId: string) {
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
