import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RoomCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsNumber()
  @IsOptional()
  max_size?: number;
}
