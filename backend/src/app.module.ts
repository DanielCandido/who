import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AppGateway } from './app/app.gateway';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';
import { RoomRepository } from './modules/repositories/room.repository';
import { UserRepository } from './modules/repositories';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, RoomModule],
  controllers: [AppController],
  providers: [AppService, AppGateway, RoomRepository, UserRepository],
})
export class AppModule {}
