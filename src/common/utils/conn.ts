import Redis from "ioredis";
import { promisify } from "util";

export default function promisifyObj(obj: Redis) {
  const promisifiedObj:{ [key: string]: (...args: any[]) => Promise<any> } = {};
  for (const key in obj) {
      if (typeof obj[key] === 'function') {
          promisifiedObj[key] = promisify(obj[key]).bind(obj);
      }
  }
  return promisifiedObj;
}