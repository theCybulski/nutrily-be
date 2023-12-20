import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { User } from '@prisma/client';
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
    try {
      const user = await this.dbService.user.create({
        data: {
          email: createUserDto.email,
          hash: createUserDto.hash,
        },
      });
      const { hash: _, refreshTokenHash: __, ...returnUser } = user;
      return returnUser;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('User already exists');
        }
      }
    }
  }

  async updateRefreshToken(userId: string, refreshTokenHash: string) {
    await this.dbService.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  async clearRefreshToken(userId: string) {
    return this.dbService.user.updateMany({
      where: {
        id: userId,
        refreshTokenHash: { not: null },
      },
      data: { refreshTokenHash: null },
    });
  }
}
