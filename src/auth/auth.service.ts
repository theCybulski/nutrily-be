import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class AuthService {
  constructor(private dbService: DbService) {}

  login() {
    return 'i am login';
  }

  signup() {
    return 'i am signup';
  }
}
