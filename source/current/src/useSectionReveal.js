import { useEffect } from 'react';
import { startSectionReveals } from './section-reveal.js';
export function useSectionReveal(locale) {
  useEffect(() => startSectionReveals(document.querySelector('.v9 main'), {
    Observer: window.IntersectionObserver,
    media: window.matchMedia('(prefers-reduced-motion: reduce)'),
    viewportHeight: window.innerHeight,
  }), [locale]);
}
