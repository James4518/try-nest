import { Injectable } from '@nestjs/common';
import { PrismaClient, user } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaClient) {}
  async search(name) {
    return this.prisma.user.findUnique({ where: { name }})
  }
  async findAll(offset: number, size: number): Promise<user[]> {
    return this.prisma.user.findMany({
      skip: offset,
      take: size,
    });
  }
}
