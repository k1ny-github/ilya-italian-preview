import { useEffect, useRef, useState } from 'react';
import { reviews } from './reviews-data.js';



function ReviewDialog({ review, onClose }) {
  const ref = useRef(null);
  const backdropDown = useRef(false);
  useEffect(() => {
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    const dialog = ref.current;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.querySelector('button').focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      trigger?.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={ref} className="r10-dialog" aria-labelledby="r10-dialog-title"
    onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const elements = [...event.currentTarget.querySelectorAll('button,[tabindex="0"]')];
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onPointerDown={event => {
      const box = event.currentTarget.getBoundingClientRect();
      backdropDown.current = event.target === event.currentTarget &&
        (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom);
    }}
    onClick={event => { if (backdropDown.current && event.target === event.currentTarget) onClose(); backdropDown.current = false; }}>
    <div className="r10-dialog-inner" tabIndex={0} aria-label="Полный текст отзыва">
      <div className="r10-dialog-top"><span>ПОЛНЫЙ ОТЗЫВ</span><button type="button" className="r10-dialog-close" onClick={onClose} aria-label="Свернуть отзыв">×</button></div>
      <h2 id="r10-dialog-title">{review.name}</h2>
      <div className="r10-dialog-copy">{review.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      <button type="button" className="r10-dialog-bottom" onClick={onClose}>Свернуть отзыв</button>
    </div>
  </dialog>;
}

function ReviewCard({ review, index, openReview }) {
  const excerpt = useRef(null);
  const [clipped, setClipped] = useState(false);
  useEffect(() => {
    const element = excerpt.current;
    const observer = new ResizeObserver(() => setClipped(element.scrollHeight > element.clientHeight + 1));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const more = review.paragraphs.length > 1 || clipped;
  return <article className="r10-card" id={`r10-review-${index}`} 
    aria-labelledby={`r10-author-${index}`}>
    <div className="r10-card-top"><span className="r10-avatar" aria-hidden="true"><img src="/ilya-italian-preview/images/review-section/c-neutral.svg" width="52" height="52" alt=""/></span><h3 id={`r10-author-${index}`}>{review.name}</h3></div>
    <div ref={excerpt} className={`r10-excerpt ${clipped ? 'has-more' : ''}`}>{review.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>

    {more ? <button type="button" className="r10-read-more" onClick={() => openReview(index)} aria-label={`Читать полный отзыв: ${review.name}`}>Читать дальше</button> : null}
  </article>;
}

export function ReviewsSection({ title }) {
  const [opened, setOpened] = useState(null);
  return <section className="r10-reviews" id="reviews" aria-labelledby="r10-title"><div className="r10-inner">
    <h2 id="r10-title">{title}</h2>
    <div className="r10-grid">{reviews.map((review, index) => <ReviewCard key={review.name} review={review} index={index} openReview={setOpened}/>)}</div>
    {opened !== null ? <ReviewDialog review={reviews[opened]} onClose={() => setOpened(null)}/> : null}
  </div></section>;
}