import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { comparePasswd } from "@/common/utils/passwd"

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}
  async signup(data) {
    delete data.confirmPassword;
    const { password, ...userWithoutPassword } = await this.prisma.user.create({ data });
    return userWithoutPassword;
  }
  async signIn(name: string, password: string): Promise<{ access_token: string }> {
    const user = await this.userService.search(name);
    const res = await comparePasswd(password, user.password);
    if (!res) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
