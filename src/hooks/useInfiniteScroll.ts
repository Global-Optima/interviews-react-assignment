import { useEffect, useRef } from "react";

export function useInfiniteScroll<T>({
  loadMore,
  hasMore,
  threshold = 0.5,
  isLoading,
}: {
  loadMore: () => Promise<T[]> | Promise<void>;
  hasMore: boolean;
  threshold?: number;
  isLoading: boolean;
}) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          await loadMore();
        }
      },
      {
        threshold 
      }
    );

    const loader = loaderRef.current;
    if (loader) observer.observe(loader);

    return () => {
      if (loader) observer.unobserve(loader);
    };
  }, [hasMore, isLoading, loadMore]);

  return { loaderRef, isLoading };
}
