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
import { DeliverOrderUseCase } from '@/domain/shipping/application/use-cases/deliver-order'
import { InMemoryPhotosRepository } from 'test/repositories/in-memory-photos-repository'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { makeOrder } from 'test/factories/make-order'
import { makePhoto } from 'test/factories/make-photo'
import { OnOrderDelivered } from './on-order-delivered'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryPhotosRepository: InMemoryPhotosRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

let deliverOrderUseCase: DeliverOrderUseCase

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Order Picked Up', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryPhotosRepository = new InMemoryPhotosRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    deliverOrderUseCase = new DeliverOrderUseCase(
      inMemoryPhotosRepository,
      inMemoryOrdersRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    new OnOrderDelivered(sendNotification)
  })

  it('should send a notification when an order is delivered', async () => {
    const recipient = makeRecipient()
    const deliveryman = makeDeliveryman()
    const order = makeOrder({
      recipientId: recipient.id,
      deliverymanId: deliveryman.id,
    })
    const photo = makePhoto({
      orderId: order.id,
    })

    await inMemoryRecipientsRepository.create(recipient)
    await inMemoryDeliverymansRepository.create(deliveryman)
    await inMemoryOrdersRepository.create(order)
    await inMemoryPhotosRepository.create(photo)

    deliverOrderUseCase.execute({
      deliverymanId: deliveryman.id.toString(),
      orderId: order.id.toString(),
      photoId: photo.id.toString(),
    })

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
