import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '@/common/databases/redis/redis.service';

@Injectable()
export class MomentGuard implements CanActivate {
  constructor(
    private reflector: Reflector, 
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const momentId = request.params.momentId;
    const { author, visibility, ...momentData } = JSON.parse(
      await this.redisService.getHash("moments",`moment_${momentId}`)
    );
    if (visibility === 'public') {
      return true;
    } else {
      const userId: number = request.user.id;
      if (visibility === "private") {
        return userId === author;
      }  else {
        const set = await this.redisService.smembers(`follow:user${userId}`);
        request['isFollow'] = set.includes(author) ? 'y' : 'n';
        return true;
      }
    }
  }
}
