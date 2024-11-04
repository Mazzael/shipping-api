import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth-guard'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeliverOrderUseCase } from '@/domain/shipping/application/use-cases/deliver-order'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from '@/domain/shipping/application/use-cases/errors/resource-not-found-error'
import { NotAllowedError } from '@/domain/shipping/application/use-cases/errors/not-allowed-error'

const deliverOrderBodySchema = z.object({
  photoId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(deliverOrderBodySchema)

type DeliverOrderBodySchema = z.infer<typeof deliverOrderBodySchema>

@Controller('/order/:id')
@UseGuards(JwtAuthGuard)
export class DeliverOrderController {
  constructor(private deliverOrderUseCase: DeliverOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') orderId: string,
    @Body(bodyValidationPipe) body: DeliverOrderBodySchema,
  ) {
    const { photoId } = body

    const userId = user.sub

    const result = await this.deliverOrderUseCase.execute({
      deliverymanId: userId,
      orderId,
      photoId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
