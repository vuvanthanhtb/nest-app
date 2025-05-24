import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePasswordHelper } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/modules/users/schema/user.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const foundUser = await this.usersService.findByEmail(username);
    if (!foundUser) {
      return null;
    }

    const isValidPassword = await comparePasswordHelper(
      password,
      foundUser.password,
    );

    if (!isValidPassword) {
      return null;
    }

    return foundUser;
  }

  login(user: any): { access_token: string } {
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
