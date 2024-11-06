import { Body, Controller, Get, HttpCode } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchNearbyOrdersUseCase } from '@/domain/shipping/application/use-cases/fetch-nearby-orders'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const fetchNearbyOrdersBodySchema = z.object({
  deliverymanLatitude: z.number(),
  deliverymanLongitude: z.number(),
})

type FetchNearbyOrdersBodySchema = z.infer<typeof fetchNearbyOrdersBodySchema>

const bodyValidationPipe = new ZodValidationPipe(fetchNearbyOrdersBodySchema)

@Controller('/deliveryman/orders/nearby')
export class FetchNearbyOrdersController {
  constructor(private fetchNearbyOrdersUseCase: FetchNearbyOrdersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: FetchNearbyOrdersBodySchema,
  ) {
    const { deliverymanLatitude, deliverymanLongitude } = body

    const result = await this.fetchNearbyOrdersUseCase.execute({
      deliverymanLatitude,
      deliverymanLongitude,
    })

    return {
      orders: result.value?.orders,
    }
  }
}
