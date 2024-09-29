import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './database/prisma/prisma.service'
import { CreateRecipientController } from './http/controllers/create-recipient.controller'
import { envSchema } from './env/env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './http/controllers/authenticate.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [CreateRecipientController, AuthenticateController],
  providers: [PrismaService],
})
export class AppModule {}
