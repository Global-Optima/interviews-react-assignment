import { useEffect, useRef, useState } from "react";

export function useInfiniteScroll<T>({
  loadMore,
  hasMore,
  threshold = 0.5,
}: {
  loadMore: () => Promise<T[]> | Promise<void>;
  hasMore: boolean;
  threshold?: number;
}) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function loadMoreWithLoading() {
    setIsLoading(true);
    await loadMore();
    setIsLoading(false);
  }

  useEffect(() => {
    if (!hasMore || isLoading) return;
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          setIsLoading(true);
          await loadMore();
          setIsLoading(false);
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

  return { loaderRef, isLoading, loadMoreWithLoading };
}
