import api from '.';
import { PaginatedSensorsResponse } from '../types/sensor';

export const getPaginatedSensors = async (
  page: number,
  limit: number
): Promise<PaginatedSensorsResponse> => {
  const response = await api.get(`/sensors`, {
    params: { page, limit },
  });

  return response.data;
};
