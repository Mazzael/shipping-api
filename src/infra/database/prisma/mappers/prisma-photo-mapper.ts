import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Photo } from '@/domain/shipping/enterprise/entities/photo'
import { Photo as PrismaPhoto } from '@prisma/client'

export class PrismaPhotoMapper {
  static toDomain(raw: PrismaPhoto): Photo {
    return Photo.create(
      {
        title: raw.title,
        url: raw.url,
        createdAt: raw.createdAt,
        orderId: raw.orderId ? new UniqueEntityID(raw.orderId) : undefined,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(photo: Photo): PrismaPhoto {
    return {
      id: photo.id.toString(),
      orderId: photo.orderId ? photo.orderId.toString() : null,
      title: photo.title,
      url: photo.url,
      createdAt: photo.createdAt,
    }
  }
}
