import { IsString, IsNotEmpty, MinLength} from 'class-validator';

export class LoginDto {
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
//   @MinLength(6, { message: 'Password must be at least 6 characters long' })
//   @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
//   @Matches(/\d/, { message: 'Password must contain at least one number' })
//   @Matches(/[@$!%*?&]/, { message: 'Password must contain at least one special symbol (@, $, !, %, *, ?, &)' })
  password: string;
}