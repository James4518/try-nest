import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { user } from '@prisma/client';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService){
    super()
  }
  serializeUser(user: user, done: (err: Error, id:number) => void): void {
    done(null, user.id);
  }
  async deserializeUser(userId:number, done: (err: Error, user: user) => void) {
    const user = await this.userService.query(userId);
    return user ? done(null, user) : done(null,null);
  }
}