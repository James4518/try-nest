import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(@Inject(PrismaClient) private prisma: PrismaClient) {
    super()
  }
  async onModuleInit() {
    await this.$connect();
  }
  getPrisma(): PrismaClient {
    return this.prisma;
  }
}