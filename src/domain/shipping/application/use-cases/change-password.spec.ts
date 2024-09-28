import { FakeHasher } from 'test/cryptography/fake-hasher'
import { ChangePasswordUseCase } from './change-password'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let fakeHasher: FakeHasher

let sut: ChangePasswordUseCase

describe('Change Password', () => {
  beforeEach(() => {
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    fakeHasher = new FakeHasher()

    sut = new ChangePasswordUseCase(inMemoryDeliverymansRepository, fakeHasher)
  })

  it('should be able to change a delivery personnel password', async () => {
    const deliveryman = makeDeliveryman({
      cpf: '11111111111',
      password: await fakeHasher.hash('123456'),
    })

    await inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      cpf: '11111111111',
      newPassword: '654321',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymansRepository.items[0].password).toEqual(
      await fakeHasher.hash('654321'),
    )
  })

  it('should not be able to change other delivery personnel password', async () => {
    const deliveryman = makeDeliveryman({
      cpf: '11111111111',
      password: await fakeHasher.hash('123456'),
    })

    await inMemoryDeliverymansRepository.create(deliveryman)

    const result = await sut.execute({
      cpf: '22222222222',
      newPassword: '654321',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
