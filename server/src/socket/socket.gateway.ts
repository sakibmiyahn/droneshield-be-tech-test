import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebSocketPayload } from '../types/interfaces';

@WebSocketGateway({ cors: true })
export class SocketGateway {
  private readonly logger = new Logger(SocketGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`handleConnection:client: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`handleDisconnect:client: ${client.id}`);
  }

  emitSensorUpdate(payload: WebSocketPayload) {
    this.logger.debug(`socket: ${JSON.stringify(payload)}`);
    this.server.emit('sensor-status-update', payload);
  }
}
