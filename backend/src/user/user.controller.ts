import {
  BadRequestException,
  Body,
  Controller,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SyncSocketRequest } from 'src/@types';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/modules/repositories';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard)
  @Put('/syncSocket')
  async syncSocket(@Req() req, @Body() body: SyncSocketRequest) {
    const { clientId } = body;
    const authenticatedUSer = this.authService.getAuthenticatedUser(req);

    if (!clientId) {
      throw new BadRequestException('missing param error: clientId');
    }

    const user = await this.userRepository.syncSocketClientId(
      authenticatedUSer,
      clientId,
    );

    return {
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
      socketClientId: user.socketClientId,
    };
  }
}
