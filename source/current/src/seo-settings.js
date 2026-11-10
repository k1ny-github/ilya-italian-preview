export const currentSiteUrl='https://k1ny-github.github.io/ilya-italian-preview/';
export function syncPageSeo(doc,locale,metadata,origin=currentSiteUrl){
 const canonical=canonicalUrl(locale,origin);
 const link=doc.querySelector('link[rel=canonical]');
 if(link)link.href=canonical;
 const graph=doc.querySelector('script[type="application/ld+json"]');
 if(graph)graph.textContent=JSON.stringify(graphFor(locale,metadata,origin)).replaceAll('<','\\u003c');
 const social={title:metadata.title,description:metadata.description,url:canonical,locale:{ru:'ru_RU',en:'en_US',it:'it_IT'}[locale]};
 for(const [property,value] of Object.entries(social))doc.querySelector(`meta[property="og:${property}"]`)?.setAttribute('content',value);
}
export const russianMetadata={title:'Илья Хорьков — репетитор итальянского языка онлайн',description:'Индивидуальные онлайн-занятия итальянским языком с Ильёй Хорьковым: от нуля до C1. Бесплатный ознакомительный урок. Связь с преподавателем в Telegram.'};
export function canonicalUrl(locale,origin=currentSiteUrl){
 if(!['ru','en','it'].includes(locale))throw new Error('Unsupported locale');
 const root=new URL(origin);if(!root.pathname.endsWith('/'))root.pathname+='/';
 if(root.search||root.hash||!['http:','https:'].includes(root.protocol))throw new Error('Invalid site URL');
 return new URL(locale+'.html',root).href;
}
export function graphFor(locale,metadata,origin=currentSiteUrl){
 const root=new URL('./',canonicalUrl('ru',origin)).href;
 const person=root+'#person',website=root+'#website',service=root+'#service',page=canonicalUrl(locale,origin);
 return {'@context':'https://schema.org','@graph':[
 {'@type':'Person','@id':person,name:'Илья Хорьков',alternateName:'Ilya Khorkov',jobTitle:'Преподаватель итальянского языка',url:root,sameAs:['https://t.me/furettinetto']},
 {'@type':'WebSite','@id':website,url:root,name:'Илья Хорьков — итальянский язык',inLanguage:['ru','en','it'],publisher:{'@id':person}},
 {'@type':'WebPage','@id':page+'#webpage',url:page,name:metadata.title,description:metadata.description,inLanguage:locale,isPartOf:{'@id':website},about:{'@id':service}},
 {'@type':'Service','@id':service,name:'Индивидуальные онлайн-занятия итальянским языком',serviceType:'Обучение итальянскому языку онлайн',provider:{'@id':person},url:root}
 ]};
}
