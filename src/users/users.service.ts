import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class UsersService {
  constructor(private dbService: DbService) {}

  getMe() {
    return 'users info';
  }
}
