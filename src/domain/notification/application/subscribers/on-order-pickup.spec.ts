import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { MockInstance, vi } from 'vitest'
import { OnOrderPickUp } from './on-order-pickup'
import { makeOrder } from 'test/factories/make-order'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { PickUpOrderUseCase } from '@/domain/shipping/application/use-cases/pick-up-order'
import { waitFor } from 'test/utils/wait-for'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

let pickupOrderUseCase: PickUpOrderUseCase

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Order Picked Up', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    inMemoryDeliverymansRepository = new InMemoryDeliverymansRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    pickupOrderUseCase = new PickUpOrderUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliverymansRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    new OnOrderPickUp(sendNotification)
  })

  it('should send a notification when an order is picked up', async () => {
    const order = makeOrder()
    const deliveryman = makeDeliveryman()

    await inMemoryOrdersRepository.create(order)
    await inMemoryDeliverymansRepository.create(deliveryman)

    pickupOrderUseCase.execute({
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
    })

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
