import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateRecipientUseCase } from '@/domain/shipping/application/use-cases/create-recipient'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { ChangeRecipientAddressUseCase } from '@/domain/shipping/application/use-cases/change-recipient-address'
import { ChangeRecipientAddressController } from './controllers/change-recipient-address.controller'
import { AuthenticateDeliverymanUseCase } from '@/domain/shipping/application/use-cases/authenticate-delivery-personnel'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateDeliverymanController } from './controllers/authenticate-deliveryman.controller'
import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { AuthenticateAdminUseCase } from '@/domain/shipping/application/use-cases/authenticate-admin'
import { CreateDeliverymanController } from './controllers/create-deliveryman.controller'
import { CreateDeliverymanUseCase } from '@/domain/shipping/application/use-cases/create-delivery-personnel'
import { CreateAdminController } from './controllers/create-admin.controller'
import { CreateAdminUseCase } from '@/domain/shipping/application/use-cases/create-admin'
import { ChangePasswordUseCase } from '@/domain/shipping/application/use-cases/change-password'
import { ChangePasswordController } from './controllers/change-password.controller'
import { CreateRecipientOrderController } from './controllers/create-recipient-order.controller'
import { CreateRecipientOrderUseCase } from '@/domain/shipping/application/use-cases/create-recipient-order'
import { DeleteDeliverymanController } from './controllers/delete-deliveryman.controller'
import { DeleteDeliverymanUseCase } from '@/domain/shipping/application/use-cases/delete-delivery-personnel'
import { DeleteOrderController } from './controllers/delete-order.controller'
import { DeleteOrderUseCase } from '@/domain/shipping/application/use-cases/delete-order'
import { DeleteRecipientController } from './controllers/delete-recipient.controller'
import { DeleteRecipientUseCase } from '@/domain/shipping/application/use-cases/delete-recipient'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateRecipientController,
    AuthenticateDeliverymanController,
    AuthenticateAdminController,
    ChangeRecipientAddressController,
    CreateDeliverymanController,
    CreateAdminController,
    ChangePasswordController,
    CreateRecipientOrderController,
    DeleteDeliverymanController,
    DeleteOrderController,
    DeleteRecipientController,
  ],
  providers: [
    CreateRecipientUseCase,
    ChangeRecipientAddressUseCase,
    AuthenticateDeliverymanUseCase,
    AuthenticateAdminUseCase,
    CreateDeliverymanUseCase,
    CreateAdminUseCase,
    ChangePasswordUseCase,
    CreateRecipientOrderUseCase,
    DeleteDeliverymanUseCase,
    DeleteOrderUseCase,
    DeleteRecipientUseCase,
  ],
})
export class HttpModule {}
