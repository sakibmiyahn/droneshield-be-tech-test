export interface SensorResponse {
  id: number;
  serial: string;
  isOnline: boolean;
  lastSeenAt: Date;
  currentSoftware: { id: number; version: string } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftwareResponse {
  id: number;
  version: string;
  filePath: string;
  originalFileName: string;
  uploadedAt: Date;
}
