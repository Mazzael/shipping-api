import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { RecipientsRepository } from '@/domain/shipping/application/repositories/recipients-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipents-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
  ],
  exports: [PrismaService, RecipientsRepository],
})
export class DatabaseModule {}
