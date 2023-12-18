import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private dbService: DbService) {}

  async signup(authDto: AuthDto) {
    const passwordHash = await argon.hash(authDto.password);

    try {
      const user = await this.dbService.user.create({
        data: {
          email: authDto.email,
          hash: passwordHash,
        },
      });

      const { hash: _, ...returnUser } = user;
      return returnUser;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }
    }
  }

  async login(authDto: AuthDto) {
    const user = await this.dbService.user.findFirst({
      where: {
        email: authDto.email,
      },
    });

    if (!user) throw new ForbiddenException('Incorrect credentials');

    const pwMatches = await argon.verify(user.hash, authDto.password);

    if (!pwMatches) throw new ForbiddenException('Incorrect credentials');

    const { hash: _, ...returnUser } = user;
    return returnUser;
  }
}
