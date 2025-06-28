import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebSocketPayload } from '../types/interfaces';

@WebSocketGateway({ cors: true })
export class SocketGateway {
  private readonly logger = new Logger(SocketGateway.name);

  @WebSocketServer()
  server: Server;

  emitSensorUpdate(payload: WebSocketPayload) {
    this.logger.debug(`ws: ${JSON.stringify(payload)}`);
    this.server.emit('sensor-status-update', payload);
  }
}
