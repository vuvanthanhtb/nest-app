import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  _id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
