var Z=Object.defineProperty,ee=Object.defineProperties;var te=Object.getOwnPropertyDescriptors;var P=Object.getOwnPropertySymbols;var oe=Object.prototype.hasOwnProperty,se=Object.prototype.propertyIsEnumerable;var q=(t,e,o)=>e in t?Z(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,p=(t,e)=>{for(var o in e||(e={}))oe.call(e,o)&&q(t,o,e[o]);if(P)for(var o of P(e))se.call(e,o)&&q(t,o,e[o]);return t},N=(t,e)=>ee(t,te(e));import{a as D,c as le,u as ne,d as T,b as k,r as w,w as x,o as F,e as b,f as _,g as m,h as z,i as ce,T as ae,j as n,k as E,l as y,v as O,F as V,m as A,t as $,p as J,n as R,q as S,s as W,x as j,y as ie,z as de}from"./vendor.d81721fa.js";const ue=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const c of s)if(c.type==="childList")for(const h of c.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&i(h)}).observe(document,{childList:!0,subtree:!0});function o(s){const c={};return s.integrity&&(c.integrity=s.integrity),s.referrerpolicy&&(c.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?c.credentials="include":s.crossorigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function i(s){if(s.ep)return;s.ep=!0;const c=o(s);fetch(s.href,c)}};ue();const re={};var G;(function(t){t.editConfig="editConfig"})(G||(G={}));const fe={[G.editConfig](t,e){t.food=p(p({},e==null?void 0:e.food),t.food),t.lave=p(p({},e==null?void 0:e.lave),t.lave)}},he={lave:{},food:{}};var H;(function(t){t.setConfig="setConfig"})(H||(H={}));const ve={[H.setConfig]:async({state:t},e)=>{var o,i,s,c,h,r;if(e=Object.fromEntries(Object.entries(e).map(([v,l])=>[v,Object.fromEntries(Object.entries(l).map(([d,f])=>[d,f===null?void 0:f]))])),((o=e.food)==null?void 0:o.schoolName)!==((i=t.food)==null?void 0:i.schoolName)&&((s=e.food)==null?void 0:s.schoolName)||((c=e.food)==null?void 0:c.schoolId)!==((h=t.food)==null?void 0:h.schoolId)&&((r=e.food)==null?void 0:r.schoolId)){const{data:v}=await D({url:`https://fatraceschool.k12ea.gov.tw/school?SchoolName=${e.food.schoolName}`,method:"GET"});let{data:l}=v;e||(e={food:{},lave:{}}),console.log(l),l.length&&(e.$_updata=!0,e.food.schoolId=l[0].SchoolId.toString(),e.food.schoolName=l[0].SchoolName)}e.$_updata!==!1&&((chrome==null?void 0:chrome.storage)?chrome.storage.local.set({config:e}):localStorage.setItem("config",JSON.stringify(e))),t.food=p(p({},t.food),e.food),t.lave=p(p({},t.lave),e.lave)}},pe={namespaced:!0,mutations:fe,getters:re,state:he,actions:ve};var U;(function(t){t.CONFIG="config"})(U||(U={}));const _e=le({modules:{[U.CONFIG]:pe}}),Y=Symbol("vue-store"),L=()=>ne(Y);var K=(t,e)=>{const o=t.__vccOpts||t;for(const[i,s]of e)o[i]=s;return o};const M=t=>(J("data-v-35beb1d5"),t=t(),R(),t),me={key:0,class:"menu"},ge={class:"content"},Ce={class:"cover"},we=["src"],xe={class:"flex flex-down flex-item-center"},ye=["textContent"],$e=["textContent"],Se={key:0,xmlns:"http://www.w3.org/2000/svg",height:"24px",viewBox:"0 0 24 24",width:"24px",fill:"#fff"},Ie=M(()=>n("path",{d:"M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z",fill:"none"},null,-1)),Ne=M(()=>n("path",{d:"M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z"},null,-1)),ke=[Ie,Ne],De={key:1,xmlns:"http://www.w3.org/2000/svg",height:"24px",viewBox:"0 0 24 24",width:"24px",fill:"#fff"},Te=M(()=>n("path",{d:"M0 0h24v24H0V0z",fill:"none"},null,-1)),be=M(()=>n("path",{d:"M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"},null,-1)),ze=[Te,be],Le=T({setup(t){const e=L(),o=k(()=>e.state.config.food.schoolId),i=k(()=>e.state.config.food.open),s=w(),c=w(!1);x(o,()=>h()),x(i,()=>c.value=!!i.value),F(()=>{x(c,()=>{e.dispatch("config/setConfig",{food:{open:c.value}})})}),b(()=>clearInterval(r));const h=async()=>{var f;let v=new Date;const{data:l}=await D({url:`https://fatraceschool.k12ea.gov.tw/offered/meal?SchoolId=${o.value}&period=${[v.getFullYear(),v.getMonth()+1,v.getDate()].join("-")}&KitchenId=all`,method:"GET"});let d=(f=l==null?void 0:l.data)==null?void 0:f[0];if(d){const{data:g}=await D({url:`https://fatraceschool.k12ea.gov.tw/dish?BatchDataId=${d.BatchDataId}`,method:"GET"});s.value=g==null?void 0:g.data}},r=setInterval(h,1e3*60*10);return h(),(v,l)=>s.value?(_(),m("div",me,[z(ae,{name:"content"},{default:ce(()=>[y(n("div",ge,[(_(!0),m(V,null,A(s.value,(d,f)=>(_(),m("div",{class:"dish",key:f},[n("div",Ce,[n("img",{src:`https://fatraceschool.k12ea.gov.tw/dish/pic/${d.DishId}`,alt:"\u83DC\u8272\u5716\u7247"},null,8,we)]),n("div",xe,[n("span",{textContent:$(d.DishType)},null,8,ye),n("span",{textContent:$(d.DishName)},null,8,$e)])]))),128))],512),[[O,c.value]])]),_:1}),n("div",{class:"type",onClick:l[0]||(l[0]=d=>c.value=!c.value)},[c.value?(_(),m("svg",Se,ke)):(_(),m("svg",De,ze))])])):E("",!0)}});var Me=K(Le,[["__scopeId","data-v-35beb1d5"]]);const Be={class:"lave flex flex-item-center flex-center flex-down"},Fe=["textContent"],Ee={class:"flex"},Oe=["textContent"],Ve=["textContent"],Ae=T({setup(t){const e=L(),o=k(()=>e.state.config.lave.laveTime);x(o,l=>l&&(s.value=l));const i=k(()=>e.state.config.lave.title||"\u6703\u8003\u5269\u9918"),s=w("2022-05-21T00:00:00+08:00"),c=w(),h=["\u5929","\u5C0F\u6642","\u5206\u9418","\u79D2"],r=()=>{let l=new Date(s.value).getTime()-new Date().getTime();c.value=[l/(1e3*60*60*24),l%(1e3*60*60*24)/(1e3*60*60),l%(1e3*60*60)/(1e3*60),l%(1e3*60)/1e3].map(f=>(~~f).toString().padStart(2,"0"));let d=c.value.map((f,g)=>[g,+f]).filter(([,f])=>f!==0)[0];document.title=`${i.value} ${d[1]||""}${h[d[0]]}`};r();const v=setInterval(r,100);return b(()=>clearInterval(v)),(l,d)=>(_(),m("div",Be,[n("div",{class:"title",textContent:$(S(i))},null,8,Fe),n("div",Ee,[(_(),m(V,null,A(h,(f,g)=>{var I;return n("div",{class:"flex",key:g},[n("span",{class:"time",textContent:$((I=c.value)==null?void 0:I[g])},null,8,Oe),n("span",{textContent:$(f)},null,8,Ve)])}),64))])]))}});var je=K(Ae,[["__scopeId","data-v-caab62ca"]]);const B=t=>(J("data-v-8bbdf408"),t=t(),R(),t),Ge={key:0,class:"config"},He={key:0,class:"content"},Ue={class:"input"},Ke=B(()=>n("label",{for:"setTitle"},"\u5012\u8A08\u6642\u6A19\u984C:",-1)),Pe={class:"input"},qe=B(()=>n("label",{for:"setDate"},"\u8A2D\u5B9A\u5230\u671F\u6642\u9593:",-1)),Je=B(()=>n("label",{for:"schoolName"},"\u8ACB\u8F38\u5165\u5B78\u6821\u540D:(\u53EF\u9078)",-1)),Re={class:"schools"},We=["textContent","data-school-id","data-school-code","data-school-name"],Ye=B(()=>n("svg",{xmlns:"http://www.w3.org/2000/svg",height:"24px",viewBox:"0 0 24 24",width:"24px",fill:"#fff"},[n("path",{d:"M0 0h24v24H0V0z",fill:"none"}),n("path",{d:"M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"})],-1)),Qe=[Ye],Xe=T({setup(t){const e=L(),o=w(!1),i=w(""),s=w(),c=!!(chrome==null?void 0:chrome.storage),h=k(()=>e.state.config);let r=W({lave:{},food:{}}),v=W({data:[],result:1});x(h,()=>r=h.value),x(r,()=>e.dispatch("config/setConfig",N(p({},r),{$_updata:!0}))),F(()=>{D({method:"GET",url:"https://fatraceschool.k12ea.gov.tw/school"}).then(({data:C})=>v.data=C.data).catch()});let l;const d=w(),f=C=>{l==null||l.classList.remove("highlighted"),l=C.target,l==null||l.classList.add("highlighted")},g=C=>{var u;const a=(u=C.target)==null?void 0:u.dataset;!a||(r.food.schoolId=a.schoolId,r.food.schoolName=a.schoolName,i.value=a.schoolName)},I=C=>{var a;C.target&&C.target!=s.value&&!((a=s.value)==null?void 0:a.contains(C.target))&&(d.value=!1)};return addEventListener("click",I),b(()=>removeEventListener("click",I)),(C,a)=>c?E("",!0):(_(),m("div",Ge,[o.value?(_(),m("div",He,[n("div",Ue,[Ke,y(n("input",{autocomplete:"off",type:"text",placeholder:"\u6703\u8003\u5269\u9918","onUpdate:modelValue":a[0]||(a[0]=u=>S(r).lave.title=u),id:"setTitle"},null,512),[[j,S(r).lave.title]])]),n("div",Pe,[qe,y(n("input",{autocomplete:"off",type:"datetime-local","onUpdate:modelValue":a[1]||(a[1]=u=>S(r).lave.laveTime=u),id:"setDate"},null,512),[[j,S(r).lave.laveTime]])]),n("div",{class:"input setSchool",onBlur:a[6]||(a[6]=u=>d.value=!1)},[Je,y(n("input",{ref_key:"schoolConfigEl",ref:s,autocapitalize:"off",autocomplete:"off",spellcheck:"false",type:"search",placeholder:"\u8ACB\u8F38\u5165\u5B78\u6821\u540D / id / code","onUpdate:modelValue":a[2]||(a[2]=u=>i.value=u),id:"schoolName",onKeydown:a[3]||(a[3]=ie(u=>d.value=!1,["esc"])),onFocus:a[4]||(a[4]=u=>d.value=!0)},null,544),[[j,i.value]]),y(n("ul",Re,[(_(!0),m(V,null,A(S(v).data,(u,Q)=>y((_(),m("li",{textContent:$(u.SchoolName),key:Q,"data-school-id":u.SchoolId,"data-school-code":u.SchoolCode,"data-school-name":u.SchoolName,onMouseover:f,onClick:a[5]||(a[5]=X=>[g(X),d.value=!d.value])},null,40,We)),[[O,`${u.SchoolName},${u.SchoolCode},${u.SchoolId}`.includes(i.value)]])),128))],512),[[O,d.value]])],32)])):E("",!0),n("div",{class:"icon",onClick:a[7]||(a[7]=u=>o.value=!o.value)},Qe)]))}});var Ze=K(Xe,[["__scopeId","data-v-8bbdf408"]]);const et={class:"wrapper"},tt=T({setup(t){const e=L();return F(()=>{if((chrome==null?void 0:chrome.storage)&&location.href.startsWith("chrome"))chrome.storage.onChanged.addListener(async({config:o})=>{o&&await e.dispatch("config/setConfig",N(p({},o.newValue),{$_updata:!1}))}),chrome.storage.local.get("config",({config:o})=>{o&&e.dispatch("config/setConfig",N(p({},o),{$_updata:!1}))});else{let o=new URL(location.href).searchParams;Object.keys(o).filter(i=>["endTitle","endTime","foodSchoolId","foodSchoolName"].includes(i))?e.dispatch("config/setConfig",N(p({},JSON.parse(localStorage.getItem("config")||"{}")),{$_updata:!1})):e.dispatch("config/setConfig",{lave:{title:o.get("endTitle"),laveTime:o.get("endTime")},food:{schoolId:o.get("foodSchoolId"),schoolName:o.get("foodSchoolName")},$_updata:!1})}}),b(()=>{}),(o,i)=>(_(),m("div",et,[z(je),z(Me),z(Ze)]))}});de(tt).use(_e,Y).mount("#app");