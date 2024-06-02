import { BadRequestException, Body, Controller, Post, UsePipes } from '@nestjs/common';
import { user } from '@prisma/client';
import { ValidationUserPipe } from './auth.pipe';
import { CreateUserDto, createUserSchema } from '../modules/user/dto/create-user.dto';
import { UserService } from '@/modules/user/user.service';
import { AuthService } from './auth.service';
import handlePasswd from "@/common/utils/encrypt-passwd";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService 
  ) {}
  
  @Post('signup')
  @UsePipes(new ValidationUserPipe(createUserSchema))
  async register(@Body() data: CreateUserDto): Promise<Omit<user,'password'>> {
    console.log(data)
    const res = await this.userService.search(data.name);
    if (res) throw new BadRequestException('User already exists');
    data.password = await handlePasswd(data.password);
    return this.authService.signup(data);
  }
}
