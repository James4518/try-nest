import { RedisService } from '@/common/databases/redis/redis.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class PraiseService {
  constructor(private readonly redisService: RedisService){}
  private getMomentSets = async (userId: number, action: string) => {
    const setKey = `${action}_moments:user${userId}`;
    return await this.redisService.smembers(setKey);
  };
  async updateList(userId: number, action: string, originalSet: string[], newSet: string[]) {
    const newItems = newSet.filter((id) => !originalSet.includes(id));
    const removedItems = originalSet.filter((id) => !newSet.includes(id));
    const addKey = `add_${action}:user${userId}`;
    const delKey = `del_${action}:user${userId}`;
    newItems.length && (await this.redisService.pushList(addKey, ...newItems));
    if (removedItems.length) {
      const res = await this.redisService.getList(addKey,0,-1);
      if (res.length) {
        await this.redisService.popFromList(addKey);
      } else {
        await this.redisService.pushList(delKey, ...removedItems);
      }
    }
  };
   async updateMomentData(userId: number, targetId: number, action: string) {
    const momentData = JSON.parse(
      await this.redisService.getHash("moments", `moment_${targetId}`)
    );
    const setKey = `${action}_moments:user${userId}`;
    const originalSet = await this.getMomentSets(userId, action);
    if (action !== "like" && action !== "collect") throw new InternalServerErrorException("Unknown action");
    const countField = action === "like" ? "likeCount" : "collectCount";
    if (!await this.redisService.sismember(setKey, targetId)) {
      momentData[countField]++;
      await this.redisService.setHash(
        "moments",
        `moment_${targetId}`,
        JSON.stringify(momentData)
      );
      await this.redisService.addSet(setKey, targetId);
      const newSet = await this.getMomentSets(userId, action);
      return { originalSet, newSet, updated: true };
    } else {
      momentData[countField]--;
      await this.redisService.setHash(
        "moments",
        `moment_${targetId}`,
        JSON.stringify(momentData)
      );
      await this.redisService.removeSet(setKey, targetId);
      const newSet = await this.getMomentSets(userId, action);
      return { originalSet, newSet, updated: false };
    }
  };
  async isFollow(userId: number,targetId: number): Promise<boolean> {
    const res = await this.redisService.sismember(`follow:user${userId}`, targetId);
    return !!res;
  }
}
