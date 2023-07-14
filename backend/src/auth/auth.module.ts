import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/modules/repositories';
import { RefreshTokenRepository } from 'src/modules/repositories/refresh-token.respository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepository, RefreshTokenRepository],
})
export class AuthModule {}
