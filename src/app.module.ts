import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@/common/service/prisma.service';
import { RedisService } from '@/common/service/redis.service';
import { UserController } from './modules/user/user.controller';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env.${process.env.NODE_ENV}`,
    isGlobal: true,
    }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, PrismaClient, PrismaService, RedisService],
  exports: [PrismaService, RedisService],
})
export class AppModule {}
