import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { AuthenticateDeliverymanUseCase } from './authenticate-delivery-personnel'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateDeliverymanUseCase

describe('Authenticate Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateDeliverymanUseCase(
      inMemoryDeliverymansRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a deliveryman', async () => {
    const deliveryman = makeDeliveryman({
      cpf: '11111111111',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      cpf: '11111111111',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong credentials', async () => {
    const deliveryman = makeDeliveryman({
      cpf: '11111111111',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      cpf: '11111111111',
      password: '654321',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
