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
const imageUrl = n => `images/${frames[mod(n)][0]}.webp`;


const cleanup = (()=>{
    const region = document.querySelector('.c16-slider');
    const images = [...region.querySelectorAll('[data-c16-image]')];
    const small = [...region.querySelectorAll('.c16-small')];
    const prev = region.querySelector('[data-c16-prev]');
    const next = region.querySelector('[data-c16-next]');
    const pause = region.querySelector('[data-c16-pause]');
    const counter = region.querySelector('.c16-counter');
    const announcement = region.querySelector('.c16-announcement');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const loaded = new Map();
    const animations = new Set();
    let index = 0, wanted = 0, request = 0, timer = null;
    let playing = !motion.matches, started = false, disposed = false;

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
      if (!disposed && started && playing && !document.hidden) {
        timer = setTimeout(() => show(index + 1, false), 4000);
      }
    }
    function control() {
      pause.setAttribute('aria-label', playing ? 'Приостановить автосмену' : 'Продолжить автосмену');
      pause.title = playing ? 'Пауза' : 'Продолжить';
      pause.dataset.playing = String(playing);
      pause.querySelector('[data-c16-pause-icon]').style.display = playing ? '' : 'none';
      pause.querySelector('[data-c16-play-icon]').style.display = playing ? 'none' : '';
    }
    function clearFades() {
      animations.forEach(animation => animation.cancel());
      animations.clear();
      region.querySelectorAll('.c16-outgoing').forEach(image => image.remove());
    }
    async function show(target, manual = true) {
      clearTimeout(timer);
      const token = ++request;
      wanted = mod(target);
      const nextIndex = wanted;
      try {
        await Promise.all([0, 1, 2].map(k => load(nextIndex + k)));
      } catch {
        if (!disposed && token === request) {
          wanted = index;
          playing = false;
          control();
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
      small.forEach((button, k) => button.setAttribute('aria-label', `Показать главным: ${frames[mod(index + k + 1)][1]}`));
      counter.textContent = `${index + 1} / ${frames.length}`;
      if (manual) announcement.textContent = `${index + 1} из ${frames.length}: ${frames[index][1]}`;
      schedule();
      load(index + 3).catch(() => {});
    }
    const goPrev = () => show(wanted - 1);
    const goNext = () => show(wanted + 1);
    const goSmall = small.map((_, k) => () => show(index + k + 1));
    const toggle = () => { playing = !playing; control(); schedule(); };
    const keyboard = event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        show(wanted + (event.key === 'ArrowRight' ? 1 : -1));
      }
    };
    const changedMotion = () => {
      if (motion.matches) { playing = false; control(); clearFades(); schedule(); }
    };
    async function start() {
      if (started || disposed) return;
      started = true;
      try {
        await Promise.all([0, 1, 2].map(load));
        if (disposed) return;
        schedule();
        load(3).catch(() => {});
      } catch {
        if (!disposed) { playing = false; control(); }
      }
    }
    prev.addEventListener('click', goPrev);
    next.addEventListener('click', goNext);
    pause.addEventListener('click', toggle);
    small.forEach((button, k) => button.addEventListener('click', goSmall[k]));
    region.addEventListener('keydown', keyboard);
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', changedMotion);
    control();
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); start(); }
    }, { rootMargin: '400px' });
    observer.observe(region);
    return () => {
      disposed = true;
      ++request;
      clearTimeout(timer);
      clearFades();
      observer.disconnect();
      prev.removeEventListener('click', goPrev);
      next.removeEventListener('click', goNext);
      pause.removeEventListener('click', toggle);
      small.forEach((button, k) => button.removeEventListener('click', goSmall[k]));
      region.removeEventListener('keydown', keyboard);
      document.removeEventListener('visibilitychange', schedule);
      motion.removeEventListener('change', changedMotion);
    };
})();
window.addEventListener("pagehide",cleanup,{once:true});