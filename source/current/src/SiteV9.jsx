import LearningSteps from './LearningSteps';
import CultureSection from './CultureSection';
import QuizDecoration from './QuizDecoration';
import { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { ArrowUp } from '@phosphor-icons/react/dist/csr/ArrowUp';
import { BookOpen } from '@phosphor-icons/react/dist/csr/BookOpen';
import { CalendarBlank } from '@phosphor-icons/react/dist/csr/CalendarBlank';
import { Certificate } from '@phosphor-icons/react/dist/csr/Certificate';
import { ChatCircle } from '@phosphor-icons/react/dist/csr/ChatCircle';
import { Check } from '@phosphor-icons/react/dist/csr/Check';
import { CheckCircle } from '@phosphor-icons/react/dist/csr/CheckCircle';
import { FilmStrip } from '@phosphor-icons/react/dist/csr/FilmStrip';
import { GraduationCap } from '@phosphor-icons/react/dist/csr/GraduationCap';
import { Headphones } from '@phosphor-icons/react/dist/csr/Headphones';
import { List } from '@phosphor-icons/react/dist/csr/List';
import { MapPin } from '@phosphor-icons/react/dist/csr/MapPin';
import { Notebook } from '@phosphor-icons/react/dist/csr/Notebook';
import { Plus } from '@phosphor-icons/react/dist/csr/Plus';
import { TelegramLogo } from '@phosphor-icons/react/dist/csr/TelegramLogo';
import { Users } from '@phosphor-icons/react/dist/csr/Users';
import { X } from '@phosphor-icons/react/dist/csr/X';
import { content as c, config } from './content.js';
import { Quiz, useQuizAttempt } from './Quiz.jsx';
import { ReviewsSection } from './ReviewsSection.jsx';
import { MaterialsSection } from './MaterialsSection.jsx';

const photo = '/ilya-italian-preview/images/v9/';
const nav = [['#audience', 'Для кого'], ['#about', 'Обо мне'], ['#materials', 'Как занимаемся'], ['#reviews', 'Отзывы']];

function PrimaryButton({ children = c.cta, href = '#booking', className = '', onClick, ...props }) {
  const classes = `button button-primary v9-primary ${className}`;
  const inner = <><span>{children}</span></>;
  return onClick ? <button type="button" className={classes} onClick={onClick} {...props}>{inner}</button> : <a className={classes} href={href} {...props}>{inner}</a>;
}

function TelegramButton({ children = 'Написать в Telegram', className = '' }) {
  return <a className={`v9-telegram ${className}`} href={config.telegramUrl} target="_blank" rel="noreferrer"><span>{children}</span></a>;
}

function Brand() {
  return <a className="v9-brand" href="#top" aria-label={`${c.name} — в начало`}><span className="v9-flag" aria-hidden="true"><i /><i /><i /></span><span><strong>{c.name}</strong><small>{c.role}</small></span></a>;
}

function OliveBranch({ className = '' }) {
  return <svg className={`v9-olive ${className}`} viewBox="0 0 240 330" fill="none" aria-hidden="true"><path d="M-3 308C77 246 107 172 188 8M49 261c34-7 55-25 65-59M80 220c-6-43 10-72 37-93m21 36c29-7 52-28 67-58m-48 28c-8-32-3-54 18-76" stroke="#526437" strokeWidth="7" strokeLinecap="round"/><g fill="#4e6b36" stroke="#779456" strokeWidth="2"><ellipse cx="62" cy="267" rx="15" ry="39" transform="rotate(52 62 267)"/><ellipse cx="105" cy="222" rx="14" ry="36" transform="rotate(59 105 222)"/><ellipse cx="91" cy="181" rx="14" ry="37" transform="rotate(-20 91 181)"/><ellipse cx="128" cy="150" rx="13" ry="34" transform="rotate(52 128 150)"/><ellipse cx="151" cy="102" rx="13" ry="37" transform="rotate(-18 151 102)"/><ellipse cx="192" cy="80" rx="12" ry="34" transform="rotate(46 192 80)"/><ellipse cx="194" cy="26" rx="12" ry="34" transform="rotate(24 194 26)"/></g><g fill="#81974e"><circle cx="126" cy="202" r="8"/><circle cx="143" cy="190" r="7"/><circle cx="165" cy="125" r="7"/></g></svg>;
}

function Books({ className = '' }) {
  return <div className={`v9-books ${className}`} aria-hidden="true"><span className="v9-pen"/><span className="v9-book v9-book-white"/><span className="v9-book v9-book-green"/><span className="v9-book v9-book-orange"/></div>;
}

function Modal({ title, children, onClose, className = '' }) {
  const ref = useRef(null);
  const backdropDown = useRef(false);
  useEffect(() => {
    const trigger = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    const dialog = ref.current;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = oldOverflow; trigger?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={ref} className={`dialog ${className}`} onCancel={onClose} onPointerDown={e => { const r = e.currentTarget.getBoundingClientRect(); backdropDown.current = e.target === e.currentTarget && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom); }} onClick={e => { if (backdropDown.current && e.target === e.currentTarget) onClose(); backdropDown.current = false; }} aria-label={title}>
    <div className="dialog-heading"><h2>{title}</h2><button className="icon-button" type="button" onClick={onClose} aria-label="Закрыть"><X size={23} /></button></div>{children}
  </dialog>;
}

function Board() {
  return <div className="v9-board" role="img" aria-label="Иллюстративный пример доски Miro. Настоящие материалы урока будут добавлены"><div className="v9-board-bar"><strong><span>▰</span> miro</strong><small>Итальянский с Ильёй / Материалы</small><span className="v9-board-people">И &nbsp; Вы</span></div><div className="v9-board-body"><div className="v9-board-tools" aria-hidden="true">↖<br/>T<br/>▢<br/>✎</div><div className="v9-board-task"><strong>Упражнения</strong><span>□ Прослушать диалог</span><span>□ Вставить пропущенные слова</span><span>□ Составить предложения</span><span>□ Обсудить на уроке</span></div><div className="v9-board-video"><strong>Видео / Аудио</strong><div><FilmStrip size={44} weight="duotone" /></div><small>Разговорная практика</small></div><div className="v9-board-notes"><strong>Заметки</strong><span>• Новые слова</span><span>• Полезные выражения</span><span>• Правила</span></div></div><span className="v9-board-label">Пример доски · реальные материалы будут добавлены</span></div>;
}

function MethodArt({ index }) {
  const arts = [<><BookOpen size={82} weight="duotone"/><span className="v9-art-lines"><i/><i/><i/></span></>, <><FilmStrip size={87} weight="duotone"/><Headphones size={50} weight="duotone"/></>, <><ChatCircle size={96} weight="duotone"/><span className="v9-art-bubble">Ciao!</span></>, <><Notebook size={92} weight="duotone"/><span className="v9-art-script">io parlo</span></>];
  return <div className={`v9-method-art v9-method-art-${index}`} aria-hidden="true">{arts[index]}</div>;
}

export function SiteV9() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const quizAttempt = useQuizAttempt();
  const bookingRequested = useRef(false);
  useEffect(() => { if (modal !== null || !bookingRequested.current) return; bookingRequested.current = false; const booking = document.getElementById('booking'); booking?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); booking?.querySelector('a.v9-primary')?.focus({ preventScroll: true }); }, [modal]);
  useEffect(() => { if (!menuOpen) return; const close = e => { if (e.key === 'Escape') setMenuOpen(false); }; addEventListener('keydown', close); return () => removeEventListener('keydown', close); }, [menuOpen]);
  return <div className="v9" id="top">
    <a className="skip-link" href="#main">Перейти к содержанию</a>
    <header className="v9-header"><div className="v9-shell v9-header-inner h01-header"><Brand/><nav id="v9-navigation" className={`v9-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Основная навигация">{nav.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}<TelegramButton className="v9-header-telegram v9-menu-telegram">Есть вопрос? Пишите!</TelegramButton></nav><TelegramButton className="v9-header-telegram">Есть вопрос? Пишите!</TelegramButton><button className="v9-menu-toggle" type="button" aria-controls="v9-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X size={25}/> : <List size={25}/>}</button></div></header>
    <main id="main">
      <section className="h01-hero" aria-labelledby="h01-title"><img className="h01-left" src="/ilya-italian-preview/images/hero-section/olive-left.png" width="1154" height="1363" alt="" aria-hidden="true"/><div className="h01-stage">
        
        <div className="h01-grid"><div className="h01-copy">
          <h1 id="h01-title">Запишитесь на <br/><em>бесплатный урок</em> по <br/>итальянскому языку</h1>
          <img className="h01-emphasis" src="/ilya-italian-preview/images/hero-section/emphasis-strokes.svg" width="56" height="72" alt="" aria-hidden="true"/>
          <p className="h01-intro">{c.intro.split("CILS C1").map((part, i) => <Fragment key={i}>{i > 0 && <span style={{ whiteSpace: "nowrap" }}>CILS C1</span>}{part}</Fragment>)}</p>
          <ul className="h01-benefits">{c.bullets.map(item=><li key={item}><Check size={19} weight="bold" aria-hidden="true"/>{item}</li>)}</ul>
          <PrimaryButton className="h01-primary" href={config.bookingUrl} target="_blank" rel="noreferrer"/>
        </div><div className="h01-art"><div className="h01-glow" aria-hidden="true"/>
          <img className="h01-left h01-portrait-left" src="/ilya-italian-preview/images/hero-section/olive-left.png" width="1154" height="1363" alt="" aria-hidden="true"/>
          <img className="h01-right" src="/ilya-italian-preview/images/hero-section/olive-right.png" width="1137" height="1383" alt="" aria-hidden="true"/>
          
          <img className="h01-photo" src="/ilya-italian-preview/images/hero-section/ilya-hero-photo-1.png" width="853" height="1279" fetchPriority="high" alt="Илья Хорьков"/>
        </div></div>
        <div className="h01-trust">{c.trust.map(([title,detail],i)=><div key={title}><img src={`/ilya-italian-preview/images/hero-section/trust-${['shield','people','level'][i]}.svg`} width="48" height="48" alt="" aria-hidden="true"/><span><strong>{title}</strong><small>{detail}</small></span></div>)}</div>
      </div></section>

      <MaterialsSection/>

      <section className="a04-approach" id="approach" aria-labelledby="a04-title"><div className="a04-inner"><h2 id="a04-title">{c.approachTitle}</h2><div className="a04-grid">{c.approach.map(([title, text], i) => {
        const scenes = [
          ['P1-A-books-without-papers.webp', 1254, 1254, 'Иллюстрация: три книги по итальянской грамматике, лексике и общению'],
          ['P2-C-laptop-full-edges-balanced-close.webp', 1254, 1254, 'Иллюстрация: ноутбук с видеозаписью разговора на итальянской улице'],
          ['P3-C-conversation-centered-close.webp', 1254, 1254, 'Иллюстрация: женщина разговаривает и жестикулирует перед ноутбуком'],
          ['P4-C-italian-page-neat-diagonal.webp', 1254, 1254, 'Иллюстрация: пять строк итальянской грамматики в блокноте и синяя ручка'],
        ];
        const [file, width, height, alt] = scenes[i];
        return <article className={'a04-card a04-card-' + i} key={title}><div className="a04-visual" style={{ '--a04-ratio': width + ' / ' + height }}><img src={'/ilya-italian-preview/images/approach-section/' + file} width={width} height={height} alt={alt} loading="lazy"/></div><div className="a04-copy"><h3>{title}</h3><p>{text}</p></div></article>;
      })}</div></div></section>

      <LearningSteps title={c.stepsTitle} steps={c.steps}/>

      <section className="a02-audience" id="audience" aria-labelledby="a02-title"><div className="a02-inner"><h2 id="a02-title">{c.audienceTitle}</h2><div className="a02-grid">{c.audience.map(([title, text], i) => {
        const assets = ['01-relocation-06a-2508.webp', '02-waterfront-cafe-warm.webp', '03-speaking-h1-gelateria-pause.webp', '04-return-a1-large-handwriting.webp'];
        const sizes = [[2508, 2508], [1254, 1254], [1254, 1254], [1254, 1254]];
        const alts = ['Иллюстрация: набережная у озера, дома и горы', 'Иллюстрация: капучино на столике кафе у воды', 'Иллюстрация: женщина у витрины мороженого подбирает слова', 'Иллюстрация: блокнот с крупной надписью Si può sempre ricominciare'];
        const breaks = [' в Италии', null, ' не говорите', ' к итальянскому'];
        const at = breaks[i] ? title.indexOf(breaks[i]) : -1;
        return <a className="a02-card" href="#booking" key={title}><span className="a02-image-slot"><img className="a02-image" style={i === 2 ? { objectFit: 'cover' } : undefined} src={'/ilya-italian-preview/images/audience-section/' + assets[i]} alt={alts[i]} width={sizes[i][0]} height={sizes[i][1]} loading="lazy"/></span><div className="a02-body"><h3>{at >= 0 ? <>{title.slice(0, at)}<br className="a02-desktop-break"/>{title.slice(at)}</> : title}</h3><p>{text}</p></div></a>;
      })}</div></div></section>

      <section className="q08-invitation" id="quiz" aria-labelledby="q08-title"><div className="q08-inner"><div className="q08-copy"><h2 id="q08-title">Проверьте свой<br/><span>итальянский</span></h2><p>Грамматика, артикли и устойчивые выражения. После теста — результат и разбор каждого ответа.</p><button className="q08-button" type="button" onClick={() => setModal('quiz')}>Начать тест</button></div><QuizDecoration/></div></section>

      <section id="formats" className="f07-formats" aria-labelledby="formats-title"><div className="f07-inner"><h2 id="formats-title">{c.formatsTitle}</h2><div className="f07-grid">{c.formats.map(([title, text], i) => <article className={`f07-card f07-${i === 0 ? 'primary' : 'secondary'}`} key={title}><div className="f07-content"><h3>{title}</h3><p>{text}</p><a className={`f07-button f07-button-${i === 0 ? 'light' : 'outline'}`} href={i === 0 ? config.bookingUrl : config.telegramUrl} target="_blank" rel="noopener noreferrer"><span>{i === 0 ? c.cta : 'Обсудить в Telegram'}</span></a></div><div className="f07-lettering" aria-hidden="true">{i === 0 ? <><span>Un passo</span><span>alla volta</span></> : <><span>Insieme si impara</span><span>meglio!</span></>}</div><div className={`f07-visual f07-visual-${i === 0 ? 'solo' : 'group'}`} aria-hidden="true">{i === 0 ? <div className="f07-solo-chat"><span></span><span></span><span></span></div> : <><span></span><span></span><span></span></>}</div></article>)}</div></div></section>

      <CultureSection title={c.cultureTitle} text={c.culture} bookingUrl={config.bookingUrl} Button={PrimaryButton}/>

      <ReviewsSection title={c.reviewsTitle}/>

      <section className="a09-about" id="about" aria-labelledby="a09-title"><div className="a09-inner"><div className="a09-layout"><div className="a09-photo"><img src="/ilya-italian-preview/images/about-section/ilya-about-photo-3.png" width="853" height="1279" alt="Илья Хорьков у светлой стены" loading="lazy"/><span className="a09-signature">Илья Хорьков</span></div><div className="a09-copy"><h2 id="a09-title">Обо мне</h2><p>Я лингвист-переводчик, окончил МГЛУ и учился в Москве и Италии.</p><p>У меня 15 лет практики итальянского языка. Мой уровень владения языком подтверждён сертификатом CILS C1.</p><p>До преподавания работал на радио, занимался письменным и устным переводом. Затем преподавал в языковых школах, а сейчас провожу индивидуальные занятия по итальянскому языку.</p><p>На занятиях вы работаете со мной напрямую: я веду уроки, подбираю задания и отвечаю на ваши вопросы.</p></div></div>{/* Diploma and CILS certificate are pending owner-supplied files; document slots are temporarily hidden. */}</div></section>

      <section className="b11-booking" id="booking" aria-labelledby="b11-title"><div className="b11-inner"><div className="b11-copy"><h2 id="b11-title">{c.bookingTitle.split(' для ')[0]}<br/>для {c.bookingTitle.split(' для ')[1]}</h2><p>{c.goalDescription}</p><div className="b11-actions"><PrimaryButton className="b11-calendar" href={config.bookingUrl} target="_blank" rel="noreferrer">Выбрать время</PrimaryButton><TelegramButton className="b11-telegram"/></div></div><div className="b11-paper-wrap"><div className="b11-paper"><h3>{c.trust[1][0]}</h3><ul>{c.bullets.map(item => <li key={item}>{item}</li>)}</ul><div className="b11-note"><strong>{c.trust[0][0]}</strong><span>{c.trust[0][1]}</span></div><span className="b11-presto">A presto!</span></div></div></div></section>

      <section className="faq12" id="faq" aria-labelledby="faq12-title"><h2 id="faq12-title">{c.faqTitle}</h2><div className="faq12-list">{c.faq.map((question, i) => <details key={question}><summary><span>{question}</span><span className="faq12-toggle" aria-hidden="true"/></summary><div className="faq12-answer"><p>{config.faqAnswers[i] || 'Ответ преподавателя будет добавлен.'}</p></div></details>)}</div></section>

      <section className="c13-closing" id="closing" aria-labelledby="c13-title"><div className="c13-inner"><div className="c13-copy"><h2 id="c13-title">{c.closingTitle}</h2><p>{c.closing}</p><div className="c13-actions"><a className="c13-primary" href={config.bookingUrl} target="_blank" rel="noopener noreferrer"><span>{c.cta}</span></a><TelegramButton className="c13-telegram"/></div></div><div className="c13-lettering" aria-hidden="true">La vita<br/>parla italiano</div></div></section>
    </main>
    <footer className="c13-footer"><div className="c13-footer-inner"><a className="c13-brand" href="#top"><span className="c13-flag" aria-hidden="true"/><span><strong>{c.name}</strong><small>{c.role}</small></span></a><a className="c13-privacy" href="/ilya-italian-preview/privacy.html">Политика конфиденциальности</a><a className="c13-top" href="#top">Вернуться наверх</a></div></footer>
    {modal === 'quiz' && <Quiz attempt={quizAttempt} Modal={Modal} Button={PrimaryButton} onClose={() => setModal(null)} onBook={() => { bookingRequested.current = true; setModal(null); }}/>} 
  </div>;
}
