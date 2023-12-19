import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
  constructor(private dbService: DbService) {}

  async findByEmail(email: string): Promise<User> {
    return this.dbService.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User> {
    return this.dbService.user.findUnique({
      where: { id },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await argon.hash(createUserDto.password);

    try {
      const user = await this.dbService.user.create({
        data: {
          email: createUserDto.email,
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
}
