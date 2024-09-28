import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/shipping/enterprise/entities/recipient'
import { faker } from '@faker-js/faker'

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      addressLatitude: faker.location.latitude(),
      addressLongitude: faker.location.longitude(),
      ...override,
    },
    id,
  )

  return recipient
}
