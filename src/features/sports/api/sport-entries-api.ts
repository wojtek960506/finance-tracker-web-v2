import { api } from '@shared/api';

import type {
  SportEntry,
  SportEntryCreate,
  SportEntryFilterQuery,
  SportEntryListResponse,
  SportEntryUpdate,
} from './types';

export const getSportEntries = async (
  query?: SportEntryFilterQuery,
): Promise<SportEntryListResponse> => {
  const res = await api.get<SportEntryListResponse>('/sports', {
    params: query,
  });
  return res.data;
};

export const getSportEntry = async (id: string): Promise<SportEntry> => {
  const res = await api.get<SportEntry>(`/sports/${id}`);
  return res.data;
};

export const createSportEntry = async (data: SportEntryCreate): Promise<SportEntry> => {
  const res = await api.post<SportEntry>('/sports', data);
  return res.data;
};

export const updateSportEntry = async (
  id: string,
  data: SportEntryUpdate,
): Promise<SportEntry> => {
  const res = await api.patch<SportEntry>(`/sports/${id}`, data);
  return res.data;
};

export const deleteSportEntry = async (id: string): Promise<void> => {
  await api.delete(`/sports/${id}`);
};
