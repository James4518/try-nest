import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { RedisModule } from './common/databases/redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MomentModule } from './modules/moment/moment.module';
import { CommentModule } from './modules/comment/comment.module';
import { LabelModule } from './modules/label/label.module';
import { PraiseModule } from './modules/praise/praise.module';
import { FileModule } from './modules/file/file.module';
import { PictureModule } from './modules/picture/picture.module';
import { AppService } from './app.service';
import { PrismaService } from './common/services/prisma.service';
import { CompositeGuard } from './common/guards/composite.guard';
import { PermissionService } from './common/services/permission.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env.${process.env.NODE_ENV}`,
    isGlobal: true,
    }), 
    RedisModule, AuthModule, UserModule, MomentModule, CommentModule, 
    LabelModule, PraiseModule, FileModule, PictureModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, PermissionService,
    {
      provide: APP_GUARD,
      useClass: CompositeGuard,
    },
  ],
})
export class AppModule {}
