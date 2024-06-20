import { PrismaService } from '@/common/services/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  constructor(private readonly prismaService: PrismaService){}
  async createAvatar(filename, mimetype, size, userId) {
    return await this.prismaService.avatar.create({
      data: {
        filename,
        mimetype,
        size,
        userId,
      },
    });
  }
  async queryAvatar(userId) {
    const res = await this.prismaService.avatar.findMany({
      where: {
        userId,
      },
      select: {
        filename: true,
        mimetype: true,
        size: true,
      },
    });
    return res.pop();
  }
}
