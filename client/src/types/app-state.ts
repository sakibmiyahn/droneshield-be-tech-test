import { PayloadAction } from '@reduxjs/toolkit';

// Type
import { ISensor } from './sensor';

export interface AppState {
  isAppReady: boolean;
  isFetchingSensors: boolean;
  isUploadingSoftware: boolean;
  sensorsData: ISensor[];
  pagination: {
    page: number;
    rowsPerPage: number;
    total: number;
    pageCount: number;
  };
}

export type SetIsAppReady = PayloadAction<boolean>;
export type SetIsFetchingSensor = PayloadAction<boolean>;
export type SetIsUploadingSoftware = PayloadAction<boolean>;
export type SetSensorsData = PayloadAction<ISensor[]>;
