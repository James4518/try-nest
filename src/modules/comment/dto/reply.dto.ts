import { IsNotEmpty } from 'class-validator';

export class ReplyCommentDto {
  @IsNotEmpty({message: 'momentId is required!'})
  momentId: number;

  @IsNotEmpty({message: 'commentId is required!'})
  commentId: number;

  @IsNotEmpty({message: 'comment is required!'})
  comment: string;
}
