import { createReadStream } from 'fs';
import { join } from 'path';
import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AVATAR_PATH } from '@/common/constants';
import { Public } from '@/common/decorators/public.decorators';
import { UserService } from './user.service';
import { FileService } from '../file/file.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService
  ) {}
  @Public()
  @Get('/avatar/:userId')
  async showAvatar(
    @Param('userId') userId: number, 
    @Res() res: Response
  ) {
    const { filename, mimetype } = await this.fileService.queryAvatar(userId);
    const file = await createReadStream(join(process.cwd(), `${AVATAR_PATH}/${filename}`));
    res.set({'Content-Type':mimetype});
    file.pipe(res);
  }

  @Public()
  @Get()
  async findAll(@Query('offset') offset: number, @Query('size') size: number) {
    offset = offset || 0;
    size = size || 10;
    return this.userService.findAll(offset, size);
  }
}
