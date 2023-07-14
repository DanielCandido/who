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
}
