export function startSectionReveals(main, { Observer, media, viewportHeight }) {
  if (!main || !Observer || media.matches) return () => {};
  const seen = new WeakSet();
  const active = new Set();
  const observer = new Observer(entries => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting || seen.has(target)) continue;
      seen.add(target);
      observer.unobserve(target);
      if (media.matches || typeof target.animate !== 'function') continue;
      // No hidden CSS state: SSR, disabled JS and failed animations stay readable.
      const animation = target.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0px)' }], {
        duration: 520,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      });
      active.add(animation);
      animation.finished.then(() => active.delete(animation), () => active.delete(animation));
    }
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  for (const section of main.children) {
    if (section.tagName !== 'SECTION' || section.matches('.h01-hero')) continue;
    const rect = section.getBoundingClientRect();
    if (section.getClientRects().length && rect.top < viewportHeight && rect.bottom > 0) {
      seen.add(section);
    } else observer.observe(section);
  }
  const reduce = () => {
    if (!media.matches) return;
    observer.disconnect();
    for (const animation of active) animation.cancel();
    active.clear();
  };
  media.addEventListener?.('change', reduce);
  return () => {
    observer.disconnect();
    media.removeEventListener?.('change', reduce);
    for (const animation of active) animation.cancel();
    active.clear();
  };
}
