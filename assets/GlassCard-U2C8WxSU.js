import{r,j as l}from"./index-BnDo3VLt.js";function x({children:o,className:c="",glow:s=!1,premium:a=!1,onClick:i}){const e=r.useRef(null),d=r.useCallback(n=>{if(!e.current)return;const t=e.current.getBoundingClientRect(),g=(n.clientX-t.left)/t.width-.5,f=(n.clientY-t.top)/t.height-.5;e.current.style.transform=`perspective(800px) rotateX(${-f*3}deg) rotateY(${g*3}deg) scale(1.01)`},[]),u=r.useCallback(()=>{e.current&&(e.current.style.transform="perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)")},[]),p=a?"glass-card-premium":s?"glass-card-glow":"glass-card";return l.jsxs("div",{ref:e,onClick:i,onMouseMove:d,onMouseLeave:u,className:`
        relative rounded-3xl p-6 md:p-8 transition-all duration-500 ease-premium
        ${p}
        ${c}
      `,style:{willChange:"transform"},children:[(s||a)&&l.jsx("div",{className:"absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_50%_0%,rgba(255,110,180,0.06),transparent_60%)] pointer-events-none"}),o]})}export{x as G};
