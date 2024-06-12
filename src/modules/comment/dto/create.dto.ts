import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({message: 'momentId is required!'})
  momentId: number;

  @IsNotEmpty({message: 'comment is required!'})
  comment: string;
}
