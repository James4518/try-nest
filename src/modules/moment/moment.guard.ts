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
    const userId = request.user.id;
    const { author, visibility, ...momentData } = JSON.parse(await this.redisService.getHash("moments",`moment_${momentId}`));
    if (visibility === "private") {
      return userId === author;
    } else if (visibility === 'public') {
      return true;
    } else {
      const set = await this.redisService.getSetMembers(`follow:user${userId}`);
      request['isFollow'] = set.includes(author) ? 'y' : 'n';
      return true;
    }
  }
}
