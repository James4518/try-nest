import { Controller, ForbiddenException, Param, Post, Req } from '@nestjs/common';
import { PraiseService } from './praise.service';
import { RedisService } from '@/common/databases/redis/redis.service';
import { UserService } from '../user/user.service';

@Controller('praise')
export class PraiseController {
  constructor(
    private readonly praiseService: PraiseService,
    private readonly redisService: RedisService,
    private readonly userService: UserService
  ) {}

  @Post('/follow/:targetId')
  async follow(@Req() req, @Param('targetId') targetId:number): Promise<string> {
    const userId: number = req.user.id;
    if (userId === targetId) throw new ForbiddenException('不能关注自己~');
    const originalSet = await this.userService.follow(userId);
    const isFollow = await this.praiseService.isFollow(userId, targetId);
    if (!isFollow) {
      await this.redisService.addSet(`follow:user${userId}`, targetId);
    } else {
      await this.redisService.removeSet(`follow:user${userId}`, targetId);
    }
    const newSet = await this.userService.follow(userId);
    await this.praiseService.updateList(userId, 'follow', [...originalSet], [...newSet]);
    return !isFollow ? "关注成功~" : "取消关注成功~";
  } 

  @Post('/like/:targetId')
  async like(@Req() req, @Param('targetId') targetId:number): Promise<string> {
    const userId: number = req.user.id;
    const { originalSet, newSet, updated } = await this.praiseService.updateMomentData(
      userId,
      targetId,
      'like'
    );
    await this.praiseService.updateList(userId, 'like', originalSet, newSet);
    return updated ? "点赞成功~" : "取消点赞成功~";
  }

  @Post('/collect/:targetId')
  async collect(@Req() req, @Param('targetId') targetId:number): Promise<string> {
    const userId: number = req.user.id;
    const { originalSet, newSet, updated } = await this.praiseService.updateMomentData(
      userId,
      targetId,
      'collect'
    );
    await this.praiseService.updateList(userId, 'collect', originalSet, newSet);
    return updated ? "收藏成功~" : "取消收藏成功~";
  }
}
