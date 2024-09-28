import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { DeleteRecipientUseCase } from './delete-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository

let sut: DeleteRecipientUseCase

describe('Delete Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    sut = new DeleteRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to delete a recipient', async () => {
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
    expect(inMemoryRecipientsRepository.items).toHaveLength(2)
  })
})
