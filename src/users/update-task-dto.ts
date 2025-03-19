/* eslint-disable prettier/prettier */
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  important?: boolean;

  @IsOptional()
  @IsBoolean()
  complete?: boolean;
}
