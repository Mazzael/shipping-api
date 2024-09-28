import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryPhotosRepository } from 'test/repositories/in-memory-photos-repository'
import { DeliverOrderUseCase } from './deliver-order'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { makeOrder } from 'test/factories/make-order'
import { makePhoto } from 'test/factories/make-photo'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryPhotosRepository: InMemoryPhotosRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let sut: DeliverOrderUseCase

describe('Deliver Order', () => {
  beforeEach(() => {
    inMemoryPhotosRepository = new InMemoryPhotosRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository()

    sut = new DeliverOrderUseCase(
      inMemoryPhotosRepository,
      inMemoryOrdersRepository,
    )
  })

  it('should be able to deliver a order', async () => {
    const deliveryman = makeDeliveryman({}, new UniqueEntityID('1'))

    const order = makeOrder({
      deliverymanId: new UniqueEntityID('1'),
    })

    await inMemoryOrdersRepository.create(order)

    const photo = makePhoto()

    await inMemoryPhotosRepository.create(photo)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      orderId: order.id.toString(),
      photoId: photo.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrdersRepository.items[0].status).toEqual('DELIVERED')
    expect(inMemoryPhotosRepository.items[0].orderId).toEqual(order.id)
  })
})
