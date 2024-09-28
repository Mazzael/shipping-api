import { expect, describe, it, beforeEach } from 'vitest'
import { FetchRecipientOrdersUseCase } from './fetch-recipient-orders'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { OrderList } from '../../enterprise/entities/order-list'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

let recipientsRepository: InMemoryRecipientsRepository
let ordersRepository: InMemoryOrdersRepository
let sut: FetchRecipientOrdersUseCase

describe('Fetch Recipient Orders', () => {
  beforeEach(async () => {
    recipientsRepository = new InMemoryRecipientsRepository()
    ordersRepository = new InMemoryOrdersRepository()
    sut = new FetchRecipientOrdersUseCase(recipientsRepository)
  })

  it('should be able to fetch recipient orders', async () => {
    const order1 = makeOrder()
    const order2 = makeOrder()
    const order3 = makeOrder()

    await ordersRepository.create(order1)
    await ordersRepository.create(order2)
    await ordersRepository.create(order3)

    const recipient1 = makeRecipient({
      addressLatitude: 1,
      addressLongitude: 1,
      orders: new OrderList([order1, order2]),
    })

    const recipient2 = makeRecipient({
      addressLatitude: 934579748397,
      addressLongitude: 9348729463298,
      orders: new OrderList([order3]),
    })

    await recipientsRepository.create(recipient1)
    await recipientsRepository.create(recipient2)

    const result = await sut.execute({
      id: recipient1.id.toString(),
    })

    // @ts-expect-error if it arrived here orders property wont be undefined
    expect(result.value.orders.length).toBe(2)
  })
})
