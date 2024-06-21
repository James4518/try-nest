import { PrismaService } from '@/common/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { avatar, moment_picture } from '@prisma/client';
import { IPicRes } from './file.interface';

@Injectable()
export class FileService {
  constructor(private readonly prismaService: PrismaService){}
  async createAvatar(filename:string, mimetype: string, size: number, userId: number)
  : Promise<avatar> {
    return await this.prismaService.avatar.create({
      data: {
        filename,
        mimetype,
        size,
        userId,
      },
    });
  }
  async queryAvatar(userId:number) :Promise<Omit<avatar, 'id' | 'userId'>> {
    const res = await this.prismaService.avatar.findMany({
      where: {
        userId,
      },
      select: {
        filename: true,
        mimetype: true,
        size: true,
      },
    });
    return res.pop();
  }
  async createPicture(momentId: number, filename: string, mimetype: string, size: number, location: string) 
    : Promise<moment_picture> {
    return await this.prismaService.moment_picture.create({
      data: {
        momentId,
        filename,
        mimetype,
        size,
        location,
      },
    });
  }
  async getImgsByMomentId(momentId: number): Promise<Pick<moment_picture,'mimetype'|'location'>[]> {
    return await this.prismaService.moment_picture.findMany({
      where: {
        momentId: momentId,
      },
      select: {
        mimetype: true,
        location: true,
      },
    });
  }
  async searchPicture(filename:string): Promise<IPicRes> {
    const res = await this.prismaService.moment_picture.findUnique({
      where: {
        filename,
      },
      select: {
        filename: true,
        mimetype: true,
        size: true,
        location: true,
      },
    });
    if (res) {
      return { isExisit: true, data: res };
    } else {
      return { isExisit: false };
    }
  }      
}
