(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[347],{12415:function(e,n,t){"use strict";t.d(n,{JV:function(){return g},Cj:function(){return p},G3:function(){return b},xe:function(){return x}});var r=t(94184),i=t.n(r),o=t(67294),a=t(29163),s=t(96486),l=t.n(s),c=t(85893),u=function(e,n){return"string"===typeof e?e:n?"".concat(l().round(e),"px"):"".concat(l().round(e,4),"rem")},d=function(e){return"number"===typeof e||e.endsWith("px")};var g=(0,a.ZP)((function(e){var n=e.className,t=e.position,r=void 0===t?"left":t,a=e.fullH,s=void 0!==a&&a,g=e.count,f=void 0===g?3:g,p=e.width,h=void 0===p?120:p,m=e.color,b=void 0===m?"#191919":m,x=e.fillColor,_=void 0===x?"#000000":x,v=e.type,k=void 0===v?2:v,y=s?f+1:f,w=d(h),j="number"===typeof h?h:l().toNumber(h.replace("px","").replace("rem","")),N=(0,o.useMemo)((function(){return j/y}),[h,y]),C=(0,o.useMemo)((function(){return(2*(y-1)+k)*N}),[y,k,N]),z=(0,o.useMemo)((function(){for(var e=[],n=0;n<y;n++){var t=0===n&&s,i=t?"100%":C-2*n*N,o=u(i,w),a=t?0:"calc(50% - ".concat(u(i/2,w),")"),l={position:"absolute",height:o,width:u(N,w),top:a,backgroundColor:b};"left"===r?l.left=u(n*N,w):"right"===r&&(l.right=u(n*N,w)),e.push({style:l})}return e}),[y,N,C,s,r,w]),O=(0,o.useMemo)((function(){for(var e=[],n=0;n<y-1;n++){var t=C-2*(n+1)*N,i=u(t,w),o="calc(50% - ".concat(u(t/2,w),")"),a={position:"absolute",height:i,width:u(N,w),top:o,zIndex:2,backgroundColor:_};"left"===r?a.left=u(n*N,w):"right"===r&&(a.right=u(n*N,w)),e.push({style:a})}return e}),[y,N,C,s,r,w]);return(0,c.jsxs)("div",{className:i()(n,"Pixel_".concat(r)),children:[z.map((function(e,n){return(0,c.jsx)("div",{style:e.style},"pixels_".concat(n))})),O.map((function(e,n){return(0,c.jsx)("div",{style:e.style},"fill_pixels_".concat(n))}))]})})).withConfig({displayName:"Pixels__Pixel",componentId:"sc-1vz4at9-0"})(["z-index:2;display:flex;height:100%;position:relative;width:",";&.Pixel_left{flex-direction:row;}&.Pixel_right{flex-direction:row-reverse;}"],(function(e){var n=e.width,t=void 0===n?120:n;return"number"===typeof t?t+"px":t})),f="#000000";var p=(0,a.ZP)((function(e){var n=e.height,t=void 0===n?60:n,r=e.className,o=e.color,a=void 0===o?"#999999":o,s=e.fillColor,p=void 0===s?f:s,h=e.content,m=e.disabled,b=e.unClick,x=e.onClick,_=d(t),v="number"===typeof t?t:l().toNumber(t.replace("px","").replace("rem","")),k=u(v/5*3,_);return(0,c.jsxs)("div",{className:i()(r,{disabled:m,unClick:b}),onClick:x,children:[(0,c.jsx)(g,{type:1,width:k,color:a,fillColor:p,position:"right"}),(0,c.jsx)("div",{className:"btn_content",children:h}),(0,c.jsx)(g,{type:1,width:k,color:a,fillColor:p,position:"left"})]})})).withConfig({displayName:"Pixels__PixelBtn",componentId:"sc-1vz4at9-1"})(["display:flex;user-select:none;align-items:center;width:min-content;height:",";cursor:pointer;&.disabled{cursor:not-allowed;opacity:0.6;}&.unClick{cursor:default;}.btn_content{height:100%;line-height:",";padding:0 20px;min-width:calc(130px + 7.14rem);font-size:1.71rem;font-family:OpenSans-SemiBold;color:white;text-align:center;background-color:",";}&:hover{}"],(function(e){var n=e.height;return u(n,d(n))}),(function(e){var n=e.height;return u(n,d(n))}),(function(e){var n=e.fillColor;return void 0===n?f:n})),h=51,m=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return Math.ceil(.725*e*n)},b=a.ZP.div.withConfig({displayName:"Pixels__PixelBtn1",componentId:"sc-1vz4at9-2"})(["color:white;font-family:'OpenSans-SemiBold';font-size:32px;line-height:","px;height:","px;text-align:center;width:357px;cursor:pointer;transition:all ease-in-out 200ms;background-image:url('/images/btn/btn_bg_l.png'),url('/images/btn/btn_bg_c.png'),url('/images/btn/btn_bg_r.png');background-position:0 0,","px 0,right center;background-repeat:no-repeat;background-attachment:scroll;background-size:","px 100%,calc(100% - ","px) 100%,","px 100%;&.dark{background-image:url('/images/btn/btn_dark_bg_l.png'),url('/images/btn/btn_dark_bg_c.png'),url('/images/btn/btn_dark_bg_r.png');}transform-origin:center top;&.style_left{transform-origin:right top;background-image:url('/images/btn/btn_bg_l.png'),url('/images/btn/btn_bg_c.png'),url('/images/btn/btn_bg_r2.png');&.dark{background-image:url('/images/btn/btn_dark_bg_l.png'),url('/images/btn/btn_dark_bg_c.png'),url('/images/btn/btn_dark_bg_r2.png');}}&.style_right{transform-origin:left top;background-image:url('/images/btn/btn_bg_l2.png'),url('/images/btn/btn_bg_c.png'),url('/images/btn/btn_bg_r.png');&.dark{background-image:url('/images/btn/btn_dark_bg_l2.png'),url('/images/btn/btn_dark_bg_c.png'),url('/images/btn/btn_dark_bg_r.png');}}@media screen and (max-width:1440px){transform:scale(0.9);}@media screen and (max-width:1296px){transform:scale(0.8);}"],(function(e){var n=e.height;return void 0===n?h:n}),(function(e){var n=e.height;return void 0===n?h:n}),(function(e){var n=e.height;return m(void 0===n?h:n)-2}),(function(e){var n=e.height;return m(void 0===n?h:n)}),(function(e){var n=e.height;return m(void 0===n?h:n,2)-4}),(function(e){var n=e.height;return m(void 0===n?h:n)})),x=a.ZP.div.attrs((function(e){return{board_size:e.board_size||12}})).withConfig({displayName:"Pixels__PixelBoard",componentId:"sc-1vz4at9-3"})(["padding:","px;background-repeat:no-repeat;background-size:calc(100% - ","px) ","px,calc(100% - ","px) ","px,","px calc(100% - ","px),","px calc(100% - ","px);background-position:","px top,","px bottom,left ","px,right ","px;background-image:linear-gradient(0deg,black,black),linear-gradient(0deg,black,black),linear-gradient(0deg,black,black),linear-gradient(0deg,black,black);"],(function(e){return e.board_size}),(function(e){return 2*e.board_size}),(function(e){return e.board_size}),(function(e){return 2*e.board_size}),(function(e){return e.board_size}),(function(e){return e.board_size}),(function(e){return 2*e.board_size}),(function(e){return e.board_size}),(function(e){return 2*e.board_size}),(function(e){return e.board_size}),(function(e){return e.board_size}),(function(e){return e.board_size}),(function(e){return e.board_size}))},57288:function(e,n,t){"use strict";t.d(n,{F:function(){return i}});var r=t(67294);function i(e){var n=(0,r.useState)(e),t=n[0],i=n[1],o=(0,r.useState)({safe:!0})[0];(0,r.useEffect)((function(){return o.safe=!0,function(){o.safe=!1}}));return[t,function(e){o.safe&&i(e)}]}},27329:function(e,n,t){"use strict";t.r(n);var r=t(92809),i=t(80318),o=t(94184),a=t.n(o),s=t(11163),l=t(67294),c=t(29163),u=t(12415),d=t(58398),g=t(52423),f=t(12752),p=t(20478),h=t(57288),m=t(59996),b=t(45129),x=t(99056),_=t(85893);function v(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}n.default=l.memo((0,c.ZP)((function(e){var n=e.className,t=(0,s.useRouter)(),o=t.query,c=t.push,k=(0,f.qD)(),y=k.alert,w=k.loading,j=(0,h.F)(),N=(0,i.Z)(j,2),C=N[0],z=N[1],O=C||{},P=O.options,F=O.cid;(0,l.useEffect)((function(){if(o.cid){var e=o.options,n=JSON.parse(e);z({options:n,cid:o.cid})}o.code&&(w.show(),(0,b.tO)(o.code).then((function(e){return z(function(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?v(Object(t),!0).forEach((function(n){(0,r.Z)(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):v(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}({},e))})).catch((function(e){return y.error((0,x.az)(e))})).then(w.hide))}),[o]),(0,l.useEffect)((function(){F&&P&&(0,m.H)({type:3,walletType:P.fromWallet,address:P.fromAccount,data:{cid:F,fileType:P.isDir?1:0,strategy:P.encrypted?1:0,shareType:1}})}),[F,P]);var E=(0,l.useMemo)((function(){if(!P||!F)return"";var e=P.gateway||"https://gw.crustapps.net";return"".concat(e,"/ipfs/").concat(F,"?filename=").concat(P.name)}),[P,F]),S=(0,p.V)(),D=(P||{}).from;return(0,_.jsxs)("div",{className:a()(n),children:[(0,_.jsxs)("div",{className:"share--panel",children:[(0,_.jsx)("img",{className:"logo",src:"/images/logo_12x.png"}),(0,_.jsx)("div",{className:"share--flex1"}),(0,_.jsxs)("div",{className:"share-info",children:[C&&(0,_.jsxs)(_.Fragment,{children:[(0,_.jsxs)("div",{className:"title",children:[D&&(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)("span",{children:D}),(0,_.jsx)("br",{})]}),"is sharing something",(0,_.jsx)("br",{}),"from Crust Files."]}),(0,_.jsx)("div",{className:"link",children:"File CID: ".concat(F)}),(0,_.jsxs)(d._t,{children:[(0,_.jsx)(u.Cj,{onClick:function(){window.open(E,"_blank")},height:"4.29rem",content:"Open File"}),(0,_.jsx)("div",{style:{width:"2.2857rem"}}),(0,_.jsx)(u.Cj,{onClick:function(){S(window.location.href)},color:"#E46A11",fillColor:"#FF8D00",height:"4.29rem",content:"Copy Link"})]})]}),(0,_.jsx)("div",{className:"go-to",onClick:function(){return c("/")},children:"Go to Crust Files"})]}),(0,_.jsx)("div",{className:"share--flex1"})]}),(0,_.jsx)("div",{className:"share--pixels",children:(0,_.jsx)(u.JV,{className:"pixel_right",position:"right",fullH:!0,color:"#E46A11",fillColor:"#FF8D00"})}),(0,_.jsxs)("div",{className:"share--activity",children:[(0,_.jsxs)("div",{className:"text",children:["Your",(0,_.jsx)("br",{}),"first personal",(0,_.jsx)("br",{}),"Web3.0 storage",(0,_.jsx)("br",{}),"in the Metaverse.",(0,_.jsx)("br",{}),(0,_.jsx)("br",{}),"now with",(0,_.jsx)("br",{}),(0,_.jsx)("span",{children:"$50,000,000"})," ",(0,_.jsx)("br",{}),"User Rewards"]}),(0,_.jsx)("div",{className:"footer",children:(0,_.jsx)(g.y,{className:"links"})})]})]})})).withConfig({displayName:"share",componentId:"sc-uk0lct-0"})(["width:100%;height:100vh;min-height:70rem;background:white;display:flex;.share--flex1{flex:1;}.share--panel{display:flex;flex-direction:column;position:relative;height:100%;flex:1;align-items:center;.logo{height:2.5rem;align-self:flex-start;margin-top:2.57rem;margin-left:3.57rem;}.share-info{width:49.07rem;padding-bottom:10rem;.title{font-size:4.29rem;line-height:5.86rem;font-family:OpenSans-SemiBold;color:black;span{color:var(--primary-color);}}.link{font-size:2rem;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:2.71rem;margin-top:1.71rem;margin-bottom:6rem;color:var(--secend-color);}.go-to{font-size:2rem;margin-top:5.4286rem;line-height:2.71rem;color:black;text-decoration:underline;cursor:pointer;}}}.share--pixels{width:12.86rem;position:relative;flex-shrink:0;.pixel_right{position:absolute;right:0;top:0;}}.share--activity{background:var(--primary-color);padding:6.14rem .71rem 4rem 1.43rem;width:35.36rem;flex-shrink:0;display:flex;flex-direction:column;.text{font-size:4.29rem;line-height:5.86rem;font-family:OpenSans-SemiBold;color:#FFE2C8;span{color:white;}}.footer{display:flex;flex-direction:column;align-items:flex-start;margin-top:2rem;}.links{margin-top:1rem;flex-shrink:0;height:2.71rem;align-items:center;}}"]))},61158:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/share",function(){return t(27329)}])}},function(e){e.O(0,[774,888,179],(function(){return n=61158,e(e.s=n);var n}));var n=e.O();_N_E=n}]);