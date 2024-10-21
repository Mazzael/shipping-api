import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ChangeRecipientAddressUseCase } from '@/domain/shipping/application/use-cases/change-recipient-address'
import { Roles } from '@/infra/auth/roles'
import { JwtRoleGuard } from '@/infra/auth/jwt-role-guard'

const changeRecipientAddressBodySchema = z.object({
  addressLatitude: z.number(),
  addressLongitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(
  changeRecipientAddressBodySchema,
)

type ChangeRecipientAddressBodySchema = z.infer<
  typeof changeRecipientAddressBodySchema
>
@Controller('/recipient/:id')
export class ChangeRecipientAddressController {
  constructor(
    private changeRecipientAddressUseCase: ChangeRecipientAddressUseCase,
  ) {}

  @Patch()
  @Roles('admin')
  @UseGuards(JwtRoleGuard)
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ChangeRecipientAddressBodySchema,
    @Param('id') recipientId: string,
  ) {
    const { addressLatitude, addressLongitude } = body

    const result = await this.changeRecipientAddressUseCase.execute({
      recipientId,
      addressLatitude,
      addressLongitude,
    })

    if (result.isLeft()) {
      throw new NotFoundException()
    }
  }
}
