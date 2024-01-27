import { IsNotEmpty, IsString } from 'class-validator';

export class AddJokeDto {
  @IsString()
  @IsNotEmpty()
  joke: string;
}
