import {
  IsString,
  IsEnum,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export enum Role {
  CLIENT = 'CLIENT',
  BUSINESS = 'BUSINESS',
  ADMIN = 'ADMIN',
}

export class RegisterRequestDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  password: string;

  @IsEnum(Role, { message: 'Role must be CLIENT or BUSINESS' })
  @IsOptional()
  role: Role = Role.CLIENT;
}
