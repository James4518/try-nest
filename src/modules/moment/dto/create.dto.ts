import { IsEnum, IsNotEmpty } from 'class-validator';

enum Visibility {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  PRIVATE = 'private',
}

export class CreateMomentDto {
  @IsNotEmpty({message: 'moment is required!'})
  moment: string;
  
  @IsNotEmpty({message: 'visibility is required!'})
  @IsEnum(Visibility, {message: 'visibility is one of value: public、friends、private!'})
  visibility: string;
}
