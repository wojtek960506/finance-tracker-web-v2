import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@context/theme-context';
import { ICON_CLASS_NAME } from '@shared/consts';
import { Button } from '@ui';

export const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" onClick={toggleTheme}>
      {theme === 'dark' ? (
        <Sun className={ICON_CLASS_NAME} />
      ) : (
        <Moon className={ICON_CLASS_NAME} />
      )}
    </Button>
  );
};
