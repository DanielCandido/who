import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomRepository } from 'src/modules/repositories/room.repository';

@Module({
  controllers: [RoomController],
  providers: [RoomRepository],
})
export class RoomModule {}
