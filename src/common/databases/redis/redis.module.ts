import { Module, OnModuleDestroy } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import promisifyObj from "@/common/utils/conn";

interface CustomRedisOptions extends RedisOptions {
  replication?: {
    mode: 'slave';
    masterHost: string;
    masterPort: number;
    masterPassword?: string;
    slaveHost: string;
    slavePort: number;
    slavePassword?: string;
  };
}

@Module({
    providers: [
      RedisService,
      {
        provide: 'REDIS_CLIENT',
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          const redisOptions: CustomRedisOptions = ({
            name: "master",
            role: 'master',
            host: configService.get<string>('REDIS_MASTER_HOST', 'localhost'),
            port: parseInt(configService.get<string>('REDIS_MASTER_PORT', '6379')),
            password: configService.get<string>('REDIS_MASTER_PASSWORD', ''),
            db: parseInt(configService.get<string>('REDIS_MASTER_DB', '0')),
            replication: {
              masterHost: configService.get<string>('REDIS_MASTER_HOST', 'localhost'),
              masterPort: parseInt(configService.get<string>('REDIS_MASTER_PORT', '6379')),
              masterPassword: configService.get<string>('REDIS_MASTER_PASSWORD', ''),
              mode: 'slave',
              slaveHost: configService.get<string>('REDIS_SLAVE_HOST', 'localhost'),
              slavePort: parseInt(configService.get<string>('REDIS_SLAVE_PORT', '6380')),
              slavePassword: configService.get<string>('REDIS_SLAVE_PASSWORD', ''),
            },
        })
        const connPool = new Redis(redisOptions);
        return promisifyObj(connPool);
      }
    }
    ],
    exports: [RedisService,'REDIS_CLIENT']
  })  

export class RedisModule {}
