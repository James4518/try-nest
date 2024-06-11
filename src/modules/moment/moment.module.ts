import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MomentController } from './moment.controller';
import { MomentService } from './moment.service';
import { PrismaService } from '@/common/service/prisma.service';
import { RedisService } from '@/common/databases/redis/redis.service';
import { RedisModule } from '@/common/databases/redis/redis.module';
import { CheckVisibilityMiddleware } from './moment.middleware';

@Module({
  imports: [RedisModule],
  providers: [MomentService, PrismaService, RedisService],
  controllers: [MomentController]
})
export class MomentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckVisibilityMiddleware)
      .forRoutes({ path: '/moment/:id(\\d+)', method: RequestMethod.GET });
  }
}
