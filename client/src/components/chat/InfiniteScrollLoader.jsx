import { useEffect, useRef } from 'react';

/**
 * Renders an invisible sentinel div at the top of the message list.
 * Fires onIntersect once when the sentinel enters the viewport.
 * Uses refs to avoid re-creating the observer on every render.
 */
const InfiniteScrollLoader = ({ onIntersect, disabled }) => {
  const ref = useRef(null);
  const callbackRef = useRef(onIntersect);
  const disabledRef = useRef(disabled);

  useEffect(() => { callbackRef.current = onIntersect; }, [onIntersect]);
  useEffect(() => { disabledRef.current = disabled; }, [disabled]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !disabledRef.current) {
          callbackRef.current();
        }
      },
      { threshold: 0, rootMargin: '100px 0px 0px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []); // single observer for lifetime of component

  return <div ref={ref} className="infinite-scroll-trigger" aria-hidden="true" />;
};

export default InfiniteScrollLoader;
