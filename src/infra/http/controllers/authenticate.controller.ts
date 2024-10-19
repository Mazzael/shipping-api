import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { PrismaService } from '../../database/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { JwtService } from '@nestjs/jwt'
import { Public } from '@/infra/auth/public'

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>
@Controller('/auth')
@Public()
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { cpf, password } = body

    const token = this.jwt.sign({ sub: 'user-id' })

    return token
  }
}
