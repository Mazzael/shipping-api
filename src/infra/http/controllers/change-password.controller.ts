import {
  Body,
  Controller,
  HttpCode,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/roles'
import { JwtRoleGuard } from '@/infra/auth/jwt-role-guard'
import { ChangePasswordUseCase } from '@/domain/shipping/application/use-cases/change-password'

const changePasswordBodySchema = z.object({
  cpf: z.string(),
  newPassword: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(changePasswordBodySchema)

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>
@Controller('/deliveryman')
export class ChangePasswordController {
  constructor(private changePasswordUseCase: ChangePasswordUseCase) {}

  @Patch()
  @Roles('admin')
  @UseGuards(JwtRoleGuard)
  @HttpCode(204)
  async handle(@Body(bodyValidationPipe) body: ChangePasswordBodySchema) {
    const { cpf, newPassword } = body

    const result = await this.changePasswordUseCase.execute({
      cpf,
      newPassword,
    })

    if (result.isLeft()) {
      throw new UnauthorizedException()
    }
  }
}
