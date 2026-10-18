import { useEffect, useRef } from 'react';

export default function LearningSteps({ title, steps }) {
  const listRef = useRef(null);
  // Survives effect replays in StrictMode; resets only when this section unmounts.
  const seen = useRef(new Set());

  useEffect(() => {
    if (window.location.hash !== '#steps') return;
    // React mounts after the browser's first attempt to find a fragment target.
    const frame = requestAnimationFrame(() => {
      listRef.current?.closest('section')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const items = [...listRef.current.children];
    if (typeof IntersectionObserver !== 'function' ||
        typeof window.matchMedia !== 'function' ||
        typeof Element.prototype.animate !== 'function') return;

    let motion;
    try { motion = window.matchMedia('(prefers-reduced-motion: reduce)'); }
    catch { return; }
    if (typeof motion.addEventListener !== 'function' ||
        typeof motion.removeEventListener !== 'function') return;
    if (motion.matches) {
      items.forEach(item => seen.current.add(item));
      return;
    }

    let observer;
    let disposed = false;
    const running = new Map();
    const cancelAnimations = () => {
      running.forEach(animation => animation.cancel());
      running.clear();
    };
    const revealEverything = () => {
      observer?.disconnect();
      items.forEach(item => seen.current.add(item));
      cancelAnimations();
    };
    const changedMotion = () => {
      if (motion.matches) revealEverything();
    };

    try {
      observer = new IntersectionObserver(entries => {
        if (disposed) return;
        for (const entry of entries) {
          const item = entry.target;
          if (seen.current.has(item)) { observer.unobserve(item); continue; }
          // Fast jumps past a step count as seen, so scrolling back never hides it.
          if (!entry.isIntersecting && entry.boundingClientRect.bottom <= 0) {
            seen.current.add(item);
            observer.unobserve(item);
            continue;
          }
          if (!entry.isIntersecting) continue;
          seen.current.add(item);
          observer.unobserve(item);
          if (motion.matches) continue;
          try {
            // No hidden pending state: content remains readable without enhancement.
            const animation = item.animate([{ opacity: 0 }, { opacity: 1 }], {
              duration: 450, easing: 'ease-in-out', delay: 0, fill: 'none',
            });
            running.set(item, animation);
            animation.finished.catch(() => {}).finally(() => running.delete(item));
          } catch {
            // No CSS opacity was changed, so a failed animation is already visible.
          }
        }
      }, { threshold: 0 });
      items.forEach(item => {
        if (!seen.current.has(item)) observer.observe(item);
      });
      motion.addEventListener('change', changedMotion);
    } catch {
      revealEverything();
    }

    return () => {
      disposed = true;
      observer?.disconnect();
      motion.removeEventListener('change', changedMotion);
      cancelAnimations();
    };
  }, []);

  return <section className="s05-steps" id="steps" aria-labelledby="s05-title">
    <div className="s05-inner"><h2 id="s05-title">{title}</h2>
      <ol ref={listRef} className="s05-grid">{steps.map(([heading, text], i) =>
        <li className="s05-card" key={heading}>
          <span className="s05-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <div className="s05-copy"><h3>{heading}</h3><p>{text}</p></div>
        </li>
      )}</ol>
    </div>
  </section>;
}
