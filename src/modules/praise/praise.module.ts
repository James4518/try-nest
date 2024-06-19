import { Module } from '@nestjs/common';
import { PraiseController } from './praise.controller';
import { PraiseService } from './praise.service';
import { RedisModule } from '@/common/databases/redis/redis.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [RedisModule,UserModule],
  controllers: [PraiseController],
  providers: [PraiseService]
})
export class PraiseModule {}
