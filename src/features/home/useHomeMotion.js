import { useEffect } from 'react';

export function useHomeMotion(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.IntersectionObserver || !Element.prototype.animate) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const played = new WeakSet();
    const animations = new Set();
    let observer;

    const stop = () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    const setup = () => {
      stop();
      if (preference.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting || played.has(target)) return;
          played.add(target);
          observer.unobserve(target);
          const animation = target.animate([
            { opacity: 0.65, transform: 'translateY(14px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ], { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
          animations.add(animation);
          animation.addEventListener('finish', () => animations.delete(animation), { once: true });
        });
      }, { rootMargin: '0px 0px -32px 0px', threshold: 0 });
      root.querySelectorAll('.collection-intro, .home-fitting-layout, .home-wedding-section > div, .service-heading')
        .forEach(element => { if (!played.has(element)) observer.observe(element); });
    };
    setup();
    preference.addEventListener('change', setup);
    return () => {
      stop();
      preference.removeEventListener('change', setup);
    };
  }, [rootRef]);
}
