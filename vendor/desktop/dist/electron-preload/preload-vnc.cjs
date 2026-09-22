"use strict";!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="62409c1e-f3c8-46a5-bd84-813dc18b4d14",e._sentryDebugIdIdentifier="sentry-dbid-62409c1e-f3c8-46a5-bd84-813dc18b4d14")}catch(e){}}();
"use strict";var A=Object.defineProperty;var We=Object.getOwnPropertyDescriptor;var $e=Object.getOwnPropertyNames;var Ge=Object.prototype.hasOwnProperty;var r=(e,n)=>A(e,"name",{value:n,configurable:!0});var re=(e,n)=>{for(var t in n)A(e,t,{get:n[t],enumerable:!0})},Ye=(e,n,t,o)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of $e(n))!Ge.call(e,i)&&i!==t&&A(e,i,{get:()=>n[i],enumerable:!(o=We(n,i))||o.enumerable});return e};var Je=e=>Ye(A({},"__esModule",{value:!0}),e);var Cn={};re(Cn,{installVncPreload:()=>Ue});module.exports=Je(Cn);var D=require("electron");var b={now:r(()=>Date.now(),"now"),monotonicNow:r(()=>performance.now(),"monotonicNow"),schedule(e,n,t){qe(e);let o=!0,i=globalThis.setTimeout(()=>{o&&(o=!1,n())},e);return t?.keepEventLoopAlive!==!0&&ze(i)&&i.unref(),{dispose(){o&&(o=!1,globalThis.clearTimeout(i))}}}};function ze(e){return typeof e=="object"&&e!==null&&"unref"in e&&typeof e.unref=="function"}r(ze,"isNodeTimer");function qe(e){if(!Number.isFinite(e)||e<0)throw new RangeError("delayMs must be a finite non-negative number")}r(qe,"assertDelay");var te=Object.freeze({workspace:Object.freeze({idPrefix:"view"}),overlay:Object.freeze({idPrefix:"overlay"})});function F(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}r(F,"isUnknownRecord");var oe=["click","keydown","pointerdown","wheel","input"],ie=["open","close"],ae=["immediate","user-blocking","normal","idle"],se=["mount","update"],de=["quiet","cap","superseded"];var rr=new Set(Object.keys(te)),tr=new Set(ie),or=new Set(oe),ir=new Set(ae),ar=new Set(se),sr=new Set(de);function le(e){return{invoke:r((n,t)=>e.invoke(n,t),"invoke"),on:r((n,t)=>{let o=r((i,a)=>{t(a)},"wrapped");return e.on(n,o),()=>{e.off(n,o)}},"on")}}r(le,"transportOverIpcRenderer");function ce(e){return e!=null?le(e.ipcRenderer):le(D.ipcRenderer)}r(ce,"ipcRendererTransport");function Xe(e){return e===null?"null":Array.isArray(e)?"array":typeof e}r(Xe,"describeReceived");function H(e,n,t){return{ok:!1,path:e,expected:n,received:Xe(t)}}r(H,"failed");function Qe(e){return e.optional===!0}r(Qe,"isOptionalValidator");function B(e,n){return{expects:e,check:n,"~standard":{version:1,vendor:"dune",validate:r(t=>{let o=n(t,[]);return o.ok?{value:o.value}:{issues:[{message:`must be ${o.expected}, got ${o.received}`,path:o.path}]}},"validate")}}}r(B,"toValidator");function Ze(e,n,t){if(!F(n))return H(t,"object",n);let o=[];for(let[i,a]of Object.entries(e)){let d=Object.hasOwn(n,i)?n[i]:void 0;if(d===void 0&&Qe(a))continue;let s=a.check(d,[...t,i]);if(!s.ok)return s;o.push([i,s.value])}return{ok:!0,value:Object.fromEntries(o)}}r(Ze,"checkRpcFields");function j(){return B("string",(e,n)=>typeof e=="string"?{ok:!0,value:e}:H(n,"string",e))}r(j,"rpcString");function K(){return B("boolean",(e,n)=>typeof e=="boolean"?{ok:!0,value:e}:H(n,"boolean",e))}r(K,"rpcBoolean");function T(e){return B("object",(n,t)=>Ze(e,n,t))}r(T,"rpcObject");function en(e){let n=e["~standard"];return typeof n=="object"&&n!==null&&n.version===1&&typeof n.validate=="function"}r(en,"isStandardSchema");var _=class extends Error{static{r(this,"RpcMethodDeclarationError")}constructor(n){super(`rpcMethod().args: field "${n}" is not an rpc field validator; pass rpc* combinators or one Standard Schema v1 value.`),this.name="RpcMethodDeclarationError"}};function C(){return{noArgs:{schema:null},args:r(e=>{if(en(e))return{schema:e};for(let[n,t]of Object.entries(e))if(typeof t?.check!="function")throw new _(n);return{schema:T(e)}},"args")}}r(C,"rpcMethod");function U(e,n){return Object.freeze({kind:"rpc-edge",edge:e,methods:n.methods,hasEvents:n.events!=null})}r(U,"declareRpcEdge");var ue="edge/unknown-method",W="edge/transport-failed";var fe="edge/handler-failed";var h=class extends Error{static{r(this,"EdgeCallFailure")}code;detail;constructor(n){super(`${n.code}: ${n.detail}`),this.name="EdgeCallFailure",this.code=n.code,this.detail=n.detail}};function pe(e){return typeof e!="object"||e==null||!("ok"in e)?!1:typeof e.ok=="boolean"}r(pe,"isEdgeReplyEnvelope");function nn(e,n){return`dune-rpc:${e}:m:${n}`}r(nn,"methodChannel");function rn(e,n){return`dune-rpc:${e}:e:${n}`}r(rn,"eventChannel");function tn(e){return`dune-rpc:${e}:probe`}r(tn,"probeChannel");var Dr=T({});function $(e,n){let t={},o=r(async(a,d)=>{let s=d instanceof Error?d.message:String(d),l;try{l=await n.invoke(tn(e.edge),a)}catch{return new h({code:W,detail:s})}return pe(l)&&!l.ok&&l.failure.code===ue?new h(l.failure):new h({code:W,detail:s})},"classifyRejectedInvoke"),i=r(async(a,d)=>{let s;try{s=await n.invoke(nn(e.edge,a),d)}catch(l){throw await o(a,l)}if(!pe(s))throw new h({code:fe,detail:"The edge replied outside its envelope."});if(s.ok)return s.value;throw new h(s.failure)},"callMethod");for(let[a,{schema:d}]of Object.entries(e.methods))t[a]=d===null?()=>i(a,{}):s=>i(a,s);return e.hasEvents&&(t.subscribe=a=>{let d=[];for(let[s,l]of Object.entries(a))l!=null&&d.push(n.on(rn(e.edge,s),l));return()=>{for(let s of d)s()}}),t}r($,"bridgeEdge");var on=r(()=>{},"noSchedulingReport");function an(e,n,t){return{policyName:e,reason:n,errorClass:t instanceof Error?t.name:typeof t}}r(an,"failedStop");var S=class extends Error{static{r(this,"DeadlineExceededError")}code="deadline_exceeded";policyName;constructor(n){super(`Deadline exceeded for ${n}`),this.name="DeadlineExceededError",this.policyName=n}};function G(e){ye(e.name),ge(e.timeoutMs,"timeoutMs");let n=e.clock??b;return{name:e.name,async run(t,o){if(o?.aborted)throw me(o,e.name);let i=new AbortController,a=r(()=>{},"rejectTimeout"),d=new Promise((p,c)=>{a=c}),s=r(()=>{},"rejectCancellation"),l=new Promise((p,c)=>{s=c}),u=r(()=>{},"removeAbortListener");if(o!=null){let p=r(()=>{let c=me(o,e.name);s(c),i.abort(c)},"abort");o.addEventListener("abort",p,{once:!0}),u=r(()=>o.removeEventListener("abort",p),"removeAbortListener")}let y=n.schedule(e.timeoutMs,()=>{let p=new S(e.name);a(p),i.abort(p)});try{return await Promise.race([t(i.signal),d,l])}finally{y.dispose(),u()}}}}r(G,"createDeadlinePolicy");function M(e){if(ye(e.name),ge(e.intervalMs,"intervalMs"),e.intervalMs===0)throw new RangeError(`${e.name}: intervalMs must be greater than 0`);let n=e.clock??b,t=e.report??on;return{name:e.name,start(o,i){let a=sn(),d=r(()=>{},"resolveStopped"),s=new Promise(m=>{d=m}),l=r(()=>{},"removeAbortListener"),u=r(m=>a.dispose()?(l(),d(m),!0):!1,"stop"),y=r(()=>{u({policyName:e.name,reason:"disposed"})},"dispose"),p=r(m=>{u({policyName:e.name,reason:"tick-failed",cause:m})&&t(an(e.name,"tick-failed",m))},"tickFailed"),c=r(()=>{if(a.fired(),a.current.state==="disposed")return;let m;try{m=o()}catch(R){p(R);return}m.then(()=>{a.current.state!=="disposed"&&a.arm(n.schedule(e.intervalMs,c))},p)},"run"),g={dispose:y,stopped:s};return i?.aborted?(y(),g):(i!=null&&(i.addEventListener("abort",y,{once:!0}),l=r(()=>i.removeEventListener("abort",y),"removeAbortListener")),e.leading??!0?c():a.arm(n.schedule(e.intervalMs,c)),g)}}}r(M,"createPollingPolicy");function sn(){let e={state:"running"};return{get current(){return e},arm(n){if(e.state==="disposed"){n.dispose();return}e.state==="armed"&&e.handle.dispose(),e={state:"armed",handle:n}},fired(){e.state==="armed"&&(e={state:"running"})},dispose(){return e.state==="disposed"?!1:(e.state==="armed"&&e.handle.dispose(),e={state:"disposed"},!0)}}}r(sn,"createLifecycle");var ot={none:0,equal:1/2,full:1};function me(e,n){return e.reason??dn(n)}r(me,"abortReason");function dn(e){let n=new Error(`Operation aborted for ${e}`);return n.name="AbortError",n}r(dn,"createAbortError");var ln=/^[a-z0-9]+([-.][a-z0-9]+)*$/;function ye(e){if(!ln.test(e))throw new TypeError(`name must be lowercase segments joined by "-" or ".", got ${JSON.stringify(e)}`)}r(ye,"assertName");function ge(e,n){if(!Number.isFinite(e)||e<0)throw new RangeError(`${n} must be a finite non-negative number`)}r(ge,"assertDuration");var Y=[{code:"KeyA",keysym:97,forceShift:!1},{code:"KeyC",keysym:99,forceShift:!1},{code:"KeyV",keysym:118,forceShift:!0},{code:"KeyX",keysym:120,forceShift:!1},{code:"KeyZ",keysym:122,forceShift:!1}],L=65507,I=65505,J=[[65511,"MetaLeft"],[65512,"MetaRight"],[65513,"AltLeft"],[65514,"AltRight"],[65515,"SuperLeft"],[65516,"SuperRight"]];function z(){let e="",n="";return{shouldSendHostText(t){return t.length>0&&t!==e&&t!==n},commitHostText(t){e=t},resolveVmText(t){return t.length===0||t===e||t===n?null:(n=t,t)}}}r(z,"createVncClipboardMirror");var Ee=U("box-vnc",{methods:{readClipboard:C().noArgs,writeClipboard:C().args({text:j()}),reportUserPresence:C().args({isPresent:K()})}});var ke="sand:vnc-host-key";function q(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}r(q,"isUnknownRecord");var ve="sand:vnc-liveness",X=1e4,he=3;var Re="sand:vnc-viewer-visible";function be(e){return`
    import("./app/ui.js")
      .then(function (m) {
        var rfb = m && m.default && m.default.rfb;
        var text = ${JSON.stringify(e)};
        if (rfb && typeof rfb.clipboardPasteFrom === "function" && text) {
          rfb.clipboardPasteFrom(text);
          return true;
        }
        return false;
      })
      .catch(function () {
        return false;
      });
  `}r(be,"buildHostClipboardPasteScript");function Se(e,n){return n&&e.length>0?e:null}r(Se,"resolveHostToBoxSync");var cn="sandVncImeInput";function xe(){return`
    (function () {
      if (window.__sandVncImeFieldInstalled) return;
      window.__sandVncImeFieldInstalled = true;

      var FIELD_ID = ${JSON.stringify(cn)};
      var XK_RETURN = 65293;
      var ui = null;
      var keysyms = null;

      function liveRfb() {
        var rfb = ui && ui.rfb;
        return rfb && typeof rfb.sendKey === "function" ? rfb : null;
      }

      function keysymOf(codepoint) {
        if (codepoint === 0x0a || codepoint === 0x0d) return XK_RETURN;
        if (codepoint < 0x20) return null;
        return keysyms.lookup(codepoint);
      }

      function sendText(text) {
        var rfb = liveRfb();
        if (!rfb) return;
        var chars = Array.from(text);
        for (var i = 0; i < chars.length; i++) {
          var keysym = keysymOf(chars[i].codePointAt(0));
          if (keysym === null) continue;
          rfb.sendKey(keysym, null, true);
          rfb.sendKey(keysym, null, false);
        }
      }

      function isViewerCanvas(node) {
        return node instanceof HTMLCanvasElement && node.closest("#noVNC_container") !== null;
      }

      function install(Keyboard) {
        var field = document.createElement("textarea");
        field.id = FIELD_ID;
        field.tabIndex = -1;
        field.setAttribute("aria-label", "Remote desktop keyboard input");
        field.setAttribute("autocapitalize", "off");
        field.setAttribute("autocomplete", "off");
        field.setAttribute("autocorrect", "off");
        field.setAttribute("spellcheck", "false");
        field.style.cssText =
          "position:fixed;left:0;top:0;width:1px;height:1px;margin:0;padding:0;border:0;" +
          "opacity:0;overflow:hidden;resize:none;pointer-events:none;";
        document.body.appendChild(field);

        var keyboard = new Keyboard(field);
        keyboard.onkeyevent = function (keysym, code, down) {
          var rfb = liveRfb();
          if (rfb) rfb.sendKey(keysym, code, down);
        };
        keyboard.grab();

        function moveCandidateWindowAnchorTo(e) {
          if (!isViewerCanvas(e.target)) return;
          field.style.left = e.clientX + "px";
          field.style.top = e.clientY + "px";
        }

        field.addEventListener("compositionend", function (e) {
          if (typeof e.data === "string") sendText(e.data);
          field.value = "";
        });
        field.addEventListener("beforeinput", function (e) {
          if (e.isComposing || e.inputType === "insertCompositionText") return;
          e.preventDefault();
          if (e.inputType === "insertText" && typeof e.data === "string") {
            sendText(e.data);
          } else if (e.inputType === "insertLineBreak" || e.inputType === "insertParagraph") {
            sendText("\\n");
          }
        });
        field.addEventListener("input", function (e) {
          if (!e.isComposing) field.value = "";
        });

        document.addEventListener(
          "focus",
          function (e) {
            if (isViewerCanvas(e.target)) field.focus({ preventScroll: true });
          },
          true,
        );
        document.addEventListener("mousedown", moveCandidateWindowAnchorTo, true);

        if (isViewerCanvas(document.activeElement)) field.focus({ preventScroll: true });
      }

      return Promise.all([
        import("./app/ui.js"),
        import("./core/input/keyboard.js"),
        import("./core/input/keysymdef.js"),
      ]).then(function (modules) {
        ui = modules[0] && modules[0].default;
        var Keyboard = modules[1] && modules[1].default;
        keysyms = modules[2] && modules[2].default;
        if (!ui || !keysyms || typeof Keyboard !== "function") {
          throw new Error("noVNC modules lack Keyboard, keysymdef, or UI");
        }
        if (document.body) {
          install(Keyboard);
        } else {
          document.addEventListener("DOMContentLoaded", function () { install(Keyboard); }, { once: true });
        }
      });
    })();
  `}r(xe,"buildVncImeFieldScript");var Te=[{member:"keyEvent",modulePath:"./core/rfb.js"},{member:"QEMUExtendedKeyEvent",modulePath:"./core/rfb.js"},{member:"pointerEvent",modulePath:"./core/rfb.js"},{member:"_damage",modulePath:"./core/display.js"},{member:"_recvMessage",modulePath:"./core/websock.js"}];var Q="__sandVncLivenessBeacon";function Ce(){let[e,n,t,o,i]=Te;return`
    (function () {
      if (window.${Q}) return;
      var counters = { keys: 0, clicks: 0, moves: 0, drawOps: 0, inBytes: 0 };
      window.${Q} = counters;
      var PRIMARY_BUTTON_MASK_BITS = 0x07;
      var lastButtonMask = 0;
      import(${JSON.stringify(e.modulePath)}).then(function (m) {
        var messages = m.default.messages;
        var keyEvent = messages.${e.member};
        messages.${e.member} = function (sock, keysym, down) {
          if (down) counters.keys += 1;
          return keyEvent.apply(this, arguments);
        };
        if (typeof messages.${n.member} === "function") {
          var qemuKeyEvent = messages.${n.member};
          messages.${n.member} = function (sock, keysym, down) {
            if (down) counters.keys += 1;
            return qemuKeyEvent.apply(this, arguments);
          };
        }
        var pointerEvent = messages.${t.member};
        messages.${t.member} = function (sock, x, y, mask) {
          if (mask & ~lastButtonMask & PRIMARY_BUTTON_MASK_BITS) counters.clicks += 1;
          else counters.moves += 1;
          lastButtonMask = mask;
          return pointerEvent.apply(this, arguments);
        };
      }).catch(function () {});
      import(${JSON.stringify(o.modulePath)}).then(function (m) {
        var damage = m.default.prototype.${o.member};
        m.default.prototype.${o.member} = function () {
          counters.drawOps += 1;
          return damage.apply(this, arguments);
        };
      }).catch(function () {});
      import(${JSON.stringify(i.modulePath)}).then(function (m) {
        var recvMessage = m.default.prototype.${i.member};
        m.default.prototype.${i.member} = function (e) {
          counters.inBytes += (e && e.data && e.data.byteLength) || 0;
          return recvMessage.apply(this, arguments);
        };
      }).catch(function () {});
    })();
  `}r(Ce,"buildVncLivenessBeaconScript");function we(){return`JSON.stringify(window.${Q} || null)`}r(we,"buildVncLivenessBeaconReadExpression");function w(e){return typeof e=="number"&&Number.isFinite(e)&&e>=0}r(w,"isBeaconCount");function Pe(e){if(typeof e!="string")return null;let n=JSON.parse(e);return!q(n)||!w(n.keys)||!w(n.clicks)||!w(n.moves)||!w(n.drawOps)||!w(n.inBytes)?null:{keys:n.keys,clicks:n.clicks,moves:n.moves,drawOps:n.drawOps,inBytes:n.inBytes}}r(Pe,"parseVncLivenessBeaconCounters");function Ae(){let e=null,n=[],t=null,o=!1;function i(){e=null,n=[],t=null,o=!1}r(i,"reset");function a(s,l){i(),e=l,t=s}r(a,"rebaseline");function d(s,l){if(e==null)return a(s,l),null;let u={atMs:s,keys:l.keys-e.keys,clicks:l.clicks-e.clicks,moves:l.moves-e.moves,drawOps:l.drawOps-e.drawOps,inBytes:l.inBytes-e.inBytes};if(u.keys<0||u.clicks<0||u.moves<0||u.drawOps<0||u.inBytes<0)return a(s,l),null;e=l,n.push(u);let y=s-X;if(n=n.filter(f=>f.atMs>y),u.drawOps>0&&(o=!1),o||t==null||s-t<X)return null;let p=0,c=0,g=0,m=0,R=0;for(let f of n)p+=f.keys,c+=f.clicks,g+=f.moves,m+=f.drawOps,R+=f.inBytes;if(p+c<he||m>0||R>0)return null;o=!0;let v=n.find(f=>f.keys+f.clicks>0);return{phase:"post_connect",stallMs:s-(v?.atMs??s),keys:p,clicks:c,moves:g,inBytes:R}}return r(d,"sample"),{sample:d,reset:i}}r(Ae,"createVncLivenessDetector");function De(){let e=!1;return{isVisible:r(()=>e,"isVisible"),update(n){let t=n===!0,o=t&&!e;return e=t,o}}}r(De,"createViewerVisibilityGate");var ee={};re(ee,{getErrorMessage:()=>E,getIpcRenderer:()=>Z,getWebFrame:()=>He,installSandBrowserPreload:()=>kn,logWarn:()=>k});var _e=6e4;function Me(e){return e.policy.run(()=>e.call).catch(n=>{throw n instanceof S?(e.reportStall({method:e.method,since:e.since}),e.buildStallError()):n})}r(Me,"raceWithPasskeyStallDeadline");function E(e){return e instanceof Error?e.message:void 0}r(E,"getErrorMessage");function k(...e){console.warn("[sand-webview-preload]",...e)}r(k,"logWarn");var Le=[".okta.com",".okta-emea.com",".oktapreview.com",".duosecurity.com",".login.microsoftonline.com",".onelogin.com",".auth0.com",".pingidentity.com",".rippling.com"];var Ie=!1,Oe=null,Fe=null;function Ve(){if(!Ie){Ie=!0;try{let e=require("electron");Oe=e.ipcRenderer??null,Fe=e.webFrame??null}catch(e){k("electron module unavailable",E(e))}}}r(Ve,"loadElectron");function Z(){return Ve(),Oe}r(Z,"getIpcRenderer");function He(){return Ve(),Fe}r(He,"getWebFrame");function pn(e){if(typeof e!="string"||e.length===0)return!1;for(let n=0;n<Le.length;n++)if(e.endsWith(Le[n]))return!0;return!1}r(pn,"isAllowlistedIdpHost");function un(){let e=He();if(e==null||typeof location>"u"||!pn(location.hostname))return;e.executeJavaScript(`
    (function () {
      var permissions = navigator && navigator.permissions;
      if (!permissions || typeof permissions.query !== "function") return;
      if (permissions.__sandLocalNetworkPolyfill) return;
      permissions.__sandLocalNetworkPolyfill = true;
      var originalQuery = permissions.query.bind(permissions);
      permissions.query = function (descriptor) {
        var name = descriptor && descriptor.name;
        if (name === "local-network-access" || name === "local-network") {
          var status = new EventTarget();
          Object.defineProperties(status, {
            name: { value: name },
            state: { value: "granted" },
            onchange: { value: null, writable: true },
          });
          return Promise.resolve(status);
        }
        return originalQuery(descriptor);
      };
    })();
  `).catch(t=>{k("local network polyfill injection failed",E(t))})}r(un,"injectLocalNetworkAccessPolyfill");function fn(){try{return new DOMException("Passkey request stalled","NotAllowedError")}catch{let n=new Error("Passkey request stalled");return n.name="NotAllowedError",n}}r(fn,"buildPasskeyStallError");var mn=G({name:"sand-webview-passkey-stall",timeoutMs:_e});function Ne(e,n,t){return r(function(...i){let a=Date.now(),d;try{let s=t.apply(navigator.credentials,i);d=Promise.resolve(s)}catch(s){return Promise.reject(s)}return Me({policy:mn,method:n,since:a,call:d,reportStall:r(s=>{try{e.sendToHost("sand:browser-passkey-stalled",s)}catch(l){k("passkey stall send failed",E(l))}},"reportStall"),buildStallError:fn})},"patchedCredentialMethod")}r(Ne,"wrapCredentialMethod");function yn(){if(typeof navigator>"u")return;let e=Z();if(e!=null&&navigator.credentials){if(typeof navigator.credentials.create=="function"){let n=navigator.credentials.create.bind(navigator.credentials);navigator.credentials.create=Ne(e,"create",n)}if(typeof navigator.credentials.get=="function"){let n=navigator.credentials.get.bind(navigator.credentials);navigator.credentials.get=Ne(e,"get",n)}}}r(yn,"installWebAuthnPolyfill");function gn(){typeof window>"u"||window.__sandDialogOverridesApplied!==!0&&(window.alert=r(function(){},"sandAlertStub"),window.confirm=r(function(){return!0},"sandConfirmStub"),window.prompt=r(function(){return null},"sandPromptStub"),window.__sandDialogOverridesApplied=!0)}r(gn,"installDialogStubs");function En(){let e=Z();if(e==null)return;let n=e;if(typeof window>"u"||typeof location>"u")return;let t=location.origin;function o(){try{n.sendToHost("sand:browser-popup-closed",{url:location.href})}catch(i){k("popup-closed send failed",E(i))}}r(o,"sendPopupClosed"),window.addEventListener("beforeunload",o),window.addEventListener("pagehide",o),window.addEventListener("pageshow",r(function(a){if(!(!a||a.persisted!==!0)&&location.origin===t)try{n.sendToHost("sand:browser-origin-return",{origin:t,currentUrl:location.href})}catch(d){k("origin-return send failed",E(d))}},"onPageShow"))}r(En,"installIpcWiring");function kn(){try{un()}catch(e){k("local network polyfill install failed",E(e))}try{yn()}catch(e){k("webauthn polyfill install failed",E(e))}try{gn()}catch(e){k("dialog stubs install failed",E(e))}try{En()}catch(e){k("ipc wiring install failed",E(e))}}r(kn,"installSandBrowserPreload");function je(e){let n=e.getIpcRenderer();return n==null?null:$(Ee,ce({ipcRenderer:n}))}r(je,"resolveBoxVncEdge");function x(){if(typeof location>"u"||!location.pathname.endsWith("/vnc.html"))return!1;try{return new URLSearchParams(location.search).get("sandInteractive")==="1"}catch{return!1}}r(x,"isInteractiveVncPage");function Be(){if(typeof document>"u")return null;let e=document.getElementById("noVNC_clipboard_text");return e instanceof HTMLTextAreaElement?e:null}r(Be,"getVncClipboardTextarea");function vn({getErrorMessage:e,getWebFrame:n,logWarn:t}){if(typeof location>"u"||!location.pathname.endsWith("/vnc.html"))return;let o=`
    #noVNC_control_bar,
    #noVNC_control_bar_handle,
    #noVNC_control_bar_anchor,
    #noVNC_status,
    .noVNC_logo {
      display: none !important;
      pointer-events: none !important;
      visibility: hidden !important;
    }
  `;try{n()?.insertCSS(o)}catch(a){t("noVNC CSS injection failed",e(a))}function i(){document.getElementById("noVNC_control_bar")?.classList.remove("noVNC_open")}r(i,"apply"),!(typeof document>"u")&&(i(),document.addEventListener("DOMContentLoaded",i,{once:!0}),window.addEventListener("load",i,{once:!0}))}r(vn,"installNoVncChromeHider");function hn(e){let{getErrorMessage:n,getIpcRenderer:t,getWebFrame:o,logWarn:i}=e,a=t(),d=je(e);if(a==null||d==null)return;let s=d;if(typeof window>"u"||typeof document>"u"||!x())return;let l=500,u=200,y=z(),p=0,c=De();a.on(Re,(v,f)=>{c.update(f)&&m()});function g(){if(!c.isVisible())return;let v=Be();if(v==null)return;let f=y.resolveVmText(v.value);f!=null&&s.writeClipboard({text:f}).catch(P=>{i("vnc clipboard write failed",n(P))})}r(g,"mirrorBoxClipboardToHost");function m(){if(!c.isVisible())return;let v=Date.now();v-p<u||(p=v,s.readClipboard().then(f=>{if(!y.shouldSendHostText(f))return;let P=o();P?.executeJavaScript(be(f)).then(N=>{let O=Se(f,N===!0);if(O==null)return;y.commitHostText(O);let ne=Be();ne!=null&&(ne.value=O)}).catch(N=>{i("vnc clipboard paste failed",n(N))})}).catch(f=>{i("vnc clipboard read failed",n(f))}))}r(m,"mirrorHostClipboardToBox");let R=M({name:"vnc-clipboard-mirror",intervalMs:l}).start(async()=>{g()});window.addEventListener("focus",m),document.addEventListener("mousedown",m,!0),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&m()}),window.addEventListener("pagehide",()=>R.dispose(),{once:!0})}r(hn,"installVncClipboardBridge");function Ke(e){let{getErrorMessage:n,logWarn:t}=e,o=je(e);if(o==null)return;let i=o;if(typeof window>"u"||typeof document>"u"||!x())return;if(document.documentElement==null){document.addEventListener("DOMContentLoaded",()=>Ke(e),{once:!0});return}let a=null;function d(l){l!==a&&(a=l,i.reportUserPresence({isPresent:l}).catch(u=>{t("vnc user presence report failed",n(u))}))}r(d,"report");let s=document.documentElement;s.addEventListener("mouseenter",()=>d(!0)),s.addEventListener("mouseleave",()=>d(!1)),document.addEventListener("mousemove",()=>d(!0),{passive:!0}),window.addEventListener("blur",()=>d(!1)),window.addEventListener("pagehide",()=>d(!1),{once:!0})}r(Ke,"installVncUserPresenceReporter");function Rn({getErrorMessage:e,getIpcRenderer:n,logWarn:t}){let o=n();if(o==null||typeof document>"u"||!x())return;let i=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]);document.addEventListener("keydown",a=>{if(i.has(a.key))try{o.sendToHost(ke,a.key)}catch(d){t("vnc host key forward failed",e(d))}},!0)}r(Rn,"installVncHostKeyForwarder");function bn({getErrorMessage:e,getIpcRenderer:n,logWarn:t}){let o=n();if(o==null)return;let i=o;if(typeof window>"u"||typeof document>"u"||typeof location>"u"||!location.pathname.endsWith("/vnc.html"))return;function a(c,g){try{i.sendToHost("sand:vnc-session",JSON.stringify({phase:c,clean:g}))}catch(m){t("vnc session report failed",e(m))}}r(a,"report");let d=0,s=!1,l=null;function u(){let c=document.documentElement.classList;return c.contains("noVNC_connected")?"connected":c.contains("noVNC_reconnecting")?"reconnecting":c.contains("noVNC_connecting")?"connecting":c.contains("noVNC_disconnecting")?"disconnecting":"disconnected"}r(u,"currentState");function y(){let c=u();c!==l&&(l=c,c==="connected"?(d+=1,a(d>1?"reconnect":"rfb_connect",!0),s=!0):s&&c!=="connecting"&&(a("rfb_disconnect",c==="disconnecting"),s=!1))}r(y,"evaluate");function p(){let c=new MutationObserver(y);c.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]}),y(),window.addEventListener("pagehide",()=>c.disconnect(),{once:!0})}r(p,"start"),document.documentElement==null?document.addEventListener("DOMContentLoaded",()=>p(),{once:!0}):p()}r(bn,"installVncRfbSessionReporter");function Sn({getErrorMessage:e,getIpcRenderer:n,getWebFrame:t,logWarn:o}){let i=n(),a=t();if(i==null||a==null)return;let d=i,s=a;if(typeof window>"u"||typeof document>"u"||!x())return;s.executeJavaScript(Ce()).catch(p=>{o("vnc liveness beacon install failed",e(p))});let l=Ae(),u=we(),y=M({name:"vnc-liveness-sampler",intervalMs:1e3}).start(async()=>{if(document.documentElement?.classList.contains("noVNC_connected")!==!0){l.reset();return}try{let p=await s.executeJavaScript(u),c=Pe(p);if(c==null)return;let g=l.sample(performance.now(),c);if(g==null)return;d.sendToHost(ve,g)}catch(p){o("vnc liveness sample failed",e(p))}});window.addEventListener("pagehide",()=>y.dispose(),{once:!0})}r(Sn,"installVncLivenessTripwire");function xn({getErrorMessage:e,getWebFrame:n,logWarn:t}){let o=n();if(o==null||!x())return;let i=`
    (function () {
      if (window.__sandVncMacKeysInstalled) return;
      if (!/Mac/i.test((navigator && navigator.platform) || "")) return;
      window.__sandVncMacKeysInstalled = true;

      var CHORDS = ${JSON.stringify(Y)};
      var HELD_MODIFIERS = ${JSON.stringify(J)};

      var ui = null;
      import("./app/ui.js")
        .then(function (m) { ui = m && m.default; })
        .catch(function () {});

      document.addEventListener("keydown", function (e) {
        if (!e.metaKey) return;
        var chord = CHORDS.find(function (entry) { return entry.code === e.code; });
        if (!chord) return;
        var rfb = ui && ui.rfb;
        if (!rfb || typeof rfb.sendKey !== "function") return;
        e.preventDefault();
        e.stopImmediatePropagation();
        // noVNC presses Meta/Alt down for Cmd, so release them first to avoid
        // sending Alt+Ctrl+key instead of a clean Ctrl+key.
        for (var i = 0; i < HELD_MODIFIERS.length; i++) {
          try { rfb.sendKey(HELD_MODIFIERS[i][0], HELD_MODIFIERS[i][1], false); } catch (_e) {}
        }
        var withShift = e.shiftKey || chord.forceShift;
        var chordKeysym = withShift ? chord.keysym - 0x20 : chord.keysym;
        rfb.sendKey(${L}, "ControlLeft", true);
        if (withShift) rfb.sendKey(${I}, "ShiftLeft", true);
        rfb.sendKey(chordKeysym, e.code, true);
        rfb.sendKey(chordKeysym, e.code, false);
        if (withShift) rfb.sendKey(${I}, "ShiftLeft", false);
        rfb.sendKey(${L}, "ControlLeft", false);
      }, true);
    })();
  `;o.executeJavaScript(i).catch(a=>{t("vnc mac key mapping injection failed",e(a))})}r(xn,"installVncMacKeyMapping");function Tn({getErrorMessage:e,getWebFrame:n,logWarn:t}){let o=n();o!=null&&x()&&o.executeJavaScript(xe()).catch(i=>{t("vnc ime field injection failed",e(i))})}r(Tn,"installVncImeField");function Ue(e=ee){let{getErrorMessage:n,installSandBrowserPreload:t,logWarn:o}=e;t();try{vn(e)}catch(i){o("noVNC chrome hider install failed",n(i))}try{hn(e)}catch(i){o("vnc clipboard bridge install failed",n(i))}try{Ke(e)}catch(i){o("vnc user presence reporter install failed",n(i))}try{Rn(e)}catch(i){o("vnc host key forwarder install failed",n(i))}try{bn(e)}catch(i){o("vnc rfb session reporter install failed",n(i))}try{xn(e)}catch(i){o("vnc mac key mapping install failed",n(i))}try{Tn(e)}catch(i){o("vnc ime field install failed",n(i))}try{Sn(e)}catch(i){o("vnc liveness tripwire install failed",n(i))}}r(Ue,"installVncPreload");Ue();0&&(module.exports={installVncPreload});
//# debugId=62409c1e-f3c8-46a5-bd84-813dc18b4d14
