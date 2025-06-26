export interface ISensor {
    id: number;
    serial: string;
    version?: string;
    isOnline: boolean;
}