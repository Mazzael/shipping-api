import { FakeHasher } from 'test/cryptography/fake-hasher'
import { AdminAlreadyExistsError } from './errors/admin-already-exists-error'
import { CreateAdminUseCase } from './create-admin'
import { makeAdmin } from 'test/factories/make-admin'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'

let inMemoryAdminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher

let sut: CreateAdminUseCase

describe('Create Admin', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()

    sut = new CreateAdminUseCase(inMemoryAdminsRepository, fakeHasher)
  })

  it('should be able to create an admin', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '11111111111',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      admin: inMemoryAdminsRepository.items[0],
    })
  })

  it('should hash admins password upon creation', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '11111111111',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminsRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not be able to create an admin with same CPF', async () => {
    const admin = makeAdmin({
      cpf: '11111111111',
    })
    inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      name: 'John Doe',
      cpf: '11111111111',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AdminAlreadyExistsError)
  })
})
