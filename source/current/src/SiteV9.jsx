import { useSectionReveal } from "./useSectionReveal.js";
import { ProgressiveHeroImage } from "./ProgressiveHeroImage.jsx";
import { localizedUrl } from "./locale-utils.js";
import { useLocale } from "./LocaleProvider.jsx";
import LearningSteps from "./LearningSteps";
import CultureSection from "./CultureSection";
import QuizDecoration from "./QuizDecoration";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { ArrowUp } from "@phosphor-icons/react/dist/csr/ArrowUp";
import { BookOpen } from "@phosphor-icons/react/dist/csr/BookOpen";
import { CalendarBlank } from "@phosphor-icons/react/dist/csr/CalendarBlank";
import { Certificate } from "@phosphor-icons/react/dist/csr/Certificate";
import { ChatCircle } from "@phosphor-icons/react/dist/csr/ChatCircle";
import { Check } from "@phosphor-icons/react/dist/csr/Check";
import { CheckCircle } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { FilmStrip } from "@phosphor-icons/react/dist/csr/FilmStrip";
import { GraduationCap } from "@phosphor-icons/react/dist/csr/GraduationCap";
import { Headphones } from "@phosphor-icons/react/dist/csr/Headphones";
import { List } from "@phosphor-icons/react/dist/csr/List";
import { MapPin } from "@phosphor-icons/react/dist/csr/MapPin";
import { Notebook } from "@phosphor-icons/react/dist/csr/Notebook";
import { Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { TelegramLogo } from "@phosphor-icons/react/dist/csr/TelegramLogo";
import { Users } from "@phosphor-icons/react/dist/csr/Users";
import { X } from "@phosphor-icons/react/dist/csr/X";
import { config } from "./content.js";
import { Quiz, useQuizAttempt } from "./Quiz.jsx";
import { ReviewsSection } from "./ReviewsSection.jsx";
import { MaterialsSection } from "./MaterialsSection.jsx";
import { useInertImages } from "./useInertImages.js";
const photo = "./images/v9/";
const nav = [["#audience", "Для кого"], ["#about", "Обо мне"], ["#materials", "Как занимаемся"], ["#reviews", "Отзывы"]];
function PrimaryButton({
  children,
  href = config.telegramUrl,
  className = "",
  onClick,
  ...props
}) {
  const {
    t,
    dictionary,
    locale
  } = useLocale();
  children ??= dictionary.content.cta;
  const classes = `button button-primary v9-primary ${className}`;
  const inner = <><span>{children}</span></>;
  return onClick ? <button type="button" className={classes} onClick={onClick} {...props}>{inner}</button> : <a className={classes} href={href} {...props}>{inner}</a>;
}
function TelegramButton({
  children,
  className = ""
}) {
  const {
    t,
    dictionary,
    locale
  } = useLocale();
  children ??= t("Написать в Telegram");
  return <a className={`v9-telegram ${className}`} href={config.telegramUrl} target="_blank" rel="noreferrer"><span>{children}</span></a>;
}
function Brand() {
  const {
    t,
    dictionary,
    locale
  } = useLocale();
  const c = dictionary.content;
  return <a className="v9-brand" href="#top" aria-label={t("{0} — в начало", c.name)}><span className="v9-flag" aria-hidden="true"><svg className="v9-flag-svg" width="33" height="22" viewBox="0 0 33 22" focusable="false"><defs><clipPath id="brand-italy-flag-clip"><rect width="33" height="22" rx="2" /></clipPath></defs><g clipPath="url(#brand-italy-flag-clip)"><path fill="#fff" d="M0 0h33v22H0z" /><path fill="#00a769" d="M0 0h11v22H0z" /><path fill="#ec1641" d="M22 0h11v22H22z" /></g><rect x="0.25" y="0.25" width="32.5" height="21.5" rx="1.75" fill="none" stroke="#9ba4ad" strokeWidth="0.5" /></svg></span><span><strong>{c.name}</strong><small>{c.role}</small></span></a>;
}
function OliveBranch({
  className = ""
}) {
  const {
    t,
    dictionary,
    locale
  } = useLocale();
  return <svg className={`v9-olive ${className}`} viewBox="0 0 240 330" fill="none" aria-hidden="true"><path d="M-3 308C77 246 107 172 188 8M49 261c34-7 55-25 65-59M80 220c-6-43 10-72 37-93m21 36c29-7 52-28 67-58m-48 28c-8-32-3-54 18-76" stroke="#526437" strokeWidth="7" strokeLinecap="round" /><g fill="#4e6b36" stroke="#779456" strokeWidth="2"><ellipse cx="62" cy="267" rx="15" ry="39" transform="rotate(52 62 267)" /><ellipse cx="105" cy="222" rx="14" ry="36" transform="rotate(59 105 222)" /><ellipse cx="91" cy="181" rx="14" ry="37" transform="rotate(-20 91 181)" /><ellipse cx="128" cy="150" rx="13" ry="34" transform="rotate(52 128 150)" /><ellipse cx="151" cy="102" rx="13" ry="37" transform="rotate(-18 151 102)" /><ellipse cx="192" cy="80" rx="12" ry="34" transform="rotate(46 192 80)" /><ellipse cx="194" cy="26" rx="12" ry="34" transform="rotate(24 194 26)" /></g><g fill="#81974e"><circle cx="126" cy="202" r="8" /><circle cx="143" cy="190" r="7" /><circle cx="165" cy="125" r="7" /></g></svg>;
}
function Books({
  className = ""
}) {
  const {
    t,
    dictionary,
    locale
  } = useLocale();
  return <div className={`v9-books ${className}`} aria-hidden="true"><span className="v9-pen" /><span className="v9-book v9-book-white" /><span className="v9-book v9-book-green" /><span className="v9-book v9-book-orange" /></div>;
}
function Modal({
  title,
  children,
  onClose,
  className = ""
}) {
  const {
    t,
    dictionary,
    locale
  } = useLocale();
  const ref = useRef(null);
  const backdropDown = useRef(false);
  useEffect(() => {
    const trigger = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    const dialog = ref.current;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = oldOverflow;
      trigger?.focus({
        preventScroll: true
      });
    };
  }, []);
  return <dialog ref={ref} className={`dialog ${className}`} onCancel={onClose} onPointerDown={e => {
    const r = e.currentTarget.getBoundingClientRect();
    backdropDown.current = e.target === e.currentTarget && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom);
  }} onClick={e => {
    if (backdropDown.current && e.target === e.currentTarget) onClose();
    backdropDown.current = false;
  }} aria-label={title}>
    <div className="dialog-heading"><h2>{title}</h2><button className="icon-button" type="button" onClick={onClose} aria-label={t("Закрыть")}><X size={23} /></button></div>{children}
  </dialog>;
}
function Board() {
  const {
    t,
    dictionary,
    locale
  } = useLocale();
  return <div className="v9-board" role="img" aria-label={t("Иллюстративный пример доски Miro. Настоящие материалы урока будут добавлены")}><div className="v9-board-bar"><strong><span>▰</span> miro</strong><small>{t("Итальянский с Ильёй / Материалы")}</small><span className="v9-board-people">{t("И \xA0 Вы")}</span></div><div className="v9-board-body"><div className="v9-board-tools" aria-hidden="true">↖<br />T<br />▢<br />✎</div><div className="v9-board-task"><strong>{t("Упражнения")}</strong><span>{t("□ Прослушать диалог")}</span><span>{t("□ Вставить пропущенные слова")}</span><span>{t("□ Составить предложения")}</span><span>{t("□ Обсудить на уроке")}</span></div><div className="v9-board-video"><strong>{t("Видео / Аудио")}</strong><div><FilmStrip size={44} weight="duotone" /></div><small>{t("Разговорная практика")}</small></div><div className="v9-board-notes"><strong>{t("Заметки")}</strong><span>{t("• Новые слова")}</span><span>{t("• Полезные выражения")}</span><span>{t("• Правила")}</span></div></div><span className="v9-board-label">{t("Пример доски · реальные материалы будут добавлены")}</span></div>;
}
function MethodArt({
  index
}) {
  const {
    t,
    dictionary,
    locale
  } = useLocale();
  const arts = [<><BookOpen size={82} weight="duotone" /><span className="v9-art-lines"><i /><i /><i /></span></>, <><FilmStrip size={87} weight="duotone" /><Headphones size={50} weight="duotone" /></>, <><ChatCircle size={96} weight="duotone" /><span className="v9-art-bubble">Ciao!</span></>, <><Notebook size={92} weight="duotone" /><span className="v9-art-script">io parlo</span></>];
  return <div className={`v9-method-art v9-method-art-${index}`} aria-hidden="true">{arts[index]}</div>;
}
export function SiteV9() {
  const {
    t,
    dictionary,
    locale
  } = useLocale();
  const c = dictionary.content;
  useInertImages();
  useSectionReveal(locale);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggleRef = useRef(null);
  const [modal, setModal] = useState(null);
  const quizAttempt = useQuizAttempt();
  useEffect(() => {
    if (!menuOpen) return;
    const close = e => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuToggleRef.current?.focus({
          preventScroll: true
        });
      }
    };
    addEventListener("keydown", close);
    return () => removeEventListener("keydown", close);
  }, [menuOpen]);
  return <div className="v9" id="top">
    <a className="skip-link" href="#main">{t("Перейти к содержанию")}</a>
    <header className="v9-header" onBlur={event => {
      if (menuOpen && !event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
    }}><div className="v9-shell v9-header-inner h01-header"><Brand /><button ref={menuToggleRef} className="v9-menu-toggle" type="button" aria-controls="v9-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? t("Закрыть меню") : t("Открыть меню")} onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X size={25} /> : <List size={25} />}</button><nav id="v9-navigation" className={`v9-nav ${menuOpen ? "is-open" : ""}`} aria-label={t("Основная навигация")}>{nav.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{t(label)}</a>)}<TelegramButton className="v9-header-telegram v9-menu-telegram">{t("Есть вопрос? Пишите!")}</TelegramButton></nav><TelegramButton className="v9-header-telegram">{t("Есть вопрос? Пишите!")}</TelegramButton></div></header>
    <main id="main">
      <section className="h01-hero" aria-labelledby="h01-title"><ProgressiveHeroImage previewKey="olive-left" className="h01-left" src="./images/hero-section/olive-left.webp" srcSet="./images/hero-section/olive-left-192.webp 192w, ./images/hero-section/olive-left-256.webp 256w, ./images/hero-section/olive-left-384.webp 384w, ./images/hero-section/olive-left-512.webp 512w, ./images/hero-section/olive-left-576.webp 576w, ./images/hero-section/olive-left-768.webp 768w, ./images/hero-section/olive-left.webp 1154w" sizes="(min-width: 1200px) clamp(160px, calc(33.333333vw - 240px), 240px), (min-width: 960px) clamp(100px, calc(25vw - 140px), 160px), (min-width: 480px) 180px, 170px" width="1154" height="1363" alt="" loading="eager" decoding="async" aria-hidden="true" /><div className="h01-stage">
        
        <div className="h01-grid"><div className="h01-copy">
          <h1 id="h01-title" className={locale === 'en' ? 'h01-title-english' : undefined}>{locale === 'en' ? <><span className="h01-title-anchor">{dictionary.heroLines[0]}<img className="h01-emphasis" src="./images/hero-section/emphasis-strokes.svg" width="56" height="72" alt="" aria-hidden="true" /></span>{" "}<br /><em>{dictionary.heroLines[1]}</em></> : <><span className="h01-title-anchor">{t("Запишитесь на")}<img className="h01-emphasis" src="./images/hero-section/emphasis-strokes.svg" width="56" height="72" alt="" aria-hidden="true" /></span> <br /><em>{t("бесплатный урок")}</em>{" "}{t("по")}{" "}<br />{t("итальянскому языку")}</>}</h1>
          <p className="h01-intro">{c.intro.split("CILS C1").map((part, i) => <Fragment key={i}>{i > 0 && <span style={{
                    whiteSpace: "nowrap"
                  }}>CILS C1</span>}{part}</Fragment>)}</p>
          <ul className="h01-benefits">{c.bullets.map(item => <li key={item}><Check size={19} weight="bold" aria-hidden="true" />{item}</li>)}</ul>
          <PrimaryButton className="h01-primary" href={config.telegramUrl} target="_blank" rel="noreferrer">{t("Записаться на урок")}</PrimaryButton>
        </div><div className="h01-art" data-image-surface=""><div className="h01-glow" aria-hidden="true" />
          <ProgressiveHeroImage previewKey="olive-left" className="h01-left h01-portrait-left" src="./images/hero-section/olive-left.webp" srcSet="./images/hero-section/olive-left-192.webp 192w, ./images/hero-section/olive-left-256.webp 256w, ./images/hero-section/olive-left-384.webp 384w, ./images/hero-section/olive-left-512.webp 512w, ./images/hero-section/olive-left-576.webp 576w, ./images/hero-section/olive-left-768.webp 768w, ./images/hero-section/olive-left.webp 1154w" sizes="(min-width: 1200px) clamp(160px, calc(33.333333vw - 240px), 240px), (min-width: 960px) clamp(100px, calc(25vw - 140px), 160px), (min-width: 480px) 180px, 170px" width="1154" height="1363" alt="" loading="eager" decoding="async" aria-hidden="true" />
          <ProgressiveHeroImage previewKey="olive-right" className="h01-right" src="./images/hero-section/olive-right.webp" srcSet="./images/hero-section/olive-right-192.webp 192w, ./images/hero-section/olive-right-256.webp 256w, ./images/hero-section/olive-right-384.webp 384w, ./images/hero-section/olive-right-512.webp 512w, ./images/hero-section/olive-right-576.webp 576w, ./images/hero-section/olive-right-768.webp 768w, ./images/hero-section/olive-right.webp 1137w" sizes="(min-width: 960px) clamp(150px, calc(68.75vw - 510px), 315px), (min-width: 480px) 180px, 170px" width="1137" height="1383" alt="" loading="eager" decoding="async" aria-hidden="true" />
          
          <ProgressiveHeroImage previewKey="ilya-hero-photo-1" className="h01-photo" src="./images/hero-section/ilya-hero-photo-1.webp" srcSet="./images/hero-section/ilya-hero-photo-1-256.webp 256w, ./images/hero-section/ilya-hero-photo-1-320.webp 320w, ./images/hero-section/ilya-hero-photo-1-480.webp 480w, ./images/hero-section/ilya-hero-photo-1-640.webp 640w, ./images/hero-section/ilya-hero-photo-1.webp 853w" sizes="(min-width: 960px) 367px, (min-width: 640px) 290px, (min-width: 480px) 308px, min(264px, calc(100vw - 64px))" width="853" height="1279" fetchPriority="high" loading="eager" decoding="async" alt={t("Илья Хорьков")} />
        </div></div>
        <div className="h01-trust">{c.trust.map(([title, detail], i) => <div key={title}><img src={`${import.meta.env.BASE_URL}images/hero-section/trust-${["shield", "people", "level"][i]}.svg`} width="48" height="48" alt="" aria-hidden="true" /><span><strong>{title}</strong><small>{detail}</small></span></div>)}</div>
      </div></section>

      <section className="q08-invitation" id="quiz" aria-labelledby="q08-title"><div className="q08-inner"><div className="q08-copy"><h2 id="q08-title">{t("Проверьте свой")}<br /><span>{t("итальянский")}</span></h2><p>{t("Грамматика, артикли и устойчивые выражения. После теста — результат и разбор каждого ответа.")}</p><button className="q08-button" type="button" onClick={() => setModal("quiz")}>{t("Начать тест")}</button></div><QuizDecoration /></div></section>

      <MaterialsSection />

      <section id="formats" className="f07-formats" aria-labelledby="formats-title"><div className="f07-inner"><h2 id="formats-title">{c.formatsTitle}</h2><div className="f07-grid">{c.formats.map(([title, text], i) => <article className={`f07-card f07-${i === 0 ? "primary" : "secondary"}`} key={title}><div className="f07-content"><h3>{title}</h3><p>{text}</p><a className={`f07-button f07-button-${i === 0 ? "light" : "outline"}`} href={config.telegramUrl} target="_blank" rel="noopener noreferrer"><span>{i === 0 ? c.cta : t("Написать в Telegram")}</span></a></div><div className="f07-lettering" aria-hidden="true">{i === 0 ? <><span>Un passo</span><span>alla volta</span></> : <><span>Insieme si impara</span><span>meglio!</span></>}</div><div className={`f07-visual f07-visual-${i === 0 ? "solo" : "group"}`} aria-hidden="true">{i === 0 ? <div className="f07-solo-chat"><span></span><span></span><span></span></div> : <><span></span><span></span><span></span></>}</div></article>)}</div></div></section>

      <CultureSection title={c.cultureTitle} text={c.culture} bookingUrl={config.telegramUrl} Button={PrimaryButton} />

      <section className="a04-approach" id="approach" aria-labelledby="a04-title"><div className="a04-inner"><h2 id="a04-title">{c.approachTitle}</h2><div className="a04-grid">{c.approach.map(([title, text], i) => {
              const scenes = [["P1-A-books-without-papers.webp", 1254, 1254, t("Иллюстрация: три книги по итальянской грамматике, лексике и общению")], ["P2-C-laptop-full-edges-balanced-close.webp", 1254, 1254, t("Иллюстрация: ноутбук с видеозаписью разговора на итальянской улице")], ["P3-C-conversation-centered-close.webp", 1254, 1254, t("Иллюстрация: женщина разговаривает и жестикулирует перед ноутбуком")], ["P4-C-italian-page-neat-diagonal.webp", 1254, 1254, t("Иллюстрация: пять строк итальянской грамматики в блокноте и синяя ручка")]];
              const [file, width, height, alt] = scenes[i];
              return <article className={"a04-card a04-card-" + i} key={title}><div className="a04-visual" style={{
                  "--a04-ratio": width + " / " + height
                }}><img src={"./images/approach-section/" + file} width={width} height={height} alt={alt} loading="lazy" /></div><div className="a04-copy"><h3>{title}</h3><p>{text}</p></div></article>;
            })}</div></div></section>

      <LearningSteps title={c.stepsTitle} steps={c.steps} />

      <section className="a02-audience" id="audience" aria-labelledby="a02-title"><div className="a02-inner"><h2 id="a02-title">{c.audienceTitle}</h2><div className="a02-grid">{c.audience.map(([title, text], i) => {
              const assets = ["01-relocation-06a-2508.webp", "02-waterfront-cafe-warm.webp", "03-speaking-h1-gelateria-pause.webp", "04-return-a1-large-handwriting.webp"];
              const sizes = [[2508, 2508], [1254, 1254], [1254, 1254], [1254, 1254]];
              const alts = [t("Иллюстрация: набережная у озера, дома и горы"), t("Иллюстрация: капучино на столике кафе у воды"), t("Иллюстрация: женщина у витрины мороженого подбирает слова"), t("Иллюстрация: блокнот с крупной надписью Si può sempre ricominciare")];
              const breaks = [t(" в Италии"), null, t(" не говорите"), t(" к итальянскому")];
              const at = locale === "ru" && breaks[i] ? title.indexOf(breaks[i]) : -1;
              return <a className="a02-card" href="#booking" key={title}><span className="a02-image-slot"><img className="a02-image" style={i === 2 ? {
                    objectFit: "cover"
                  } : undefined} src={"./images/audience-section/" + assets[i]} alt={alts[i]} width={sizes[i][0]} height={sizes[i][1]} loading="lazy" /></span><div className="a02-body"><h3>{at >= 0 ? <>{title.slice(0, at)}<br className="a02-desktop-break" />{title.slice(at)}</> : title}</h3><p>{text}</p></div></a>;
            })}</div></div></section>

      <section className="a09-about" id="about" aria-labelledby="a09-title"><div className="a09-inner"><div className="about-edge-decor" aria-hidden="true"><div className="about-edge-left"><img src="./images/hero-section/olive-left.webp" srcSet="./images/hero-section/olive-left-192.webp 192w, ./images/hero-section/olive-left-256.webp 256w, ./images/hero-section/olive-left-384.webp 384w, ./images/hero-section/olive-left-512.webp 512w, ./images/hero-section/olive-left-576.webp 576w, ./images/hero-section/olive-left-768.webp 768w, ./images/hero-section/olive-left.webp 1154w" sizes="(min-width: 960px) 1154px, (min-width: 480px) 180px, 170px" alt="" loading="lazy" decoding="async" /></div><div className="about-edge-right"><img src="./images/hero-section/olive-right.webp" srcSet="./images/hero-section/olive-right-192.webp 192w, ./images/hero-section/olive-right-256.webp 256w, ./images/hero-section/olive-right-384.webp 384w, ./images/hero-section/olive-right-512.webp 512w, ./images/hero-section/olive-right-576.webp 576w, ./images/hero-section/olive-right-768.webp 768w, ./images/hero-section/olive-right.webp 1137w" sizes="(min-width: 960px) 1137px, (min-width: 480px) 180px, 170px" alt="" loading="lazy" decoding="async" /></div></div><div className="a09-layout"><div className="a09-photo"><img src="./images/about-section/ilya-about-photo-3.webp" width="853" height="1279" alt={t("Илья Хорьков у светлой стены")} loading="lazy" /><span className="a09-signature">{t("Илья Хорьков")}</span></div><div className="a09-copy"><h2 id="a09-title">{t("Обо мне")}</h2><p>{t("Я лингвист-переводчик, окончил МГЛУ и учился в Москве и Италии.")}</p><p>{t("У меня 15 лет практики итальянского языка. Мой уровень владения языком подтверждён сертификатом CILS C1.")}</p><p>{t("До преподавания работал на радио, занимался письменным и устным переводом. Затем преподавал в языковых школах, а сейчас провожу индивидуальные занятия по итальянскому языку.")}</p><p>{t("На занятиях вы работаете со мной напрямую: я веду уроки, подбираю задания и отвечаю на ваши вопросы.")}</p></div></div>{/* Diploma and CILS certificate are pending owner-supplied files; document slots are temporarily hidden. */}</div></section>



      <ReviewsSection title={c.reviewsTitle} />

      <section className="faq12" id="faq" aria-labelledby="faq12-title"><h2 id="faq12-title">{c.faqTitle}</h2><div className="faq12-list">{c.faq.map((question, i) => <details key={i}><summary><span>{question}</span><span className="faq12-toggle" aria-hidden="true" /></summary><div className="faq12-answer"><p>{dictionary.faqAnswers[i] || t("Ответ преподавателя будет добавлен.")}</p></div></details>)}</div></section>

      <section className="b11-booking" id="booking" aria-labelledby="b11-title"><div className="b11-inner"><div className="b11-copy"><h2 id="b11-title">{c.bookingTitle}</h2><p>{c.goalDescription}</p><div className="b11-actions"><PrimaryButton className="b11-calendar" href={config.telegramUrl} target="_blank" rel="noreferrer">{t("Написать в Telegram")}</PrimaryButton></div></div><div className="b11-paper-wrap"><div className="b11-paper"><h3>{c.trust[1][0]}</h3><ul>{c.bullets.map(item => <li key={item}>{item}</li>)}</ul><div className="b11-note"><strong>{c.trust[0][0]}</strong><span>{c.trust[0][1]}</span></div><span className="b11-presto">A presto!</span></div></div></div></section>
    </main>
    <footer className="c13-footer"><div className="c13-footer-inner">
      <p className="c13-copyright">© {new Date().getFullYear()} {c.name}. <span className="c13-rights">{t("Все права защищены.")}</span></p>
      <a className="c13-confidentiality" href={localizedUrl("./privacy.html", locale)}>{t("Конфиденциальность")}</a>
      <a className="c13-top" href="#top">{t("Вернуться наверх")}<ArrowUp size={18} weight="regular" aria-hidden="true" /></a>
    </div></footer>
    {modal === "quiz" && <Quiz attempt={quizAttempt} Modal={Modal} Button={PrimaryButton} onClose={() => setModal(null)} bookingUrl={config.telegramUrl} />}
  </div>;
}
