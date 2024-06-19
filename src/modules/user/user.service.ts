import { Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import { PrismaService } from '@/common/services/prisma.service';
import { RedisService } from '@/common/databases/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService
  ) {}
  async search(name: string): Promise<user> {
    return this.prisma.user.findUnique({ where: { name }})
  }
  async follow(userId: number): Promise<string[]> {
    return await this.redisService.smembers(`follow:user${userId}`);
  }
  async findAll(offset: number, size: number): Promise<user[]> {
    return this.prisma.user.findMany({
      skip: offset,
      take: size,
    });
  }
}
