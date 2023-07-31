import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { randomUUID } from 'crypto';
import { Socket, Server } from 'socket.io';
import { CreateRoom } from 'src/@types';
import { UserRepository } from 'src/modules/repositories';
import { RoomRepository } from 'src/modules/repositories/room.repository';

interface Message {
  id: string;
  text: string;
  clientId: string;
  to: string;
}

interface SyncSocketId {
  userId: string;
}

@WebSocketGateway({ cors: true, namespace: 'message' })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Init');
    server.on('message', (message) => console.log(message));
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    const user = await this.userRepository.findUserByUnique({
      socketClientId: client.id,
    });

    console.log(user);

    if (user) {
      const clientRooms = await this.roomRepository.findRoomByUser(user.id);

      for (let i = 0; i < clientRooms.length; i++) {
        client.leave(clientRooms[i].id);
        await this.roomRepository.removeUserRoom(clientRooms[i].id, user.id);

        const userInRoom = await this.roomRepository.countUserInRoom(
          clientRooms[i].id,
        );

        if (userInRoom === 0) {
          await this.destroyRoom(clientRooms[i].id);
        }

        const msg: Message = {
          clientId: 'system',
          id: randomUUID(),
          text: `${user.firstName + user.lastName} saiu da sala`,
          to: clientRooms[i].id,
        };

        console.log(msg);

        this.server.to(msg.to).emit('message', msg);
      }
    }
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);

    const user = await this.userRepository.findUserByUnique({
      socketClientId: client.id,
    });

    console.log(user);

    if (user) {
      const clientRooms = await this.roomRepository.findRoomByUser(user.id);

      for (let i = 0; i < clientRooms.length; i++) {
        client.leave(clientRooms[i].id);
        await this.roomRepository.removeUserRoom(clientRooms[i].id, user.id);

        const userInRoom = await this.roomRepository.countUserInRoom(
          clientRooms[i].id,
        );

        if (userInRoom === 0) {
          await this.destroyRoom(clientRooms[i].id);
        }

        const msg: Message = {
          clientId: 'system',
          id: randomUUID(),
          text: `${user.firstName + user.lastName} saiu da sala`,
          to: clientRooms[i].id,
        };

        console.log(msg);

        this.server.to(msg.to).emit('message', msg);
      }
    }
  }

  @SubscribeMessage('rooms')
  async handleRooms(): Promise<void> {
    await this.emitRooms();
  }

  @SubscribeMessage('joinRoom')
  async handleConnectRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ): Promise<void> {
    const room = await this.roomRepository.findRoomByUnique({ id: roomId });
    const user = await this.userRepository.findUserByUnique({
      socketClientId: client.id,
    });

    if (room && user) {
      await this.roomRepository.addUserInRoom(user.id, room.id);

      const msg: Message = {
        clientId: 'system',
        id: randomUUID(),
        text: `${client.id} entrou na sala`,
        to: room.id,
      };

      this.server.to(msg.to).emit('joinRoom', msg);

      client.join(room.id);
      this.logger.log(`${client.id} join room: ${roomId}`);
    }
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomData: CreateRoom,
  ): Promise<void> {
    const user = await this.userRepository.findUserByUnique({
      socketClientId: client.id,
    });

    const room = await this.roomRepository.create(roomData, user.id);

    const msg: Message = {
      clientId: 'system',
      id: randomUUID(),
      text: `${client.id} entrou na sala`,
      to: room.id,
    };

    this.server.to(msg.to).emit('joinRoom', msg);

    client.join(room.id);
    this.emitRooms();
    this.logger.log(`${client.id} join room: ${room.id}`);
    client.emit('createdRoom', room);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: Message,
  ): Message {
    this.logger.log(`Send message: ${message}`);
    this.server.emit('message', message);

    return message;
  }

  @SubscribeMessage('whatId')
  async handleSyncSocketId(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: SyncSocketId,
  ): Promise<SyncSocketId> {
    this.clearRooms();
    await this.userRepository.syncSocketClientId(message.userId, client.id);

    return message;
  }

  async destroyRoom(roomName: string) {
    await this.roomRepository.destroy(roomName);
    this.logger.log(`Room ${roomName} is deleted`);
  }

  async emitRooms() {
    await this.clearRooms();
    const rooms = await this.roomRepository.getRooms();

    this.server.emit('rooms', rooms);
  }

  async clearRooms() {
    const rooms = await this.roomRepository.getRooms();

    for (let i = 0; i < rooms.length; i++) {
      const room = await this.roomRepository.countUserInRoom(rooms[i].id);

      if (room === 0) {
        this.logger.log(`clear room ${rooms[i].name}`);
        await this.roomRepository.destroy(rooms[i].id);
      }
    }
  }
}
