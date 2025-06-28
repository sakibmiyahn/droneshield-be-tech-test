export interface SensorResponse {
  id: number;
  serial: string;
  isOnline: boolean;
  version: string | null;
}

export interface StatusAck {
  message: string;
}

export interface WebSocketPayload {
  serial: string;
  version: string | null;
  isOnline: boolean;
}
