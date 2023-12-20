import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { Strategies } from '../types/stretegies.type';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  Strategies.REFRESH_TOKEN,
) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: { sub: string; email: string }) {
    const refreshToken = request
      .get('authorization')
      .replace('Bearer', '')
      .trim();
    const user = await this.usersService.findById(payload.sub);

    const { hash: _, refreshTokenHash: __, ...returnUser } = user;
    return {
      ...returnUser,
      refreshToken,
    };
  }
}
