import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(
    options?: IntersectionObserverInit
): [React.RefObject<HTMLDivElement>, boolean] {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const target = targetRef.current;
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, options);

        if (target) {
            observer.observe(target);
        }

        return () => {
            if (target) {
                observer.unobserve(target);
            }
        };
    }, [options]);

    return [targetRef, isIntersecting];
}
