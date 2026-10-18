import { useEffect, useRef, useState } from 'react';

export function useAmbientMotion() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const elements = [...document.querySelectorAll('.background-details,.portrait-backdrop')];
    let frame = 0;
    function draw() {
      frame = 0;
      for (const el of elements) {
        const r = el.parentElement.getBoundingClientRect();
        const offset = reduced.matches ? 0 : Math.max(-36, Math.min(36, (innerHeight / 2 - r.top - r.height / 2) * .07));
        el.style.setProperty('--drift', `${offset}px`);
      }
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    reduced.addEventListener('change', schedule);
    schedule();
    const firstStep = document.querySelector('.step-number');
    const sequence = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { firstStep.closest('.steps-list').classList.add('sequence-started'); sequence.disconnect(); }
    }, { threshold: .8 });
    if (firstStep) sequence.observe(firstStep);
    return () => { sequence.disconnect(); cancelAnimationFrame(frame); removeEventListener('scroll', schedule); removeEventListener('resize', schedule); reduced.removeEventListener('change', schedule); };
  }, []);
}

const photos = [
  ['/ilya-italian-preview/images/italian-street.png', 'Итальянская улица — сгенерированная иллюстрация'],
  ['/ilya-italian-preview/images/italian-cafe.png', 'Столик кафе — сгенерированная иллюстрация'],
  ['/ilya-italian-preview/images/italian-piazza.png', 'Итальянская площадь — сгенерированная иллюстрация'],
  ['/ilya-italian-preview/images/italian-bakery.png', 'Итальянская пекарня — сгенерированная иллюстрация'],
  ['/ilya-italian-preview/images/italian-terrace.png', 'Терраса — сгенерированная иллюстрация'],
];

export function CultureGallery() {
  const ref = useRef(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    observer.observe(ref.current);
    return () => { observer.disconnect(); media.removeEventListener('change', update); };
  }, []);
  useEffect(() => {
    if (!visible || paused || reduced) return;
    const id = setInterval(() => { if (!document.hidden) setCurrent(s => (s + 1) % photos.length); }, 4000);
    return () => clearInterval(id);
  }, [visible, paused, reduced]);
  return <div ref={ref} className="culture-gallery">
    {[0, 1].map(slot => <div className={`culture-tile tile-${slot}`} key={slot}>
      {photos.map(([src, alt], i) => <img key={src} src={src} alt={alt} aria-hidden={(current + slot) % photos.length !== i} className={`gallery-image ${(current + slot) % photos.length === i ? 'is-active' : ''}`} loading="lazy" decoding="async" width="600" height="600" />)}
    </div>)}
    {!reduced && <button type="button" className="gallery-pause" onClick={() => setPaused(p => !p)} aria-pressed={paused}>{paused ? 'Продолжить смену фото' : 'Приостановить смену фото'}</button>}
  </div>;
}
