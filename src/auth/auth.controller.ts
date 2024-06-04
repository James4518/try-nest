import { BadRequestException, Body, Controller, Post, UsePipes } from '@nestjs/common';
import { user } from '@prisma/client';
import { ValidationUserPipe } from './auth.pipe';
import { SignUpDto, createUserSchema } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { UserService } from '@/modules/user/user.service';
import { AuthService } from './auth.service';
import { encryptPasswd } from "@/common/utils/passwd";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService 
  ) {}

  @Post('signup')
  @UsePipes(new ValidationUserPipe(createUserSchema))
  async register(@Body() data: SignUpDto): Promise<Omit<user,'password'>> {
    console.log(data)
    const res = await this.userService.search(data.name);
    if (res) throw new BadRequestException('User already exists');
    data.password = await encryptPasswd(data.password);
    return this.authService.signup(data);
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<any> {
    return this.authService.signIn(signInDto.name, signInDto.password);
  }
}
