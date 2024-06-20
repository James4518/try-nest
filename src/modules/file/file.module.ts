import * as fs from 'fs';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AVATAR_PATH, PICTURE_PATH } from '@/common/constants';
import { UserModule } from '../user/user.module';
import { FileController } from './file.controller';
import { PrismaService } from '@/common/services/prisma.service';
import { FileService } from './file.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: (req, file, cb) => {
            let uploadPath = '';
            if (req.url === '/api/file/avatar') {
              uploadPath = AVATAR_PATH;
            } else if (req.url === '/api/file/picture') {
              uploadPath = PICTURE_PATH;
            }
            if (!fs.existsSync(uploadPath)) {
              fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            const filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename);
          },
        }),
      }),
    }),
    UserModule
  ],
  providers: [FileService, PrismaService],
  controllers: [FileController],
  exports: [FileService]
})
export class FileModule {}
