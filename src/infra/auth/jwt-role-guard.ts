import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtRoleGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('role', [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      return super.canActivate(context)
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (requiredRoles.includes(user.role)) {
      return true
    }

    return false
  }
}
