import { 
  Body, Param, Query,
  Controller, UseGuards, 
  Get, Post, Delete, 
  Req, Res, 
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { ReadStream, createReadStream } from 'fs';
import { moment } from '@prisma/client';
import { Public } from '@/common/decorators/public.decorators';
import { PICTURE_PATH } from '@/common/constants';
import { CreateMomentDto } from './dto/create.dto';
import { RedisService } from '@/common/databases/redis/redis.service';
import { MomentService } from './moment.service';
import { MomentRes, MomentsRes } from './moment.interface';
import { FileService } from '../file/file.service';
import { PictureService } from '../picture/picture.service';
import { MomentGuard } from './moment.guard';
import { PermissionGuard } from '@/common/guards/permission.guard';

@Controller('moment')
export class MomentController {
  constructor(
    private readonly momentService: MomentService,
    private readonly redisService: RedisService,
    private readonly fileService: FileService,
    private readonly pictureService: PictureService
  ) {}

  @Post()
  async create(@Req() req, @Body() data: CreateMomentDto): Promise<moment> {
    const { moment, visibility } = data;
    const userId: number = req.user.id;
    const res = await this.momentService.create(userId, moment, visibility);
    await this.redisService.setHash(
      "moments",
      `moment_${res.id}`,
      JSON.stringify({
        author: userId,
        visibility,
        viewCount: 0,
        likeCount: 0,
        collectCount: 0,
      })
    );
    return res;
  }

  @UseGuards(PermissionGuard)
  @Post('/labels/:momentId')
  async addLabel(@Req() req, @Param('momentId') momentId:number): Promise<string> {
    const labels:{id?: number;name: string;}[] = req.labels;
    for (const label of labels) {
      const isExisit = await this.momentService.hasLabel(momentId, label.id);
      if (isExisit) continue;
      await this.momentService.addLabel(momentId, label.id);
    }
    return '创建成功~';
  }

  @Public()
  @Get('/list')
  async list(@Query('offset') offset: number, @Query('size') size: number)
  : Promise<MomentsRes[]> {
    offset = offset || 0;
    size = size || 10;
    return this.momentService.findAll(offset, size);
  }

  @Public()
  @Get('/label/:labelName')
  async labelMoment
  (@Param('labelName') labelName:string, 
   @Query('offset') offset: number, 
   @Query('size') size: number
  ): Promise<MomentsRes[]> {
    offset = offset || 0;
    size = size || 10;
    return this.momentService.findAllLabelName(labelName, offset, size);
  }

  @Delete("/:momentId")
  async remove(@Param('momentId') momentId:number): Promise<moment> {
    return await this.momentService.remove(momentId);
  }

  @Public()
  @Get("/:momentId")
  @UseGuards(MomentGuard)
  async detail(@Param('momentId') momentId:number, @Req() req): Promise<MomentRes> {
    let res: MomentRes;
    const imgList = await this.fileService.getImgsByMomentId(momentId);
    const imgs:string[] = imgList?.map(item => item.location);
    if (req.isFollow === 'n') {
      res = await this.momentService.showPart(momentId);
    } else {
      res = await this.momentService.detail(momentId);
    }
    res.imgList = imgs;
    return res;
  }

  @Public()
  @Get('/image/:filename')
  async showMomentPicture(
    @Query('size') size:string, 
    @Query('blur') blur:number, 
    @Param('filename') filename: string,
    @Res() res:Response
  ) {
    const { mimetype, tempLocation } = await this.pictureService.process(filename,size,blur);
    res.setHeader('Content-Type', mimetype);
    let file:ReadStream;
    if (tempLocation) {
      file = createReadStream(`${tempLocation}`);
    } else {
      file = createReadStream(join(process.cwd(),`${PICTURE_PATH}/${filename}`));
    }
    file.pipe(res);
  }
}
