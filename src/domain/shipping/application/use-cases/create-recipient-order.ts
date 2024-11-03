import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrdersRepository } from '../repositories/orders-repository'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientDoesntExistError } from './errors/recipient-doesnt-exist-error'
import { Order } from '../../enterprise/entities/order'
import { OrderItem } from '../../enterprise/entities/order-item'

interface CreateRecipientOrderUseCaseRequest {
  recipientId: string
  items: OrderItem[]
}

type CreateRecipientOrderUseCaseResponse = Either<
  RecipientDoesntExistError,
  {
    order: Order
  }
>

@Injectable()
export class CreateRecipientOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private recipientsRepository: RecipientsRepository,
  ) {}

  async execute({
    recipientId,
    items,
  }: CreateRecipientOrderUseCaseRequest): Promise<CreateRecipientOrderUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new RecipientDoesntExistError(recipientId))
    }

    const order = Order.create({
      recipientId: new UniqueEntityID(recipientId),
      items,
      totalInCents: items.reduce((acc, item) => {
        return acc + item.price * item.quantity
      }, 0),
      status: 'PENDING',
      createdAt: new Date(),
    })

    await this.ordersRepository.create(order)

    recipient.orders.add(order)

    await this.recipientsRepository.save(recipient)

    return right({ order })
  }
}
