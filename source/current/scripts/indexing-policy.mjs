import {currentSiteUrl} from '../src/seo-settings.js';
export function indexingPolicy(env={}) {
 const indexing=env.SEO_INDEXING==='true';
 if(indexing && env.SEO_RELEASE_APPROVED!=='true')throw new Error('Explicit owner release approval is required; indexing stays closed.');
 if(indexing && !env.VITE_SITE_URL)throw new Error('VITE_SITE_URL must explicitly identify the approved final working URL.');
 const site=new URL(env.VITE_SITE_URL || currentSiteUrl);
 if(site.search || site.hash || site.username || site.password)throw new Error('Site URL must not contain parameters, fragments or credentials.');
 if(indexing && (site.protocol!=='https:' || ['localhost','127.0.0.1','[::1]'].includes(site.hostname) || !site.hostname.includes('.')))throw new Error('Release requires the final public HTTPS URL.');
 if(!site.pathname.endsWith('/'))site.pathname+='/';
 return {
  indexing,siteUrl:site.href,
  robots:indexing ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml',site)}\n` : 'User-agent: *\nDisallow: /\n',
  publicRobots:indexing ? 'index, follow' : 'noindex, nofollow',
  privateRobots:'noindex, nofollow',
 };
}

export function applyPublicRobots(html,policy) {
 return html.replace(/<meta name="robots" content="[^"]*"\s*\/?>/,policy.publicRobots ? `<meta name="robots" content="${policy.publicRobots}" />` : '');
}
