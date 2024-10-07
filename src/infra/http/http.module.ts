import { Module } from '@nestjs/common'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateRecipientController, AuthenticateController],
})
export class HttpModule {}
