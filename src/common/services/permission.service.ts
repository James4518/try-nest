import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PermissionService {
  constructor(private readonly prismaService: PrismaService) {}
  async checkResource(resourceName: string, resourceId: number, userId: number) {
    const res = await this.prismaService[resourceName].findUnique({
      where: {
        id: resourceId,
        userId,
      },
    });
    return !!res;
  }

}
