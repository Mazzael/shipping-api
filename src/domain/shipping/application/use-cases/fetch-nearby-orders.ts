import { Either, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface FetchNearbyOrdersUseCaseRequest {
  deliverymanLatitude: number
  deliverymanLongitude: number
}

type FetchNearbyOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>

export class FetchNearbyOrdersUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    deliverymanLatitude,
    deliverymanLongitude,
  }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseResponse> {
    const orders = await this.recipientsRepository.findManyNearby({
      latitude: deliverymanLatitude,
      longitude: deliverymanLongitude,
    })

    return right({ orders })
  }
}
