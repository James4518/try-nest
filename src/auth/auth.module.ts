import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@/modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '@/common/service/prisma.service';
import { LocalAuthGuard } from './local_auth.guard';
import { JwtAuthGuard } from './jwt_auth.guard';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy'

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
    AuthService, PrismaService, JwtService, LocalStrategy, JwtStrategy, JwtAuthGuard, LocalAuthGuard
  ],
  exports: [JwtAuthGuard, LocalAuthGuard]
})
export class AuthModule {}
