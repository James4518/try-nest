import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';
import { UserService } from '@/modules/user/user.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaClient, UserService],
})
export class AuthModule {}
