import { Injectable } from '@nestjs/common';

@Injectable()
export class RecipesService {
  getAll() {
    return 'all recipes here';
  }
}
