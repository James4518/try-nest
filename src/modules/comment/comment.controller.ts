import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create.dto';
import { ReplyCommentDto } from './dto/reply.dto';
import { comment } from '@prisma/client';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService){}

  @Post()
  async create(@Req() req, @Body() data: CreateCommentDto): Promise<comment> {
    const userId = req.user.id;
    const { momentId, comment: content } = data;
    return await this.commentService.create(momentId, content, userId);
  }

  @Post('/reply')
  async reply(@Req() req, @Body() data: ReplyCommentDto): Promise<comment> {
    const userId = req.user.id;
    const { momentId, comment: content, commentId } = data;
    return await this.commentService.reply(momentId, content, userId, commentId);
  }

  @Delete('/:id')
  async remove(@Param('id') id:number): Promise<comment> {
    return await this.commentService.remove(id)
  }
}
