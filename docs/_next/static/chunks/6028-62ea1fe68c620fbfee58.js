"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6028],{66028:function(e,t,r){r.d(t,{N:function(){return E}});var n=r(30266),s=r(809),i=r.n(s),a=r(9669),c=r.n(a),o=r(93162),u=r(56755),l=r.n(u),p=r(96486),f=r.n(p),m=r(67294),d=r(1300),h=r(28803),v=r(65382),x=r(29163),g=r(12752),b=r(54040),w=r(65369),y=r(20478),k=r(59996),N=r(45129),C=r(56262),j=r(99056),Z=r(55564),_=r(60954),S=r(6169),T=r(85893),E=["https://crustipfs.live","https://crustipfs.art","https://crustipfs.info","https://web3files.world","https://web3files.live","https://storagefiles.site","https://storagefiles.space","https://crustipfs.tech"];function z(e,t){var r=(new Date).getTime(),n=E[r%8];return"".concat(n,"/ipfs/").concat(e.Hash,"?filename=").concat(e.Name)}function A(e,t){return D.apply(this,arguments)}function D(){return(D=(0,n.Z)(i().mark((function e(t,r){var n;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,N.Cn)(t.Hash,{name:t.Name,encrypted:t.Encrypted,gateway:t.UpEndpoint,fromAccount:r.account,fromWallet:r.wallet,from:r.nickName,isDir:!!t.items});case 2:return n=e.sent,(0,k.H)({type:3,walletType:r.wallet,address:r.account,data:{cid:t.Hash,fileType:t.items?1:0,strategy:t.Encrypted?1:0,shareType:0}}),e.abrupt("return","".concat(window.location.origin,"/share?code=").concat(n));case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function F(e){try{return JSON.parse(JSON.stringify(e))}catch(t){return{expired_at:0,reported_replica_count:0,amount:0,file_size:0,prepaid:!1}}}t.Z=m.memo((0,x.ZP)((function(e){var t,r,s,a,u=e.file,p=e.className,x=e.uc,k=e.onDelete,N=e.type,E="public"===(void 0===N?"public":N),D=(0,y.V)(),H=(0,m.useContext)(g.Il),R=H.api,I=H.alert,L=H.loading,q=(0,C.T)().endpoints,W=(0,m.useCallback)((0,n.Z)(i().mark((function e(){var t,r,n,s;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!u.Encrypted||0!==f().size(u.items)){e.next=28;break}if(e.prev=1,x.secret){e.next=4;break}return e.abrupt("return");case 4:return L.show(),e.next=7,c().get(z(u),{responseType:"arraybuffer"});case 7:return t=e.sent,console.info("res::",t),r=(new Date).getTime(),e.next=12,(0,b.n)(t.data,x.secret);case 12:if(n=e.sent,console.info("decrypt:",((new Date).getTime()-r)/1e3),n){e.next=16;break}throw"error";case 16:console.info("de:",n),s=new File([n],u.Name,{type:t.headers["content-type"]}),(0,o.saveAs)(s,u.Name),L.hide(),e.next=26;break;case 22:e.prev=22,e.t0=e.catch(1),L.hide(),I.error("Decrypt error");case 26:e.next=29;break;case 28:window.open(z(u),"_blank");case 29:case"end":return e.stop()}}),e,null,[[1,22]])}))),[x,u,q]),P=(0,Z.WY)(),O=function(){var e=(0,n.Z)(i().mark((function e(){var t;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,A(u,P);case 3:t=e.sent,window.open(t,"_blank"),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),I.error((0,j.az)(e.t0));case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(){return e.apply(this,arguments)}}(),V=function(){var e=(0,n.Z)(i().mark((function e(){var t,r,n;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,A(u,P);case 3:t=e.sent,r=P.nickName?"Check out what '".concat(P.nickName,"' is sharing on Crust Files!"):"Check out what I am sharing on Crust Files!",n="https://twitter.com/intent/tweet?text=".concat(encodeURI(r),"&url=").concat(encodeURIComponent(t),"&hashtags=web3,ipfs,crustnetwork,metaverse,crustfiles"),window.open(n,"_blank"),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),I.error((0,j.az)(e.t0));case 12:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(){return e.apply(this,arguments)}}(),J=R&&(null===(t=R.query)||void 0===t?void 0:t.market)&&((0,S.m)(R.query.market.filesV2)?R.query.market.filesV2:R.query.market.files),M=R&&(null===(r=R.query)||void 0===r?void 0:r.market)&&R.query.market.files,U=!!J,Q=(0,w.W7)(J,[u.Hash]),Y=(0,w.W7)(M,[u.Hash]),B=(0,w.W7)(null===R||void 0===R||null===(s=R.derive)||void 0===s||null===(a=s.chain)||void 0===a?void 0:a.bestNumber),G=B&&B.toNumber(),K=(0,m.useMemo)((function(){var e={status:"Submitted"};if(Y&&!Y.isEmpty){var t=F(Y),r=t.expired_at,n=t.reported_replica_count,s=t.amount,i=t.file_size,a=t.prepaid;e.expireTime=r,e.amount=s,e.startTime=r?r-216e3:0,e.fileSize=i,e.confirmedReplicas=n,e.prepaid=a,r&&r<G&&(e.status="Expired"),n<1&&(e.status="Submitted"),r&&r>G&&n>0&&(e.status="Success")}else if(Q&&!Q.isEmpty){var c=F(Q),o=c.expired_at,l=c.reported_replica_count,p=c.amount,f=c.file_size,m=c.prepaid;e.expireTime=o,e.amount=p,e.startTime=o?o-216e3:0,e.fileSize=f,e.confirmedReplicas=l,e.prepaid=m,o&&o<G&&(e.status="Expired"),l<1&&(e.status="Submitted"),o&&o>G&&l>0&&(e.status="Success")}else U&&(new Date).getTime()-u.PinTime>=72e5&&(e.status="Failed");return G||(e.status="Loading"),e}),[Y,Q,G]);return(0,T.jsxs)(d.Z.Row,{className:p,children:[(0,T.jsxs)(d.Z.Cell,{className:"fileName",children:[(0,j.lS)(u.Name),u.items&&(0,T.jsx)("span",{className:"icon cru-fo-folder"}),u.Encrypted&&(0,T.jsx)(h.Z,{trigger:(0,T.jsx)("span",{className:"icon cru-fo-key"}),content:"Encrypted",position:"top center"})]}),(0,T.jsxs)(d.Z.Cell,{textAlign:"right",children:[(0,j.lS)(u.Hash),(0,T.jsx)(h.Z,{position:"top center",content:"Copy File CID",trigger:(0,T.jsx)("span",{className:"cru-fo cru-fo-copy",onClick:function(){return D(u.Hash)},style:{marginLeft:"1.8rem"}})})]}),(0,T.jsx)(d.Z.Cell,{textAlign:"center",style:{textTransform:"uppercase"},children:l()(Number(u.Size),{round:2})}),(0,T.jsxs)(d.Z.Cell,{textAlign:"center",children:["Loading"===K.status&&(0,T.jsx)(v.Z,{loading:!0,name:"spinner"}),"Submitted"===K.status&&K.status,"Expired"===K.status&&K.status,"Failed"===K.status&&K.status,"Success"===K.status&&"".concat(K.status," (").concat(K.confirmedReplicas," Replicas)")]}),(0,T.jsxs)(d.Z.Cell,{textAlign:"center",children:[(0,T.jsx)(h.Z,{position:"top center",content:"Open",trigger:(0,T.jsx)("span",{className:"cru-fo cru-fo-external-link",style:{marginLeft:"1rem"},onClick:W})}),(0,T.jsx)(h.Z,{position:"top center",content:"Delete",trigger:(0,T.jsx)("span",{className:"cru-fo cru-fo-trash-2",style:{marginLeft:"1rem"},onClick:function(){k(u)}})}),(0,T.jsx)(h.Z,{position:"top center",content:"IPFS Scan",trigger:(0,T.jsx)("span",{className:"cru-fo cru-fo-search",style:{marginLeft:"1rem"},onClick:function(){window.open("https://ipfs-scan.io?cid=".concat(u.Hash),"_blank")}})})]}),E&&(0,T.jsx)(d.Z.Cell,{textAlign:"center",children:(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(_.Z,{className:"item-share-btn",onClick:O,children:"Share"}),(0,T.jsx)(h.Z,{position:"top center",content:"Quick Tweet",trigger:(0,T.jsx)("span",{className:"cru-fo cru-fo-twitter",onClick:V,style:{marginLeft:"0.5rem",top:"0.2rem"}})})]})})]})})).withConfig({displayName:"FileItem",componentId:"sc-3bbeav-0"})(["color:var(--secend-color) !important;.cru-fo,.icon{cursor:pointer;font-size:1.3rem;position:relative;top:0.3rem;}.fileName{.icon{margin-left:0.6rem;}}.item-share-btn{padding:5px 11px !important;border-radius:8px !important;}"]))},65369:function(e,t,r){r.d(t,{W7:function(){return l}});var n=r(80318),s=r(83789),i=r(67294),a=r(66103),c=r(98278);function o(e){return e}function u(e){e.current.isActive=!1,e.current.subscriber&&(e.current.subscriber.then((function(e){return e()})).catch(console.error),e.current.subscriber=null)}function l(e,t,r){var l=function(){var e=(0,i.useRef)(!1);return(0,i.useEffect)((function(){return e.current=!0,function(){e.current=!1}}),[]),e}(),p=(0,i.useRef)({isActive:!1,serialized:null,subscriber:null}),f=(0,i.useState)((r||{}).defaultValue),m=f[0],d=f[1];return(0,i.useEffect)((function(){return function(){return u(p)}}),[]),(0,i.useEffect)((function(){if(l.current&&e){var i=function(e,t){var r=(arguments.length>2&&void 0!==arguments[2]?arguments[2]:{}).paramMap,n=void 0===r?o:r;return[JSON.stringify({f:null===e||void 0===e?void 0:e.name,p:t}),0!==t.length&&t.some((function(e){return(0,a.F)(e)||(0,c.o)(e)}))?null:n(t)]}(e,t||[],r),f=(0,n.Z)(i,2),m=f[0],h=f[1];h&&m!==p.current.serialized&&(p.current.serialized=m,function(e,t,r,n,i){var a=arguments.length>5&&void 0!==arguments[5]?arguments[5]:{},l=a.transform,p=void 0===l?o:l,f=a.withParams,m=a.withParamsTransform,d=n.filter((function(e){return!(0,c.o)(e)}));u(t),setTimeout((function(){var a;e.current&&(!r||r.meta&&null!==(a=r.meta.type)&&void 0!==a&&a.isDoubleMap&&2!==d.length?t.current.subscriber=null:(t.current.isActive=!0,t.current.subscriber=r.apply(void 0,(0,s.Z)(n).concat([function(r){e.current&&t.current.isActive&&e.current&&t.current.isActive&&i(f?[n,p(r)]:p(m?[n,r]:r))}]))))}),0)}(l,p,e,h,d,r))}}),[e,r,l,t]),m}}}]);