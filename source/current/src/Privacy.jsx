import {createRoot} from 'react-dom/client';
import {LocaleProvider,useLocale} from './LocaleProvider.jsx';
import {localizedUrl} from './locale-utils.js';
import './locale.css';
import './privacy.css';
export function Privacy(){
 const {locale,dictionary}=useLocale();
 const p=dictionary.privacy;
 return <main><a className="back" href={localizedUrl('./',locale)}>{p.back}</a><h1>{p.title}</h1><p className="updated">{p.updated}</p><p>{p.contact} <a href="https://t.me/furettinetto">@furettinetto</a>.</p>{p.paragraphs.map((html,i)=><p key={i} dangerouslySetInnerHTML={{__html:html}}/>)}<p>{p.languageNote}</p></main>;
}
createRoot(document.getElementById('root')).render(<LocaleProvider><Privacy/></LocaleProvider>);
