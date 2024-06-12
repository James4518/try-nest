import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/service/prisma.service';
import { moment } from '@prisma/client';

@Injectable()
export class MomentService {
  constructor(private readonly prisma: PrismaService) {}
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
  async findAll(offset: number, size: number): Promise<moment[]> {
    return this.prisma.moment.findMany({
      skip: offset,
      take: size,
      where: {
        NOT: {
          visibility: 'private'
        }
      }
    });
  }
}
