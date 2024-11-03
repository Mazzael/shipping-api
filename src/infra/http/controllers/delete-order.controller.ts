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
import { DeleteOrderUseCase } from '@/domain/shipping/application/use-cases/delete-order'

@Controller('/order/:id')
@Roles('admin')
@UseGuards(JwtRoleGuard)
export class DeleteOrderController {
  constructor(private deleteOrderUseCase: DeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') orderId: string) {
    const result = await this.deleteOrderUseCase.execute({
      orderId,
    })

    if (result.isLeft()) {
      throw new NotFoundException()
    }
  }
}
