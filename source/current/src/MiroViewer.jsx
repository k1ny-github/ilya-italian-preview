import { useEffect, useRef, useState } from 'react';
import shell from './miro-shell.html?raw';
import refreshedShell from './miro-shell-refreshed.html?raw';

const root = '/ilya-italian-preview/images/miro-approved/';
const slides = [
  { file: 'originals/01-people-original.png', sw: 1739, cx: 0, cy: 0, cw: 1739, ch: 854, alt: 'Задание 1: описание людей' },
  { file: 'originals/02-plural-original.png', sw: 2610, cx: 0, cy: 0, cw: 2610, ch: 1033, alt: 'Задание 2: множественное число' },
  { file: 'originals/03-bologna-original.png', sw: 2610, cx: 0, cy: 0, cw: 2610, ch: 1571, alt: 'Задание 3: чтение о Болонье' },
  { file: 'frames/04-exercise.jpg', sw: 871, cx: 76, cy: 139, cw: 723, ch: 369, alt: 'Задание 4: предлоги и диалог' },
  { file: 'frames/05-exercise.jpg', sw: 871, cx: 70, cy: 170, cw: 732, ch: 307, alt: 'Задание 5: глаголы' },
  { file: 'frames/06-exercise.jpg', sw: 871, cx: 125, cy: 139, cw: 622, ch: 372, alt: 'Задание 6: упражнения по видео' },
];

function Symbol({ name }) {
  const paths = { prev: 'M15 4 7 12l8 8', next: 'm9 4 8 8-8 8', plus: 'M12 4v16M4 12h16', minus: 'M4 12h16', move: 'M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3' };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>;
}

export default function MiroViewer({ shellVariant = 'classic' }) {
  const refreshed = shellVariant === 'refreshed';
  const screen = useRef(null), slot = useRef(null), drag = useRef(null);
  const [current, setCurrent] = useState(2);
  const [paused, setPaused] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible, setVisible] = useState(false), [pageVisible, setPageVisible] = useState(!document.hidden);
  const [epoch, setEpoch] = useState(0), [scale, setScale] = useState(1), [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false), [size, setSize] = useState({ width: 0, height: 0, mobile: false });
  useEffect(() => {
    const observer = new IntersectionObserver(entries => setVisible(entries[0].intersectionRatio >= .5), { threshold: [0, .5] });
    observer.observe(screen.current);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    const update = () => setSize({ width: slot.current.clientWidth, height: slot.current.clientHeight, mobile: matchMedia('(width < 640px)').matches });
    const observer = new ResizeObserver(update); observer.observe(slot.current); update();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (paused || !visible || !pageVisible || dragging) return;
    const timer = setTimeout(() => { setCurrent(index => (index + 1) % slides.length); setScale(1); setPan({ x: 0, y: 0 }); }, current === 2 ? 5000 : 4000);
    return () => clearTimeout(timer);
  }, [paused, visible, pageVisible, dragging, epoch, current]);
  const ratio = slides[current].cw / slides[current].ch;
  const base = Math.max(0, Math.min(size.width - 24, (size.height - 24) * ratio));
  const limitX = Math.max(0, (base * scale - size.width) / 2 + 12);
  const limitY = Math.max(0, (base / ratio * scale - size.height) / 2 + 12);
  const position = { x: Math.max(-limitX, Math.min(limitX, pan.x)), y: Math.max(-limitY, Math.min(limitY, pan.y)) };
  function show(delta) { setCurrent(index => (index + delta + slides.length) % slides.length); setScale(1); setPan({ x: 0, y: 0 }); drag.current = null; setDragging(false); setEpoch(value => value + 1); }
  function zoom(delta) { setScale(value => Math.min(3, Math.max(1, value + delta))); setPan({ x: 0, y: 0 }); setEpoch(value => value + 1); }
  function finish(event) { if (drag.current?.id !== event.pointerId) return; drag.current = null; setDragging(false); }
  return <figure aria-label="Примеры заданий с демонстрационной оболочкой Miro">
    <div ref={screen} data-shell-variant={refreshed ? 'refreshed' : 'classic'} className={`screen ${scale > 1 ? 'is-zoomed' : ''} ${dragging ? 'is-dragging' : ''}`} style={{ '--mobile-base': `${base}px`, '--mobile-scale': scale, '--pan-x': `${position.x}px`, '--pan-y': `${position.y}px` }}>
      {/* Exact supplied SVG/HTML shell; visual examples, not editing controls or live presence. */}
      <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: refreshed ? refreshedShell : shell }}/>
      <div ref={slot} className="exercise-slot" tabIndex={0} role="region" aria-label="Просмотр задания: увеличение и перемещение" onKeyDown={event => {
        if (!size.mobile) return;
        if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(.5); }
        else if (event.key === '-') { event.preventDefault(); zoom(-.5); }
        else if (event.key === 'Home') { event.preventDefault(); setScale(1); setPan({ x: 0, y: 0 }); }
        else if (scale > 1 && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) { event.preventDefault(); setPan({ x: position.x + (event.key === 'ArrowLeft' ? 40 : event.key === 'ArrowRight' ? -40 : 0), y: position.y + (event.key === 'ArrowUp' ? 40 : event.key === 'ArrowDown' ? -40 : 0) }); }
      }} onPointerDown={event => {
        if (!size.mobile || scale <= 1) return;
        drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, pan: position }; slot.current.setPointerCapture(event.pointerId); setDragging(true);
      }} onPointerMove={event => {
        const origin = drag.current; if (origin?.id !== event.pointerId) return;
        setPan({ x: origin.pan.x + event.clientX - origin.x, y: origin.pan.y + event.clientY - origin.y });
      }} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}>
        {slides.map((slide, index) => <div className={`slide ${current === index ? 'active' : ''}`} aria-hidden={current !== index} key={slide.file}>
          <div className="crop" style={{ '--sw': slide.sw, '--cx': slide.cx, '--cy': slide.cy, '--cw': slide.cw, '--ch': slide.ch }}>
            {(index === current || index === (current + 1) % slides.length) && <img src={root + slide.file} alt={slide.alt} decoding="async"/>}
          </div>
        </div>)}
      </div>
      <p className="mobile-pan-hint">{scale > 1 && <Symbol name="move"/>}<span>{scale > 1 ? 'Двигайте пальцем в любую сторону' : 'Задание целиком · нажмите + для увеличения'}</span></p>
    </div>
    <div className="controls" role="group" aria-label="Управление слайдами">
      <button type="button" aria-label="Предыдущее задание" onClick={() => show(-1)}><Symbol name="prev"/></button>
      <button type="button" className={`m13-toggle ${paused ? 'is-paused' : ''}`} aria-label={paused ? 'Продолжить автосмену' : 'Приостановить автосмену'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path className="play-symbol" d="m8 5 11 7-11 7Z"/><path className="pause-symbol" d="M8 5v14M16 5v14"/></svg>
      </button>
      <button type="button" aria-label="Следующее задание" onClick={() => show(1)}><Symbol name="next"/></button>
      <span className="m13-counter sr-only" aria-live={paused ? 'polite' : 'off'}>{current + 1} / {slides.length}</span>
    </div>
    <div className="mobile-view-tools" role="group" aria-label="Масштаб задания">
      <button type="button" aria-label="Уменьшить задание" disabled={scale <= 1} onClick={() => zoom(-.5)}><Symbol name="minus"/></button>
      <button type="button" aria-label="Увеличить задание" disabled={scale >= 3} onClick={() => zoom(.5)}><Symbol name="plus"/></button>
    </div>
  </figure>;
}
