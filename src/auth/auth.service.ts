import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { password, ...rest } = signupDto;
    const hash = await this.hashData(password);

    const user = await this.usersService.create({ ...rest, hash });
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user,
      tokens,
    };
  }

  async login(authDto: AuthDto) {
    const user = await this.usersService.findByEmail(authDto.email);
    if (!user) throw new ForbiddenException('Incorrect credentials');

    const pwMatches = await argon.verify(user.hash, authDto.password);
    if (!pwMatches) throw new ForbiddenException('Incorrect credentials');

    const { hash: _, ...returnUser } = user;
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      user: returnUser,
      tokens,
    };
  }

  async logout(userId: string) {
    this.usersService.clearRefreshToken(userId);
  }

  async hashData(data: string) {
    return argon.hash(data);
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const refreshTokenHash = await this.hashData(refreshToken);
    await this.usersService.updateRefreshToken(userId, refreshTokenHash);
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const payload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '60m',
        secret: process.env.JWT_ACCESS_SECRET,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '30d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshTokenHash)
      throw new ForbiddenException('Access denied');

    const refreshTokenMatches = await argon.verify(
      user.refreshTokenHash,
      refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Invalid token');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }
}
