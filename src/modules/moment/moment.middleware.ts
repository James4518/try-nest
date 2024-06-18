import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from '@/common/databases/redis/redis.service';
import { LabelService } from '../label/label.service';

@Injectable()
export class CheckVisibilityMiddleware implements NestMiddleware {
  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const momentId = req.params.id;
    const momentDataString = await this.redisService.getHash("moments", `moment_${momentId}`);
    if (!momentDataString) {
      return res.status(404).json({ message: 'Moment not found' });
    }
    const { visibility, ...momentData } = JSON.parse(momentDataString);
    visibility === 'public' ? req['visibility'] = 'all' : req['visibility'] = 'protect'
    next();
  }
}

@Injectable()
export class VerifyExistLabelMiddleware implements NestMiddleware {
  constructor(private readonly labelService: LabelService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const labels: string[] = req.body.labels;
    if (!Array.isArray(labels)) return res.status(400).json({ error: 'Labels should be an array.' });
    const newLabels: Array<{ id?: number; name: string }> = [];
    for (const name of labels) {
      let labelObj: { id?:number, name:string } = { name };
      const exisitLabel = await this.labelService.search(name);
      if (exisitLabel) {
        labelObj.id = exisitLabel.id;
      } else {
        const insertRes = await this.labelService.create(name);
        labelObj.id = insertRes.id;
      }
      newLabels.push(labelObj);
    }
    req['labels'] = newLabels;
    next();
  }
}
