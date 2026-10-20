
import { useRef } from 'react';
import { useBelowHeroImages } from './useBelowHeroImages.js';

export default function QuizDecoration() {
  const regionRef = useRef(null);
  const imagesReady = useBelowHeroImages(regionRef);
  return <div ref={regionRef} className="q08-decoration q08-rebuilt" aria-hidden="true">
    <div className="q08-photo-frame">
      <img src={imagesReady ? '/ilya-italian-preview/images/audience-section/01-relocation-06a-2508.webp' : undefined} alt="" width="2508" height="2508" loading="lazy" decoding="async" />
    </div>
    <img className="q08-foreground" src={imagesReady ? '/ilya-italian-preview/images/quiz-section/quiz-foreground-complete.webp' : undefined} alt="" width="1254" height="1254" loading="lazy" decoding="async" />
  </div>;
}
