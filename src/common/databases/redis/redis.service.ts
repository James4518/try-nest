import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

interface ZMember {
  score: number;
  value: string | Buffer;
}

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT') private redisClient: RedisClientType;

  async setString(key: string, value: string): Promise<string | null> {
    return this.redisClient.set(key, value);
  }
  async getString(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }
  async delString(key:string): Promise<number> {
    return this.redisClient.del(key);
  }

  async setHash(hashKey: string, field: string, value: string): Promise<number> {
    return this.redisClient.hSet(hashKey, field, value);
  }
  async getHash(hashKey: string, field: string): Promise<string | null> {
    return this.redisClient.hGet(hashKey, field);
  }
  async delHash(hashKey: string, field: string): Promise<number> {
    return this.redisClient.hDel(hashKey, field);
  }

  async addSet(setKey: string, member: string): Promise<number> {
    return this.redisClient.sAdd(setKey, member);
  }
  async removeSet(setKey: string, member: string): Promise<number> {
    return this.redisClient.sRem(setKey, member);
  }
  async getSetMembers(setKey: string): Promise<string[]> {
    return this.redisClient.sMembers(setKey);
  }

  async pushList(listKey: string, value: string): Promise<number> {
    return this.redisClient.lPush(listKey, value);
  }
  async popFromList(listKey: string): Promise<string | null> {
    return this.redisClient.lPop(listKey);
  }
  async getList(listKey: string, start: number, end: number): Promise<string[]> {
    return this.redisClient.lRange(listKey, start, end);
  }

  async addSortedSetMember(sortedSetKey: string, members: ZMember | Array<ZMember>): Promise<number> {
    return this.redisClient.zAdd(sortedSetKey, members);
  }
  async removeFromSortedSet(sortedSetKey: string, member: string): Promise<number> {
    return this.redisClient.zRem(sortedSetKey, member);
  }
  async getSortedSetRangeByScore(sortedSetKey: string, min: number, max: number): Promise<string[]> {
    return this.redisClient.zRangeByScore(sortedSetKey, min, max);
  }

  async isExists(key: string): Promise<boolean> {
    const exists = await this.redisClient.exists(key);
    return exists === 1;
  }
  async isExpire(key: string, seconds: number): Promise<boolean> {
    return this.redisClient.expire(key, seconds);
  }
  async ttl(key: string): Promise<number> {
    return this.redisClient.ttl(key);
  }
  async keys(pattern: string): Promise<string[]> {
    return this.redisClient.keys(pattern)
  }
  async smembers(key: string, member: string): Promise<boolean> {
    return this.redisClient.sIsMember(key, member)
  }
}