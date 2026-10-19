import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { content } from './content.js';

const MiroViewer = lazy(() => import('./MiroViewer.jsx'));

export function MaterialsSection({ shellVariant = 'classic' }) {
  const section = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setReady(true); observer.disconnect(); }
    }, { rootMargin: '400px' });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  return <section ref={section} className="m13-materials" id="materials" aria-labelledby="m13-title">
    <div className="inner"><h2 className="m13-title" id="m13-title">{content.materialsTitle}</h2>
      <div className="features">{content.materials.map(([title, text], index) => <div className="feature" key={title}>
        <img src={`/ilya-italian-preview/images/miro-approved/assets/${index ? 'folder-tile-source.png' : 'miro-yellow-tile.png'}`} width={index ? 94 : 90} height={89} alt="" loading="lazy"/>
        <div><h3>{title}</h3><p>{text}</p></div>
      </div>)}</div>
      <Suspense fallback={<div className="m13-screen-placeholder"/>}>{ready ? <MiroViewer shellVariant={shellVariant}/> : <div className="m13-screen-placeholder"/>}</Suspense>
    </div>
  </section>;
}
