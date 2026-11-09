import test from 'node:test';
import assert from 'node:assert/strict';
import {canonicalUrl,graphFor} from '../src/seo-settings.js';
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
