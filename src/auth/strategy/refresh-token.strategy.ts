import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from '../../users/users.service';
import { Strategies } from '../types/stretegies.type';
import { REFRESH_TOKEN_COOKIE_KEY } from '../constants/tokens';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  Strategies.REFRESH_TOKEN,
) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJwt,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  private static extractJwt(req: Request) {
    const hasToken =
      req.cookies &&
      REFRESH_TOKEN_COOKIE_KEY in req.cookies &&
      req.cookies[REFRESH_TOKEN_COOKIE_KEY].length > 0;

    return hasToken ? req.cookies[REFRESH_TOKEN_COOKIE_KEY] : null;
  }

  async validate(request: Request, payload: { sub: string; email: string }) {
    const refreshToken =
      request.get('authorization')?.replace('Bearer', '')?.trim() ||
      request.cookies[REFRESH_TOKEN_COOKIE_KEY]?.trim();
    const user = await this.usersService.findById(payload.sub);

    const { hash: _, refreshTokenHash: __, ...returnUser } = user;
    return {
      ...returnUser,
      refreshToken,
    };
  }
}
