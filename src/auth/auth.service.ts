import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import { JWT_KEY } from '@/common/config/screct';
import { comparePasswd } from "@/common/utils/passwd"
import { PrismaService } from '@/common/services/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}
  async signUp(data): Promise<Omit<user,'password'>> {
    delete data.confirmPassword;
    const { password, ...userWithoutPassword } = await this.prismaService.user.create({ data });
    return userWithoutPassword;
  }
  async validateUser(name: string, password: string):Promise<Omit<user, 'password'> | null> {
    const user = await this.userService.search(name);
    const res = await comparePasswd(password, user.password);
    if (user && res) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
  async signIn(user): Promise<{ access_token: string }> {
    const payload = { sub: user.id, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload, { secret: JWT_KEY }),
    };
  }
}
