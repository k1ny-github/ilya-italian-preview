import {useEffect,useRef,useState} from 'react';
import generatedPreviews from './hero-previews.json';

// Static HTML already carries the previews. Reuse those exact data URLs during
// hydration instead of shipping the bitmap bytes again in the client bundle.
// Vite removes the generated JSON import from the production client branch.
const previews=import.meta.env.SSR || import.meta.env.DEV ? generatedPreviews :
  Object.fromEntries([
    ['ilya-hero-photo-1','.h01-photo'],
    ['olive-left','.h01-portrait-left'],
    ['olive-right','.h01-art>.h01-right'],
  ].map(([key,selector])=>{
    const background=typeof document==='undefined'?'':document.querySelector(selector)?.style.backgroundImage??'';
    const value=background.match(/^url\(["']?(data:image\/webp;base64,[A-Za-z0-9+/=]+)["']?\)$/)?.[1];
    return [key,value];
  }));

// The full-quality image remains a normal eager, responsive image in the HTML.
// A tiny inline background occupies its exact content box until decode settles.
export function ProgressiveHeroImage({previewKey,style,...props}) {
  const image=useRef(null);
  const [decoded,setDecoded]=useState(false);
  useEffect(()=>{
    const node=image.current;
    let disposed=false;
    const reveal=()=>{
      if(!node.naturalWidth)return;
      const done=()=>{if(!disposed)setDecoded(true);};
      if(node.decode)node.decode().then(done,done);
      else done();
    };
    node.addEventListener('load',reveal);
    if(node.complete)reveal();
    return ()=>{disposed=true;node.removeEventListener('load',reveal);};
  },[props.src,props.srcSet]);
  return <img {...props} ref={image} style={{...style,
    backgroundImage:decoded||!previews[previewKey]?undefined:`url("${previews[previewKey]}")`,
    backgroundSize:props.className?.includes('h01-photo')?'cover':'contain',
    backgroundPosition:props.className?.includes('h01-photo')?'50% 47%':'center',backgroundRepeat:'no-repeat',
    backgroundOrigin:'content-box',backgroundClip:'content-box',
  }}/>;
}
