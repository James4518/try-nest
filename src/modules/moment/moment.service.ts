import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/services/prisma.service';
import { moment, moment_label } from '@prisma/client';
import { MomentRes } from './moment.interface';
import { RedisService } from '@/common/databases/redis/redis.service';

@Injectable()
export class MomentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService
  ) {}
  async create(userId, content, visibility): Promise<moment> {
    return this.prisma.moment.create({
      data: {
        userId,
        content,
        visibility
      }
    });
  }
  async remove(id): Promise<moment> {
    return this.prisma.moment.delete({
      where: { id }
    });
  }
  async detail(id): Promise<moment> {
    return this.prisma.moment.findUnique({
      where: { id }
    });
  }
  async addLabel(momentId, labelId): Promise<moment_label> {
    return await this.prisma.moment_label.create({
      data: {
        momentId,
        labelId
      },
    });
  }
  async hasLabel(momentId, labelId): Promise<boolean> {
    const label = await this.prisma.moment_label.findFirst({
      where: {
        momentId,
        labelId,
      },
    });
    return !!label;
  }
  async getMomentData(id) {
    const momentDataStr = await this.redisService.getHash("moments", `moment_${id}`);
    return JSON.parse(momentDataStr);
  }
  async showPart(id): Promise<moment> {
    const data = this.prisma.moment.findUnique({
      where: { id }
    });
    const sentences = (await data).content.match(/[^.!?]+[.!?]/g) || [];
    const length = Math.ceil(sentences.length * 0.3);
    const content = sentences.slice(0, length).join(' ') + '...';
    return {
      ...data,
      content
    }
  }
  async findAll(offset: number, size: number): Promise<MomentRes[]> {
    return this.prisma.moment.findMany({
      select: {
        id: true,
        content: true,
        userId: false,
        author: {
          select: {
            id: true,
            name: true
          }
        },
        visibility: true,
        viewCount: true,
        likeCount: true,
        collectCount: true,
        createAt: true
      },
      where: {
        visibility: {
          not: 'private', 
        },
      },
      skip: offset,
      take: size,
    });
  }
  async findAllLabelName(labelName: string, offset: number, size: number): Promise<MomentRes[]> {
    return await this.prisma.moment.findMany({
      select: {
        id: true,
        content: true,
        userId: false,
        author: {
          select: {
            id: true,
            name: true
          }
        },
        visibility: true,
        viewCount: true,
        likeCount: true,
        collectCount: true,
        createAt: true
      },
      where: {
        labels: {
          some: {
            label: {
              name: labelName,
            },
          },
        },
        visibility: {
          not: 'private', 
        },
      },
      take: size,
      skip: offset,
    });
  }
}
