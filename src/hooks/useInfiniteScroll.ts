import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

export const useInfiniteScroll = ({
  hasMore,
  loading,
  onLoadMore,
}: UseInfiniteScrollProps) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loaderElement = loaderRef.current;
    if (!loaderElement || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loaderElement);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  return loaderRef;
};

