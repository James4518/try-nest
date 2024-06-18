import { PrismaService } from '@/common/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { comment } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService){}
  async create(momentId, content, userId): Promise<comment> {
    return await this.prismaService.comment.create({
      data: {
        momentId,
        content,
        userId
      }
    });
  }
  async reply(momentId, content, userId, commentId): Promise<comment> {
    return await this.prismaService.comment.create({
      data: {
        momentId,
        content,
        userId,
        commentId
      }
    });
  }
  async remove(id) :Promise<comment> {
    return await this.prismaService.comment.delete({where: {id}})
  }
}
