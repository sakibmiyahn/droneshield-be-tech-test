export interface SensorResponse {
  id: number;
  serial: string;
  isOnline: boolean;
  lastSeenAt: Date;
  version: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusAck {
  message: string;
}
