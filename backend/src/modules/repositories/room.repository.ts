import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { CreateRoom } from 'src/@types';

@Injectable()
export class RoomRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateRoom, userId: string) {
    return this.prismaService.room.create({
      data: {
        ...data,
        UserOnRooms: { create: { assignedBy: userId, userId } },
      },
    });
  }

  findRoomByUnique(input: Prisma.RoomWhereUniqueInput) {
    return this.prismaService.room.findUnique({
      where: input,
    });
  }

  findRoomByUser(userId: string) {
    return this.prismaService.room.findMany({
      where: {
        UserOnRooms: {
          every: {
            userId,
          },
        },
      },
    });
  }

  getRooms() {
    return this.prismaService.room.findMany();
  }

  destroy(id: string) {
    return this.prismaService.room.delete({
      where: {
        id,
      },
    });
  }

  addUserInRoom(userId: string, roomId: string) {
    return this.prismaService.userOnRooms.create({
      data: {
        userId,
        roomId,
        assignedBy: userId,
      },
    });
  }

  countUserInRoom(roomId: string) {
    return this.prismaService.userOnRooms.count({
      where: {
        roomId,
      },
    });
  }

  removeUserRoom(roomId: string, userId: string) {
    return this.prismaService.userOnRooms.delete({
      where: {
        userId_roomId: {
          roomId,
          userId,
        },
      },
    });
  }
}
