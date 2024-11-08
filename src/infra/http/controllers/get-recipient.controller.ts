import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/roles'
import { JwtRoleGuard } from '@/infra/auth/jwt-role-guard'
import { GetRecipientUseCase } from '@/domain/shipping/application/use-cases/get-recipient'

@Controller('/recipient/:id')
@Roles('admin')
@UseGuards(JwtRoleGuard)
export class GetRecipientController {
  constructor(private getRecipientUseCase: GetRecipientUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('id') recipientId: string) {
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
