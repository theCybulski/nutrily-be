import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private dbService: DbService) {}

  async signup(dto: AuthDto) {
    const passwordHash = await argon.hash(dto.password);

    try {
      const user = await this.dbService.user.create({
        data: {
          email: dto.email,
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

  login() {
    return 'i am login';
  }
}
