import { useEffect } from 'react';

interface UseIntersectionObserverOptions {
  target: React.RefObject<HTMLElement>;
  onIntersect: () => void;
  enabled: boolean;
  rootMargin?: string;
  threshold?: number;
}

export function useIntersectionObserver({
  target,
  onIntersect,
  enabled,
  rootMargin = '100px',
  threshold = 0.1,
}: UseIntersectionObserverOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const element = target.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          onIntersect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [target, onIntersect, enabled, rootMargin, threshold]);
}
