import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '@/common/decorators/public.decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  findAll(@Query('offset') offset: number, @Query('size') size: number) {
    offset = offset || 0;
    size = size || 10;
    return this.userService.findAll(offset, size);
  }
}
