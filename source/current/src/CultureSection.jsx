import { useLocale } from "./LocaleProvider.jsx";
import { useEffect, useRef } from "react";
const frames = [["C8-02-pisa-tower-and-cathedral", "Пизанская башня и собор"], ["C8-06-apollo-daphne-marble-detail", "Мраморный профиль Дафны"], ["C9-light-italian-church-interior", "Светлый интерьер церкви"], ["C8-03-bologna-terracotta-rooftops", "Красные крыши Болоньи"], ["C8-04-bologna-archiginnasio-courtyard", "Двор Аркиджинназио"], ["C8-05-light-italian-gallery", "Светлая итальянская галерея"], ["C8-07-italian-painted-vault", "Расписной свод"], ["C8-01-colosseum-daylight", "Колизей"]];
const mod = n => (n % frames.length + frames.length) % frames.length;
const imageUrl = n => `./images/culture-slider/${frames[mod(n)][0]}.webp`;
const imageSrcSet = n => [320, 448, 1254].map(width => {
  const original = imageUrl(n);
  const url = width === 1254 ? original : original.replace(".webp", `-${width}.webp`);
  return `${url} ${width}w`;
}).join(", ");
export default function CultureSection({
  title,
  text,
  bookingUrl,
  Button
}) {
  const {
    t,
    dictionary,
    locale
  } = useLocale();
  const regionRef = useRef(null);
  const activeIndex = useRef(0);
  useEffect(() => {
    const region = regionRef.current;
    const images = [...region.querySelectorAll("[data-c16-image]")];
    const counter = region.querySelector(".c16-counter");
    const announcement = region.querySelector(".c16-announcement");
    images.forEach((image,k) => { image.alt = t("Иллюстрация: {0}", t(frames[mod(activeIndex.current+k)][1])); });
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const loaded = new Map();
    const animations = new Set();
    let index = activeIndex.current,
      request = 0,
      timer = null;
    let playing = !motion.matches,
      started = false,
      loading = false,
      visible = false,
      disposed = false;
    function load(n, slotIndex) {
      n = mod(n);
      const slotWidth = images[slotIndex].clientWidth;
      if (!slotWidth) return Promise.resolve();
      const key = `${n}/${slotWidth}/${window.devicePixelRatio}`;
      if (!loaded.has(key)) {
        const image = new Image();
        image.sizes = `${slotWidth}px`;
        image.srcset = imageSrcSet(n);
        image.src = imageUrl(n);
        loaded.set(key, image.decode().catch(error => {
          loaded.delete(key);
          throw error;
        }));
      }
      return loaded.get(key);
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
      region.querySelectorAll(".c16-outgoing").forEach(image => image.remove());
    }
    async function show(target) {
      clearTimeout(timer);
      const token = ++request;
      const nextIndex = mod(target);
      try {
        await Promise.all(images.map((_, k) => load(nextIndex + k, k)));
      } catch {
        if (!disposed && token === request) {
          playing = false;
          announcement.textContent = t("Не удалось загрузить изображение. Попробуйте ещё раз.");
        }
        return;
      }
      if (disposed || token !== request) return;
      clearFades();
      index = nextIndex;
      activeIndex.current = index;
      images.forEach((image, k) => {
        const old = image.cloneNode();
        old.removeAttribute("data-c16-image");
        old.alt = "";
        old.setAttribute("aria-hidden", "true");
        old.className = "c16-outgoing";
        if (!motion.matches) image.parentElement.append(old);
        image.srcset = imageSrcSet(index + k);
        image.src = imageUrl(index + k);
        image.alt = t("Иллюстрация: {0}", t(frames[mod(index + k)][1]));
        if (!motion.matches) {
          const fade = old.animate([{
            opacity: 1
          }, {
            opacity: 0
          }], {
            duration: 450,
            easing: "ease-in-out",
            fill: "forwards"
          });
          animations.add(fade);
          fade.finished.catch(() => {}).finally(() => {
            old.remove();
            animations.delete(fade);
          });
        }
      });
      counter.textContent = `${index + 1} / ${frames.length}`;
      schedule();
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
        await Promise.all(images.map((_, k) => load(index + k, k)));
        if (disposed) return;
        loading = false;
        started = true;
        schedule();
      } catch {
        loading = false;
        if (!disposed) playing = false;
      }
    }
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", changedMotion);
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible && !started) start();else schedule();
    });
    observer.observe(region);
    return () => {
      disposed = true;
      ++request;
      clearTimeout(timer);
      clearFades();
      observer.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      motion.removeEventListener("change", changedMotion);
    };
  }, [t]);
  return <section className="c16-culture" id="culture" aria-labelledby="c16-title">
    <div className="c16-inner">
      <div className="c16-copy"><h2 id="c16-title">{title}</h2><p>{text}</p>
      </div>
      <div ref={regionRef} className="c16-slider" role="region" aria-label={t("Иллюстративная галерея культуры Италии")} aria-roledescription={t("карусель")}>
        <div className="c16-photos" data-image-surface="">
          <figure className="c16-main"><img data-c16-image src={imageUrl(0)} srcSet={imageSrcSet(0)} sizes="auto, 100vw" width="1254" height="1254" alt={t("Иллюстрация: {0}", t(frames[0][1]))} loading="lazy" decoding="async" /></figure>
          {[1, 2].map((n, k) => <div key={n} className={`c16-small ${k ? "c16-second" : ""}`}>
            <img data-c16-image src={imageUrl(n)} srcSet={imageSrcSet(n)} sizes="auto, 50vw" width="1254" height="1254" alt={t("Иллюстрация: {0}", t(frames[n][1]))} loading="lazy" decoding="async" />
          </div>)}
        </div>
        <span className="c16-counter" hidden aria-live="off">1 / 8</span>
        <span className="c16-announcement" aria-live="polite" />
      </div>
      <Button className="c16-cta" href={bookingUrl} target="_blank" rel="noreferrer" />
    </div>
  </section>;
}
