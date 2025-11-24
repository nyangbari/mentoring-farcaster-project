import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReviewRequestModule } from './features/review-request/review-request.module';
import { ReviewModule } from './features/review/review.module';
import { VaultModule } from './vault/vault.module';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST ?? 'db',
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'postgres',
      database: process.env.DATABASE_NAME ?? 'nestdb',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    UserModule,
    AuthModule,
    ReviewRequestModule,
    ReviewModule,
    VaultModule,
    BlockchainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}