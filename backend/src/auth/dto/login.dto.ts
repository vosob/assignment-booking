import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6)
  password: string;
}
