import { InMemoryPhotosRepository } from 'test/repositories/in-memory-photos-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { UploadPhotoUseCase } from './upload-photo'
import { InvalidPhotoTypeError } from './errors/invalid-photo-type-error'

let inMemoryPhotosRepository: InMemoryPhotosRepository
let fakeUploader: FakeUploader

let sut: UploadPhotoUseCase

describe('Upload Photo', () => {
  beforeEach(() => {
    inMemoryPhotosRepository = new InMemoryPhotosRepository()
    fakeUploader = new FakeUploader()

    sut = new UploadPhotoUseCase(inMemoryPhotosRepository, fakeUploader)
  })

  it('should be able to upload a photo', async () => {
    const result = await sut.execute({
      fileName: 'order.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      photo: inMemoryPhotosRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'order.png',
      }),
    )
  })

  it('should not be able to upload a photo with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'order.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPhotoTypeError)
  })
})
