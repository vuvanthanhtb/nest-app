import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  _id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
