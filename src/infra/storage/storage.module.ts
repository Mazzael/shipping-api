import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { Uploader } from '@/domain/shipping/application/storage/uploader'
import { TebiStorage } from './tebi-storage'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: TebiStorage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
