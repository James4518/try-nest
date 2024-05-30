import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: parseInt(this.configService.get('REDIS_PORT')),
      db: parseInt(this.configService.get('REDIS_DB')),
      password: this.configService.get('REDIS_PASSPORT')
    });
  }

  getClient(): Redis {
    return this.redisClient;
  }
}
