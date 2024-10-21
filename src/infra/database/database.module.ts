import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { RecipientsRepository } from '@/domain/shipping/application/repositories/recipients-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipents-repository'
import { DeliverymansRepository } from '@/domain/shipping/application/repositories/deliveryman-repository'
import { PrismaDeliverymansRepository } from './prisma/repositories/prisma-deliverymans-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: DeliverymansRepository,
      useClass: PrismaDeliverymansRepository,
    },
  ],
  exports: [PrismaService, RecipientsRepository, DeliverymansRepository],
})
export class DatabaseModule {}
