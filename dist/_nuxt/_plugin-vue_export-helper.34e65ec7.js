import{b as s}from"./entry.cb13286f.js";function e(n){return n!==null&&typeof n=="object"}function c(n,t,o=".",u){if(!e(t))return c(n,{},o,u);const i=Object.assign({},t);for(const r in n){if(r==="__proto__"||r==="constructor")continue;const f=n[r];f!=null&&(u&&u(i,r,f,o)||(Array.isArray(f)&&Array.isArray(i[r])?i[r]=[...f,...i[r]]:e(f)&&e(i[r])?i[r]=c(f,i[r],(o?`${o}.`:"")+r.toString(),u):i[r]=f))}return i}function _(n){return(...t)=>t.reduce((o,u)=>c(o,u,"",n),{})}const d=_((n,t,o)=>{if(typeof n[t]<"u"&&typeof o=="function")return n[t]=o(n[t]),!0});function l(n,t){return s()._useHead(n,t)}const p={};d(p);const A=(n,t)=>{const o=n.__vccOpts||n;for(const[u,i]of t)o[u]=i;return o};export{A as _,l as u};
