import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists-error'
import { RegisterRecipientUseCase } from './register-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository

let sut: RegisterRecipientUseCase

describe('Register Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    sut = new RegisterRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to create a delivery personnel', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      addressLatitude: -22.0165786,
      addressLongitude: -47.9038534,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: inMemoryRecipientsRepository.items[0],
    })
  })

  it('should not be able to register a recipient with same email', async () => {
    const recipient = makeRecipient({
      email: 'johndoe@example.com',
    })
    inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      addressLatitude: -22.0165786,
      addressLongitude: -47.9038534,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(RecipientAlreadyExistsError)
  })
})
