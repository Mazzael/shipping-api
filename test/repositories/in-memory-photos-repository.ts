import { PhotosRepository } from '@/domain/shipping/application/repositories/photos-repository'
import { Photo } from '@/domain/shipping/enterprise/entities/photo'

export class InMemoryPhotosRepository implements PhotosRepository {
  public items: Photo[] = []

  async create(photo: Photo) {
    this.items.push(photo)
  }

  async findById(id: string) {
    const photo = this.items.find((item) => {
      return item.id.toString() === id
    })

    if (!photo) {
      return null
    }

    return photo
  }
}
