import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { ReturnOrderUseCase } from './return-order'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: ReturnOrderUseCase

describe('Return Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()

    sut = new ReturnOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to return an order', async () => {
    const deliveryman = makeDeliveryman({}, new UniqueEntityID('1'))

    const order = makeOrder({
      deliverymanId: new UniqueEntityID('1'),
    })

    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0].status).toEqual('RETURNED')
  })
})
