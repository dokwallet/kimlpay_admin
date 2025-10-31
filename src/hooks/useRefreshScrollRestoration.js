import { useEffect, useRef } from 'react';
import { throttle } from 'throttle-debounce';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';
gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(ScrollTrigger);

const scrollPositions = {};

function useRefreshScrollRestoration(name) {
  const isUnmounted = useRef(false);
  useEffect(() => {
    let ctx;
    const pageAccessedByReload = window.performance
      .getEntriesByType('navigation')
      .map(nav => nav.type)
      .includes('reload');
    if (pageAccessedByReload) {
      if (scrollPositions[name]) {
        gsap.to(window, {
          duration: 0.3,
          scrollTo: scrollPositions[name],
        });
      }
    }

    const handleScroll = throttle(500, () => {
      if (!isUnmounted.current && window?.scrollY !== 0) {
        scrollPositions[name] = window.scrollY;
      }
      ctx?.revert?.();
    });

    window.addEventListener('scroll', handleScroll);

    return () => {
      isUnmounted.current = true;
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useRefreshScrollRestoration;
