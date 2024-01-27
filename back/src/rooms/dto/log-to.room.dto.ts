import { IsNotEmpty, IsString } from 'class-validator';

export class LogToRoom {
  @IsString()
  @IsNotEmpty()
  password: string;
}
