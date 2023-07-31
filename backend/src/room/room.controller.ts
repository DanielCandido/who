import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateRoom } from 'src/@types';
import { AppGateway } from 'src/app/app.gateway';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('room')
export class RoomController {}
