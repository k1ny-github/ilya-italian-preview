import {createServer} from 'vite';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import path from 'node:path';
import {canonicalUrl,graphFor,russianMetadata,supplementaryMetadata} from '../src/seo-settings.js';
import {indexingPolicy,applyPublicRobots} from './indexing-policy.mjs';
const policy=indexingPolicy(process.env);
const indexing=policy.indexing;
const origin=policy.siteUrl;
const site=new URL(origin); if(!site.pathname.endsWith('/'))site.pathname+='/';
const base=process.env.SITE_BASE || '/';
const out=path.resolve('dist/client');
const template=await readFile(path.join(out,'index.html'),'utf8');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try {
 const {render}=await server.ssrLoadModule('/src/seo-render.jsx');
 const alternates=['ru','en','it'].map(l=>`<link rel="alternate" hreflang="${l}" href="${new URL(l+'.html',site)}" />`).join('')+`<link rel="alternate" hreflang="x-default" href="${site}" />`;
 for(const locale of ['ru','en','it']){
  const result=render(locale);
  const html=result.html;
  const metadata=locale==='ru' ? russianMetadata : result.metadata;
  const extra=Object.entries(supplementaryMetadata(locale)).map(([name,value])=>`<meta name="${name}" content="${escape(value)}" />`).join('');
  const canonical=canonicalUrl(locale,site.href);
  let page=applyPublicRobots(template,policy).replace('lang="ru"',`lang="${locale}"`).replace(/<title>[^<]*<\/title>/,`<title>${escape(metadata.title)}</title>`).replace(/<meta name="description" content="[^"]*"/,`<meta name="description" content="${escape(metadata.description)}"`);
  page=page.replace('</head>',extra+'</head>');
  const markup=html.replaceAll('\"/images/', '\"'+base+'images/').replaceAll(', /images/', ', '+base+'images/');
  page=page.replace('<div id="root"></div>',`<div id="root">${markup}</div>`).replace('</head>',`<link rel="canonical" href="${canonical}" />${alternates}<meta property="og:title" content="${escape(metadata.title)}" /><meta property="og:description" content="${escape(metadata.description)}" /><meta property="og:type" content="website" /><meta property="og:url" content="${canonical}" /><meta property="og:locale" content="${{ru:'ru_RU',en:'en_US',it:'it_IT'}[locale]}" /><script type="application/ld+json">${JSON.stringify(graphFor(locale,metadata,site.href)).replaceAll('<','\\u003c')}</script></head>`);
  await writeFile(path.join(out,locale+'.html'),page);
  if(locale==='ru')await writeFile(path.join(out,'index.html'),page);
 }
 await writeFile(path.join(out,'robots.txt'),policy.robots);
 const review=path.resolve('dist/seo-review');
 await mkdir(review,{recursive:true});
 await writeFile(path.join(review,'robots.closed.txt'),indexingPolicy({}).robots);
 await writeFile(path.join(review,'robots.launch.template.txt'),'User-agent: *\nAllow: /\n\nSitemap: https://FINAL-APPROVED-DOMAIN/sitemap.xml\n');
 const sitemap=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['ru','en','it'].map(l=>`<url><loc>${new URL(l+'.html',site)}</loc></url>`).join('')}</urlset>`;
 await writeFile(path.join(review,'sitemap.xml'),sitemap);
 if(indexing)await writeFile(path.join(out,'sitemap.xml'),sitemap);
 else await rm(path.join(out,'sitemap.xml'),{force:true});
 // Exclude the pre-existing, unapproved license draft from distributable output.
 await rm(path.join(out,'THIRD-PARTY-NOTICES.txt'),{force:true});
 await writeFile(path.join(review,'http-release-notes.txt'),'GitHub Pages cannot set arbitrary X-Robots-Tag or query-based redirects. Current noindex is in HTML. Retain noindex until an approved release. Sites worker SPA fallback is unchanged; assess 404s again on the chosen final host.');
 console.log('Indexing: '+(indexing ? 'OPEN' : 'CLOSED'));
 console.log('SEO: rendered RU/EN/IT, canonical, hreflang, sitemap, robots for '+site);
} finally {await server.close();}
