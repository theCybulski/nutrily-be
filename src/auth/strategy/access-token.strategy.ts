import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Strategies } from '../types/stretegies.type';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  Strategies.ACCESS_TOKEN,
) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.usersService.findById(payload.sub);

    const { hash: _, refreshTokenHash: __, ...returnUser } = user;
    return returnUser;
  }
}
