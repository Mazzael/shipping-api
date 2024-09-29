import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { MockInstance, vi } from 'vitest'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { waitFor } from 'test/utils/wait-for'
import { CreateRecipientOrderUseCase } from '@/domain/shipping/application/use-cases/create-recipient-order'
import { makeOrderItem } from 'test/factories/make-order-item'
import { OnOrderCreated } from './on-order-created'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

let createRecipientOrderUseCase: CreateRecipientOrderUseCase

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Order Picked Up', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    createRecipientOrderUseCase = new CreateRecipientOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryRecipientsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    new OnOrderCreated(sendNotification)
  })

  it('should send a notification when an order is picked up', async () => {
    const recipient = makeRecipient()
    const item1 = makeOrderItem()
    const item2 = makeOrderItem()

    await inMemoryRecipientsRepository.create(recipient)

    createRecipientOrderUseCase.execute({
      recipientId: recipient.id.toString(),
      items: [item1, item2],
    })

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
