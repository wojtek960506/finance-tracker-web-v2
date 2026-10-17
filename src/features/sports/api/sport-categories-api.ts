import { api } from '@shared/api';

import type { SportCategory, SportCategoryCreate, SportCategoryUpdate } from './types';

export const getSportCategories = async (): Promise<SportCategory[]> => {
  const res = await api.get<SportCategory[]>('/sports/categories');
  return res.data;
};

export const getFavoriteSportCategories = async (): Promise<SportCategory[]> => {
  const res = await api.get<SportCategory[]>('/sports/categories/favorites');
  return res.data;
};

export const getSportCategory = async (id: string): Promise<SportCategory> => {
  const res = await api.get<SportCategory>(`/sports/categories/${id}`);
  return res.data;
};

export const createSportCategory = async (
  data: SportCategoryCreate,
): Promise<SportCategory> => {
  const res = await api.post<SportCategory>('/sports/categories', data);
  return res.data;
};

export const updateSportCategory = async (
  id: string,
  data: SportCategoryUpdate,
): Promise<SportCategory> => {
  const res = await api.patch<SportCategory>(`/sports/categories/${id}`, data);
  return res.data;
};

export const deleteSportCategory = async (id: string): Promise<void> => {
  await api.delete(`/sports/categories/${id}`);
};

export const favoriteSportCategory = async (id: string): Promise<SportCategory> => {
  const res = await api.post<SportCategory>(`/sports/categories/${id}/favorite`);
  return res.data;
};

export const unfavoriteSportCategory = async (id: string): Promise<SportCategory> => {
  const res = await api.delete<SportCategory>(`/sports/categories/${id}/unfavorite`);
  return res.data;
};
