import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MomentController } from './moment.controller';
import { RedisModule } from '@/common/databases/redis/redis.module';
import { FileModule } from '../file/file.module';
import { CheckVisibilityMiddleware, VerifyExistLabelMiddleware } from './moment.middleware';
import { MomentService } from './moment.service';
import { PrismaService } from '@/common/services/prisma.service';
import { RedisService } from '@/common/databases/redis/redis.service';
import { PermissionService } from '@/common/services/permission.service';
import { LabelService } from '../label/label.service';

@Module({
  imports: [RedisModule,FileModule],
  providers: [MomentService, PrismaService, RedisService, PermissionService, LabelService],
  controllers: [MomentController]
})
export class MomentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckVisibilityMiddleware)
      .forRoutes({ path: '/moment/:id(\\d+)', method: RequestMethod.GET });
    consumer
      .apply(VerifyExistLabelMiddleware)
      .forRoutes({path: '/moment/labels/:momentid(\\d+)', method: RequestMethod.POST} );
  }
}
