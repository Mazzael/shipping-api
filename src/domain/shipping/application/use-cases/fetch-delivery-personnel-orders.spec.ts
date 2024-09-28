import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { OrderList } from '../../enterprise/entities/order-list'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { FetchDeliverymanOrdersUseCase } from './fetch-delivery-personnel-orders'

let deliverymansRepository: InMemoryDeliverymansRepository
let ordersRepository: InMemoryOrdersRepository
let sut: FetchDeliverymanOrdersUseCase

describe('Fetch Deliveryman Orders', () => {
  beforeEach(async () => {
    deliverymansRepository = new InMemoryDeliverymansRepository()
    ordersRepository = new InMemoryOrdersRepository()
    sut = new FetchDeliverymanOrdersUseCase(deliverymansRepository)
  })

  it('should be able to fetch deliveryman orders', async () => {
    const order1 = makeOrder()
    const order2 = makeOrder()
    const order3 = makeOrder()

    await ordersRepository.create(order1)
    await ordersRepository.create(order2)
    await ordersRepository.create(order3)

    const deliveryman1 = makeDeliveryman({
      orders: new OrderList([order1, order2]),
    })

    const deliveryman2 = makeDeliveryman({
      orders: new OrderList([order3]),
    })

    await deliverymansRepository.create(deliveryman1)
    await deliverymansRepository.create(deliveryman2)

    const result = await sut.execute({
      id: deliveryman1.id.toString(),
    })

    // @ts-expect-error if it arrived here orders property wont be undefined
    expect(result.value.orders.length).toBe(2)
  })
})
