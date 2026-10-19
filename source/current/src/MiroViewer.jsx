import { useEffect, useRef, useState } from 'react';
import shell from './miro-shell.html?raw';
import refreshedShell from './miro-shell-refreshed.html?raw';

const root = '/ilya-italian-preview/images/miro-approved/';
const slides = [
  { file: 'originals/03-bologna-original.png', sw: 2610, cx: 0, cy: 0, cw: 2610, ch: 1571, alt: 'Чтение: 10 e lode — Bologna' },
  { file: 'originals/01-people-original.png', sw: 1739, cx: 0, cy: 0, cw: 1739, ch: 854, alt: 'G. Descrivi le persone — описание людей' },
  { file: 'originals/02-plural-original.png', sw: 2610, cx: 0, cy: 0, cw: 2610, ch: 1033, alt: '3B. Ora metti le parole al plurale — множественное число' },
];

export default function MiroViewer({ shellVariant = 'classic' }) {
  const screen = useRef(null), slot = useRef(null);
  const [current, setCurrent] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible, setVisible] = useState(false), [pageVisible, setPageVisible] = useState(!document.hidden);
  const [size, setSize] = useState({ width: 0, height: 0, inset: 24 });
  useEffect(() => {
    const observer = new IntersectionObserver(entries => setVisible(entries[0].intersectionRatio >= .5), { threshold: [0, .5] });
    observer.observe(screen.current);
    const visibility = () => setPageVisible(!document.hidden);
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const changedMotion = () => setReducedMotion(motion.matches);
    document.addEventListener('visibilitychange', visibility);
    motion.addEventListener('change', changedMotion);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); motion.removeEventListener('change', changedMotion); };
  }, []);
  useEffect(() => {
    const update = () => {
      const inset = parseFloat(getComputedStyle(screen.current).getPropertyValue('--miro-fit-inset'));
      setSize({ width: slot.current.clientWidth, height: slot.current.clientHeight, inset: Number.isFinite(inset) ? inset : 24 });
    };
    const observer = new ResizeObserver(update); observer.observe(slot.current); update();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (reducedMotion || !visible || !pageVisible) return;
    const timer = setTimeout(() => setCurrent(index => (index + 1) % slides.length), current === 0 ? 7000 : 6000);
    return () => clearTimeout(timer);
  }, [reducedMotion, visible, pageVisible, current]);
  const ratio = slides[current].cw / slides[current].ch;
  const base = Math.max(0, Math.min(size.width - size.inset, (size.height - size.inset) * ratio));
  const refreshed = shellVariant === 'refreshed';
  return <figure aria-label="Примеры заданий с демонстрационной оболочкой Miro">
    <div ref={screen} data-image-surface="" data-shell-variant={refreshed ? 'refreshed' : 'classic'} className="screen" style={{ '--mobile-base': base + 'px', '--mobile-scale': 1, '--pan-x': '0px', '--pan-y': '0px' }}>
      {/* Preserve the supplied visual toolbar; it has no editing or slider actions. */}
      <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: refreshed ? refreshedShell : shell }}/>
      <div ref={slot} className="exercise-slot">
        {slides.map((slide, index) => <div className={'slide ' + (current === index ? 'active' : '')} aria-hidden={current !== index} key={slide.file}>
          <div className="crop" style={{ '--sw': slide.sw, '--cx': slide.cx, '--cy': slide.cy, '--cw': slide.cw, '--ch': slide.ch, '--mobile-base': Math.max(0, Math.min(size.width - size.inset, (size.height - size.inset) * slide.cw / slide.ch)) + 'px' }}>
            {(index === current || index === (current + 1) % slides.length) && <img src={root + slide.file} alt={slide.alt} draggable={false} decoding="async"/>}
          </div>
        </div>)}
      </div>
    </div>
    <span className="m13-counter" hidden aria-live="off">{current + 1} / {slides.length}</span>
  </figure>;
}
