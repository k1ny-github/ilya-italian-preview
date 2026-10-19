import './style-entry.js';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MaterialsSection } from './MaterialsSection.jsx';
import './MiroShellReview.css';
import { useInertImages } from './useInertImages.js';

function MiroShellReview(){
  useInertImages();
  const [variant,setVariant]=useState('classic');
  return <>
    <header className="miro-review-toolbar">
      <h1>Сравнение оболочек Miro</h1>
      <div role="group" aria-label="Оформление доски">
        <button type="button" aria-pressed={variant==='classic'} onClick={()=>setVariant('classic')}>Прежняя оболочка</button>
        <button type="button" aria-pressed={variant==='refreshed'} onClick={()=>setVariant('refreshed')}>Обновлённая оболочка</button>
      </div>
      <p>Три задания сменяются автоматически. При смене оформления текущий кадр сохраняется. На сайте по умолчанию остаётся прежняя оболочка.</p>
    </header>
    <main className="v9"><MaterialsSection shellVariant={variant}/></main>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><MiroShellReview/></React.StrictMode>);
