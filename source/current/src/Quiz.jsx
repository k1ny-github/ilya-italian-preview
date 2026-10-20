import { useEffect, useRef, useState } from 'react';
import { Q } from './quiz-data.js';

export function useQuizAttempt() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(() => Array(Q.length).fill(null));
  const [done, setDone] = useState(false);
  return { index, setIndex, answers, setAnswers, done, setDone };
}

export function Quiz({ Modal, Button, onClose, bookingUrl, attempt }) {
  const { index, setIndex, answers, setAnswers, done, setDone } = attempt;
  const heading = useRef(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    const dialog = heading.current?.closest("dialog");
    if (dialog) dialog.scrollTop = 0;
  }, [index, done]);
  const q = Q[index];
  function answer(value) {
    setAnswers(prev => prev.map((a, i) => i === index ? value : a));
    if (index < Q.length - 1) setIndex(index + 1);
  }
  const score = Q.reduce((n, q, i) => n + Number(answers[i] === q.k), 0);
  const answered = answers.filter(a => a !== null && a >= 0).length;
  const topics = [...new Set(Q.map(q => q.t))].map(topic => ({ topic, total: Q.filter(q => q.t === topic).length, correct: Q.reduce((n, q, i) => n + Number(q.t === topic && answers[i] === q.k), 0) }));
  return <Modal title="Проверьте свой итальянский" onClose={onClose} className="quiz-dialog">
    {!done ? <div className="quiz-question" key={index}>
      <div className="quiz-meta"><span>Вопрос {index + 1} из {Q.length}</span><span>{q.l} · {q.t}</span></div>
      <progress value={index} max={Q.length} aria-label="Прогресс теста" />
      <h3 ref={heading} tabIndex={-1}>{q.q}</h3><p className="quiz-sentence" lang="it">{q.s}</p>
      <div className="quiz-answers">{q.o.map((option, i) => <button type="button" key={option} aria-pressed={answers[index] === i} className={answers[index] === i ? 'chosen' : ''} onClick={() => answer(i)}><span>{String.fromCharCode(65 + i)}</span><span lang="it">{option}</span><span aria-hidden="true">→</span></button>)}</div>
      {index === Q.length - 1 && answers[index] !== null && <Button className="quiz-finish" onClick={() => setDone(true)}>Показать результат</Button>}
      <div className="quiz-controls"><button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}>Назад</button><button type="button" onClick={() => answer(-1)}>Не знаю — пропустить</button></div>
    </div> : <div className="quiz-result">
      <p className="result-score">{score}<span> / {Q.length}</span></p><h3 ref={heading} tabIndex={-1}>Ваш результат</h3>
      {answered === 0 ? <p>Недостаточно ответов для оценки. Вы пропустили все вопросы. Можно пройти тест заново или обсудить свой уровень на знакомстве.</p> : <p>Предварительный ориентир по грамматике: <strong>{score <= 7 ? 'A1–A2' : score <= 14 ? 'B1–B2' : 'C1–C2'}</strong>. Короткий тест не определяет общий уровень языка и не проверяет разговорную речь.</p>}
      <div className="quiz-result-actions"><Button href={bookingUrl} target="_blank" rel="noreferrer" /><button className="text-button quiz-restart" type="button" onClick={() => { setAnswers(Array(Q.length).fill(null)); setIndex(0); setDone(false); }}>Пройти заново</button></div>
      <div className="topic-results">{topics.map(t => <div key={t.topic}><span>{t.topic}</span><strong>{t.correct} / {t.total}</strong><progress value={t.correct} max={t.total} aria-label={t.topic} /></div>)}</div>
      <h3 className="review-title">Разбор ответов</h3>{Q.map((q, i) => <details className="answer-review" key={q.s}><summary><span className={answers[i] === q.k ? 'answer-correct' : 'answer-wrong'}>{answers[i] === q.k ? '✓' : '—'}</span>{i + 1}. {q.s}</summary><p>Ваш ответ: {answers[i] === -1 ? 'Пропущен' : q.o[answers[i]]}</p><p><strong>Правильный ответ: {q.o[q.k]}</strong></p><p>{q.w}</p></details>)}
    </div>}
  </Modal>;
}
