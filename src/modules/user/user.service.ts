import { Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import { PrismaService } from '@/common/services/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
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
