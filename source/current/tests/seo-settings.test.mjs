import test from 'node:test';
import assert from 'node:assert/strict';
import {canonicalUrl,graphFor,syncPageSeo} from '../src/seo-settings.js';
test('language overrides keep canonical, JSON-LD and social metadata consistent',()=>{
 const nodes=new Map();
 for(const key of ['link[rel=canonical]','script[type="application/ld+json"]',...['title','description','url','locale'].map(p=>`meta[property="og:${p}"]`)])nodes.set(key,{setAttribute(name,value){this[name]=value;}});
 const doc={querySelector:key=>nodes.get(key)};
 for(const locale of ['en','ru','it']){
  syncPageSeo(doc,locale,{title:'Title '+locale,description:'Description '+locale},'https://example.test/site/');
  const page=JSON.parse(nodes.get('script[type="application/ld+json"]').textContent)['@graph'].find(n=>n['@type']==='WebPage');
  assert.equal(page.inLanguage,locale);
  assert.equal(page.url,nodes.get('link[rel=canonical]').href);
  assert.equal(nodes.get('meta[property="og:url"]').content,page.url);
  assert.equal(nodes.get('meta[property="og:title"]').content,'Title '+locale);
 }
});
test('canonical mapping drops query and handles each locale once',()=>{
 assert.equal(canonicalUrl('ru','https://example.test/site/'),'https://example.test/site/ru.html');
 assert.equal(canonicalUrl('en','https://example.test/site/'),'https://example.test/site/en.html');
 assert.throws(()=>canonicalUrl('xx','https://example.test/'));
});
test('schema has real linked entities without invented reviews or prices',()=>{
 const schema=graphFor('ru',{title:'Title',description:'Description'},'https://example.test/');
 assert.deepEqual(schema['@graph'].map(x=>x['@type']),['Person','WebSite','WebPage','Service']);
 assert.equal(schema['@graph'][0].name,'Илья Хорьков');
 assert.equal(schema['@graph'][3].provider['@id'],'https://example.test/#person');
 assert.doesNotMatch(JSON.stringify(schema),/aggregateRating|price|address|taxID/);
});
