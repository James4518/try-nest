import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '@/auth/jwt_auth.guard';
import { LocalAuthGuard } from '@/auth/local_auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorators';

@Injectable()
export class CompositeGuard implements CanActivate {
    constructor(
      private reflector: Reflector,
      private localAuthGuard: LocalAuthGuard,
      private jwtAuthGuard: JwtAuthGuard
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) return true;
      if (await this.jwtAuthGuard.canActivate(context)) return true;
      if (await this.localAuthGuard.canActivate(context)) return true;
      return false;
    }    
}
