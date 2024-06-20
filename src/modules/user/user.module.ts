import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '@/common/services/prisma.service';
import { RedisModule } from '@/common/databases/redis/redis.module';
import { FileService } from '../file/file.service';

@Module({
  imports: [RedisModule],
  providers: [UserService, PrismaService, FileService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
