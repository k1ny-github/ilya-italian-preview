import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react/dist/csr/ArrowUpRight';
import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { ArrowUp } from '@phosphor-icons/react/dist/csr/ArrowUp';
import { ArrowDown } from '@phosphor-icons/react/dist/csr/ArrowDown';
import { ArrowCounterClockwise } from '@phosphor-icons/react/dist/csr/ArrowCounterClockwise';
import { BookOpen } from '@phosphor-icons/react/dist/csr/BookOpen';
import { CalendarBlank } from '@phosphor-icons/react/dist/csr/CalendarBlank';
import { Certificate } from '@phosphor-icons/react/dist/csr/Certificate';
import { ChatCircle } from '@phosphor-icons/react/dist/csr/ChatCircle';
import { Check } from '@phosphor-icons/react/dist/csr/Check';
import { CheckCircle } from '@phosphor-icons/react/dist/csr/CheckCircle';
import { Compass } from '@phosphor-icons/react/dist/csr/Compass';
import { Cursor } from '@phosphor-icons/react/dist/csr/Cursor';
import { FileText } from '@phosphor-icons/react/dist/csr/FileText';
import { FilmStrip } from '@phosphor-icons/react/dist/csr/FilmStrip';
import { GlobeHemisphereWest } from '@phosphor-icons/react/dist/csr/GlobeHemisphereWest';
import { GraduationCap } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { Headphones } from '@phosphor-icons/react/dist/csr/Headphones';
import { ImageSquare } from '@phosphor-icons/react/dist/csr/ImageSquare';
import { List } from '@phosphor-icons/react/dist/csr/List';
import { MapPin } from '@phosphor-icons/react/dist/csr/MapPin';
import { Microphone } from '@phosphor-icons/react/dist/csr/Microphone';
import { Notebook } from '@phosphor-icons/react/dist/csr/Notebook';
import { Pause } from '@phosphor-icons/react/dist/csr/Pause';
import { PencilSimple } from '@phosphor-icons/react/dist/csr/PencilSimple';
import { Play } from '@phosphor-icons/react/dist/csr/Play';
import { Plus } from '@phosphor-icons/react/dist/csr/Plus';
import { Quotes } from '@phosphor-icons/react/dist/csr/Quotes';
import { Stack } from '@phosphor-icons/react/dist/csr/Stack';
import { UserFocus } from '@phosphor-icons/react/dist/csr/UserFocus';
import { Users } from '@phosphor-icons/react/dist/csr/Users';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { ArrowsOut } from '@phosphor-icons/react/dist/csr/ArrowsOut';
import { PaperPlaneTilt } from '@phosphor-icons/react/dist/csr/PaperPlaneTilt';
import { content as c, config } from './content.js';
import { Quiz, useQuizAttempt } from './Quiz.jsx';
import { CultureGallery, useAmbientMotion } from './LivingDetails.jsx';
import { TelegramLogo } from '@phosphor-icons/react/dist/csr/TelegramLogo';

const audienceIcons = [MapPin, FilmStrip, ChatCircle, ArrowCounterClockwise];
const approachIcons = [BookOpen, Play, ChatCircle, PencilSimple];
const nav = [['#audience', 'Для кого'], ['#about', 'Обо мне'], ['#materials', 'Как занимаемся'], ['#reviews', 'Отзывы']];

function BackgroundDetails({ variant }) {
  const Icon = { hero: PencilSimple, audience: Compass, approach: Notebook, culture: Headphones, closing: PaperPlaneTilt, formats: Users, goal: Compass, reviews: Quotes }[variant];
  return <div className={`background-details background-${variant}`} aria-hidden="true">
    <span className="background-route route-a" /><span className="background-route route-b" />
    <span className="background-object"><Icon weight="duotone" /></span>
    <span className="background-node node-a" /><span className="background-node node-b" />
    <span className="background-ticks"><i /><i /><i /></span>
  </div>;
}

function CardDetails() {
  return <span className="card-details" aria-hidden="true"><span className="card-rings"><i /><i /><i /></span><span className="card-dots">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</span></span>;
}

function Button({ children = c.cta, href = config.telegramUrl, secondary = false, className = '', icon = true, ...props }) {
  const classes = `button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`;
  const inside = <><span>{children}</span>{icon && <ArrowUpRight size={21} weight="bold" aria-hidden="true" />}</>;
  return props.onClick ? <button type="button" className={classes} {...props}>{inside}</button> : <a className={classes} href={href} {...props}>{inside}</a>;
}

function AssetSlot({ label, detail = 'Изображение будет добавлено', className = '', icon: Icon = ImageSquare }) {
  return <div className={`asset-slot ${className}`} role="img" aria-label={`${label}. ${detail}`}><Icon weight="thin" aria-hidden="true" /><span>{label}<small>{detail}</small></span></div>;
}

function Modal({ title, children, onClose, className = '' }) {
  const ref = useRef(null);
  const backdropDown = useRef(false);
  useEffect(() => {
    const trigger = document.activeElement;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current.showModal();
    return () => { document.body.style.overflow = previous; trigger?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={ref} className={`dialog ${className}`} onCancel={onClose} onPointerDown={e => { const r = e.currentTarget.getBoundingClientRect(); backdropDown.current = e.target === e.currentTarget && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom); }} onClick={e => { if (backdropDown.current && e.target === e.currentTarget) onClose(); backdropDown.current = false; }} aria-label={title}>
    <div className="dialog-heading"><h2>{title}</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Закрыть"><X size={23} /></button></div>{children}
  </dialog>;
}

function Workspace({ enlarged = false }) {
  return <div className={`workspace ${enlarged ? 'workspace-enlarged' : ''}`}>
    <div className="workspace-bar"><span className="workspace-brand">miro<span className="workspace-divider" />Общая доска</span><span className="participants"><span>И</span><span>Вы</span></span></div>
    <div className="workspace-canvas">
      <div className="workspace-toolbar" aria-hidden="true"><Cursor weight="fill" /><PencilSimple /><FileText /><ImageSquare /><Plus /></div>
      <div className="board-link board-link-one" aria-hidden="true" /><div className="board-link board-link-two" aria-hidden="true" />
      <div className="board-card board-task"><span className="board-card-head"><Notebook size={19} />Задание</span><span className="board-asset"><ImageSquare weight="thin" size={49} /><span>Фрагмент задания</span></span><span className="skeleton-lines" aria-hidden="true"><i /><i /><i /></span></div>
      <div className="board-card board-video"><span className="video-placeholder"><FilmStrip size={33} weight="duotone" /></span><span className="board-card-head">Фрагмент видео<ImageSquare size={18} /></span></div>
      <div className="board-card board-note"><span className="board-card-head"><PencilSimple size={19} />Заметки</span><span className="skeleton-lines" aria-hidden="true"><i /><i /><i /></span><span className="note-foot">Материалы урока</span></div>
      <span className="board-cursor cursor-ilya" aria-hidden="true"><Cursor size={24} weight="fill" /><span>Илья</span></span><span className="board-cursor cursor-student" aria-hidden="true"><Cursor size={22} weight="fill" /><span>Вы</span></span>
    </div>
    <div className="workspace-footer"><span>Пример доски · Материалы будут добавлены</span></div>
  </div>;
}


export function App() {
  useAmbientMotion();
  const quizAttempt = useQuizAttempt();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [faq, setFaq] = useState(null);


  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = e => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  return <>
    <a className="skip-link" href="#main">Перейти к содержанию</a>
    <header className="site-header wrap">
      <a href="#" className="wordmark" aria-label={`${c.name} — в начало`}><span className="brand-symbol" aria-hidden="true"><span className="italy-flag" /></span><span>{c.name}<small>итальянский язык</small></span></a>
      <nav className={`navigation ${menuOpen ? 'is-open' : ''}`} id="navigation" aria-label="Основная навигация">{nav.map(([href, name]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{name}</a>)}<button type="button" onClick={() => { setModal('quiz'); setMenuOpen(false); }}>Тест</button></nav>
      <a className="header-contact" href={config.telegramUrl} target="_blank" rel="noreferrer" aria-label="Написать в Telegram"><TelegramLogo size={22} weight="fill" /><span>Написать в Telegram</span></a>
      <button type="button" className="menu-toggle icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="navigation" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}>{menuOpen ? <X /> : <List />}</button>
    </header>

    <main id="main">
      <section className="hero wrap" aria-labelledby="hero-title">
        <BackgroundDetails variant="hero" />
        <div className="hero-copy">
          <p className="hero-role"><span aria-hidden="true" />{c.role}</p>
          <h1 id="hero-title">Запишитесь на <span className="hero-emphasis">бесплатный урок</span> по итальянскому языку</h1>
          <p className="hero-intro">От <strong>лингвиста-переводчика</strong> с сертификатом <strong>CILS C1</strong> и <strong>15 годами практики</strong></p>
          <div className="hero-actions"><Button /></div>
          <ul className="hero-benefits">{c.bullets.map(item => <li key={item}><span className="benefit-mark" aria-hidden="true" />{item}</li>)}</ul>
        </div>
        <div className="hero-visual" aria-label="Композиция с местом для портрета Ильи">
          <div className="portrait-backdrop" aria-hidden="true" />
          <div className="portrait-orbit orbit-one" aria-hidden="true" /><div className="portrait-orbit orbit-two" aria-hidden="true" />
          <div className="portrait-frame"><div className="portrait-frame-top"><span>{c.name}</span><span className="live-dot" aria-hidden="true" /></div><AssetSlot label="Портрет Ильи" detail="Место для фотографии" className="portrait-slot" icon={UserFocus} /><span className="portrait-signature" aria-hidden="true">{c.name}</span></div>
          <ul className="portrait-credentials" aria-label="Образование и опыт" data-reveal>
            <li className="credential credential-certificate"><strong>CILS C1</strong><span>Сертификат</span></li>
            <li className="credential credential-practice"><strong>15 лет</strong><span>практики</span></li>
            <li className="credential credential-profession"><strong>Лингвист-<br />переводчик</strong><span>По образованию</span></li>
            <li className="credential credential-study"><strong>Москва и Италия</strong><span>Учился в двух странах</span></li>
          </ul>
          <div className="floating-card materials-preview"><span className="preview-play"><Play size={19} weight="fill" /></span><span><strong>Живые материалы</strong><small>Видео, аудио и тексты</small></span><Headphones size={20} /><span className="preview-files" aria-hidden="true"><span><FilmStrip size={27} /></span><span><Headphones size={27} /></span><span><FileText size={27} /></span></span></div>
          <span className="hero-annotation" aria-hidden="true"><ArrowDown size={31} />Знакомство с преподавателем</span>
          <span className="hero-detail detail-one" aria-hidden="true"><Microphone size={17} /></span><span className="hero-detail detail-two" aria-hidden="true"><PencilSimple size={17} /></span>
          <span className="orbit-icon orbit-icon-top" aria-hidden="true"><ChatCircle size={25} weight="duotone" /></span><span className="orbit-icon orbit-icon-bottom" aria-hidden="true"><BookOpen size={27} weight="duotone" /></span>
        </div>
        <div className="hero-trust">{c.trust.map(([title, text], i) => { const Icon = [CheckCircle, CalendarBlank, Stack][i]; return <div className="trust-item" key={title}><Icon size={26} weight="duotone" /><span><strong>{title}</strong><small>{text}</small></span></div>; })}</div>
      </section>

      <section id="audience" className="audience section wrap" aria-labelledby="audience-title">
        <BackgroundDetails variant="audience" />
        <div className="section-heading"><h2 id="audience-title">Кому подойдут<br />занятия <span className="detail-underline">со мной</span></h2><span className="heading-decoration" aria-hidden="true"><Compass size={42} weight="duotone" /></span></div>
        <div className="audience-grid">{c.audience.map(([title, text], i) => { const Icon = audienceIcons[i]; return <article key={title} className={`audience-card audience-card-${i}`} data-reveal><CardDetails /><div className="audience-art" aria-hidden="true"><span className="audience-art-plate"><Icon size={68} weight="duotone" /></span>{i === 0 ? <span className="art-small"><GlobeHemisphereWest size={26} /></span> : i === 1 ? <span className="art-small"><Headphones size={26} /></span> : i === 2 ? <span className="art-small"><Microphone size={26} /></span> : <span className="art-small"><BookOpen size={26} /></span>}</div><div className="audience-card-copy"><h3>{title}</h3><p>{text}</p></div><a className="card-link" href="#booking" aria-label={`${title} — записаться на урок`}><ArrowUpRight size={24} /></a></article>; })}</div>
      </section>

      <section id="approach" className="approach section wrap" aria-labelledby="approach-title"><BackgroundDetails variant="approach" /><div className="section-heading"><h2 id="approach-title">Мой подход</h2><span className="section-handwriting" aria-hidden="true">Теория в практику</span></div><div className="approach-grid">{c.approach.map(([title, text], i) => { const Icon = approachIcons[i]; return <article className="approach-item" key={title}><span className={`approach-icon approach-icon-${i}`}><Icon size={29} weight="duotone" /></span><h3>{title}</h3><p>{text}</p></article>; })}</div></section>

      <section id="materials" className="materials section" aria-labelledby="materials-title"><div className="wrap materials-layout"><div className="materials-copy"><div className="lesson-brands" aria-label="Miro и Zoom"><span className="brand-badge"><span className="miro-brand">miro</span></span><span className="brand-badge"><span className="zoom-brand">zoom</span></span></div><h2 id="materials-title">Доступ к материалам<br />после урока</h2>{c.materials.map(([title, text]) => <div className="materials-paragraph" key={title}><h3>{title}</h3><p>{text}</p></div>)}</div><div className="workspace-stage" data-reveal><Workspace /><div className="workspace-caption"><CheckCircle size={20} weight="fill" /><span>Всё в одном месте</span></div></div></div></section>

      <section className="steps section wrap" aria-labelledby="steps-title"><div className="section-heading"><h2 id="steps-title">{c.stepsTitle}</h2></div><ol className="steps-list" data-reveal>{c.steps.map(([title, text], i) => <li key={title} style={{ "--step": i }}><span className="step-number">{String(i + 1).padStart(2, '0')}</span><span className="step-connector" aria-hidden="true"><svg viewBox="0 0 180 50" preserveAspectRatio="none"><path d="M2 25 L172 25 M163 17 L172 25 L163 33" /></svg></span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>

      <section className="culture section wrap" aria-labelledby="culture-title"><BackgroundDetails variant="culture" /><CultureGallery /><div className="culture-copy"><h2 id="culture-title">Погружение<br />в культуру</h2><p>{c.culture}</p><Button secondary /></div></section>

      <section id="formats" className="formats section wrap" aria-labelledby="formats-title"><BackgroundDetails variant="formats" /><div className="section-heading"><h2 id="formats-title">{c.formatsTitle}</h2></div><div className="formats-grid">{c.formats.map(([title, text], i) => <article className={`format-card format-${i}`} key={title}><CardDetails /><div className="format-visual" aria-hidden="true">{i === 0 ? <UserFocus size={100} weight="thin" /> : <Users size={100} weight="thin" />}<span className="format-mini-icon">{i === 0 ? <ChatCircle weight="duotone" /> : <BookOpen weight="duotone" />}</span></div><h3>{title}</h3><p>{text}</p>{i === 0 ? <Button className="button-white" /> : <Button secondary icon={false} href={config.telegramUrl} target="_blank" rel="noreferrer"><TelegramLogo size={22} weight="fill" />{c.cta}</Button>}</article>)}</div></section>

      <section id="quiz" data-reveal className="quiz-section section wrap" aria-labelledby="quiz-title">
        <div className="quiz-invite"><span className="quiz-label">20 вопросов · Без регистрации</span><h2 id="quiz-title">Проверьте свой<br />итальянский</h2><p>Грамматика, артикли и устойчивые выражения. После теста — результат и разбор каждого ответа.</p><Button onClick={() => setModal('quiz')}>Начать тест</Button></div>
        <div className="quiz-preview" aria-hidden="true"><span className="quiz-paper-label">Попробуем?</span><span className="quiz-paper-question">Какой артикль подходит?</span><p lang="it">___ studente<br />è italiano.</p><div className="quiz-sample-options"><span>Il</span><span>Lo</span><span>La</span></div><span className="quiz-pencil" /></div>
      </section>
      <section id="about" data-reveal className="about section wrap" aria-labelledby="about-title">
        <div className="about-portrait"><AssetSlot label="Портрет Ильи" detail="Место для фотографии" icon={UserFocus} /><span className="about-signature">Илья Хорьков</span></div>
        <div className="about-copy"><h2 id="about-title">Обо мне</h2><p className="about-lead">До преподавания работал на радио, занимался письменным и устным переводом.</p><p>Окончил МГЛУ, учился в Москве и Италии.</p><p>Преподавал в языковых школах, а сейчас работаю самостоятельно. Вы общаетесь и занимаетесь со мной напрямую: я веду уроки, подбираю задания и отвечаю на ваши вопросы.</p><div className="about-credentials"><div><strong>МГЛУ</strong><span>Лингвист-переводчик</span></div><div><strong>CILS C1</strong><span>Сертификат</span></div></div></div>
      </section>

      <section id="reviews" className="reviews section wrap" aria-labelledby="reviews-title"><BackgroundDetails variant="reviews" /><div className="section-heading"><h2 id="reviews-title">{c.reviewsTitle}</h2><Quotes size={44} weight="duotone" className="heading-decoration" aria-hidden="true" /></div><div className="reviews-grid">{[0, 1].map(i => <article className="review-placeholder" key={i}><Quotes size={33} weight="fill" /><p className="review-empty-label">Место для отзыва ученика</p><div className="review-lines" aria-hidden="true"><i /><i /><i /></div><div className="review-author"><span><UserFocus size={27} /></span><div>Имя ученика<small>Отзыв будет добавлен</small></div></div></article>)}</div></section>

      <section id="booking" className="booking section wrap" aria-labelledby="booking-title"><div className="booking-panel"><div className="booking-copy"><span className="booking-icon"><CalendarBlank size={32} weight="duotone" /></span><h2 id="booking-title">{c.bookingTitle}</h2><p>{c.goalDescription}</p><Button href={config.telegramUrl} target="_blank" rel="noreferrer">Написать в Telegram</Button></div><div className="booking-side"><div className="appointment-card"><div className="appointment-card-top"><CalendarBlank size={25} /><ArrowUpRight size={21} /></div><h3>Ознакомительный урок</h3><ul>{c.bullets.map(item => <li key={item}><Check size={17} />{item}</li>)}</ul><div className="appointment-foot"><CheckCircle size={20} weight="duotone" />Без обязательств</div></div><span className="booking-handwriting">Давайте знакомиться</span></div></div></section>

      <section id="faq" className="faq section wrap" aria-labelledby="faq-title"><div className="faq-intro"><h2 id="faq-title">Ответы<br />на вопросы</h2><span className="faq-mark" aria-hidden="true"><ChatCircle size={69} weight="duotone" /></span></div><div className="faq-list">{c.faq.map((question, i) => <div className={`faq-item ${faq === i ? 'is-open' : ''}`} key={question}><h3><button type="button" aria-expanded={faq === i} aria-controls={`faq-answer-${i}`} onClick={() => setFaq(faq === i ? null : i)}>{question}<span className="faq-toggle"><Plus size={22} /></span></button></h3><div id={`faq-answer-${i}`} className="faq-answer" aria-hidden={faq !== i}><div><p>{config.faqAnswers[i] || 'Ответ преподавателя будет добавлен.'}</p></div></div></div>)}</div></section>

      <section className="closing wrap"><BackgroundDetails variant="closing" /><span className="closing-icon" aria-hidden="true"><ChatCircle size={33} weight="duotone" /></span><h2>{c.closingTitle}</h2><p>{c.closing}</p><Button /><a className="closing-secondary" href={config.telegramUrl} target="_blank" rel="noreferrer"><TelegramLogo size={23} weight="fill" />Написать в Telegram</a></section>
    </main>
    <footer className="site-footer wrap"><a href="#" className="footer-name">{c.name}<small>{c.role}</small></a><div className="footer-actions"><button type="button" onClick={() => setModal('privacy')}>Политика конфиденциальности</button><span>Локальный прототип</span></div><a href="#" className="back-top" aria-label="Вернуться наверх"><ArrowUp size={22} /></a></footer>
    {modal === 'workspace' && <Modal title="Общая доска" onClose={() => setModal(null)} className="workspace-dialog"><Workspace enlarged /><p className="dialog-note">Композиция для предпросмотра. Реальные фрагменты занятия будут добавлены.</p></Modal>}
    {modal === 'quiz' && <Quiz attempt={quizAttempt} Modal={Modal} Button={Button} onClose={() => setModal(null)} bookingUrl={config.telegramUrl} />}
    {modal === 'privacy' && <Modal title="Политика конфиденциальности" onClose={() => setModal(null)}><div className="policy-placeholder"><FileText size={46} weight="duotone" /><p>Документ будет добавлен перед публикацией сайта.</p><p className="muted">В этом локальном прототипе нет собственной формы сбора контактов и аналитики. Для записи можно написать в Telegram.</p></div></Modal>}
  </>;
}
