import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class UserQueryDto {
  @IsOptional()
  @IsString()
  query: string = "";

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  pageIndex: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  pageSize: number = 10;
}
