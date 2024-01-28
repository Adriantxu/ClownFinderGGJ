import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LogToRoom {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;
}
