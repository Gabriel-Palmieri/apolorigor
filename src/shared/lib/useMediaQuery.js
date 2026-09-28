import { useSyncExternalStore } from 'react';
export function useMediaQuery(query) {
  const subscribe = listener => {
    const media = window.matchMedia(query);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  };
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
