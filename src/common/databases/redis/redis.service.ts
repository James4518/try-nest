import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class RedisService implements OnApplicationShutdown {
  private isClientClosed: boolean = false;
  constructor(
    @Inject('REDIS_CLIENT') private redisClient:{ [key: string]: (...args: any[]) => Promise<any> }){
      this.redisClient.on('end', () => {
      this.isClientClosed = true;
    });
  }
  getClient() {
    return this.redisClient;
  }

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
    return this.redisClient.hset(hashKey, field, value);
  }
  async getHash(hashKey: string, field: string): Promise<string | null> {
    return this.redisClient.hget(hashKey, field);
  }
  async delHash(hashKey: string, field: string): Promise<number> {
    return this.redisClient.hdel(hashKey, field);
  }

  async addSet(setKey: string, member: number): Promise<number> {
    return this.redisClient.sadd(setKey, member);
  }
  async removeSet(setKey: string, member: number): Promise<number> {
    return this.redisClient.srem(setKey, member);
  }

  async pushList(listKey: string, ...values: string[]): Promise<number> {
    return this.redisClient.lpush(listKey, ...values);
  }
  async popFromList(listKey: string): Promise<string | null> {
    return this.redisClient.lpop(listKey);
  }
  async getList(listKey: string, start: number, end: number): Promise<string[]> {
    return this.redisClient.lrange(listKey, start, end);
  }

  async addSortedSetMember(key: string, score: number, member: string): Promise<number> {
    return this.redisClient.zadd(key, score, member);
  }
  async removeFromSortedSet(sortedSetKey: string, member: string): Promise<number> {
    return this.redisClient.zrem(sortedSetKey, member);
  }
  async getSortedSetRangeByScore(sortedSetKey: string, min: number, max: number): Promise<string[]> {
    return this.redisClient.zrangebyscore(sortedSetKey, min, max);
  }

  async isExists(key: string): Promise<boolean> {
    const exists = await this.redisClient.exists(key);
    return exists === 1;
  }
  async isExpire(key: string, seconds: number): Promise<boolean> {
    return !!this.redisClient.expire(key, seconds);
  }
  async ttl(key: string): Promise<number> {
    return this.redisClient.ttl(key);
  }
  async keys(pattern: string): Promise<string[]> {
    return this.redisClient.keys(pattern)
  }
  async smembers(key: string): Promise<string[]> {
    return this.redisClient.smembers(key)
  }
  async sismember(key: string, member: number): Promise<number> {
    return this.redisClient.sismember(key, member)
  }
  async onApplicationShutdown(signal?: string): Promise<void> {
    if (this.isClientClosed) return;

    await new Promise<void>((resolve) => {
      this.redisClient.on('end', () => {
        resolve();
      });
      this.redisClient.quit();
      this.isClientClosed = true;
    });
  }
}