import { Module } from '@nestjs/common'
import { PrismaService } from './database/prisma/prisma.service'
import { CreateRecipientController } from './controllers/create-recipient.controller'

@Module({
  imports: [],
  controllers: [CreateRecipientController],
  providers: [PrismaService],
})
export class AppModule {}
