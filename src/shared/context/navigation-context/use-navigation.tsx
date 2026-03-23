import { useContext } from 'react';

import { NavigationContext } from './navigation-context';

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
};
