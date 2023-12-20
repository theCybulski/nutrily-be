import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Strategies } from '../types/stretegies.type';
import { Request } from 'express';
import { ACCESS_TOKEN_COOKIE_KEY } from '../constants/tokens';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  Strategies.ACCESS_TOKEN,
) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessTokenStrategy.extractJwt,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration: false,
    });
  }

  private static extractJwt(req: Request) {
    const hasToken =
      req.cookies &&
      ACCESS_TOKEN_COOKIE_KEY in req.cookies &&
      req.cookies[ACCESS_TOKEN_COOKIE_KEY].length > 0;

    return hasToken ? req.cookies[ACCESS_TOKEN_COOKIE_KEY] : null;
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.usersService.findById(payload.sub);

    const { hash: _, refreshTokenHash: __, ...returnUser } = user;
    return returnUser;
  }
}
