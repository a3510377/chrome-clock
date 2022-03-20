var E=Object.defineProperty,B=Object.defineProperties;var G=Object.getOwnPropertyDescriptors;var k=Object.getOwnPropertySymbols;var M=Object.prototype.hasOwnProperty,A=Object.prototype.propertyIsEnumerable;var T=(o,e,t)=>e in o?E(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t,h=(o,e)=>{for(var t in e||(e={}))M.call(e,t)&&T(o,t,e[t]);if(k)for(var t of k(e))A.call(e,t)&&T(o,t,e[t]);return o},g=(o,e)=>B(o,G(e));import{a as y,c as V,u as P,d as x,b as C,r as I,w as O,o as $,e as _,f as m,F as b,g as L,h as K,i as d,t as p,j as U,k as q,l as F,m as R}from"./vendor.311f687c.js";const W=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))c(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&c(l)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerpolicy&&(n.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?n.credentials="include":s.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function c(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}};W();const Y={},z={},H={lave:{},food:{}};var w;(function(o){o.setConfig="setConfig"})(w||(w={}));const J={[w.setConfig]:async({state:o},e)=>{var t,c,s,n,l,i;if(e=Object.fromEntries(Object.entries(e).map(([r,a])=>[r,Object.fromEntries(Object.entries(a).map(([f,u])=>[f,u===null?void 0:u]))])),((t=e.food)==null?void 0:t.schoolName)!==((c=o.food)==null?void 0:c.schoolName)&&((s=e.food)==null?void 0:s.schoolName)||((n=e.food)==null?void 0:n.schoolId)!==((l=o.food)==null?void 0:l.schoolId)&&((i=e.food)==null?void 0:i.schoolId)){const{data:r}=await y({url:`https://fatraceschool.k12ea.gov.tw/school?SchoolName=${e.food.schoolName}`,method:"GET"});let{data:a}=r;e||(e={food:{},lave:{}}),console.log(a),a.length&&(e.$_updata=!0,e.food.schoolId=a[0].SchoolId.toString(),e.food.schoolName=a[0].SchoolName)}e.$_updata!==!1&&chrome.storage&&chrome.storage.local.set({config:e}),o.food=h(h({},o.food),e.food),o.lave=h(h({},o.lave),e.lave)}},Q={namespaced:!0,mutations:z,getters:Y,state:H,actions:J};var D;(function(o){o.CONFIG="config"})(D||(D={}));const X=V({modules:{[D.CONFIG]:Q}}),j=Symbol("vue-store"),N=()=>P(j);const Z={key:0,class:"menu"},ee={class:"cover"},te=["src"],oe={class:"info flex flex-down flex-item-center"},se=["textContent"],ne=["textContent"],ae=x({setup(o){const e=N(),t=C(()=>e.state.config.food.schoolId),c=I();O(t,()=>s()),$(()=>clearInterval(n));const s=async()=>{var a;let l=new Date;const{data:i}=await y({url:`https://fatraceschool.k12ea.gov.tw/offered/meal?SchoolId=${t.value}&period=${[l.getFullYear(),l.getMonth()+1,l.getDate()].join("-")}&KitchenId=all`,method:"GET"});let r=(a=i==null?void 0:i.data)==null?void 0:a[0];if(r){const{data:f}=await y({url:`https://fatraceschool.k12ea.gov.tw/dish?BatchDataId=${r.BatchDataId}`,method:"GET"});c.value=f==null?void 0:f.data}},n=setInterval(s,1e3*60*10);return s(),(l,i)=>c.value?(_(),m("div",Z,[(_(!0),m(b,null,L(c.value,(r,a)=>(_(),m("div",{class:"dish",key:a},[d("div",ee,[d("img",{src:`https://fatraceschool.k12ea.gov.tw/dish/pic/${r.DishId}`,alt:"\u83DC\u8272\u5716\u7247"},null,8,te)]),d("div",oe,[d("span",{textContent:p(r.DishType)},null,8,se),d("span",{textContent:p(r.DishName)},null,8,ne)])]))),128))])):K("",!0)}});var ce=(o,e)=>{const t=o.__vccOpts||o;for(const[c,s]of e)t[c]=s;return t};const le={class:"lave flex flex-item-center flex-center flex-down"},re=["textContent"],ie={class:"flex"},ue=["textContent"],de=["textContent"],fe=x({setup(o){const e=N(),t=C(()=>e.state.config.lave.laveTime);O(t,a=>a&&(s.value=a));const c=C(()=>e.state.config.lave.title||"\u6703\u8003\u5269\u9918"),s=I("2022-05-21T00:00:00+08:00"),n=I(),l=["\u5929","\u5C0F\u6642","\u5206\u9418","\u79D2"],i=()=>{let a=new Date(s.value).getTime()-new Date().getTime();n.value=[a/(1e3*60*60*24),a%(1e3*60*60*24)/(1e3*60*60),a%(1e3*60*60)/(1e3*60),a%(1e3*60)/1e3].map(u=>(~~u).toString().padStart(2,"0"));let f=n.value.map((u,v)=>[v,+u]).filter(([,u])=>u!==0)[0];document.title=`${c.value} ${f[1]||""}${l[f[0]]}`};i();const r=setInterval(i,100);return $(()=>clearInterval(r)),(a,f)=>(_(),m("div",le,[d("div",{class:"title",textContent:p(U(c))},null,8,re),d("div",ie,[(_(),m(b,null,L(l,(u,v)=>{var S;return d("div",{class:"flex",key:v},[d("span",{class:"time",textContent:p((S=n.value)==null?void 0:S[v])},null,8,ue),d("span",{textContent:p(u)},null,8,de)])}),64))])]))}});var he=ce(fe,[["__scopeId","data-v-caab62ca"]]);const _e={class:"wrapper"},me=x({setup(o){const e=N();return q(()=>{if(chrome.storage&&location.href.startsWith("chrome"))chrome.storage.onChanged.addListener(async({config:t})=>{t&&await e.dispatch("config/setConfig",g(h({},t.newValue),{$_updata:!1}))}),chrome.storage.local.get("config",({config:t})=>{t&&e.dispatch("config/setConfig",g(h({},t),{$_updata:!1}))});else{let t=new URL(location.href).searchParams;e.dispatch("config/setConfig",{lave:{title:t.get("endTitle"),laveTime:t.get("endTime")},food:{schoolId:t.get("foodSchoolId"),schoolName:t.get("foodSchoolName")},$_updata:!1})}}),$(()=>{}),(t,c)=>(_(),m("div",_e,[F(he),F(ae)]))}});R(me).use(X,j).mount("#app");