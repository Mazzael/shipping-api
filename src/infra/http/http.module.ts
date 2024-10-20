import { Module } from '@nestjs/common'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateRecipientUseCase } from '@/domain/shipping/application/use-cases/create-recipient'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateRecipientController, AuthenticateController],
  providers: [CreateRecipientUseCase],
})
export class HttpModule {}
