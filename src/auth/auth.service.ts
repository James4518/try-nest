import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}
  async signup(data) {
    delete data.confirmPassword;
    const { password, ...userWithoutPassword } = await this.prisma.user.create({ data });
    return userWithoutPassword;
  }
}
