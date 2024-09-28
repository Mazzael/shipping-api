import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { GetRecipientUseCase } from './get-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository

let sut: GetRecipientUseCase

describe('Get Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    sut = new GetRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to get a Recipient', async () => {
    const recipient1 = makeRecipient()
    const recipient2 = makeRecipient()
    const recipient3 = makeRecipient()

    await inMemoryRecipientsRepository.create(recipient1)
    await inMemoryRecipientsRepository.create(recipient2)
    await inMemoryRecipientsRepository.create(recipient3)

    const result = await sut.execute({
      id: recipient2.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: inMemoryRecipientsRepository.items[1],
    })
  })
})
