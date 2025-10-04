"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[5198,5110],{58763:(e,t,r)=>{r.d(t,{A:()=>f});var n=r(98587),a=r(58168),o=r(96540),i=r(34164),s=r(64111),l=r(11848),c=r(3541),d=r(27553),u=r(17245);function h(e){return(0,u.Ay)("MuiDialogActions",e)}(0,d.A)("MuiDialogActions",["root","spacing"]);var p=r(74848);const A=["className","disableSpacing"],m=(0,l.Ay)("div",{name:"MuiDialogActions",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:r}=e;return[t.root,!r.disableSpacing&&t.spacing]}})((({ownerState:e})=>(0,a.A)({display:"flex",alignItems:"center",padding:8,justifyContent:"flex-end",flex:"0 0 auto"},!e.disableSpacing&&{"& > :not(style) ~ :not(style)":{marginLeft:8}}))),f=o.forwardRef((function(e,t){const r=(0,c.A)({props:e,name:"MuiDialogActions"}),{className:o,disableSpacing:l=!1}=r,d=(0,n.A)(r,A),u=(0,a.A)({},r,{disableSpacing:l}),f=(e=>{const{classes:t,disableSpacing:r}=e,n={root:["root",!r&&"spacing"]};return(0,s.A)(n,h,t)})(u);return(0,p.jsx)(m,(0,a.A)({className:(0,i.A)(f.root,o),ownerState:u,ref:t},d))}))},46831:(e,t,r)=>{r.d(t,{A:()=>f});var n=r(58168),a=r(98587),o=r(96540),i=r(34164),s=r(64111),l=r(14073),c=r(11848),d=r(3541),u=r(61435),h=r(28102),p=r(74848);const A=["className","id"],m=(0,c.Ay)(l.A,{name:"MuiDialogTitle",slot:"Root",overridesResolver:(e,t)=>t.root})({padding:"16px 24px",flex:"0 0 auto"}),f=o.forwardRef((function(e,t){const r=(0,d.A)({props:e,name:"MuiDialogTitle"}),{className:l,id:c}=r,f=(0,a.A)(r,A),g=r,v=(e=>{const{classes:t}=e;return(0,s.A)({root:["root"]},u.t,t)})(g),{titleId:y=c}=o.useContext(h.A);return(0,p.jsx)(m,(0,n.A)({component:"h2",className:(0,i.A)(v.root,l),ownerState:g,ref:t,variant:"h6",id:null!=c?c:y},f))}))},32325:(e,t,r)=>{r.d(t,{A:()=>Y});var n=r(98587),a=r(58168),o=r(96540),i=r(34164),s=r(17437),l=r(64111);var c=r(24279),d=r(11848),u=r(3541),h=r(27553),p=r(17245);function A(e){return(0,p.Ay)("MuiSkeleton",e)}(0,h.A)("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);var m=r(74848);const f=["animation","className","component","height","style","variant","width"];let g,v,y,b,w=e=>e;const S=(0,s.i7)(g||(g=w`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`)),x=(0,s.i7)(v||(v=w`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`)),C=(0,d.Ay)("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:r}=e;return[t.root,t[r.variant],!1!==r.animation&&t[r.animation],r.hasChildren&&t.withChildren,r.hasChildren&&!r.width&&t.fitContent,r.hasChildren&&!r.height&&t.heightAuto]}})((({theme:e,ownerState:t})=>{const r=(i=e.shape.borderRadius,String(i).match(/[\d.\-+]*\s*(.*)/)[1]||""||"px"),n=(o=e.shape.borderRadius,parseFloat(o));var o,i;return(0,a.A)({display:"block",backgroundColor:e.vars?e.vars.palette.Skeleton.bg:(0,c.X4)(e.palette.text.primary,"light"===e.palette.mode?.11:.13),height:"1.2em"},"text"===t.variant&&{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${n}${r}/${Math.round(n/.6*10)/10}${r}`,"&:empty:before":{content:'"\\00a0"'}},"circular"===t.variant&&{borderRadius:"50%"},"rounded"===t.variant&&{borderRadius:(e.vars||e).shape.borderRadius},t.hasChildren&&{"& > *":{visibility:"hidden"}},t.hasChildren&&!t.width&&{maxWidth:"fit-content"},t.hasChildren&&!t.height&&{height:"auto"})}),(({ownerState:e})=>"pulse"===e.animation&&(0,s.AH)(y||(y=w`
      animation: ${0} 2s ease-in-out 0.5s infinite;
    `),S)),(({ownerState:e,theme:t})=>"wave"===e.animation&&(0,s.AH)(b||(b=w`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 2s linear 0.5s infinite;
        background: linear-gradient(
          90deg,
          transparent,
          ${0},
          transparent
        );
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `),x,(t.vars||t).palette.action.hover))),Y=o.forwardRef((function(e,t){const r=(0,u.A)({props:e,name:"MuiSkeleton"}),{animation:o="pulse",className:s,component:c="span",height:d,style:h,variant:p="text",width:g}=r,v=(0,n.A)(r,f),y=(0,a.A)({},r,{animation:o,component:c,variant:p,hasChildren:Boolean(v.children)}),b=(e=>{const{classes:t,variant:r,animation:n,hasChildren:a,width:o,height:i}=e,s={root:["root",r,n,a&&"withChildren",a&&!o&&"fitContent",a&&!i&&"heightAuto"]};return(0,l.A)(s,A,t)})(y);return(0,m.jsx)(C,(0,a.A)({as:c,ref:t,className:(0,i.A)(b.root,s),ownerState:y},v,{style:(0,a.A)({width:g,height:d},h)}))}))},33198:(e,t,r)=>{r.d(t,{A:()=>f});var n=r(58168),a=r(98587),o=r(96540),i=r(34164),s=r(64111),l=r(3541),c=r(11848),d=r(27553),u=r(17245);function h(e){return(0,u.Ay)("MuiTableContainer",e)}(0,d.A)("MuiTableContainer",["root"]);var p=r(74848);const A=["className","component"],m=(0,c.Ay)("div",{name:"MuiTableContainer",slot:"Root",overridesResolver:(e,t)=>t.root})({width:"100%",overflowX:"auto"}),f=o.forwardRef((function(e,t){const r=(0,l.A)({props:e,name:"MuiTableContainer"}),{className:o,component:c="div"}=r,d=(0,a.A)(r,A),u=(0,n.A)({},r,{component:c}),f=(e=>{const{classes:t}=e;return(0,s.A)({root:["root"]},h,t)})(u);return(0,p.jsx)(m,(0,n.A)({ref:t,as:c,className:(0,i.A)(f.root,o),ownerState:u},d))}))},24279:(e,t,r)=>{r.d(t,{X4:()=>i});var n=r(35697),a=r(76937);function o(e){if(e.type)return e;if("#"===e.charAt(0))return o(function(e){e=e.slice(1);const t=new RegExp(`.{1,${e.length>=6?2:1}}`,"g");let r=e.match(t);return r&&1===r[0].length&&(r=r.map((e=>e+e))),r?`rgb${4===r.length?"a":""}(${r.map(((e,t)=>t<3?parseInt(e,16):Math.round(parseInt(e,16)/255*1e3)/1e3)).join(", ")})`:""}(e));const t=e.indexOf("("),r=e.substring(0,t);if(-1===["rgb","rgba","hsl","hsla","color"].indexOf(r))throw new Error((0,n.A)(9,e));let a,i=e.substring(t+1,e.length-1);if("color"===r){if(i=i.split(" "),a=i.shift(),4===i.length&&"/"===i[3].charAt(0)&&(i[3]=i[3].slice(1)),-1===["srgb","display-p3","a98-rgb","prophoto-rgb","rec-2020"].indexOf(a))throw new Error((0,n.A)(10,a))}else i=i.split(",");return i=i.map((e=>parseFloat(e))),{type:r,values:i,colorSpace:a}}function i(e,t){return e=o(e),t=function(e,t=0,r=1){return(0,a.A)(e,t,r)}(t),"rgb"!==e.type&&"hsl"!==e.type||(e.type+="a"),"color"===e.type?e.values[3]=`/${t}`:e.values[3]=t,function(e){const{type:t,colorSpace:r}=e;let{values:n}=e;return-1!==t.indexOf("rgb")?n=n.map(((e,t)=>t<3?parseInt(e,10):e)):-1!==t.indexOf("hsl")&&(n[1]=`${n[1]}%`,n[2]=`${n[2]}%`),n=-1!==t.indexOf("color")?`${r} ${n.join(" ")}`:`${n.join(", ")}`,`${t}(${n})`}(e)}},65110:(e,t,r)=>{r.r(t),r.d(t,{getMeasurementSuffix:()=>i,measurementNumericFormatProps:()=>s,useProducts:()=>o}),r(16280);var n=r(72635),a=r(65300);function o(){const{products:e}=(0,a.S8)().props;if(!e)throw new Error("For some reason, the products page props are not available.");return e}function i(e,t){if(0===t)return"";switch(e){case"unit":return t>1?n.Ay.t("Units"):n.Ay.t("Unit");case"liter":return t>1?"Lts":"Lt";case"weight":return"Kg"}}function s(e,t){const r="unit"===e?{allowNegative:!1,decimalScale:0}:{thousandSeparator:!1};return r.suffix=e&&` ${i(e,t)}`,r}},75198:(e,t,r)=>{r.r(t),r.d(t,{default:()=>b});var n=r(77037),a=r(58763),o=r(86990),i=r(22477),s=r(33198),l=r(64137),c=r(43884),d=r(96627),u=r(86798),h=r(14774),p=r(46831),A=r(15327),m=r(32389),f=r(44675),g=r(32393),v=r(65110),y=r(2445);function b({sale_items:e,onClose:t=(()=>{})}){const{t:r}=(0,m.Bd)(),b=(0,f.A)(),w=(0,A.A)(b.breakpoints.down("md"));return(0,y.FD)(n.A,{open:Boolean(e),fullScreen:w,maxWidth:"md",fullWidth:!0,onClose:t,keepMounted:!0,children:[(0,y.Y)(p.A,{children:r("Purchase")}),(0,y.Y)(i.A,{children:(0,y.Y)(s.A,{children:(0,y.FD)(l.A,{children:[(0,y.Y)(d.A,{children:(0,y.FD)(u.A,{children:[(0,y.Y)(h.A,{children:r("Barcode")}),(0,y.Y)(h.A,{children:r("Name")}),(0,y.Y)(h.A,{children:r("Brand")}),(0,y.Y)(h.A,{children:r("Category")}),(0,y.Y)(h.A,{children:r("Sale price")}),(0,y.Y)(h.A,{children:r("Qty")})]})}),(0,y.Y)(c.A,{children:null==e?void 0:e.map((e=>(0,y.FD)(u.A,{children:[(0,y.Y)(h.A,{children:e.product.barcode}),(0,y.Y)(h.A,{children:e.product.name}),(0,y.Y)(h.A,{children:e.product.brand.brand_label}),(0,y.Y)(h.A,{children:e.product.category.category_label}),(0,y.Y)(h.A,{children:(0,y.Y)(g.A,{value:e.unit_price})}),(0,y.Y)(h.A,{children:`${e.quantity} ${(0,v.getMeasurementSuffix)(e.product.measurement,e.quantity)}`})]},`items-dialog-item-${e.id}`)))})]})})}),(0,y.Y)(a.A,{children:(0,y.Y)(o.A,{variant:"text",color:"primary",onClick:t,children:r("Ok")})})]})}},32393:(e,t,r)=>{r.d(t,{A:()=>l});var n=r(14073),a=r(90644),o=r(9972),i=r(42119),s=r(2445);function l({value:e}){const t=(0,o.G)((e=>e.currencies.dolar));return(0,s.FD)(c,{children:[(0,s.Y)(d,{color:"CaptionText",children:e.toLocaleString("en-US",{style:"currency",currency:"USD"})}),(0,s.Y)(i.A,{children:(0,s.Y)(d,{variant:"overline",color:"GrayText",children:(e*t).toLocaleString("es-VE",{style:"currency",currency:"VES"})})})]})}const c=(0,a.A)("div",{target:"e140ssns1"})({name:"1fttcpj",styles:"display:flex;flex-direction:column"}),d=(0,a.A)(n.A,{target:"e140ssns0"})({name:"1rey5vk",styles:"text-wrap:nowrap"})},42119:(e,t,r)=>{r.d(t,{A:()=>i});var n=r(32325),a=r(9972),o=r(2445);function i({children:e,...t}){return"ok"===(0,a.G)((e=>e.app.sync))?e:(0,o.Y)(n.A,{...t,children:e})}},9972:(e,t,r)=>{r.d(t,{G:()=>o,j:()=>a});var n=r(71468);function a(){return(0,n.wA)()}const o=n.d4}}]);