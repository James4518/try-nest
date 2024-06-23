import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from '@/modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '@/common/services/prisma.service';
import { LocalAuthGuard } from './local_auth.guard';
import { JwtAuthGuard } from './jwt_auth.guard';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy'
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [
    JwtModule.register({
      signOptions: { expiresIn: '2h' },
    }),
    PassportModule.register({ session: true }), 
    UserModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService, PrismaService, JwtService, LocalAuthGuard,
    LocalStrategy, JwtStrategy,  SessionSerializer,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [LocalAuthGuard]
})
export class AuthModule {}
