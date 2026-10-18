import { useQuery } from '@tanstack/react-query';

import {
  getFavoriteSportCategories,
  getSportCategories,
  type SportCategory,
  sportsQueryKeys,
} from '../api';

export const useSportCategories = () => {
  return useQuery<SportCategory[], Error>({
    queryKey: sportsQueryKeys.categories(),
    queryFn: getSportCategories,
  });
};

export const useFavoriteSportCategories = () => {
  return useQuery<SportCategory[], Error>({
    queryKey: sportsQueryKeys.categoryFavorites(),
    queryFn: getFavoriteSportCategories,
  });
};
