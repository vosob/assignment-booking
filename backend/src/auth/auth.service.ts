import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { RegisterRequestDto } from './dto/register.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadType } from './jwt.interface';
import { StringValue } from 'ms';
import { LoginRequestDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { isDev } from 'src/utils/is-dev.util';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly COOKIE_DOMAIN: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_SECRET = configService.getOrThrow<string>('JWT_SECRET');
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
  }

  async register(res: Response, dto: RegisterRequestDto) {
    const { name, email, password, role } = dto;

    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        role,
        password: await hash(password),
      },
    });

    return this.auth(res, user.id);
    // return user;
  }

  async login(res: Response, dto: LoginRequestDto) {
    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }

    const isPasswordValid = await verify(user.password, password);

    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }

    return this.auth(res, user.id);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new ConflictException('Refresh token not found');
    }

    const payload: JwtPayloadType =
      await this.jwtService.verifyAsync(refreshToken);

    if (payload) {
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.id },
        select: { id: true },
      });

      if (!user) {
        throw new ConflictException('User not found');
      }

      return this.auth(res, user.id);
    }
  }

  logout(res: Response) {
    this.setCookie(res, 'refreshToken', new Date(0));
    return { message: 'Logout successful' };
  }

  async validate(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private auth(res: Response, id: string) {
    const { accessToken, refreshToken } = this.generateTokens(id);

    this.setCookie(
      res,
      refreshToken,
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    );

    return { accessToken };
  }

  private generateTokens(id: string) {
    const payload: JwtPayloadType = { id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.JWT_SECRET,
      expiresIn: this.JWT_ACCESS_TOKEN_TTL as StringValue,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.JWT_SECRET,
      expiresIn: this.JWT_REFRESH_TOKEN_TTL as StringValue,
    });

    return { accessToken, refreshToken };
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'none' : 'lax',
      expires,
    });
  }
}
