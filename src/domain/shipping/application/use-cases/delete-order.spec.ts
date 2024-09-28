import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { DeleteOrderUseCase } from './delete-order'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: DeleteOrderUseCase

describe('Delete Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()

    sut = new DeleteOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to delete an order', async () => {
    const order1 = makeOrder()

    const orderToBeDeleted = makeOrder({}, new UniqueEntityID('2'))

    const order3 = makeOrder()

    await inMemoryOrdersRepository.create(order1)
    await inMemoryOrdersRepository.create(orderToBeDeleted)
    await inMemoryOrdersRepository.create(order3)

    const result = await sut.execute({
      orderId: orderToBeDeleted.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items.length).toEqual(2)
  })
})
