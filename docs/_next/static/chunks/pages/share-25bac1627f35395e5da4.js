(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3347],{12415:function(e,n,t){"use strict";t.d(n,{JV:function(){return d},Cj:function(){return g},G3:function(){return m},xe:function(){return v}});var r=t(94184),i=t.n(r),o=t(67294),a=t(29163),c=t(96486),s=t.n(c),u=t(85893),l=function(e,n){return"string"===typeof e?e:n?"".concat(s().round(e),"px"):"".concat(s().round(e,4),"rem")},f=function(e){return"number"===typeof e||e.endsWith("px")};var d=(0,a.ZP)((function(e){var n=e.className,t=e.position,r=void 0===t?"left":t,a=e.fullH,c=void 0!==a&&a,d=e.count,p=void 0===d?3:d,g=e.width,h=void 0===g?120:g,b=e.color,m=void 0===b?"#191919":b,v=e.fillColor,x=void 0===v?"#000000":v,y=e.type,w=void 0===y?2:y,_=c?p+1:p,k=f(h),j="number"===typeof h?h:s().toNumber(h.replace("px","").replace("rem","")),O=(0,o.useMemo)((function(){return j/_}),[h,_]),P=(0,o.useMemo)((function(){return(2*(_-1)+w)*O}),[_,w,O]),C=(0,o.useMemo)((function(){for(var e=[],n=0;n<_;n++){var t=0===n&&c,i=t?"100%":P-2*n*O,o=l(i,k),a=t?0:"calc(50% - ".concat(l(i/2,k),")"),s={position:"absolute",height:o,width:l(O,k),top:a,backgroundColor:m};"left"===r?s.left=l(n*O,k):"right"===r&&(s.right=l(n*O,k)),e.push({style:s})}return e}),[_,O,P,c,r,k]),N=(0,o.useMemo)((function(){for(var e=[],n=0;n<_-1;n++){var t=P-2*(n+1)*O,i=l(t,k),o="calc(50% - ".concat(l(t/2,k),")"),a={position:"absolute",height:i,width:l(O,k),top:o,zIndex:2,backgroundColor:x};"left"===r?a.left=l(n*O,k):"right"===r&&(a.right=l(n*O,k)),e.push({style:a})}return e}),[_,O,P,c,r,k]);return(0,u.jsxs)("div",{className:i()(n,"Pixel_".concat(r)),children:[C.map((function(e,n){return(0,u.jsx)("div",{style:e.style},"pixels_".concat(n))})),N.map((function(e,n){return(0,u.jsx)("div",{style:e.style},"fill_pixels_".concat(n))}))]})})).withConfig({displayName:"Pixels__Pixel",componentId:"sc-1vz4at9-0"})(["z-index:2;display:flex;height:100%;position:relative;width:",";&.Pixel_left{flex-direction:row;}&.Pixel_right{flex-direction:row-reverse;}"],(function(e){var n=e.width,t=void 0===n?120:n;return"number"===typeof t?t+"px":t})),p="#000000";var g=(0,a.ZP)((function(e){var n=e.height,t=void 0===n?60:n,r=e.className,o=e.color,a=void 0===o?"#999999":o,c=e.fillColor,g=void 0===c?p:c,h=e.content,b=e.disabled,m=e.unClick,v=e.onClick,x=f(t),y="number"===typeof t?t:s().toNumber(t.replace("px","").replace("rem","")),w=l(y/5*3,x);return(0,u.jsxs)("div",{className:i()(r,{disabled:b,unClick:m}),onClick:v,children:[(0,u.jsx)(d,{type:1,width:w,color:a,fillColor:g,position:"right"}),(0,u.jsx)("div",{className:"btn_content",children:h}),(0,u.jsx)(d,{type:1,width:w,color:a,fillColor:g,position:"left"})]})})).withConfig({displayName:"Pixels__PixelBtn",componentId:"sc-1vz4at9-1"})(["display:flex;user-select:none;align-items:center;width:min-content;height:",";cursor:pointer;&.disabled{cursor:not-allowed;opacity:0.6;}&.unClick{cursor:default;}.btn_content{height:100%;line-height:",";padding:0 20px;min-width:calc(130px + 7.14rem);font-size:1.71rem;font-family:OpenSans-SemiBold;color:white;text-align:center;background-color:",";}&:hover{}"],(function(e){var n=e.height;return l(n,f(n))}),(function(e){var n=e.height;return l(n,f(n))}),(function(e){var n=e.fillColor;return void 0===n?p:n})),h=51,b=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return Math.ceil(.725*e*n)},m=a.ZP.div.withConfig({displayName:"Pixels__PixelBtn1",componentId:"sc-1vz4at9-2"})(["color:white;font-family:'OpenSans-SemiBold';font-size:32px;line-height:","px;height:","px;text-align:center;width:357px;cursor:pointer;transition:all ease-in-out 200ms;background-image:url('/images/btn/btn_bg_l.png'),url('/images/btn/btn_bg_c.png'),url('/images/btn/btn_bg_r.png');background-position:0 0,","px 0,right center;background-repeat:no-repeat;background-attachment:scroll;background-size:","px 100%,calc(100% - ","px) 100%,","px 100%;&.dark{background-image:url('/images/btn/btn_dark_bg_l.png'),url('/images/btn/btn_dark_bg_c.png'),url('/images/btn/btn_dark_bg_r.png');}transform-origin:center top;&.style_left{transform-origin:right top;background-image:url('/images/btn/btn_bg_l.png'),url('/images/btn/btn_bg_c.png'),url('/images/btn/btn_bg_r2.png');&.dark{background-image:url('/images/btn/btn_dark_bg_l.png'),url('/images/btn/btn_dark_bg_c.png'),url('/images/btn/btn_dark_bg_r2.png');}}&.style_right{transform-origin:left top;background-image:url('/images/btn/btn_bg_l2.png'),url('/images/btn/btn_bg_c.png'),url('/images/btn/btn_bg_r.png');&.dark{background-image:url('/images/btn/btn_dark_bg_l2.png'),url('/images/btn/btn_dark_bg_c.png'),url('/images/btn/btn_dark_bg_r.png');}}@media screen and (max-width:1440px){transform:scale(0.9);}@media screen and (max-width:1296px){transform:scale(0.8);}"],(function(e){var n=e.height;return void 0===n?h:n}),(function(e){var n=e.height;return void 0===n?h:n}),(function(e){var n=e.height;return b(void 0===n?h:n)-2}),(function(e){var n=e.height;return b(void 0===n?h:n)}),(function(e){var n=e.height;return b(void 0===n?h:n,2)-4}),(function(e){var n=e.height;return b(void 0===n?h:n)})),v=a.ZP.div.attrs((function(e){return{board_size:e.board_size||12}})).withConfig({displayName:"Pixels__PixelBoard",componentId:"sc-1vz4at9-3"})(["padding:","px;background-repeat:no-repeat;background-size:calc(100% - ","px) ","px,calc(100% - ","px) ","px,","px calc(100% - ","px),","px calc(100% - ","px);background-position:","px top,","px bottom,left ","px,right ","px;background-image:linear-gradient(0deg,black,black),linear-gradient(0deg,black,black),linear-gradient(0deg,black,black),linear-gradient(0deg,black,black);"],(function(e){return e.board_size}),(function(e){return 2*e.board_size}),(function(e){return e.board_size}),(function(e){return 2*e.board_size}),(function(e){return e.board_size}),(function(e){return e.board_size}),(function(e){return 2*e.board_size}),(function(e){return e.board_size}),(function(e){return 2*e.board_size}),(function(e){return e.board_size}),(function(e){return e.board_size}),(function(e){return e.board_size}),(function(e){return e.board_size}))},54040:function(e,n,t){"use strict";t.d(n,{P:function(){return s},n:function(){return u}});var r=t(30266),i=t(809),o=t.n(i),a=function(){var e=(0,r.Z)(o().mark((function e(n){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",window.crypto.subtle.importKey("raw",n,"PBKDF2",!1,["deriveKey"]));case 1:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),c=function(){var e=(0,r.Z)(o().mark((function e(n,t,r){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",window.crypto.subtle.deriveKey(r,n,{name:"AES-GCM",length:256},!1,t));case 1:case"end":return e.stop()}}),e)})));return function(n,t,r){return e.apply(this,arguments)}}(),s=function(){var e=(0,r.Z)(o().mark((function e(n,t){var r,i,s,u,l,f,d,p,g;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,r=new Uint8Array(n),i=(new TextEncoder).encode(t),s=window.crypto.getRandomValues(new Uint8Array(16)),u=window.crypto.getRandomValues(new Uint8Array(12)),e.next=7,a(i);case 7:return l=e.sent,e.next=10,c(l,["encrypt"],{name:"PBKDF2",salt:s,iterations:25e4,hash:"SHA-256"});case 10:return f=e.sent,e.next=13,window.crypto.subtle.encrypt({name:"AES-GCM",iv:u},f,r);case 13:return d=e.sent,p=new Uint8Array(d),(g=new Uint8Array(p.byteLength+s.byteLength+u.byteLength)).set(s,0),g.set(u,s.byteLength),g.set(p,s.byteLength+u.byteLength),e.abrupt("return",g);case 22:throw e.prev=22,e.t0=e.catch(0),console.error("Error encrypting file"),console.error(e.t0),e.t0;case 27:case"end":return e.stop()}}),e,null,[[0,22]])})));return function(n,t){return e.apply(this,arguments)}}(),u=function(){var e=(0,r.Z)(o().mark((function e(n,t){var r,i,s,u,l,f,d,p;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,r=new Uint8Array(n),i=(new TextEncoder).encode(t),s=r.slice(0,16),u=r.slice(16,28),l=r.slice(28),e.next=8,a(i);case 8:return f=e.sent,e.next=11,c(f,["decrypt"],{name:"PBKDF2",salt:s,iterations:25e4,hash:"SHA-256"});case 11:return d=e.sent,e.next=14,window.crypto.subtle.decrypt({name:"AES-GCM",iv:u},d,l);case 14:return p=e.sent,e.abrupt("return",p);case 18:return e.prev=18,e.t0=e.catch(0),console.error("Error decrypting file"),console.error(e.t0),e.abrupt("return");case 23:case"end":return e.stop()}}),e,null,[[0,18]])})));return function(n,t){return e.apply(this,arguments)}}()},57288:function(e,n,t){"use strict";t.d(n,{F:function(){return i}});var r=t(67294);function i(e){var n=(0,r.useState)(e),t=n[0],i=n[1],o=(0,r.useState)({safe:!0})[0];(0,r.useEffect)((function(){return o.safe=!0,function(){o.safe=!1}}));return[t,function(e){o.safe&&i(e)}]}},56262:function(e,n,t){"use strict";t.d(n,{T:function(){return f},q:function(){return d}});var r=t(92809),i=t(67294),o=t(75282),a=t(64478),c=t(58971),s=t.n(c);function u(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?u(Object(t),!0).forEach((function(n){(0,r.Z)(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):u(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function f(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"upload:last-gateway",n=(0,a.$)(),t=n.t,r=(0,i.useMemo)((function(){return(0,o.Dl)(t).map((function(e){var n,t;return l(l({},e),{},{text:"".concat(null!==(n=e.text)&&void 0!==n?n:""," (").concat(null!==(t=e.location)&&void 0!==t?t:"",")")})}))}),[t]),c=(0,i.useMemo)((function(){var n=s().get(e);if(n){var t=r.findIndex((function(e){return e.value===n.value}));if(t>=0)return t}return 0}),[e,r]),u=(0,i.useState)(r[c]),f=u[0],d=u[1],p=(0,i.useCallback)((function(n){d((function(t){var r="function"===typeof n?n(t):n;return s().set(e,{value:r.value}),r}))}),[]),g=(0,i.useCallback)((function(e,n){var t=n.value,i=r.find((function(e){return e.value===t}));i&&p(i)}),[r,p]);return(0,i.useMemo)((function(){return{endpoints:r,endpoint:f,setEndpoint:p,onChangeEndpoint:g}}),[r,f,p,g])}function d(){var e=(0,a.$)().t,n=(0,i.useMemo)((function(){return(0,o.qi)(e).sort((function(){return Math.random()>.5?-1:1})).map((function(e){var n;return l(l({},e),{},{text:"".concat(null!==(n=e.text)&&void 0!==n?n:"Pinner")})}))}),[e]),t=(0,i.useState)(n[0]),r=t[0],c=t[1],s=(0,i.useCallback)((function(e,t){var r=t.value,i=n.find((function(e){return e.value===r}));i&&c(i)}),[n]);return(0,i.useMemo)((function(){return{pinner:r,pins:n,setPinner:c,onChangePinner:s}}),[r,n,s])}},27329:function(e,n,t){"use strict";t.r(n);var r=t(92809),i=t(80318),o=t(94184),a=t.n(o),c=t(11163),s=t(67294),u=t(29163),l=t(12415),f=t(66028),d=t(58398),p=t(52423),g=t(12752),h=t(20478),b=t(57288),m=t(59996),v=t(45129),x=t(99056),y=t(85893);function w(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}n.default=s.memo((0,u.ZP)((function(e){var n=e.className,t=(0,c.useRouter)(),o=t.query,u=t.push,_=(0,g.qD)(),k=_.alert,j=_.loading,O=(0,b.F)(),P=(0,i.Z)(O,2),C=P[0],N=P[1],z=C||{},S=z.options,E=z.cid;(0,s.useEffect)((function(){if(o.cid){var e=o.options,n=JSON.parse(e);N({options:n,cid:o.cid})}o.code&&(j.show(),(0,v.tO)(o.code).then((function(e){return N(function(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?w(Object(t),!0).forEach((function(n){(0,r.Z)(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):w(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}({},e))})).catch((function(e){return k.error((0,x.az)(e))})).then(j.hide))}),[o]),(0,s.useEffect)((function(){E&&S&&(0,m.H)({type:3,walletType:S.fromWallet,address:S.fromAccount,data:{cid:E,fileType:S.isDir?1:0,strategy:S.encrypted?1:0,shareType:1}})}),[E,S]);var D=(0,s.useMemo)((function(){if(!S||!E)return"";var e=(new Date).getTime(),n=f.N[e%3];return"".concat(n,"/ipfs/").concat(E,"?filename=").concat(S.name)}),[S,E]),A=(0,h.V)(),F=(S||{}).from;return(0,y.jsxs)("div",{className:a()(n),children:[(0,y.jsxs)("div",{className:"share--panel",children:[(0,y.jsx)("img",{className:"logo",src:"/images/logo_12x.png"}),(0,y.jsx)("div",{className:"share--flex1"}),(0,y.jsxs)("div",{className:"share-info",children:[C&&(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)("div",{className:"title",children:[F&&(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)("span",{children:F}),(0,y.jsx)("br",{})]}),"is sharing something",(0,y.jsx)("br",{}),"from Crust Files."]}),(0,y.jsx)("div",{className:"link",children:"File CID: ".concat(E)}),(0,y.jsxs)(d._t,{children:[(0,y.jsx)(l.Cj,{onClick:function(){window.open(D,"_blank")},height:"4.29rem",content:"Open File"}),(0,y.jsx)("div",{style:{width:"2.2857rem"}}),(0,y.jsx)(l.Cj,{onClick:function(){A(window.location.href)},color:"#E46A11",fillColor:"#FF8D00",height:"4.29rem",content:"Copy Link"})]})]}),(0,y.jsx)("div",{className:"go-to",onClick:function(){return u("/")},children:"Go to Crust Files"})]}),(0,y.jsx)("div",{className:"share--flex1"})]}),(0,y.jsx)("div",{className:"share--pixels",children:(0,y.jsx)(l.JV,{className:"pixel_right",position:"right",fullH:!0,color:"#E46A11",fillColor:"#FF8D00"})}),(0,y.jsxs)("div",{className:"share--activity",children:[(0,y.jsxs)("div",{className:"text",children:["Your",(0,y.jsx)("br",{}),"first personal",(0,y.jsx)("br",{}),"Web3.0 storage",(0,y.jsx)("br",{}),"in the Metaverse.",(0,y.jsx)("br",{}),(0,y.jsx)("br",{}),"now with",(0,y.jsx)("br",{}),(0,y.jsx)("span",{children:"$50,000,000"})," ",(0,y.jsx)("br",{}),"User Rewards"]}),(0,y.jsx)("div",{className:"footer",children:(0,y.jsx)(p.y,{className:"links"})})]})]})})).withConfig({displayName:"share",componentId:"sc-uk0lct-0"})(["width:100%;height:100vh;min-height:70rem;background:white;display:flex;.share--flex1{flex:1;}.share--panel{display:flex;flex-direction:column;position:relative;height:100%;flex:1;align-items:center;.logo{height:2.5rem;align-self:flex-start;margin-top:2.57rem;margin-left:3.57rem;}.share-info{width:49.07rem;padding-bottom:10rem;.title{font-size:4.29rem;line-height:5.86rem;font-family:OpenSans-SemiBold;color:black;span{color:var(--primary-color);}}.link{font-size:2rem;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:2.71rem;margin-top:1.71rem;margin-bottom:6rem;color:var(--secend-color);}.go-to{font-size:2rem;margin-top:5.4286rem;line-height:2.71rem;color:black;text-decoration:underline;cursor:pointer;}}}.share--pixels{width:12.86rem;position:relative;flex-shrink:0;.pixel_right{position:absolute;right:0;top:0;}}.share--activity{background:var(--primary-color);padding:6.14rem .71rem 4rem 1.43rem;width:35.36rem;flex-shrink:0;display:flex;flex-direction:column;.text{font-size:4.29rem;line-height:5.86rem;font-family:OpenSans-SemiBold;color:#FFE2C8;span{color:white;}}.footer{display:flex;flex-direction:column;align-items:flex-start;margin-top:2rem;}.links{margin-top:1rem;flex-shrink:0;height:2.71rem;align-items:center;}}"]))},61158:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/share",function(){return t(27329)}])},64478:function(e,n,t){"use strict";t.d(n,{$:function(){return g}});var r=t(70885),i=t(4942),o=t(67294),a=t(68718);function c(){if(console&&console.warn){for(var e,n=arguments.length,t=new Array(n),r=0;r<n;r++)t[r]=arguments[r];"string"===typeof t[0]&&(t[0]="react-i18next:: ".concat(t[0])),(e=console).warn.apply(e,t)}}var s={};function u(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];"string"===typeof n[0]&&s[n[0]]||("string"===typeof n[0]&&(s[n[0]]=new Date),c.apply(void 0,n))}function l(e,n,t){e.loadNamespaces(n,(function(){if(e.isInitialized)t();else{e.on("initialized",(function n(){setTimeout((function(){e.off("initialized",n)}),0),t()}))}}))}function f(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if(!n.languages||!n.languages.length)return u("i18n.languages were undefined or empty",n.languages),!0;var r=n.languages[0],i=!!n.options&&n.options.fallbackLng,o=n.languages[n.languages.length-1];if("cimode"===r.toLowerCase())return!0;var a=function(e,t){var r=n.services.backendConnector.state["".concat(e,"|").concat(t)];return-1===r||2===r};return!(t.bindI18n&&t.bindI18n.indexOf("languageChanging")>-1&&n.services.backendConnector.backend&&n.isLanguageChangingTo&&!a(n.isLanguageChangingTo,e))&&(!!n.hasResourceBundle(r,e)||(!n.services.backendConnector.backend||!(!a(r,e)||i&&!a(o,e))))}function d(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function p(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?d(Object(t),!0).forEach((function(n){(0,i.Z)(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):d(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function g(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},t=n.i18n,i=(0,o.useContext)(a.OO)||{},c=i.i18n,s=i.defaultNS,d=t||c||(0,a.nI)();if(d&&!d.reportNamespaces&&(d.reportNamespaces=new a.zv),!d){u("You will need to pass in an i18next instance by using initReactI18next");var g=function(e){return Array.isArray(e)?e[e.length-1]:e},h=[g,{},!1];return h.t=g,h.i18n={},h.ready=!1,h}d.options.react&&void 0!==d.options.react.wait&&u("It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.");var b=p(p(p({},(0,a.JP)()),d.options.react),n),m=b.useSuspense,v=b.keyPrefix,x=e||s||d.options&&d.options.defaultNS;x="string"===typeof x?[x]:x||["translation"],d.reportNamespaces.addUsedNamespaces&&d.reportNamespaces.addUsedNamespaces(x);var y=(d.isInitialized||d.initializedStoreOnce)&&x.every((function(e){return f(e,d,b)}));function w(){return d.getFixedT(null,"fallback"===b.nsMode?x:x[0],v)}var _=(0,o.useState)(w),k=(0,r.Z)(_,2),j=k[0],O=k[1],P=(0,o.useRef)(!0);(0,o.useEffect)((function(){var e=b.bindI18n,n=b.bindI18nStore;function t(){P.current&&O(w)}return P.current=!0,y||m||l(d,x,(function(){P.current&&O(w)})),e&&d&&d.on(e,t),n&&d&&d.store.on(n,t),function(){P.current=!1,e&&d&&e.split(" ").forEach((function(e){return d.off(e,t)})),n&&d&&n.split(" ").forEach((function(e){return d.store.off(e,t)}))}}),[d,x.join()]);var C=(0,o.useRef)(!0);(0,o.useEffect)((function(){P.current&&!C.current&&O(w),C.current=!1}),[d]);var N=[j,d,y];if(N.t=j,N.i18n=d,N.ready=y,y)return N;if(!y&&!m)return N;throw new Promise((function(e){l(d,x,(function(){e()}))}))}}},function(e){e.O(0,[8803,6771,6028,9774,2888,179],(function(){return n=61158,e(e.s=n);var n}));var n=e.O();_N_E=n}]);