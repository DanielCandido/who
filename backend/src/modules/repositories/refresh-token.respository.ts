import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(userId: string) {
    return this.prismaService.refreshToken.upsert({
      create: {
        expireIn: 1,
        userId,
      },
      update: {
        expireIn: 1,
        userId,
      },
      where: {
        userId: userId,
      },
    });
  }

  findUserByUnique(input: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({
      where: input,
    });
  }
}
