import { Injectable, NotFoundException } from '@nestjs/common';
import Jimp from 'jimp';
import { PICTURE_PATH, PICTURE_REGEX } from '@/common/constants';
import { isExistsFile } from '@/common/utils/file';
import { IMomentPic } from '../moment/moment.interface';
import { FileService } from '../file/file.service';

@Injectable()
export class PictureService {
  constructor(private readonly fileService: FileService){}
  updateFilename(filename, ...textContentPairs) {
    return filename.replace(PICTURE_REGEX, (match, p1, p2, p3) => {
      let newFilenamePart = `${p1}-${p2}`;
      for (let i = 0; i < textContentPairs.length; i += 2) {
        const text = textContentPairs[i];
        const content = textContentPairs[i + 1];
        if (i === 0) {
          newFilenamePart += `-${text}=${content}`;
        } else {
          newFilenamePart += `&${text}=${content}`;
        }
      }
      return `${newFilenamePart}.${p3}`;
    });
  }
  async process(filename: string, size:string, blur:number){
    const result = await this.fileService.searchPicture(filename);
    if (!result) throw new NotFoundException('图片不存在~');
    const pictureInfo:IMomentPic = result.data;
    let width:number, height:number;
    if (size) {
      [width, height] = size.split("*").map(Number);
    }
    let newFilename;
    if (size && blur) {
      newFilename = this.updateFilename(filename, "size", size, "blur", blur);
    } else if (size) {
      newFilename = this.updateFilename(filename, "size", size);
    } else if (blur) {
      newFilename = this.updateFilename(filename, "blur", blur);
    }
    const isExisit = await isExistsFile(`${PICTURE_PATH}`, newFilename);
    if (!isExisit) {
      const image = await Jimp.read(`${PICTURE_PATH}/${filename}`);
      size && image.resize(width, height);
      blur && image.blur(Number(blur));
      await image.writeAsync(`${PICTURE_PATH}/${newFilename}`);
    }
    pictureInfo.tempLocation = `${PICTURE_PATH}/${newFilename}`;
   return pictureInfo;
  }
}
