import { useEffect, useRef } from 'react';

const frames = [
  ['C8-02-pisa-tower-and-cathedral', 'Пизанская башня и собор'],
  ['C8-06-apollo-daphne-marble-detail', 'Мраморный профиль Дафны'],
  ['C9-light-italian-church-interior', 'Светлый интерьер церкви'],
  ['C8-03-bologna-terracotta-rooftops', 'Красные крыши Болоньи'],
  ['C8-04-bologna-archiginnasio-courtyard', 'Двор Аркиджинназио'],
  ['C8-05-light-italian-gallery', 'Светлая итальянская галерея'],
  ['C8-07-italian-painted-vault', 'Расписной свод'],
  ['C8-01-colosseum-daylight', 'Колизей'],
];
const mod = n => (n % frames.length + frames.length) % frames.length;
const imageUrl = n => `/ilya-italian-preview/images/culture-slider/${frames[mod(n)][0]}.webp`;

export default function CultureSection({ title, text, bookingUrl, Button }) {
  const regionRef = useRef(null);

  useEffect(() => {
    const region = regionRef.current;
    const images = [...region.querySelectorAll('[data-c16-image]')];
    const counter = region.querySelector('.c16-counter');
    const announcement = region.querySelector('.c16-announcement');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const loaded = new Map();
    const animations = new Set();
    let index = 0, request = 0, timer = null;
    let playing = !motion.matches, started = false, loading = false, visible = false, disposed = false;

    function load(n) {
      n = mod(n);
      if (!loaded.has(n)) {
        const image = new Image();
        image.src = imageUrl(n);
        loaded.set(n, image.decode().catch(error => { loaded.delete(n); throw error; }));
      }
      return loaded.get(n);
    }
    function schedule() {
      clearTimeout(timer);
      if (!disposed && started && visible && playing && !document.hidden) {
        timer = setTimeout(() => show(index + 1), 4000);
      }
    }
    function clearFades() {
      animations.forEach(animation => animation.cancel());
      animations.clear();
      region.querySelectorAll('.c16-outgoing').forEach(image => image.remove());
    }
    async function show(target) {
      clearTimeout(timer);
      const token = ++request;
      const nextIndex = mod(target);
      try {
        await Promise.all([0, 1, 2].map(k => load(nextIndex + k)));
      } catch {
        if (!disposed && token === request) {
          playing = false;
          announcement.textContent = 'Не удалось загрузить изображение. Попробуйте ещё раз.';
        }
        return;
      }
      if (disposed || token !== request) return;
      clearFades();
      index = nextIndex;
      images.forEach((image, k) => {
        const old = image.cloneNode();
        old.removeAttribute('data-c16-image');
        old.alt = '';
        old.setAttribute('aria-hidden', 'true');
        old.className = 'c16-outgoing';
        if (!motion.matches) image.parentElement.append(old);
        image.src = imageUrl(index + k);
        image.alt = `Иллюстрация: ${frames[mod(index + k)][1]}`;
        if (!motion.matches) {
          const fade = old.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 450, easing: 'ease-in-out', fill: 'forwards',
          });
          animations.add(fade);
          fade.finished.catch(() => {}).finally(() => { old.remove(); animations.delete(fade); });
        }
      });
      counter.textContent = `${index + 1} / ${frames.length}`;
      schedule();
      load(index + 3).catch(() => {});
    }
    const changedMotion = () => {
      playing = !motion.matches;
      if (motion.matches) clearFades();
      schedule();
    };
    async function start() {
      if (started || loading || disposed) return;
      loading = true;
      try {
        await Promise.all([0, 1, 2].map(load));
        if (disposed) return;
        loading = false;
        started = true;
        schedule();
        load(3).catch(() => {});
      } catch {
        loading = false;
        if (!disposed) playing = false;
      }
    }
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', changedMotion);
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible && !started) start();
      else schedule();
    });
    observer.observe(region);
    return () => {
      disposed = true;
      ++request;
      clearTimeout(timer);
      clearFades();
      observer.disconnect();
      document.removeEventListener('visibilitychange', schedule);
      motion.removeEventListener('change', changedMotion);
    };
  }, []);

  return <section className="c16-culture" id="culture" aria-labelledby="c16-title">
    <div className="c16-inner">
      <div className="c16-copy"><h2 id="c16-title">{title}</h2><p>{text}</p>
      </div>
      <div ref={regionRef} className="c16-slider" role="region" aria-label="Иллюстративная галерея культуры Италии" aria-roledescription="карусель">
        <div className="c16-photos" data-image-surface="">
          <figure className="c16-main"><img data-c16-image src={imageUrl(0)} width="1254" height="1254" alt={`Иллюстрация: ${frames[0][1]}`} loading="lazy"/></figure>
          {[1, 2].map((n, k) => <div key={n} className={`c16-small ${k ? 'c16-second' : ''}`}>
            <img data-c16-image src={imageUrl(n)} width="1254" height="1254" alt={`Иллюстрация: ${frames[n][1]}`} loading="lazy"/>
          </div>)}
        </div>
        <span className="c16-counter" hidden aria-live="off">1 / 8</span>
        <span className="c16-announcement" aria-live="polite"/>
      </div>
      <Button className="c16-cta" href={bookingUrl} target="_blank" rel="noreferrer"/>
    </div>
  </section>;
}
