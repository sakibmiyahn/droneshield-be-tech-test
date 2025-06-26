import api from '.';
import { ISensor } from '../types/sensor';

export const getPaginatedSensors = async (
  page: number,
  limit: number
): Promise<ISensor[]> => {
  const response = await api.get(`/sensors`, {
    params: { page, limit },
  });

  return response.data;
};
