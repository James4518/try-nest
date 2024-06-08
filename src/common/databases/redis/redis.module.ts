import { Module } from '@nestjs/common';
import * as Redis from 'redis';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({
  providers: [RedisService,
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisOptions = {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: parseInt(configService.get<string>('REDIS_PORT','6379')),
          db: parseInt(configService.get<string>('REDIS_DB','0')),
          password: configService.get<string>('REDIS_PASS', '')
        };
        const client = Redis.createClient(redisOptions);
        return client;
      },
    },
  ],
  exports: [RedisService]
})
export class RedisModule {}
