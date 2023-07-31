import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { CreateUser } from 'src/@types';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: CreateUser) {
    return this.prismaService.user.create({
      data: data,
    });
  }

  findUserByUnique(input: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({
      where: input,
    });
  }

  userRooms(userId: string) {
    return this.prismaService.user.findMany({
      where: {
        id: userId,
      },
      include: {
        userOnRooms: {
          include: {
            room: true,
          },
        },
      },
    });
  }

  syncSocketClientId(userId: string, socketClientId: string) {
    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        socketClientId,
      },
    });
  }
}
