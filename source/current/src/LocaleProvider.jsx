import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import ru from './locales/ru.js';
import en from './locales/en.js';
import it from './locales/it.js';
import {resolveLocale,localizedUrl,supportedLocales,translate} from './locale-utils.js';
export const dictionaries = {ru,en,it};
export const LocaleContext = createContext(null);
function browserLocale() {
  return resolveLocale({search:typeof location === 'undefined' ? '' : location.search,languages:typeof navigator === 'undefined' ? undefined : navigator.languages,language:typeof navigator === 'undefined' ? undefined : navigator.language});
}
export function LocaleProvider({children}) {
  const [locale,setLocale] = useState(browserLocale);
  const dictionary = dictionaries[locale];
  useEffect(()=>{
    const sync=()=>setLocale(browserLocale());
    addEventListener('popstate',sync);
    return ()=>removeEventListener('popstate',sync);
  },[]);
  useEffect(()=>{
    document.documentElement.lang=locale;
    const privacy=location.pathname.endsWith('/privacy.html');
    document.title=privacy ? dictionary.metadata.privacyTitle : dictionary.metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content',privacy ? dictionary.privacy.paragraphs[0] : dictionary.metadata.description);
  },[locale,dictionary]);
  const value=useMemo(()=>({locale,dictionary,t:(key,...args)=>translate(dictionary,key,...args),switchLocale(next){
    if(!supportedLocales.includes(next))return;
    history.replaceState(history.state,'',localizedUrl(location.pathname+location.search+location.hash,next));
    setLocale(next);
  }}),[locale,dictionary]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
export function useLocale(){return useContext(LocaleContext);}
