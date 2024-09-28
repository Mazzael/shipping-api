import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { GetDeliverymanUseCase } from './get-delivery-personnel'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository

let sut: GetDeliverymanUseCase

describe('Get Delivery Personnel', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()

    sut = new GetDeliverymanUseCase(inMemoryDeliverymansRepository)
  })

  it('should be able to get a delivery personnel', async () => {
    const deliveryman1 = makeDeliveryman()
    const deliveryman2 = makeDeliveryman()
    const deliveryman3 = makeDeliveryman()

    await inMemoryDeliverymansRepository.create(deliveryman1)
    await inMemoryDeliverymansRepository.create(deliveryman2)
    await inMemoryDeliverymansRepository.create(deliveryman3)

    const result = await sut.execute({
      id: deliveryman2.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryman: inMemoryDeliverymansRepository.items[1],
    })
  })
})
