

export default function QuizDecoration() {
  return <div className="q08-decoration q08-rebuilt" aria-hidden="true">
    <div className="q08-photo-frame">
      <img src="/images/audience-section/01-relocation-06a-2508.webp"
        srcSet="/images/audience-section/01-relocation-06a-2508-320.webp 320w, /images/audience-section/01-relocation-06a-2508-480.webp 480w, /images/audience-section/01-relocation-06a-2508-640.webp 640w, /images/audience-section/01-relocation-06a-2508-960.webp 960w, /images/audience-section/01-relocation-06a-2508.webp 2508w"
        sizes="auto, (min-width: 960px) 240px, 220px"
        alt="" width="2508" height="2508" loading="lazy" fetchPriority="low" decoding="async" />
    </div>
    <img className="q08-foreground" src="/images/quiz-section/quiz-foreground-complete.webp"
      srcSet="/images/quiz-section/quiz-foreground-complete-480.webp 480w, /images/quiz-section/quiz-foreground-complete-640.webp 640w, /images/quiz-section/quiz-foreground-complete-960.webp 960w, /images/quiz-section/quiz-foreground-complete.webp 1254w"
      sizes="auto, (min-width: 960px) 660px, (min-width: 480px) 640px, 480px"
      alt="" width="1254" height="1254" loading="lazy" fetchPriority="low" decoding="async" />
  </div>;
}
