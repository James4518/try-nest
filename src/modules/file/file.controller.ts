import { 
  Controller, 
  HttpStatus, 
  ParseFilePipeBuilder, 
  Post, 
  Req, 
  UploadedFile, 
  UseInterceptors
 } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { SERVER_HOST, SERVER_PORT } from '@/common/config/server';
import { FileService } from './file.service';
import { UserService } from '../user/user.service';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly userService: UserService
  ){}
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async avatar(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /(jpg|jpeg|png|gif)$/,
      })
      .addMaxSizeValidator({
        maxSize: 1*1024*1024
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),
  ) file: Express.Multer.File, @Req() req): Promise<string> {
    const userId: number = req.user.id;
    const { filename, mimetype, size } = file;
    await this.fileService.createAvatar(filename,mimetype,size,userId);
    const avatarUrl = `${SERVER_HOST}:${SERVER_PORT}/user/avatar/${userId}`;
    await this.userService.updateAvatar(userId,avatarUrl);
    return '头像上传成功~';
  }
}
