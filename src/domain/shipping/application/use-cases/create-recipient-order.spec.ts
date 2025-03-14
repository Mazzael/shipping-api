import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { CreateRecipientOrderUseCase } from './create-recipient-order'
import { makeOrderItem } from 'test/factories/make-order-item'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository

let sut: CreateRecipientOrderUseCase

describe('Create Recipient Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    sut = new CreateRecipientOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryRecipientsRepository,
    )
  })

  it('should be able to create a order associated with a recipient', async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient)

    const item1 = makeOrderItem({
      price: 10,
      quantity: 1,
    })

    const item2 = makeOrderItem({
      price: 25,
      quantity: 2,
    })

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      items: [item1, item2],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0].totalInCents).toBe(60)
    expect(inMemoryOrdersRepository.items).toHaveLength(1)
    expect(inMemoryOrdersRepository.items[0].items).toHaveLength(2)

    // @ts-expect-error if it arrived here it, order property wont be undefined
    expect(recipient.orders.getNewItems()[0]).toBe(result.value.order)
  })
})
