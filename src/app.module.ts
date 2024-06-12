import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { RedisModule } from './common/databases/redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MomentModule } from './modules/moment/moment.module';
import { CommentModule } from './modules/comment/comment.module';
import { AppService } from './app.service';
import { PrismaService } from './common/service/prisma.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env.${process.env.NODE_ENV}`,
    isGlobal: true,
    }), 
    RedisModule, AuthModule, UserModule, MomentModule, CommentModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
