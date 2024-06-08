import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '@/modules/user/user.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { jwtConstants } from './auth.constants';
import { PrismaService } from '@/common/service/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService, PrismaService, UserService
  ],
  exports: [AuthService],
})
export class AuthModule {}
