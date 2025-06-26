import { createSlice } from "@reduxjs/toolkit";

// Types
import { 
    AppState,
    SetIsAppReady,
    SetIsFetchingSensor,
    SetIsUploadingSoftware,
    SetSensorsData,
} from "../types/app-state";

let initialState: AppState = {
    isAppReady: false,
    isFetchingSensors: false,
    isUploadingSoftware: false,
    sensorsData: [],
    pagination: {
      page: 0,
      rowsPerPage: 10,
    }
}

export const reducers = {
  setIsAppReady(state: AppState, action: SetIsAppReady): void {
    state.isAppReady = action.payload;
  },

  setIsFetchingSensors(state: AppState, action: SetIsFetchingSensor): void {
    state.isFetchingSensors = action.payload;
  },

  setIsUploadingSoftware(state: AppState, action: SetIsUploadingSoftware): void {
    state.isUploadingSoftware = action.payload;
  },

  setSensorsData(state: AppState, action: SetSensorsData): void {
    state.sensorsData = action.payload;
  },

  setPagination(
    state: AppState,
    action: { payload: { page: number; rowsPerPage: number } }
  ): void {
    state.pagination.page = action.payload.page;
    state.pagination.rowsPerPage = action.payload.rowsPerPage;
  },

  updateSensorData(
    state: AppState,
    action: {
      payload: {
        serial: string;
        version: string;
        isoOnline: boolean;
      };
    }
  ): void {
    const sensor = state.sensorsData.find(s => s.serial === action.payload.serial);
    if (sensor) {
      Object.assign(sensor, action.payload);
    }
  },
};


export const slice = createSlice({
    name: "appStateSlice",
    initialState,
    reducers
});
  
export const { reducer, actions } = slice;