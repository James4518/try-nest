import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from '@/common/databases/redis/redis.service';

@Injectable()
export class CheckVisibilityMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const momentId = req.params.id;
    const momentDataString = await this.redisService.getHash("moments", `moment_${momentId}`);
    if (!momentDataString) {
      return res.status(404).json({ message: 'Moment not found' });
    }
    const { visibility, ...momentData } = JSON.parse(momentDataString);
    visibility === 'public' ? req['visibility'] = 'all' : req['visibility'] = 'protect'
    next();
  }
}
