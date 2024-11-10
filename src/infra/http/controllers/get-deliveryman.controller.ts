import { Controller, Get, HttpCode, NotFoundException } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { GetDeliverymanUseCase } from '@/domain/shipping/application/use-cases/get-delivery-personnel'
import { DeliverymanPresenter } from '../presenters/deliveryman-presenter'

@Controller('/deliveryman/profile')
export class GetDeliverymanController {
  constructor(private getDeliverymanUseCase: GetDeliverymanUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.getDeliverymanUseCase.execute({
      id: userId,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return {
      deliveryman: DeliverymanPresenter.toHTTP(result.value.deliveryman),
    }
  }
}
