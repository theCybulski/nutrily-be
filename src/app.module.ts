import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DbModule,
    IngredientsModule,
    RecipesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
