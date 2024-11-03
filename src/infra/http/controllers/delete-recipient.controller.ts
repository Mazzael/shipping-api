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
import { DeleteRecipientUseCase } from '@/domain/shipping/application/use-cases/delete-recipient'

@Controller('/recipient/:id')
@Roles('admin')
@UseGuards(JwtRoleGuard)
export class DeleteRecipientController {
  constructor(private deleteRecipientUseCase: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') recipientId: string) {
    const result = await this.deleteRecipientUseCase.execute({
      id: recipientId,
    })

    if (result.isLeft()) {
      throw new NotFoundException()
    }
  }
}
