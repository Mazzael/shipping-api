import {
  FindManyNearbyParams,
  RecipientsRepository,
} from '@/domain/shipping/application/repositories/recipients-repository'
import { Order } from '@/domain/shipping/enterprise/entities/order'
import { Recipient } from '@/domain/shipping/enterprise/entities/recipient'
import { getDistanceBetweenCoordinates } from 'test/utils/get-distance-between-coordinates'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async findById(id: string): Promise<Recipient> {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findByEmail(email: string): Promise<Recipient> {
    const recipient = this.items.find((item) => item.email.toString() === email)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const nearbyOrders: Order[] = []

    const nearbyRecipients = this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude,
          longitude,
        },
        {
          latitude: item.addressLatitude,
          longitude: item.addressLongitude,
        },
      )

      return distance < 10
    })

    nearbyRecipients.forEach((recipient) => {
      recipient.orders.currentItems.forEach((order) => {
        nearbyOrders.push(order)
      })
    })

    return nearbyOrders
  }

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async save(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items[itemIndex] = recipient
  }

  async delete(recipient: Recipient): Promise<void> {
    this.items = await this.items.filter((item) => {
      return item.id !== recipient.id
    })
  }
}
