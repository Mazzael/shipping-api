import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { MockInstance, vi } from 'vitest'
import { makeOrder } from 'test/factories/make-order'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymansRepository } from 'test/repositories/in-memory-deliverymans-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { waitFor } from 'test/utils/wait-for'
import { OnOrderReturned } from './on-order-returned'
import { ReturnOrderUseCase } from '@/domain/shipping/application/use-cases/return-order'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliverymansRepository: InMemoryDeliverymansRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

let returnOrderUseCase: ReturnOrderUseCase

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

    returnOrderUseCase = new ReturnOrderUseCase(inMemoryOrdersRepository)

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    new OnOrderReturned(sendNotification)
  })

  it('should send a notification when an order is returned', async () => {
    const deliveryman = makeDeliveryman()
    const order = makeOrder({
      deliverymanId: deliveryman.id,
    })

    await inMemoryOrdersRepository.create(order)
    await inMemoryDeliverymansRepository.create(deliveryman)

    returnOrderUseCase.execute({
      orderId: order.id.toString(),
      deliverymanId: deliveryman.id.toString(),
    })

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
