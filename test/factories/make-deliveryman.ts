import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Deliveryman,
  DeliverymanProps,
} from '@/domain/shipping/enterprise/entities/deliveryman'
import { faker } from '@faker-js/faker'

export function makeDeliveryman(
  override: Partial<DeliverymanProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryman = Deliveryman.create(
    {
      name: faker.person.fullName(),
      cpf: faker.internet.userName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return deliveryman
}
