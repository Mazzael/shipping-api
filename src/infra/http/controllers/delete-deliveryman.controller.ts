import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles'
import { JwtRoleGuard } from '@/infra/auth/jwt-role-guard'
import { DeleteDeliverymanUseCase } from '@/domain/shipping/application/use-cases/delete-delivery-personnel'

@Controller('/deliveryman/:id')
@Roles('admin')
@UseGuards(JwtRoleGuard)
export class DeleteDeliverymanController {
  constructor(private deleteDeliverymanUseCase: DeleteDeliverymanUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') deliverymanId: string) {
    const result = await this.deleteDeliverymanUseCase.execute({
      id: deliverymanId,
    })

    if (result.isLeft()) {
      throw new NotFoundException()
    }
  }
}
