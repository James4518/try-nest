import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    if (request.visibility === "all") return true;
    if (isPublic) return true;
    return super.canActivate(context);
  }
  handleRequest(err, user, info) {
    if(err) throw err;
    if (!user) {
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('JWT token has expired');
      } else if (info && info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid JWT token');
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }
    return user;
  }
}