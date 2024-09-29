import { Controller, Post } from '@nestjs/common'
import { PrismaService } from '../database/prisma/prisma.service'

@Controller('/recipient')
export class CreateRecipientController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle() {}
}
