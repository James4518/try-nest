import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query('offset') offset: number = 0, @Query('size') size: number = 10) {
    return this.userService.findAll(offset, size);
  }
}
