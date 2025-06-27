export interface ISensor {
  id: number;
  serial: string;
  version?: string;
  isOnline: boolean;
}

export interface PaginatedSensorsResponse {
  data: ISensor[];
  total: number;
  pageCount: number;
}
