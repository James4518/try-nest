import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Public } from '@/common/decorators/public.decorators';
import { CreateMomentDto } from './dto/create.dto';
import { RedisService } from '@/common/databases/redis/redis.service';
import { MomentService } from './moment.service';
import { MomentGuard } from './moment.guard';

@Controller('moment')
export class MomentController {
  constructor(
    private readonly momentService: MomentService,
    private readonly redisService: RedisService
  ) {}

  @Post()
  async create(@Req() req, @Body() data: CreateMomentDto) {
    const { moment, visibility } = data;
    const userId = req.user.id;
    const momentId = await this.momentService.create(userId, moment, visibility);
    await this.redisService.setHash(
      "moments",
      `moment_${momentId}`,
      JSON.stringify({
        author: userId,
        visibility,
        viewCount: 0,
        likeCount: 0,
        collectCount: 0,
      })
    );
  }

  @Public()
  @Get('/list')
  async list(@Query('offset') offset: number, @Query('size') size: number) {
    offset = offset || 0;
    size = size || 10;
    return this.momentService.findAll(offset, size);
  }

  @Delete("/:momentId")
  async remove(@Param('momentId') momentId:number) {
    return await this.momentService.remove(momentId);
  }

  @Get("/:momentId")
  @UseGuards(MomentGuard)
  async detail(@Param('momentId') momentId:number, @Req() req) {
    if (req.isFollow === 'n') return await this.momentService.showPart(momentId);
    return await this.momentService.detail(momentId);
  }
}
