import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '@/common/services/prisma.service';
import { RedisModule } from '@/common/databases/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [UserService, PrismaService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
