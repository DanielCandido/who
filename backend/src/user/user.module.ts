import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from 'src/modules/repositories';
import { AuthService } from 'src/auth/auth.service';
import { RefreshTokenRepository } from 'src/modules/repositories/refresh-token.respository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, AuthService, RefreshTokenRepository],
})
export class UserModule {}
