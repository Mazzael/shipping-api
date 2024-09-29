import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { PrismaService } from '../../database/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createRecipientBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  addressLatitude: z.number(),
  addressLongitude: z.number(),
})

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>
@Controller('/recipient')
export class CreateRecipientController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createRecipientBodySchema))
  async handle(@Body() body: CreateRecipientBodySchema) {
    const { name, email, addressLatitude, addressLongitude } = body
  }
}
