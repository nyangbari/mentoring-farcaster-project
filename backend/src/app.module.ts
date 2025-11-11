import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CoinsModule } from './coins/coins.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, ReviewsModule, CoinsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
