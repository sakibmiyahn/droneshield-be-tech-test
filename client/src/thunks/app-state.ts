import { AppThunk } from '../store';
import { slice as AppSlice } from '../slices/app-state';

// Api
import { getPaginatedSensors } from '../api/sensors';
import { uploadSoftware } from '../api/software';

interface PaginatedSensorsParams {
  page: number;
  limit: number;
}

interface FileUploadParams {
  file: File;
}

export const loadPaginatedSensors =
  ({ page, limit }: PaginatedSensorsParams): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    dispatch(AppSlice.actions.setIsFetchingSensors(true));

    try {
      const response = await getPaginatedSensors(page, limit);

      if (response && Array.isArray(response.data)) {
        // Assuming response is an array of ISensor
        dispatch(AppSlice.actions.setSensorsData(response.data));
        dispatch(
          AppSlice.actions.setPaginationMeta({
            total: response.total,
            pageCount: response.pageCount,
          })
        );
      } else {
        console.warn('No sensor data received or unexpected response format');
        dispatch(AppSlice.actions.setSensorsData([]));
      }
    } catch (error) {
      console.error('Failed to load paginated sensors:', error);
      dispatch(AppSlice.actions.setSensorsData([]));
    } finally {
      dispatch(AppSlice.actions.setIsFetchingSensors(false));
    }
  };

export const uploadSoftwareFile =
  ({ file }: FileUploadParams): AppThunk =>
  async (dispatch, getState): Promise<void> => {
    dispatch(AppSlice.actions.setIsUploadingSoftware(true));

    try {
      const response = await uploadSoftware(file);

      if (response && response.success) {
        console.log('File uploaded successfully:', response);
      } else {
        console.warn('File upload failed, unexpected response:', response);
      }
    } catch (error) {
      console.error('Error during file upload:', error);
    } finally {
      dispatch(AppSlice.actions.setIsUploadingSoftware(false));
    }
  };

export const thunks = {
  loadPaginatedSensors,
  uploadSoftwareFile,
};
