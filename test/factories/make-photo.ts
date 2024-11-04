import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Photo, PhotoProps } from '@/domain/shipping/enterprise/entities/photo'
import { PrismaPhotoMapper } from '@/infra/database/prisma/mappers/prisma-photo-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makePhoto(
  override: Partial<PhotoProps> = {},
  id?: UniqueEntityID,
) {
  const photo = Photo.create(
    {
      title: faker.lorem.slug(),
      url: faker.lorem.slug(),
      createdAt: faker.date.recent(),
      ...override,
    },
    id,
  )

  return photo
}

@Injectable()
export class PhotoFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPhoto(data: Partial<PhotoProps> = {}): Promise<Photo> {
    const photo = makePhoto(data)

    await this.prisma.photo.create({
      data: PrismaPhotoMapper.toPrisma(photo),
    })

    return photo
  }
}
