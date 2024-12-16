import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @IsNotEmpty()
  description?: string;
}
