import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { Strategies } from '../types/stretegies.type';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(Strategies.REFRESH_TOKEN) {
  constructor() {
    super();
  }
}
