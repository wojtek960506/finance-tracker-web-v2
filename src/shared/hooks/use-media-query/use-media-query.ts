import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string) => {
  const getMatches = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }

    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const media = window.matchMedia(query);

    const onChange = () => setMatches(media.matches);

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
};
