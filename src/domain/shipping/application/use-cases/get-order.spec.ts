import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { GetOrderUseCase } from './get-order'
import { makeOrder } from 'test/factories/make-order'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository

let sut: GetOrderUseCase

describe('Get Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    sut = new GetOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get a order', async () => {
    const recipient = makeRecipient()

    inMemoryRecipientsRepository.create(recipient)

    const order1 = makeOrder({ recipientId: recipient.id })
    const order2 = makeOrder({ recipientId: recipient.id })
    const order3 = makeOrder({ recipientId: recipient.id })

    await inMemoryOrdersRepository.create(order1)
    await inMemoryOrdersRepository.create(order2)
    await inMemoryOrdersRepository.create(order3)

    const result = await sut.execute({
      id: order2.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: inMemoryOrdersRepository.items[1],
    })
  })
})
