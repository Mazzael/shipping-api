import { Controller, Get, HttpCode, NotFoundException } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchDeliverymanOrdersUseCase } from '@/domain/shipping/application/use-cases/fetch-delivery-personnel-orders'

@Controller('/deliveryman/orders')
export class FetchDeliverymanOrdersController {
  constructor(
    private fetchDeliverymanOrdersUseCase: FetchDeliverymanOrdersUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.fetchDeliverymanOrdersUseCase.execute({
      id: userId,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return {
      orders: result.value.orders,
    }
  }
}
