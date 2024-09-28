import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { PickUpOrderUseCase } from './pick-up-order'
import { makeOrder } from 'test/factories/make-order'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderList } from '../../enterprise/entities/order-list'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository

let sut: PickUpOrderUseCase

describe('Pick Up Order', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()

    sut = new PickUpOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliverymansRepository,
    )
  })

  it('should be able to pick up an order', async () => {
    const newOrder = makeOrder()

    await inMemoryOrdersRepository.create(newOrder)

    const order1 = makeOrder({ deliverymanId: new UniqueEntityID('1') })
    const order2 = makeOrder({ deliverymanId: new UniqueEntityID('1') })
    const order3 = makeOrder({ deliverymanId: new UniqueEntityID('1') })

    await inMemoryOrdersRepository.create(order1)
    await inMemoryOrdersRepository.create(order2)
    await inMemoryOrdersRepository.create(order3)

    const deliveryman = makeDeliveryman(
      { orders: new OrderList([order1, order2, order3]) },
      new UniqueEntityID('1'),
    )

    await inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      orderId: newOrder.id.toString(),
      deliverymanId: deliveryman.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(deliveryman.orders.currentItems).toHaveLength(4)
    expect(newOrder.status).toEqual('PICKED-UP')
    expect(inMemoryOrdersRepository.items[0].deliverymanId).toEqual(
      deliveryman.id,
    )
  })
})
