import { useEffect, useState } from 'react';

// Only Quiz artwork and Culture's initial frames use this discovery gate.
// A nearby section always takes precedence over waiting for the first screen.
export function useBelowHeroImages(regionRef) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let disposed = false, activated = false, observer;
    const listeners = [];
    const pending = new Set();
    const detach = () => {
      listeners.forEach(([image, listener]) => {
        image.removeEventListener('load', listener);
        image.removeEventListener('error', listener);
      });
    };
    const activate = () => {
      if (disposed || activated) return;
      activated = true;
      observer?.disconnect();
      detach();
      setReady(true);
    };
    const region = regionRef.current;
    if (region && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) activate();
      }, { rootMargin: '400px' });
      observer.observe(region);
    } else activate();
    const images = [...document.querySelectorAll('.h01-hero img.h01-photo, .h01-hero img.h01-left, .h01-hero img.h01-right')];
    images.forEach(image => {
      if (image.complete) return; // Includes cached images and settled failures.
      pending.add(image);
      const settled = () => {
        pending.delete(image);
        if (!pending.size) activate();
      };
      listeners.push([image, settled]);
      image.addEventListener('load', settled);
      image.addEventListener('error', settled);
    });
    // Close the race between inspecting complete and attaching the listeners.
    [...pending].forEach(image => { if (image.complete) pending.delete(image); });
    if (!pending.size) activate();
    return () => {
      disposed = true;
      observer?.disconnect();
      detach();
    };
  }, [regionRef]);
  return ready;
}
