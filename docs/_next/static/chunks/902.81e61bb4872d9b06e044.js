(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[902,6834],{35796:function(t,e,n){"use strict";n.d(e,{d:function(){return v}});var r=n(15861),i=n(15671),o=n(43144),a=n(97326),c=n(79340),s=n(82963),u=n(61120),h=n(4942),d=n(64687),l=n.n(d),p=n(8654);function f(t){var e=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=(0,u.Z)(t);if(e){var i=(0,u.Z)(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return(0,s.Z)(this,n)}}var v=function(t){(0,c.Z)(n,t);var e=f(n);function n(){var t,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return(0,i.Z)(this,n),t=e.call(this),(0,h.Z)((0,a.Z)(t),"clientId",void 0),t.clientId=r.clientId,t}return(0,o.Z)(n,[{key:"authenticateUser",value:function(){var t=(0,r.Z)(l().mark((function t(){var e,n,r,i,o,a,c,s,u,h;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.provider&&null!==(e=this.chainConfig)&&void 0!==e&&e.chainId){t.next=2;break}throw p.RM.notConnectedError();case 2:if(n=this.chainConfig,r=n.chainNamespace,i=n.chainId,this.status===p.MP.CONNECTED){t.next=5;break}throw p.RM.notConnectedError("Not connected with wallet, Please login/connect first");case 5:return t.next=7,this.provider.request({method:"eth_accounts"});case 7:if(!((o=t.sent)&&o.length>0)){t.next=26;break}if(!(a=(0,p.Cb)(o[0],this.name))){t.next=14;break}if((0,p.$E)(a)){t.next=14;break}return t.abrupt("return",{idToken:a});case 14:return c={domain:window.location.origin,uri:window.location.href,address:o[0],chainId:parseInt(i,16),version:"1",nonce:Math.random().toString(36).slice(2),issuedAt:(new Date).toISOString()},t.next=17,(0,p.tV)(c,r);case 17:return s=t.sent,t.next=20,this.provider.request({method:"personal_sign",params:[s,o[0]]});case 20:return u=t.sent,t.next=23,(0,p.rn)(r,u,s,this.name,this.sessionTime,this.clientId);case 23:return h=t.sent,(0,p.Fr)(o[0],this.name,h),t.abrupt("return",{idToken:h});case 26:throw p.RM.notConnectedError("Not connected with wallet, Please login/connect first");case 27:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"disconnect",value:function(){var t=(0,r.Z)(l().mark((function t(){var e;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.status===p.MP.CONNECTED){t.next=2;break}throw p.RM.disconnectionError("Not connected with wallet");case 2:return t.next=4,this.provider.request({method:"eth_accounts"});case 4:(e=t.sent)&&e.length>0&&(0,p.qz)(e[0],this.name);case 6:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()}]),n}(p.J5)},46740:function(t,e,n){"use strict";n.r(e),n.d(e,{WalletConnectV1Adapter:function(){return x}});var r=n(15861),i=n(15671),o=n(43144),a=n(97326),c=n(11752),s=n(79340),u=n(82963),h=n(61120),d=n(4942),l=n(64687),p=n.n(l),f=n(55991),v=n(21857);class w extends f.Z{constructor(t,e){super({cryptoLib:v,connectorOpts:t,pushServerOpts:e})}}var y=w,k=n(8654),g=n(35796),m=n(52062),C=[{name:"Rainbow",chains:[k.EN.EIP155],logo:"https://images.web3auth.io/login-rainbow.svg",mobile:{native:"rainbow:",universal:"https://rnbwapp.com"},desktop:{native:"",universal:""}},{name:"MetaMask",chains:[k.EN.EIP155],logo:"https://images.web3auth.io/login-metamask.svg",mobile:{native:"metamask:",universal:"https://metamask.app.link"},desktop:{native:"",universal:""}}];function b(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function E(t){var e=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=(0,h.Z)(t);if(e){var i=(0,h.Z)(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return(0,u.Z)(this,n)}}var x=function(t){(0,s.Z)(n,t);var e=E(n);function n(t){var r;return(0,i.Z)(this,n),r=e.call(this,t),(0,d.Z)((0,a.Z)(r),"name",k.rW.WALLET_CONNECT_V1),(0,d.Z)((0,a.Z)(r),"adapterNamespace",k.yk.EIP155),(0,d.Z)((0,a.Z)(r),"currentChainNamespace",k.EN.EIP155),(0,d.Z)((0,a.Z)(r),"type",k.hN.EXTERNAL),(0,d.Z)((0,a.Z)(r),"adapterOptions",void 0),(0,d.Z)((0,a.Z)(r),"status",k.MP.NOT_READY),(0,d.Z)((0,a.Z)(r),"adapterData",{uri:"",extensionAdapters:C}),(0,d.Z)((0,a.Z)(r),"connector",null),(0,d.Z)((0,a.Z)(r),"wcProvider",null),(0,d.Z)((0,a.Z)(r),"rehydrated",!1),r.adapterOptions=function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?b(Object(n),!0).forEach((function(e){(0,d.Z)(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):b(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}({},t),r.chainConfig=t.chainConfig||null,r.sessionTime=t.sessionTime||86400,r}return(0,o.Z)(n,[{key:"connected",get:function(){var t;return!(null===(t=this.connector)||void 0===t||!t.connected)}},{key:"provider",get:function(){var t;return(null===(t=this.wcProvider)||void 0===t?void 0:t.provider)||null},set:function(t){throw new Error("Not implemented")}},{key:"init",value:function(){var t=(0,r.Z)(p().mark((function t(){return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if((0,c.Z)((0,h.Z)(n.prototype),"checkInitializationRequirements",this).call(this),this.chainConfig||(this.chainConfig=(0,k.h2)(k.EN.EIP155,1)),this.connector=this.getWalletConnectInstance(),this.wcProvider=new m.WalletConnectProvider({config:{chainConfig:this.chainConfig},connector:this.connector}),this.emit(k.n2.READY,k.rW.WALLET_CONNECT_V1),this.status=k.MP.READY,k.cM.debug("initializing wallet connect v1 adapter"),!this.connector.connected){t.next=11;break}return this.rehydrated=!0,t.next=11,this.onConnectHandler({accounts:this.connector.accounts,chainId:this.connector.chainId});case 11:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"connect",value:function(){var t=(0,r.Z)(p().mark((function t(){var e,i,o=this;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if((0,c.Z)((0,h.Z)(n.prototype),"checkConnectionRequirements",this).call(this),this.connector){t.next=3;break}throw k.Ty.notReady("Wallet adapter is not ready yet");case 3:if(!this.connected){t.next=7;break}return t.next=6,this.onConnectHandler({accounts:this.connector.accounts,chainId:this.connector.chainId});case 6:return t.abrupt("return",this.provider);case 7:if(this.status===k.MP.CONNECTING){t.next=13;break}return null!==(e=this.adapterOptions.adapterSettings)&&void 0!==e&&e.qrcodeModal&&(this.connector=this.getWalletConnectInstance(),this.wcProvider=new m.WalletConnectProvider({config:{chainConfig:this.chainConfig,skipLookupNetwork:null===(i=this.adapterOptions.adapterSettings)||void 0===i?void 0:i.skipNetworkSwitching},connector:this.connector})),t.next=11,this.createNewSession();case 11:this.status=k.MP.CONNECTING,this.emit(k.n2.CONNECTING,{adapter:k.rW.WALLET_CONNECT_V1});case 13:return t.abrupt("return",new Promise((function(t,e){if(!o.connector)return e(k.Ty.notReady("Wallet adapter is not ready yet"));o.connector.on("modal_closed",(0,r.Z)(p().mark((function t(){return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o.status=k.MP.READY,o.emit(k.n2.READY,k.rW.WALLET_CONNECT_V1),t.abrupt("return",e(new Error("User closed modal")));case 3:case"end":return t.stop()}}),t)}))));try{o.connector.on("connect",function(){var e=(0,r.Z)(p().mark((function e(n,r){return p().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n&&o.emit(k.n2.ERRORED,n),k.cM.debug("connected event emitted by web3auth"),e.next=4,o.onConnectHandler(r.params[0]);case 4:return e.abrupt("return",t(o.provider));case 5:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}())}catch(n){k.cM.error("Wallet connect v1 adapter error while connecting",n),o.status=k.MP.READY,o.rehydrated=!0,o.emit(k.n2.ERRORED,n),e(n instanceof k.up?n:k.RM.connectionError("Failed to login with wallet connect: ".concat((null===n||void 0===n?void 0:n.message)||"")))}})));case 14:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"setAdapterSettings",value:function(t){this.status!==k.MP.READY&&(null!==t&&void 0!==t&&t.sessionTime&&(this.sessionTime=t.sessionTime),null!==t&&void 0!==t&&t.clientId&&(this.clientId=t.clientId))}},{key:"getUserInfo",value:function(){var t=(0,r.Z)(p().mark((function t(){return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.connected){t.next=2;break}throw k.RM.notConnectedError("Not connected with wallet, Please login/connect first");case 2:return t.abrupt("return",{});case 3:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"disconnect",value:function(){var t=(0,r.Z)(p().mark((function t(){var e,r,i=arguments;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e=i.length>0&&void 0!==i[0]?i[0]:{cleanup:!1},r=e.cleanup,this.connector&&this.connected){t.next=4;break}throw k.RM.notConnectedError("Not connected with wallet");case 4:return t.next=6,(0,c.Z)((0,h.Z)(n.prototype),"disconnect",this).call(this);case 6:return t.next=8,this.connector.killSession();case 8:this.rehydrated=!1,r?(this.connector=null,this.status=k.MP.NOT_READY,this.wcProvider=null):this.status=k.MP.READY,this.emit(k.n2.DISCONNECTED);case 11:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"addChain",value:function(){var t=(0,r.Z)(p().mark((function t(e){var n,r;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,this.wcProvider){t.next=3;break}throw k.Ty.notReady("Wallet adapter is not ready yet");case 3:if(!(r=null===(n=this.adapterOptions.adapterSettings)||void 0===n?void 0:n.networkSwitchModal)){t.next=7;break}return t.next=7,r.addNetwork({chainConfig:e,appOrigin:window.location.hostname});case 7:return t.next=9,this.wcProvider.addChain(e);case 9:t.next=14;break;case 11:t.prev=11,t.t0=t.catch(0),k.cM.error(t.t0);case 14:case"end":return t.stop()}}),t,this,[[0,11]])})));return function(e){return t.apply(this,arguments)}}()},{key:"switchChain",value:function(){var t=(0,r.Z)(p().mark((function t(e,n){var r,i;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.wcProvider){t.next=2;break}throw k.Ty.notReady("Wallet adapter is not ready yet");case 2:if(!(i=null===(r=this.adapterOptions.adapterSettings)||void 0===r?void 0:r.networkSwitchModal)){t.next=6;break}return t.next=6,i.switchNetwork({currentChainConfig:n,newChainConfig:e,appOrigin:window.location.hostname});case 6:return t.next=8,this.wcProvider.switchChain({chainId:n.chainId,lookup:!1,addChain:!1});case 8:case"end":return t.stop()}}),t,this)})));return function(e,n){return t.apply(this,arguments)}}()},{key:"createNewSession",value:function(){var t=(0,r.Z)(p().mark((function t(){var e,n,i,o,a=this,c=arguments;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(i=c.length>0&&void 0!==c[0]?c[0]:{forceNewSession:!1},this.connector){t.next=3;break}throw k.Ty.notReady("Wallet adapter is not ready yet");case 3:if(!i.forceNewSession||!this.connector.pending){t.next=6;break}return t.next=6,this.connector.killSession();case 6:if(null===(e=this.adapterOptions)||void 0===e||null===(n=e.adapterSettings)||void 0===n||!n.qrcodeModal){t.next=10;break}return t.next=9,this.connector.createSession({chainId:parseInt((null===(o=this.chainConfig)||void 0===o?void 0:o.chainId)||"0x1",16)});case 9:return t.abrupt("return");case 10:return t.abrupt("return",new Promise((function(t,e){var n;if(!a.connector)return e(k.Ty.notReady("Wallet adapter is not ready yet"));k.cM.debug("creating new session for web3auth wallet connect"),a.connector.on("display_uri",function(){var n=(0,r.Z)(p().mark((function n(r,i){var o,c;return p().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!r){n.next=3;break}return a.emit(k.n2.ERRORED,k.RM.connectionError("Failed to display wallet connect qr code")),n.abrupt("return",e(r));case 3:return c=i.params[0],a.updateAdapterData({uri:c,extensionAdapters:C}),null===(o=a.connector)||void 0===o||o.off("display_uri"),n.abrupt("return",t());case 7:case"end":return n.stop()}}),n)})));return function(t,e){return n.apply(this,arguments)}}()),a.connector.createSession({chainId:parseInt((null===(n=a.chainConfig)||void 0===n?void 0:n.chainId)||"0x1",16)}).catch((function(t){return k.cM.error("error while creating new wallet connect session",t),a.emit(k.n2.ERRORED,t),e(t)}))})));case 11:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"onConnectHandler",value:function(){var t=(0,r.Z)(p().mark((function t(e){var n,r,i,o,a,c;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.connector&&this.wcProvider){t.next=2;break}throw k.Ty.notReady("Wallet adapter is not ready yet");case 2:if(this.chainConfig){t.next=4;break}throw k.Ty.invalidParams("Chain config is not set");case 4:if(n=e.chainId,k.cM.debug("connected chainId in hex"),n===parseInt(this.chainConfig.chainId,16)){t.next=27;break}if(a=(0,k.h2)(k.EN.EIP155,n)||{chainId:"0x".concat(n.toString(16)),displayName:"Unknown Network"},(c=null===(r=this.adapterOptions.adapterSettings)||void 0===r?void 0:r.qrcodeModal)&&(!c||null!==(i=this.adapterOptions)&&void 0!==i&&null!==(o=i.adapterSettings)&&void 0!==o&&o.skipNetworkSwitching)){t.next=27;break}return t.prev=10,t.next=13,this.addChain(this.chainConfig);case 13:return t.next=15,this.switchChain(a,this.chainConfig);case 15:this.connector=this.getWalletConnectInstance(),t.next=27;break;case 18:return t.prev=18,t.t0=t.catch(10),k.cM.error("error while chain switching",t.t0),t.next=23,this.createNewSession({forceNewSession:!0});case 23:return this.emit(k.n2.ERRORED,k.Ty.fromCode(5e3,"Not connected to correct network. Expected: ".concat(this.chainConfig.displayName,", Current: ").concat((null===a||void 0===a?void 0:a.displayName)||n,", Please switch to correct network from wallet"))),this.status=k.MP.READY,this.rehydrated=!0,t.abrupt("return");case 27:return t.next=29,this.wcProvider.setupProvider(this.connector);case 29:this.subscribeEvents(this.connector),this.status=k.MP.CONNECTED,this.emit(k.n2.CONNECTED,{adapter:k.rW.WALLET_CONNECT_V1,reconnected:this.rehydrated});case 32:case"end":return t.stop()}}),t,this,[[10,18]])})));return function(e){return t.apply(this,arguments)}}()},{key:"subscribeEvents",value:function(t){var e=this;t.on("session_update",function(){var t=(0,r.Z)(p().mark((function t(n){return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n&&e.emit(k.n2.ERRORED,n);case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}},{key:"getWalletConnectInstance",value:function(){var t=this.adapterOptions.adapterSettings||{};return t.bridge=t.bridge||"https://bridge.walletconnect.org",new y(t)}}]),n}(g.d)},993:function(){},69159:function(){},29704:function(){},88924:function(){}}]);