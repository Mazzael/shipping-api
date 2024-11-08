import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { GetOrderUseCase } from '@/domain/shipping/application/use-cases/get-order'

@Controller('/order/:id')
export class GetOrderController {
  constructor(private getOrderUseCase: GetOrderUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('id') orderId: string) {
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
