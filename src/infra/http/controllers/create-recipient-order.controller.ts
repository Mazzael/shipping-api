import {
  Body,
  Controller,
  NotFoundException,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { OrderItem } from '@/domain/shipping/enterprise/entities/order-item'
import { CreateRecipientOrderUseCase } from '@/domain/shipping/application/use-cases/create-recipient-order'
import { Roles } from '@/infra/auth/roles'
import { JwtRoleGuard } from '@/infra/auth/jwt-role-guard'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderPresenter } from '../presenters/order-presenter'

const orderItemSchema = z.object({
  id: z.string(),
  productName: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(0),
})

const createRecipientOrderBodySchema = z.object({
  recipientId: z.string(),
  items: z.array(orderItemSchema).nonempty(),
})

type CreateRecipientOrderBody = z.infer<typeof createRecipientOrderBodySchema>

@Controller('/order')
@Roles('admin')
@UseGuards(JwtRoleGuard)
export class CreateRecipientOrderController {
  constructor(
    private createRecipientOrderUseCase: CreateRecipientOrderUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createRecipientOrderBodySchema))
  async create(@Body() body: CreateRecipientOrderBody) {
    const { recipientId, items } = body

    const orderItems = items.map((item) =>
      OrderItem.create(
        {
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
        },
        new UniqueEntityID(item.id),
      ),
    )

    const result = await this.createRecipientOrderUseCase.execute({
      recipientId,
      items: orderItems,
    })

    if (result.isLeft()) {
      throw new NotFoundException()
    }

    return {
      order: OrderPresenter.toHTTP(result.value.order),
    }
  }
}
