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

interface Message {
  id: string;
  text: string;
  clientId: string;
  to: string;
}

@WebSocketGateway({ cors: true, namespace: 'message' })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Init');
    server.on('message', (message) => console.log(message));
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    const msg: Message = {
      clientId: 'system',
      id: randomUUID(),
      text: `${client.id} saiu da sala`,
      to: 'Sala 1',
    };

    this.server.to(msg.to).emit('message', msg);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('syncUser')
  handleSyncUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ): string {
    return userId;
  }

  @SubscribeMessage('joinRoom')
  handleConnectRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomName: string,
  ): string {
    const msg: Message = {
      clientId: 'system',
      id: randomUUID(),
      text: `${client.id} entrou na sala`,
      to: roomName,
    };

    this.server.to(msg.to).emit('joinRoom', msg);

    client.join(roomName);
    this.logger.log(`${client.id} join room: ${roomName}`);

    return roomName;
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
}
