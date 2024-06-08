import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { comparePasswd } from "@/common/utils/passwd"
import { PrismaService } from '@/common/service/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}
  async signup(data) {
    delete data.confirmPassword;
    const { password, ...userWithoutPassword } = await this.prismaService.user.create({ data });
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
