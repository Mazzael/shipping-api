import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
} from '@nestjs/common'
import { GetOrderUseCase } from '@/domain/shipping/application/use-cases/get-order'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const getOrderBodySchema = z.object({
  orderId: z.string(),
})

type GetOrderBodySchema = z.infer<typeof getOrderBodySchema>

const bodyValidationPipe = new ZodValidationPipe(getOrderBodySchema)

@Controller('/order/details')
export class GetOrderController {
  constructor(private getOrderUseCase: GetOrderUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Body(bodyValidationPipe) body: GetOrderBodySchema) {
    const { orderId } = body

    const result = await this.getOrderUseCase.execute({
      id: orderId,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    return {
      order: result.value.order,
    }
  }
}
