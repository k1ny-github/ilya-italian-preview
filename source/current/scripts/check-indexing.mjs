import {indexingPolicy} from './indexing-policy.mjs';
const policy=indexingPolicy(process.env);
console.log('Indexing release gate: '+(policy.indexing?'explicitly enabled for '+policy.siteUrl:'CLOSED'));
