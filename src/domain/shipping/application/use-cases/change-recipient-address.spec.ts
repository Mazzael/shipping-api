import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { ChangeRecipientAddressUseCase } from './change-recipient-address'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository

let sut: ChangeRecipientAddressUseCase

describe('Change Recipient Address', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()

    sut = new ChangeRecipientAddressUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to change a recipient address', async () => {
    const recipient = makeRecipient({
      addressLatitude: 235,
      addressLongitude: 2359,
    })

    await inMemoryRecipientsRepository.create(recipient)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      addressLatitude: 1,
      addressLongitude: 2,
    })

    expect(result.isRight()).toBe(true)

    expect(inMemoryRecipientsRepository.items[0].addressLatitude).toBe(1)
    expect(inMemoryRecipientsRepository.items[0].addressLongitude).toBe(2)
  })
})
