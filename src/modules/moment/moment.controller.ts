import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Public } from '@/common/decorators/public.decorators';
import { CreateMomentDto } from './dto/create.dto';
import { RedisService } from '@/common/databases/redis/redis.service';
import { MomentService } from './moment.service';
import { MomentGuard } from './moment.guard';
import { moment } from '@prisma/client';
import { PermissionGuard } from '@/common/guards/permission.guard';
import { MomentRes } from './moment.interface';

@Controller('moment')
export class MomentController {
  constructor(
    private readonly momentService: MomentService,
    private readonly redisService: RedisService
  ) {}

  @Post()
  async create(@Req() req, @Body() data: CreateMomentDto): Promise<moment> {
    const { moment, visibility } = data;
    const userId = req.user.id;
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
  async addLabel(@Req() req, @Param('momentId') momentId:number) {
    const { labels } = req;
    for (const label of labels) {
      const isExisit = await this.momentService.hasLabel(momentId, label.id);
      if (isExisit) continue;
      await this.momentService.addLabel(momentId, label.id);
    }
  }

  @Public()
  @Get('/list')
  async list(@Query('offset') offset: number, @Query('size') size: number): Promise<MomentRes[]> {
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
  ): Promise<MomentRes[]> {
    offset = offset || 0;
    size = size || 10;
    return this.momentService.findAllLabelName(labelName, offset, size);
  }

  @Delete("/:momentId")
  async remove(@Param('momentId') momentId:number): Promise<moment> {
    return await this.momentService.remove(momentId);
  }

  @Get("/:momentId")
  @UseGuards(MomentGuard)
  async detail(@Param('momentId') momentId:number, @Req() req): Promise<moment> {
    if (req.isFollow === 'n') return await this.momentService.showPart(momentId);
    return await this.momentService.detail(momentId);
  }
}
