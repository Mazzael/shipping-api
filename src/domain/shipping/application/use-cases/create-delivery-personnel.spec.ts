import { FakeHasher } from 'test/cryptography/fake-hasher'
import { CreateDeliverymanUseCase } from './create-delivery-personnel'
import { DeliverymanAlreadyExistsError } from './errors/deliveryman-already-exists-error'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let fakeHasher: FakeHasher

let sut: CreateDeliverymanUseCase

describe('Create Delivery Personnel', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    fakeHasher = new FakeHasher()

    sut = new CreateDeliverymanUseCase(
      inMemoryDeliverymansRepository,
      fakeHasher,
    )
  })

  it('should be able to create a delivery personnel', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '11111111111',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryman: inMemoryDeliverymansRepository.items[0],
    })
  })

  it('should hash delivery personnel password upon creation', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '11111111111',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymansRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })

  it('should not be able to create a delivery personnel with same CPF', async () => {
    const deliveryman = makeDeliveryman({
      cpf: '11111111111',
    })
    inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      name: 'John Doe',
      cpf: '11111111111',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DeliverymanAlreadyExistsError)
  })
})
