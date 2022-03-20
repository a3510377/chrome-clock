var F=Object.defineProperty,j=Object.defineProperties;var E=Object.getOwnPropertyDescriptors;var D=Object.getOwnPropertySymbols;var B=Object.prototype.hasOwnProperty,G=Object.prototype.propertyIsEnumerable;var S=(s,e,t)=>e in s?F(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,h=(s,e)=>{for(var t in e||(e={}))B.call(e,t)&&S(s,t,e[t]);if(D)for(var t of D(e))G.call(e,t)&&S(s,t,e[t]);return s},v=(s,e)=>j(s,E(e));import{a as g,c as M,u as A,d as y,b as x,r as k,w as V,o as C,e as _,f as m,F as T,g as O,h as P,i as u,t as p,j as K,k as U,l as L,m as q}from"./vendor.311f687c.js";const R=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))c(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&c(r)}).observe(document,{childList:!0,subtree:!0});function t(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerpolicy&&(n.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?n.credentials="include":o.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function c(o){if(o.ep)return;o.ep=!0;const n=t(o);fetch(o.href,n)}};R();const W={},Y={},z={lave:{},food:{}};var I;(function(s){s.setConfig="setConfig"})(I||(I={}));const H={[I.setConfig]:async({state:s},e)=>{var t,c,o,n,r,d;if(e=Object.fromEntries(Object.entries(e).map(([a,l])=>[a,Object.fromEntries(Object.entries(l).map(([i,f])=>[i,f===null?void 0:f]))])),((t=e.food)==null?void 0:t.schoolName)!==((c=s.food)==null?void 0:c.schoolName)&&((o=e.food)==null?void 0:o.schoolName)||((n=e.food)==null?void 0:n.schoolId)!==((r=s.food)==null?void 0:r.schoolId)&&((d=e.food)==null?void 0:d.schoolId)){const{data:a}=await g({url:`https://fatraceschool.k12ea.gov.tw/school?SchoolName=${e.food.schoolName}`,method:"GET"});let{data:l}=a;e||(e={food:{},lave:{}}),console.log(l),l.length&&(e.$_updata=!0,e.food.schoolId=l[0].SchoolId.toString(),e.food.schoolName=l[0].SchoolName)}e.$_updata!==!1&&chrome.storage&&chrome.storage.local.set({config:e}),s.food=h(h({},s.food),e.food),s.lave=h(h({},s.lave),e.lave)}},J={namespaced:!0,mutations:Y,getters:W,state:z,actions:H};var $;(function(s){s.CONFIG="config"})($||($={}));const Q=M({modules:{[$.CONFIG]:J}}),b=Symbol("vue-store"),w=()=>A(b);const X={key:0,class:"menu"},Z={class:"cover"},ee=["src"],te={class:"info flex flex-down flex-item-center"},oe=["textContent"],se=["textContent"],ne=y({setup(s){const e=w(),t=x(()=>e.state.config.food.schoolId),c=k();V(t,()=>o()),C(()=>clearInterval(n));const o=async()=>{var l;let r=new Date;const{data:d}=await g({url:`https://fatraceschool.k12ea.gov.tw/offered/meal?SchoolId=${t.value}&period=${[r.getFullYear(),r.getMonth()+1,r.getDate()].join("-")}&KitchenId=all`,method:"GET"});let a=(l=d==null?void 0:d.data)==null?void 0:l[0];if(a){const{data:i}=await g({url:`https://fatraceschool.k12ea.gov.tw/dish?BatchDataId=${a.BatchDataId}`,method:"GET"});c.value=i==null?void 0:i.data}},n=setInterval(o,1e3*60*10);return o(),(r,d)=>c.value?(_(),m("div",X,[(_(!0),m(T,null,O(c.value,(a,l)=>(_(),m("div",{class:"dish",key:l},[u("div",Z,[u("img",{src:`https://fatraceschool.k12ea.gov.tw/dish/pic/${a.DishId}`,alt:"\u83DC\u8272\u5716\u7247"},null,8,ee)]),u("div",te,[u("span",{textContent:p(a.DishType)},null,8,oe),u("span",{textContent:p(a.DishName)},null,8,se)])]))),128))])):P("",!0)}});var ae=(s,e)=>{const t=s.__vccOpts||s;for(const[c,o]of e)t[c]=o;return t};const ce={class:"lave flex flex-item-center flex-center flex-down"},le=["textContent"],re={class:"flex"},ie=["textContent"],ue=["textContent"],de=y({setup(s){const e=w(),t=x(()=>e.state.config.lave.laveTime||0),c=x(()=>e.state.config.lave.title||"\u6703\u8003\u5269\u9918"),o=k(),n=["\u5929","\u5C0F\u6642","\u5206\u9418","\u79D2"],r=()=>{let a=new Date(+t.value||"2022-05-21T00:00:00+08:00").getTime()-new Date().getTime();o.value=[a/(1e3*60*60*24),a%(1e3*60*60*24)/(1e3*60*60),a%(1e3*60*60)/(1e3*60),a%(1e3*60)/1e3].map(i=>(~~i).toString().padStart(2,"0"));let l=o.value.map((i,f)=>[f,+i]).filter(([,i])=>i!==0)[0];document.title=`${c.value} ${l[1]||""}${n[l[0]]}`};r();const d=setInterval(r,100);return C(()=>clearInterval(d)),(a,l)=>(_(),m("div",ce,[u("div",{class:"title",textContent:p(K(c))},null,8,le),u("div",re,[(_(),m(T,null,O(n,(i,f)=>{var N;return u("div",{class:"flex",key:f},[u("span",{class:"time",textContent:p((N=o.value)==null?void 0:N[f])},null,8,ie),u("span",{textContent:p(i)},null,8,ue)])}),64))])]))}});var fe=ae(de,[["__scopeId","data-v-64601931"]]);const he={class:"wrapper"},_e=y({setup(s){const e=w();return U(()=>{if(chrome.storage&&location.href.startsWith("chrome"))chrome.storage.onChanged.addListener(async({config:t})=>{t&&await e.dispatch("config/setConfig",v(h({},t.newValue),{$_updata:!1}))}),chrome.storage.local.get(["config"],({config:t})=>{t&&e.dispatch("config/setConfig",v(h({},t),{$_updata:!1}))});else{let t=new URL(location.href).searchParams;e.dispatch("config/setConfig",{lave:{title:t.get("laveTitle"),laveTime:t.get("laveTime")},food:{schoolId:t.get("foodSchoolId"),schoolName:t.get("foodSchoolName")},$_updata:!1})}}),C(()=>{}),(t,c)=>(_(),m("div",he,[L(fe),L(ne)]))}});q(_e).use(Q,b).mount("#app");
