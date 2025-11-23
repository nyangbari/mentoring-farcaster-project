import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BlockchainModule } from '../blockchain/blockchain.module';  // 추가

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BlockchainModule,  // TokenService 사용을 위해 추가
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}