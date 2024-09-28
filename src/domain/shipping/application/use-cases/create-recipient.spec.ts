import { CreateRecipientUseCase } from './create-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository

let sut: CreateRecipientUseCase

describe('Create Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    sut = new CreateRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to create a recipient', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      addressLatitude: 1,
      addressLongitude: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: inMemoryRecipientsRepository.items[0],
    })
  })
})
