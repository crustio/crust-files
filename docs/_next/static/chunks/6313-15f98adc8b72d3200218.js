(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6313],{48964:function(e,t,r){"use strict";r.d(t,{b:function(){return E}});var n=r(92809),o=r(30266),a=r(80318),s=r(809),i=r.n(s),c=r(22751),l=r(67294),u=r(29163),p=r(12752),d=r(75282),m=r(34111),f=r(13711),h=r(57288),g=r(45129),x=r(99056),b=r(93664),v=r(60954),y=r(8670),w=r(31772),j=r(85893);function k(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function C(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?k(Object(r),!0).forEach((function(t){(0,n.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):k(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var O=(0,u.ZP)(w.Z).withConfig({displayName:"BindAirdrop__BindTypeDropdown",componentId:"sc-1fcwrum-0"})(["&.mdropdown{display:inline-block;vertical-align:top;width:130px !important;border-radius:8px !important;border:1px solid #999999 !important;margin-right:8px !important;line-height:40px;height:40px;padding:0 30px 0 14px;.text{white-space:nowrap;font-size:14px !important;line-height:40px !important;font-weight:500 !important;color:var(--main-color) !important;font-family:OpenSans-Medium sans-serif !important;}.dropIcon{position:absolute;right:11px;top:12px;}.options{.item{line-height:24px;padding:4px 20px;}}}"]),N=["eth","polygon","bsc"],S={eth:{value:"eth",text:"ETH"},polygon:{value:"polygon",text:"Polygon"},bsc:{value:"bsc",text:"BSC (BEP20)"}},P={0:"ETH",1:"BSC",2:"Polygon"};var E=(0,u.ZP)((function(e){var t=e.className,r=(0,p.qD)(),n=r.loading,s=r.api,u=r.alert,w=(0,f.S)(),k=w.isPremiumUser,E=w.user,Z=(0,m.X)((function(){return(0,g.w8)(E.account)}),[E.account,k]),I=(0,a.Z)(Z,2),D=I[0],z=I[1],A=D||[],F=(0,h.F)(""),M=(0,a.Z)(F,2),_=M[0],B=M[1],G=(0,h.F)(""),T=(0,a.Z)(G,2),U=T[0],H=T[1],R=!k||!!U,Y=(0,l.useMemo)((function(){return N.map((function(e){return S[e]}))}),[]),V=(0,l.useState)(N[0]),L=V[0],J=V[1],K=(0,l.useCallback)((function(e,t){var r=t.value;J(r)}),[]),X=function(){var e=(0,o.Z)(i().mark((function e(){var t,r,o;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(k){e.next=2;break}return e.abrupt("return");case 2:if(_){e.next=4;break}return e.abrupt("return");case 4:return e.prev=4,n.show(),s.setSigner(C({},E.crust.wallet.signer)),t=s.tx.system.remark(JSON.stringify({scope:"crustFiles",env:d.g6,action:"bindExternalAddress",externalAddressType:L,externalAddress:_})),e.next=10,(0,b.iQ)(t,E.account);case 10:s.setSigner(void 0),r=1;case 12:if(!(r<=3)){e.next=23;break}return e.next=15,(0,b._v)(3e3);case 15:return e.next=17,z();case 17:if(!e.sent){e.next=20;break}return e.abrupt("break",23);case 20:r++,e.next=12;break;case 23:n.hide(),e.next=31;break;case 26:e.prev=26,e.t0=e.catch(4),n.hide(),(o=(0,x.az)(e.t0)).includes("account balance too low")?u.warnModal("Insufficient Funds!"):u.error(o);case 31:case"end":return e.stop()}}),e,null,[[4,26]])})));return function(){return e.apply(this,arguments)}}();return(0,j.jsxs)(y.o,{className:t,children:[(0,j.jsx)("div",{className:"title font-sans-semibold",children:"Bind AirDrop Addresses"}),(0,j.jsxs)("div",{className:"text font-sans-regular",children:["Bind your addresses from multi blockchain platforms for potential airdrops. You can submit amandments when you have updates on your addresses.",(0,j.jsx)("br",{}),(0,j.jsx)("br",{}),A.map((function(e,t){return(0,j.jsxs)("div",{children:["Your binded ",P[e.chain_type]," address: ",(0,j.jsx)("span",{className:"bold-text font-sans-semibold",children:e.address})]},"old_ex_".concat(t))})),(0,j.jsx)("br",{})]}),(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(O,{selection:!0,icon:(0,j.jsx)("span",{className:"icon cru-fo cru-fo-chevron-down"}),defaultValue:N[0],options:Y,onChange:K}),(0,j.jsx)("input",{disabled:!k,className:"input-eth",spellCheck:"false",value:_,onChange:function(e){B(e.target.value);var t=(0,c.isValidAddress)(e.target.value);H(t?"":"Check Input")}}),U&&(0,j.jsx)("span",{className:"input-EthError",children:U}),(0,j.jsx)("br",{}),(0,j.jsx)(v.Z,{disabled:R,className:"btn",style:{width:544,height:40},onClick:X,children:"Submit"}),!k&&(0,j.jsx)("span",{className:"submit-tip",children:"Get Premium User to bind your AirDrop addresses."})]})]})})).withConfig({displayName:"BindAirdrop",componentId:"sc-1fcwrum-1"})([".input-eth{vertical-align:top;display:inline-block;min-width:406px;margin-bottom:12px;height:40px;line-height:40px;border:1px solid #999999;font-family:OpenSans-Regular;outline:unset;border-radius:8px;padding-left:16px;padding-right:16px;font-size:10px;&::placeholder{color:#999999;}}.input-EthError{font-size:10px;color:#F37565;margin-left:12px;}.submit-tip{margin-left:12px;font-size:10px;color:var(--secend-color);}"])},8670:function(e,t,r){"use strict";r.d(t,{o:function(){return c}});var n=r(67294),o=r(29163),a=r(94184),s=r.n(a),i=r(85893);var c=n.memo((0,o.ZP)((function(e){var t=e.className,r=e.children;return(0,i.jsx)("div",{className:s()(t,"mcard"),children:r})})).withConfig({displayName:"MCard",componentId:"sc-157sg53-0"})(["padding:1.71rem !important;box-shadow:0 0.71rem 1.71rem 0 rgba(0,0,0,0.06) !important;border-radius:1.14rem !important;border:0.07rem solid #EEEEEE !important;margin-top:2.21rem;.title{font-size:1.3rem !important;font-weight:600;color:var(--main-color);padding-bottom:1.14rem;.cru-fo{margin-right:0.8rem;}}.text{font-size:1rem;color:var(--secend-color);line-height:1.57rem;}.icon{margin-left:1rem;font-size:1.428571rem;position:relative;top:3px;cursor:pointer;}.bold-text{color:var(--main-color);}a{text-decoration:underline;line-height:1.2rem;cursor:pointer;}.btns{margin-top:1.7rem;button:first-child{margin-right:1rem;}}"]))},31772:function(e,t,r){"use strict";var n=r(80318),o=r(67294),a=r(22090),s=r(29163),i=r(65058),c=r(87962),l=r(96486),u=r.n(l),p=r(94184),d=r.n(p),m=r(85893),f="_null",h=function(e){var t=e.expand,r=e.list,n=e.group,o=e.select,a=e.onClickItem,s=e.onClickGroup,i=e.renderGroupTitle,c=void 0===i?null:i,l=n===o.group;return(0,m.jsxs)("div",{className:"group",children:[n!==f&&(c&&c({group:n,select:o,onClickGroup:s})||(0,m.jsxs)("div",{className:d()("title",{active:l}),onClick:s,children:[n," ",(0,m.jsx)("span",{className:"dropIcon cru-fo-chevron-down"})]})),t&&r.map((function(e,t){return(0,m.jsx)("div",{className:d()("item",{active:l&&e.value===o.value}),onClick:function(t){return a(t,{group:n,value:e.value})},children:e.text},"group_item_".concat(t))}))]})};t.Z=o.memo((0,s.ZP)((function(e){var t,r=e.className,s=e.label,l=e.help,p=e.options,g=e.defaultValue,x=e.defaultGroup,b=void 0===x?f:x,v=e.renderGroupTitle,y=e.footer,w=(0,o.useState)({value:g,group:b}),j=w[0],k=w[1],C=(0,o.useMemo)((function(){return u().find(p,(function(e){return(e.group||f)===j.group&&e.value===j.value}))}),[p,j]),O=(0,o.useState)(b),N=O[0],S=O[1],P=(0,i.O)(),E=(0,n.Z)(P,2),Z=E[0],I=E[1],D=(0,c.Z)((function(){Z&&I(!1)})),z=(0,o.useMemo)((function(){return u().groupBy(p,(function(e){return e.group||f}))}),[p]),A=u().keys(z);return(0,m.jsxs)("div",{className:d()(r,"mdropdown"),onClick:function(){return I()},ref:D,children:[s&&(0,m.jsxs)("div",{className:"label font-sans-semibold",children:[s,l&&(0,m.jsx)(a.Z,{position:"top center",trigger:(0,m.jsx)("span",{className:"icon cru-fo-help-circle"}),content:l})]}),(0,m.jsx)("span",{className:d()("dropIcon","cru-fo-chevron-down")}),(0,m.jsx)("div",{className:"text font-sans-regular",children:null!==(t=null===C||void 0===C?void 0:C.text)&&void 0!==t?t:""}),Z&&(0,m.jsxs)("div",{className:"options",children:[A.map((function(t,r){return(0,m.jsx)(h,{group:t,renderGroupTitle:v,select:j,expand:N===t||t===f,list:z[t],onClickGroup:function(e){S(N===t?f:t),e.stopPropagation()},onClickItem:function(t,r){k(r),e.onChange(t,r)}},"group_".concat(r))})),y]})]})})).withConfig({displayName:"MDropdown",componentId:"sc-1nmwkbf-0"})(["&.mdropdown{position:relative;width:100%;border-radius:0.57rem;border:1px solid var(--line-color);padding:0.8rem 1rem;cursor:pointer;.label{font-size:1rem;font-weight:600;white-space:nowrap;color:var(--main-color);margin-bottom:0.6rem;.icon{font-size:1.3rem;position:relative;top:0.2rem;margin-left:0.86rem;cursor:pointer;color:var(--secend-color);}}.dropIcon{float:right;position:relative;top:-0.9rem;right:0;}.text{font-size:1rem;color:#999999;}.options{width:100%;background:white;position:absolute;top:calc(100% + 1px);left:0;z-index:10;border-radius:4px;border:1px solid var(--line-color);box-shadow:0 1px 5px rgba(0,0,0,0.3);.group{.title{cursor:pointer;border-top:1px solid var(--line-color);padding:0.8rem 1rem;font-size:1.2rem;font-weight:500;&:hover,&.active{background:var(--line-color);}.dropIcon{float:right;right:0.6rem;top:0rem;}}.item{padding:0.6rem 1.6rem;cursor:pointer;&:hover,&.active{background:var(--line-color);}}}}}"]))},17082:function(e,t,r){"use strict";r.d(t,{vZ:function(){return g},hC:function(){return x},MH:function(){return b}});var n=r(92809),o=r(30266),a=r(80318),s=r(809),i=r.n(s),c=r(67294),l=r(58971),u=r.n(l),p=r(65058);function d(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function m(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?d(Object(r),!0).forEach((function(t){(0,n.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):d(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var f=r(21994).Cypher,h=new f(8),g=function(e){return new Promise((function(t,r){var n=new FileReader;n.onload=function(){n.result&&t(n.result)},n.onerror=r,n.readAsArrayBuffer(e)}))};function x(e){try{var t=e&&e.trim();if(t){var r=t.split(" ");if(1===r.length&&r[0]){var n=r[0],o=window.atob(n),a=h.phraseFromSecret(o);if(a&&a.split(" ").length>=4)return{secret:n,seeds:a}}else if(r.length>=4){var s=h.secretFromPhrase(t);if(s&&s.split("-").length>=4)return{secret:window.btoa(s),seeds:t}}}return null}catch(i){return null}}function b(){var e=(0,c.useState)({}),t=e[0],r=e[1],n=(0,p.O)(),s=(0,a.Z)(n,2),l=s[0],d=s[1];(0,c.useEffect)((function(){var e=u().get("user:crypto");e&&r(e),d(!0)}),[]);var h=(0,c.useCallback)((function(e){r(e),u().set("user:crypto",e)}),[]),g=(0,c.useCallback)((0,o.Z)(i().mark((function e(){var t,r,n,o,a;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=new f(8),r=t.genMnemonics(),n=r.secret,o=r.mnemonics,a={secret:window.btoa(n),seeds:o},h(a),e.abrupt("return",a);case 5:case"end":return e.stop()}}),e)}))),[]);return(0,c.useMemo)((function(){return m(m({},t),{},{generate:g,set:h,init:l})}),[t,h,l,g])}},81496:function(e,t,r){"use strict";r.d(t,{z:function(){return d}});var n=r(92809),o=r(80318),a=r(67294),s=r(58971),i=r.n(s),c=r(34111);function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function u(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){(0,n.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var p=[{text:"https://ipfs.io",value:"https://ipfs.io"},{text:"https://crustgateway.online",value:"https://crustgateway.online"},{text:"https://gw.w3ipfs.org.cn",value:"https://gw.w3ipfs.org.cn"}];function d(){var e=(0,a.useState)({gateway:"https://ipfs.io"}),t=e[0],r=e[1],n=(0,a.useState)(p),s=n[0],l=n[1];(0,a.useEffect)((function(){var e=i().get("downloadgateway");e&&r(e),i().get("allDownloadGateways"),s&&l(s)}),[]);var d=(0,a.useCallback)((function(e){var t={gateway:e};r(t),i().set("downloadgateway",t)}),[]),m=(0,c.X)((function(){return fetch("https://gist.githubusercontent.com/XueMoMo/2cfc982ce6aefb85e09313b714a029bd/raw/CrustFilesDownloadGateway.json").then((function(e){return e.json()})).then((function(e){return e.map((function(e){return{text:e,value:e}}))}))}),[]),f=(0,o.Z)(m,1)[0];return(0,a.useEffect)((function(){f&&f.length&&(i().set("allDownloadGateways",f),l(f))}),[f]),(0,a.useMemo)((function(){return u(u({},t),{},{set:d,allDownloadGateways:s})}),[t,d,s])}},57288:function(e,t,r){"use strict";r.d(t,{F:function(){return o}});var n=r(67294);function o(e){var t=(0,n.useState)(e),r=t[0],o=t[1],a=(0,n.useState)({safe:!0})[0];(0,n.useEffect)((function(){return a.safe=!0,function(){a.safe=!1}}));return[r,function(e){a.safe&&o(e)}]}},2125:function(e,t,r){"use strict";r.d(t,{D:function(){return c}});var n=r(67294),o=r(96486),a=r.n(o),s=r(56755),i=r.n(s);function c(e){return(0,n.useMemo)((function(){var t=e.files.length,r=a().groupBy(e.files,(function(e){return e.Encrypted?"valut":"public"}));return r.public||(r.public=[]),r.valut||(r.valut=[]),{count:t,publicCount:a().size(r.public),valutCount:a().size(r.valut),publicSize:i()(a().sumBy(r.public,(function(e){return a().toNumber(e.Size)}))).toUpperCase(),valutSize:i()(a().sumBy(r.valut,(function(e){return a().toNumber(e.Size)}))).toUpperCase()}}),[e.files])}},39436:function(e,t,r){"use strict";r.r(t),r.d(t,{StorageChainConfig:function(){return L},default:function(){return $}});var n=r(30266),o=r(83789),a=r(80318),s=r(809),i=r.n(s),c=r(94184),l=r.n(c),u=r(93162),p=r.n(u),d=r(11163),m=r(67294),f=r(25443),h=r(35766),g=r(21004),x=r(49147),b=r(27416),v=r(29163),y=r(37918),w=r.n(y),j=r(48964),k=r(60954),C=r(31772),O=r(92809),N=r(10219),S=r(345),P=r(60416),E=r(17082),Z=r(85893),I=["alert","onSuccess","toggleOpen"];function D(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function z(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?D(Object(r),!0).forEach((function(t){(0,O.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):D(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var A=m.memo((0,v.ZP)((function(e){var t=e.alert,r=e.onSuccess,n=e.toggleOpen,o=(0,N.Z)(e,I),a=(0,m.useState)(""),s=a[0],i=a[1],c=(0,m.useCallback)((function(e,t){var r=t.value;i(r)}),[]),l=(0,m.useCallback)((function(){var e=(0,E.hC)(s);e?(r(e),n(!1)):t.error("Please check input value")}),[s,t]),u=(0,m.useCallback)((function(){i(""),n(!1)}),[]);return(0,Z.jsxs)(S.Z,z(z({closeIcon:(0,Z.jsx)("span",{className:"close icon cru-fo-x"}),onClose:u},o),{},{children:[(0,Z.jsx)(S.Z.Header,{content:"Input a new key"}),(0,Z.jsxs)(S.Z.Content,{children:[(0,Z.jsx)(P.Z,{fluid:!0,onChange:c}),(0,Z.jsxs)("div",{className:"btns",children:[(0,Z.jsx)(k.Z,{content:"Input",onClick:l}),(0,Z.jsx)(k.Z,{content:"Cancel",onClick:function(){return n(!1)}})]})]})]}))})).withConfig({displayName:"ModalNewKey",componentId:"sc-crca66-0"})(["width:34.3rem !important;.header{height:3.93rem;font-size:1.3rem !important;padding:0 1.14rem !important;font-weight:600 !important;line-height:3.93rem !important;}.close.icon{top:0.5rem;right:0.6rem;color:#666666;}.content{padding:1rem !important;input{border:0.07rem solid #CCCCCC !important;border-radius:0.57rem !important;}.btns{padding-top:2.3rem;button{width:calc(50% - 0.5rem) !important;margin:unset;}button:first-child{margin-right:1rem;}}}"])),F=r(53572),M=r(12752),_=r(20478),B=r(81496),G=r(13711),T=r(65058),U=r(2125),H=r(57908),R=r(48764).Buffer;function Y(e,t){var r="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"===typeof e)return V(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return V(e,t)}(e))||t&&e&&"number"===typeof e.length){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}((function(e){throw e})),f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,s=!0,i=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return s=e.done,e},e:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}((function(e){i=!0,a=e})),f:function(){try{s||null==r.return||r.return()}finally{if(i)throw a}}}}function V(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var L={chainId:"0x5afe",chainName:"Oasis Sapphire",nativeCurrency:{name:"ROSE",symbol:"ROSE",decimals:18},rpcUrls:["https://sapphire.oasis.io/"],blockExplorerUrls:["https://explorer.sapphire.oasis.io"]},J=[{type:"function",stateMutability:"nonpayable",outputs:[],name:"createSecret",inputs:[{type:"string",name:"name",internalType:"string"},{type:"bytes",name:"secret",internalType:"bytes"}]},{type:"function",stateMutability:"view",outputs:[{type:"bytes",name:"",internalType:"bytes"}],name:"revealSecret",inputs:[{type:"string",name:"name",internalType:"string"}]},{type:"event",name:"SecretCreated",inputs:[{type:"address",name:"creator",indexed:!0},{type:"uint256",name:"index",indexed:!1}],anonymous:!1}],K="0x744772c372ea818C0779148CF215C0C642053Ee6";var X=(0,v.ZP)(C.Z).withConfig({displayName:"setting__SelectDownloadGatewayDropdown",componentId:"sc-1rkrrxr-0"})(["&.mdropdown{display:inline-block;vertical-align:top;width:230px !important;border-radius:8px !important;border:1px solid #999999 !important;margin-right:8px !important;line-height:25px;height:25px;padding:0 30px 0 14px;.text{white-space:nowrap;font-size:14 !important;line-height:25px !important;font-weight:500 !important;color:var(--main-color) !important;font-family:OpenSans-SemiBold !important;}.dropIcon{position:absolute;right:11px;top:6px;}.options{.item{line-height:24px;padding:4px 20px;}}}"]),$=m.memo((0,v.ZP)((function(e){var t=e.className,r=(0,f.$)().t,s=(0,E.MH)(),c=(0,B.z)(),u=(0,d.useRouter)(),v=(0,m.useContext)(M.Il).alert,y=(0,T.O)(!1),C=(0,a.Z)(y,2),O=C[0],N=C[1],S=(0,T.O)(),P=(0,a.Z)(S,2),I=P[0],D=P[1];(0,m.useEffect)((function(){s.init&&!s.secret&&D(!0)}),[s]);var z=(0,G.S)(),V=z.user,$=z.isPremiumUser,q=(0,_.V)(),W=(0,m.useMemo)((function(){return $?"Premium User":"Trial User"}),[V,$]),Q="crust"===V.wallet,ee=(0,H.Yg)(),te=(0,U.D)(ee),re=te.publicCount,ne=te.publicSize,oe=te.valutCount,ae=te.valutSize,se=(0,m.useRef)(null),ie=(0,m.useCallback)((function(){se.current&&se.current.click()}),[se]),ce=(0,m.useCallback)((function(e){try{var t=new FileReader,n=e.target.files;if(!n)return;if(t.readAsText(n[0],"UTF-8"),!/(.json)$/i.test(e.target.value))return v.error(r("File error"));t.onload=function(e){var t,n=JSON.parse(null===(t=e.target)||void 0===t?void 0:t.result),a={files:[]};if(Array.isArray(n))a.files=n;else{if(!n.files||!Array.isArray(n.files))return v.error(r("File content error"));a.secret=n.secret,a.files=n.files}if(s.secret&&a.secret&&a.secret!==s.secret)return v.error("Two secrets were found, and they are different.");if(a.secret){var i=(0,E.hC)(a.secret);i&&s.set(i)}var c,l=[],u={},p=Y(a.files);try{for(p.s();!(c=p.n()).done;){var d=c.value;d.Hash&&d.Name&&d.UpEndpoint&&d.PinEndpoint&&(l.push(d),u[d.Hash]=!0)}}catch(f){p.e(f)}finally{p.f()}var m=ee.files.filter((function(e){return!u[e.Hash]}));ee.setFiles([].concat(l,(0,o.Z)(m))),v.alert({msg:r("Import Success"),type:"success"})}}catch(e){v.alert({msg:r("File content error"),type:"error"})}}),[ee,s.set,v,r]),le=(0,m.useCallback)((function(){var e={files:ee.files,secret:s.secret},t=new Blob([JSON.stringify(e)],{type:"application/json; charset=utf-8"});p().saveAs(t,"backup.json")}),[ee,s]),ue=(0,m.useCallback)((0,n.Z)(i().mark((function e(){var t,r,n,o;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!s.secret){e.next=27;break}if(t=!1,"undefined"!==typeof window.ethereum&&(t=!0),!(!!t&&window.ethereum.isMetaMask)){e.next=24;break}return e.next=7,window.ethereum.enable();case 7:return e.next=9,de();case 9:if(!e.sent){e.next=21;break}return r=new(w())(window.ethereum),n=new r.eth.Contract(J,K),e.next=14,r.eth.personal.sign("secret",window.ethereum.selectedAddress,"123456");case 14:return o=e.sent,v.info("Please wait patiently for upload (about 30s)..."),e.next=18,n.methods.createSecret(o.substring(2,12),R.from(s.secret)).send({from:window.ethereum.selectedAddress});case 18:v.info("Your secret key has been uploaded to the Oasis network"),e.next=22;break;case 21:v.error("Change to Oasis error");case 22:e.next=25;break;case 24:v.error("Please make sure you have install Metamask");case 25:e.next=28;break;case 27:v.error("You don't have any secret to upload");case 28:case"end":return e.stop()}}),e)}))),[s]),pe=(0,m.useCallback)((0,n.Z)(i().mark((function e(){var t,r,n,o,a,c,l;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=!1,"undefined"!==typeof window.ethereum&&(t=!0),!(!!t&&window.ethereum.isMetaMask)){e.next=24;break}return e.next=6,window.ethereum.enable();case 6:return e.next=8,de();case 8:if(!e.sent){e.next=21;break}return r=new(w())(window.ethereum),n=new r.eth.Contract(J,K),console.log(window.ethereum.selectedAddress),e.next=14,r.eth.personal.sign("secret",window.ethereum.selectedAddress,"123456");case 14:return o=e.sent,e.next=17,n.methods.revealSecret(o.substring(2,12)).call();case 17:null!==(a=e.sent)&&""!==a?(c=R.from(a.slice(2),"hex").toString(),console.log(c),(l=(0,E.hC)(c))&&s.set(l)):v.error("You don't have any secrets on Oasis"),e.next=22;break;case 21:v.error("Change to Oasis error");case 22:e.next=25;break;case 24:v.error("Please make sure you have install Metamask");case 25:case"end":return e.stop()}}),e)}))),[s]);function de(){return me.apply(this,arguments)}function me(){return(me=(0,n.Z)(i().mark((function e(){var t,r;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=window.ethereum.request,e.next=3,t({method:"eth_chainId"});case 3:if(r=e.sent,console.log("chainId:".concat(r)),r===L.chainId){e.next=32;break}return e.prev=6,e.next=9,t({method:"wallet_switchEthereumChain",params:[{chainId:L.chainId}]});case 9:e.next=32;break;case 11:if(e.prev=11,e.t0=e.catch(6),console.log(e.t0),4902!==e.t0.code){e.next=31;break}return e.prev=15,e.next=18,t({method:"wallet_addEthereumChain",params:[L]});case 18:return e.next=20,t({method:"eth_chainId"});case 20:return e.t1=e.sent,e.t2=L.chainId,e.abrupt("return",e.t1==e.t2);case 25:return e.prev=25,e.t3=e.catch(15),console.error(e.t3),e.abrupt("return",!1);case 29:e.next=32;break;case 31:return e.abrupt("return",!1);case 32:return e.abrupt("return",!0);case 33:case"end":return e.stop()}}),e,null,[[6,11],[15,25]])})))).apply(this,arguments)}var fe=(0,m.useState)(""),he=fe[0],ge=fe[1],xe=(0,m.useCallback)((function(e,t){var r=t.value;ge(r)}),[]);return(0,Z.jsxs)(F.Z,{path:"/setting",className:t,children:[(0,Z.jsx)("input",{onChange:ce,ref:se,style:{display:"none"},type:"file"}),O&&(0,Z.jsx)(A,{alert:v,size:"tiny",open:!0,toggleOpen:N,onSuccess:s.set}),(0,Z.jsxs)(h.Z,{basic:!0,className:"mcard",children:[(0,Z.jsx)("div",{className:"title font-sans-semibold",children:r("User Profile")}),(0,Z.jsxs)("div",{className:"text font-sans-regular",children:["".concat(r("Web3 Identity Logged-in:")," "),(0,Z.jsx)("span",{className:"bold-text font-sans-semibold",children:V.account})]}),(0,Z.jsxs)("div",{className:"text font-sans-regular",children:["".concat(r("Logged-in Wallet:")," "),(0,Z.jsx)("span",{className:"bold-text font-sans-semibold",children:H.w3[V.wallet]})]}),Q&&V.nickName&&(0,Z.jsxs)("div",{className:"text font-sans-regular",children:["".concat(r("Nick Name:")," "),(0,Z.jsx)("span",{className:"bold-text font-sans-semibold",children:V.nickName})]}),(0,Z.jsxs)("div",{className:"text font-sans-regular",children:["".concat(r("User Type:")," "),(0,Z.jsx)("span",{className:"bold-text font-sans-semibold",children:W})," ",!$&&(0,Z.jsx)("a",{onClick:function(){return u.push("/user")},rel:"noreferrer",children:"Get Premium"})]}),(0,Z.jsxs)("div",{className:"text font-sans-regular",children:["".concat(r("File/Folder Stored:")," ")," ",(0,Z.jsx)("span",{className:"bold-text font-sans-semibold",children:"".concat(re," in Public, ").concat(oe," in Vault")})]}),(0,Z.jsxs)("div",{className:"text font-sans-regular",children:["".concat(r("Space Usage:")," ")," ",(0,Z.jsx)("span",{className:"bold-text font-sans-semibold",children:"".concat(ne," in Public, ").concat(ae," in Vault")})]})]}),(0,Z.jsxs)(h.Z,{basic:!0,className:"mcard",children:[(0,Z.jsx)("div",{className:"title font-sans-semibold",children:r("IPFS Gateway settings for download")}),(0,Z.jsxs)("div",{className:"text font-sans-regular",children:["".concat(r("Default gateway:")," "),(0,Z.jsx)("span",{className:"bold-text font-sans-semibold",children:c.gateway})]}),(0,Z.jsxs)("div",{className:"text font-sans-regular",children:["".concat(r("Select a gateway from community contribution:")," "),(0,Z.jsx)(X,{icon:(0,Z.jsx)("span",{className:"dropdown icon"}),options:c.allDownloadGateways,onChange:xe})]}),(0,Z.jsx)("div",{className:"text font-sans-regular",children:"Customized:"}),(0,Z.jsx)("input",{className:"input-dowload-gateway",spellCheck:"false",onChange:function(e){ge(e.target.value)},placeholder:r("Customize your download gateway")}),(0,Z.jsx)(k.Z,{content:r("Save"),style:{height:25,lineHeight:"0px"},onClick:function(){null!=he&&""!=he?(c.set(he),v.success("Save success")):v.error("Please give right gateway")}})]}),(0,Z.jsxs)(h.Z,{basic:!0,className:"mcard",children:[(0,Z.jsx)("div",{className:"title font-sans-semibold",children:r("Developer Profile")}),(0,Z.jsxs)("div",{className:"text font-sans-regular",children:["".concat(r("Access token:")," ")," ",(0,Z.jsxs)("span",{className:"bold-text font-sans-semibold",style:{wordBreak:"break-all"},children:[V.authBasic,(0,Z.jsx)("span",{className:"icon cru-fo-copy",onClick:function(){return q(V.authBasic)}})]})]})]}),(0,Z.jsxs)(h.Z,{basic:!0,className:"mcard",children:[(0,Z.jsx)("div",{className:"title font-sans-semibold",children:r("User Data Management")}),(0,Z.jsxs)("div",{className:"text font-sans-regular",children:["".concat(r("Your user data (including three File Lists and one File Encryption Key) are cached on your local devices. If you want to migrate your user data to a new device, use Export & Import function.")," "),(0,Z.jsx)("span",{style:{color:"#f47e6b"},children:"Attention Please! If you want to switch device or explorer, please follow the following steps: 1) Export your user data from old device/explorer. 2) Log in to Crust Files in your new device/explorer. 3) Import the user data. 4) Enjoy Crust Files! PS: Another way you can spend some ROSE tokens to safely and securely store your private keys on the Oasis sapphire network"})]}),(0,Z.jsxs)(g.Z,{children:[(0,Z.jsx)(x.Z,{active:I,onClick:function(){return D()},children:(0,Z.jsxs)("div",{className:"title font-sans-semibold",children:[r("File Encryption"),(0,Z.jsx)("span",{className:l()("icon",I?"cru-fo-chevron-up":"cru-fo-chevron-down")})]})}),(0,Z.jsxs)(b.Z,{active:I,className:"no-padding",children:[(0,Z.jsxs)("div",{className:"text font-sans-regular",children:["".concat(r("Your File Encryption Key:")," "),s.secret&&(0,Z.jsxs)("span",{className:"bold-text font-sans-semibold",children:[s.secret,(0,Z.jsx)("span",{className:"icon cru-fo-copy",onClick:function(){return q(s.secret)}})]}),!s.secret&&(0,Z.jsx)("a",{onClick:s.generate,children:"Generate a New"})]}),s.seeds&&(0,Z.jsxs)("div",{className:"text font-sans-regular",children:["".concat(r("Seed Phrase:")," "),(0,Z.jsx)("span",{className:"bold-text font-sans-semibold",children:s.seeds})]})]})]}),(0,Z.jsxs)("div",{className:"btns",children:[(0,Z.jsx)(k.Z,{content:r("Export"),onClick:le}),(0,Z.jsx)(k.Z,{content:r("Import"),onClick:ie}),(0,Z.jsx)(k.Z,{content:r("Upload key to Oasis"),onClick:ue}),(0,Z.jsx)(k.Z,{content:r("Download key from Oasis"),onClick:pe})]})]}),(0,Z.jsx)(j.b,{})]})})).withConfig({displayName:"setting",componentId:"sc-1rkrrxr-1"})([".pusl_center_flex_content{min-width:60rem;}.mcard{padding:1.71rem !important;box-shadow:0 0.71rem 1.71rem 0 rgba(0,0,0,0.06) !important;border-radius:1.14rem !important;border:0.07rem solid #EEEEEE !important;margin-top:2.21rem;.title{font-size:1.3rem !important;font-weight:600;color:var(--main-color);padding-bottom:1.14rem;.cru-fo{margin-right:0.8rem;}}.text{font-size:1rem;color:var(--secend-color);line-height:1.57rem;}.icon{margin-left:1rem;font-size:1.428571rem;position:relative;top:3px;cursor:pointer;}.bold-text{color:var(--main-color);}a{text-decoration:underline;line-height:1.2rem;cursor:pointer;}.btns{margin-top:1.7rem;button:{margin-right:1rem;}}.input-dowload-gateway{vertical-align:top;display:inline-block;min-width:406px;margin-bottom:12px;margin-right:12px;height:25px;line-height:25px;border:1px solid #999999;font-family:OpenSans-Regular;outline:unset;border-radius:8px;padding-left:16px;padding-right:16px;font-size:10px;&::placeholder{color:#999999;}}}"]))},27790:function(){}}]);