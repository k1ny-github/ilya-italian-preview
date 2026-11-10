import test from 'node:test';
import assert from 'node:assert/strict';
import { startSectionReveals } from '../src/section-reveal.js';
function harness(reduced=false) {
 const calls=[];let callback,disconnected=false;
 const section=(top,hero=false)=>({tagName:'SECTION',matches:()=>hero,getBoundingClientRect:()=>({top,bottom:top+300}),getClientRects:()=>[{}],animate:(frames,options)=>{calls.push({frames,options});return {finished:Promise.resolve(),cancel(){}};}});
 const hero=section(0,true),visible=section(200),below=section(900);
 const observed=[];
 class Observer {constructor(cb){callback=cb;}observe(s){observed.push(s);}unobserve(s){observed.splice(observed.indexOf(s),1);}disconnect(){disconnected=true;}}
 const media={matches:reduced,addEventListener(){},removeEventListener(){}};
 return {main:{children:[hero,visible,below]},options:{Observer,media,viewportHeight:700},calls,observed,below,fire:entries=>callback(entries),disconnected:()=>disconnected};
}
test('only below-screen sections animate, once, without delaying the hero',()=>{const h=harness();const stop=startSectionReveals(h.main,h.options);assert.deepEqual(h.observed,[h.below]);h.fire([{target:h.below,isIntersecting:true}]);h.fire([{target:h.below,isIntersecting:true}]);assert.equal(h.calls.length,1);assert.equal(h.calls[0].options.duration,520);assert.deepEqual(h.calls[0].frames,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0px)'}]);stop();assert.equal(h.disconnected(),true);});
test('reduced motion leaves content static',()=>{const h=harness(true);startSectionReveals(h.main,h.options);assert.equal(h.observed.length,0);assert.equal(h.calls.length,0);});
test('unsupported observer leaves all content available',()=>{const h=harness();assert.doesNotThrow(()=>startSectionReveals(h.main,{...h.options,Observer:undefined})());assert.equal(h.calls.length,0);});
