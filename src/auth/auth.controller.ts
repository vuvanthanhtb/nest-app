import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from '@/decorator';
import { CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  login(@Request() req: { user: any }): { access_token: string } {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  @Public()
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.handleRegister(createAuthDto);
  }

  @Post('send-email')
  @Public()
  sendEmail() {
    this.mailerService
      .sendMail({
        to: 'amunra1102@gmail.com',
        subject: 'Testing Nest MailerModule ✔',
        text: 'welcome',
        template: 'register.hbs',
        context: {
          activationCode: '123456',
          name: 'thanhvv',
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
    return 'OK;';
  }
}
