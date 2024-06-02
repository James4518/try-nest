import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@/common/service/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env.${process.env.NODE_ENV}`,
    isGlobal: true,
    }), AuthModule, UserModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaClient, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
