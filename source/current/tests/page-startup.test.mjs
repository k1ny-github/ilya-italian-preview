import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {transformSync} from 'esbuild';

// Execute the real entry point. Model createRoot's documented clearing of
// existing HTML, so this catches a return to tearing down the first screen.
function start(hasHtml, language='ru') {
 const photo={id:'already-downloaded-photo'};
 const container={firstChild:hasHtml?photo:null,hasChildNodes(){return !!this.firstChild;}};
 const calls=[];
 const React={StrictMode:'strict',createElement:(type,props,...children)=>({type,props,children})};
 const source=transformSync(readFileSync(new URL('../src/main.jsx',import.meta.url),'utf8'),{loader:'jsx',format:'cjs'}).code;
 vm.runInNewContext(source,{
  document:{getElementById:()=>container,documentElement:{lang:language}},
  require(name){
   if(name==='react')return React;
   if(name==='react-dom/client')return {
    createRoot(){container.firstChild=null;return {render:tree=>calls.push({kind:'create',tree})};},
    hydrateRoot(node,tree){calls.push({kind:'hydrate',tree});},
   };
   if(name.endsWith('LocaleProvider.jsx'))return {LocaleProvider:'locale'};
   if(name.endsWith('SiteV9.jsx'))return {SiteV9:'site'};
   if(name.endsWith('style-entry.js'))return {};
   throw new Error(name);
  },
 });
 return {photo,container,calls};
}
test('published HTML keeps the existing hero nodes while handlers attach',()=>{
 const result=start(true);
 assert.equal(result.calls[0].kind,'hydrate');
 assert.equal(result.container.firstChild,result.photo);
});
test('hydration starts in the language of the delivered HTML',()=>{
 for(const locale of ['ru','en','it']){
  const result=start(true,locale);
  assert.equal(result.calls[0].tree.children[0].props.initialLocale,locale);
 }
});
test('empty local development root still renders normally',()=>{
 assert.equal(start(false).calls[0].kind,'create');
});
