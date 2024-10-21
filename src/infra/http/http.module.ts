import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateRecipientUseCase } from '@/domain/shipping/application/use-cases/create-recipient'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { ChangeRecipientAddressUseCase } from '@/domain/shipping/application/use-cases/change-recipient-address'
import { ChangeRecipientAddressController } from './controllers/change-recipient-address.controller'
import { AuthenticateDeliverymanUseCase } from '@/domain/shipping/application/use-cases/authenticate-delivery-personnel'
import { CryptographyModule } from '../cryptography/cryptography.module'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateRecipientController,
    AuthenticateController,
    ChangeRecipientAddressController,
  ],
  providers: [
    CreateRecipientUseCase,
    ChangeRecipientAddressUseCase,
    AuthenticateDeliverymanUseCase,
  ],
})
export class HttpModule {}
