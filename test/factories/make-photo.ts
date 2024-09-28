import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Photo, PhotoProps } from '@/domain/shipping/enterprise/entities/photo'

export function makePhoto(
  override: Partial<PhotoProps> = {},
  id?: UniqueEntityID,
) {
  const photo = Photo.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      ...override,
    },
    id,
  )

  return photo
}
