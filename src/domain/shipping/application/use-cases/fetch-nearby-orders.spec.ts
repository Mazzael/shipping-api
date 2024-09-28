import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearbyOrdersUseCase } from './fetch-nearby-orders'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { OrderList } from '../../enterprise/entities/order-list'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

let recipientsRepository: InMemoryRecipientsRepository
let ordersRepository: InMemoryOrdersRepository
let sut: FetchNearbyOrdersUseCase

describe('Fetch Nearby Orders', () => {
  beforeEach(async () => {
    recipientsRepository = new InMemoryRecipientsRepository()
    ordersRepository = new InMemoryOrdersRepository()
    sut = new FetchNearbyOrdersUseCase(recipientsRepository)
  })

  it('should be able to fetch nearby orders', async () => {
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
      deliverymanLatitude: 1.01,
      deliverymanLongitude: 1.01,
    })

    expect(result.value.orders.length).toBe(2)
  })
})
