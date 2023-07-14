import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthRequest, AuthResponse } from 'src/@types';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Post()
  @HttpCode(200)
  async login(
    @Req() request: Request,
    @Body() body: AuthRequest,
  ): Promise<AuthResponse> {
    const { email, password } = body;

    const isValidMail = this.appService.isValidMail(email);

    if (!isValidMail) {
      throw new BadRequestException('email is not valid');
    }

    const { refreshToken, token } = await this.appService.login(
      email,
      password,
    );

    return {
      token,
      refreshToken: refreshToken.id,
      expireAt: '2d',
    };
  }
}
