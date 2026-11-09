import test from 'node:test';
import assert from 'node:assert/strict';
import {indexingPolicy,applyPublicRobots} from '../scripts/indexing-policy.mjs';
test('default mode stays closed with the exact robots text',()=>{
 const policy=indexingPolicy({});
 assert.equal(policy.indexing,false);
 assert.equal(policy.robots,'User-agent: *\nDisallow: /\n');
 assert.equal(policy.publicRobots,'noindex, nofollow');
});
test('indexing flag alone cannot open a release',()=>{
 assert.throws(()=>indexingPolicy({SEO_INDEXING:'true'}),/approval/i);
});
test('approved release still needs an explicit final URL',()=>{
 assert.throws(()=>indexingPolicy({SEO_INDEXING:'true',SEO_RELEASE_APPROVED:'true'}),/VITE_SITE_URL/);
});
test('open policy allows crawling and points at the exact chosen sitemap',()=>{
 const policy=indexingPolicy({SEO_INDEXING:'true',SEO_RELEASE_APPROVED:'true',VITE_SITE_URL:'https://ilyakhorkov.example.org/site/'});
 assert.equal(policy.robots,'User-agent: *\nAllow: /\n\nSitemap: https://ilyakhorkov.example.org/site/sitemap.xml\n');
 assert.equal(policy.publicRobots,null);
 assert.equal(policy.privateRobots,'noindex, nofollow');
 assert.doesNotMatch(policy.robots,/Disallow|assets|images|css|javascript/);
});
test('release URL rejects insecure, local and parameterized addresses',()=>{
 for(const url of ['http://example.org/','https://localhost/','https://127.0.0.1/','https://example.org/?lang=ru','https://example.org/#top','https://user:pass@example.org/']){
  assert.throws(()=>indexingPolicy({SEO_INDEXING:'true',SEO_RELEASE_APPROVED:'true',VITE_SITE_URL:url}));
 }
});

test('approved public HTML loses noindex/nofollow without modifying body',()=>{
 const template='<head><meta name="robots" content="noindex, nofollow" /></head><body><h1>Keep</h1></body>';
 const policy=indexingPolicy({SEO_INDEXING:'true',SEO_RELEASE_APPROVED:'true',VITE_SITE_URL:'https://example.org/'});
 const html=applyPublicRobots(template,policy);
 assert.doesNotMatch(html,/noindex|nofollow/);
 assert.equal(html.split('<body>')[1],template.split('<body>')[1]);
 assert.match(applyPublicRobots(template,indexingPolicy({})),/noindex, nofollow/);
});
