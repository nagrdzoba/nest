import { IsString, IsNotEmpty, MinLength, Matches, IsOptional } from 'class-validator';
import { Request } from 'express';

export class RegisterAndUpdateDto {
  @IsOptional()  // Makes the id optional
  id?: number;   // You can also mark it as optional by using `?` here
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/[@$!%*?&]/, { message: 'Password must contain at least one special symbol (@, $, !, %, *, ?, &)' })
  password: string;
}



export interface CustomRequest extends Request {
  user: {
    id: number;
    username: string;
    // Add other properties here as needed
  }; // Extend Request with a user property
}