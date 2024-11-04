import { PhotosRepository } from '@/domain/shipping/application/repositories/photos-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Photo } from '@/domain/shipping/enterprise/entities/photo'
import { PrismaPhotoMapper } from '../mappers/prisma-photo-mapper'

@Injectable()
export class PrismaPhotosRepository implements PhotosRepository {
  constructor(private prisma: PrismaService) {}

  async create(photo: Photo) {
    const data = PrismaPhotoMapper.toPrisma(photo)

    await this.prisma.photo.create({
      data,
    })
  }

  async findById(id: string) {
    const photo = await this.prisma.photo.findUnique({
      where: {
        id,
      },
    })

    if (!photo) {
      return null
    }

    return PrismaPhotoMapper.toDomain(photo)
  }

  async save(photo: Photo) {
    const data = PrismaPhotoMapper.toPrisma(photo)

    await this.prisma.photo.update({
      where: {
        id: data.id,
      },

      data,
    })
  }
}
