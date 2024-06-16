import { BadRequestException, Body, Controller, Post, Req, UsePipes, UseGuards } from '@nestjs/common';
import { SignUpDto, createUserSchema } from './dto/signup.dto';
import { user } from '@prisma/client';
import { Public } from '@/common/decorators/public.decorators';
import { LocalAuthGuard } from './local_auth.guard';
import { ValidationUserPipe } from './auth.pipe';
import { AuthService } from './auth.service';
import { UserService } from '@/modules/user/user.service';
import { encryptPasswd } from "@/common/utils/passwd";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService 
  ) {}
  
  @Public()
  @Post('signup')
  @UsePipes(new ValidationUserPipe(createUserSchema))
  async register(@Body() data: SignUpDto): Promise<Omit<user,'password'>> {
    const res = await this.userService.search(data.name);
    if (res) throw new BadRequestException('User already exists');
    data.password = await encryptPasswd(data.password);
    return this.authService.signup(data);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Req() req): Promise<{ access_token: string }> {
    return this.authService.signIn(req.user);
  }
}
