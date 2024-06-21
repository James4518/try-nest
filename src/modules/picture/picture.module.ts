import { Module } from '@nestjs/common';
import { PictureService } from './picture.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  providers: [PictureService],
  exports: [PictureService]
})
export class PictureModule {}
