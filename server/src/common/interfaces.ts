export interface SensorResponse {
  id: number;
  serial: string;
  isOnline: boolean;
  lastSeenAt: Date;
  currentSoftware: { id: number; version: string } | null;
  createdAt: Date;
  updatedAt: Date;
}
