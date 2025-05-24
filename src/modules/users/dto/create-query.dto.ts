import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UserQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  query: string = '';

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @ApiProperty()
  pageIndex: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @ApiProperty()
  pageSize: number = 10;
}
