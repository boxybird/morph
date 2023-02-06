(()=>{var e={854:e=>{function t(e){return void 0===e}function n(e){return e===Object(e)}function o(e){return Array.isArray(e)}function r(e,o){return o?n(e)&&!t(e.uri):n(e)&&"number"==typeof e.size&&"string"==typeof e.type&&"function"==typeof e.slice}function i(e){return!t(e)&&e}e.exports={serialize:function e(a,s,l,u){s=s||{},l=l||new FormData,s.indices=i(s.indices),s.nullsAsUndefineds=i(s.nullsAsUndefineds),s.booleansAsIntegers=i(s.booleansAsIntegers),s.allowEmptyArrays=i(s.allowEmptyArrays),s.noFilesWithArrayNotation=i(s.noFilesWithArrayNotation),s.dotsForObjectNotation=i(s.dotsForObjectNotation);const c="function"==typeof l.getParts;return t(a)||(null===a?s.nullsAsUndefineds||l.append(u,""):!function(e){return"boolean"==typeof e}(a)?o(a)?a.length?a.forEach(((t,o)=>{let i=u+"["+(s.indices?o:"")+"]";s.noFilesWithArrayNotation&&function(e,t){return r(e,t)&&"string"==typeof e.name&&(n(e.lastModifiedDate)||"number"==typeof e.lastModified)}(t,c)&&(i=u),e(t,s,l,i)})):s.allowEmptyArrays&&l.append(u+"[]",""):!function(e){return e instanceof Date}(a)?n(a)&&!r(a,c)?Object.keys(a).forEach((t=>{const n=a[t];if(o(n))for(;t.length>2&&t.lastIndexOf("[]")===t.length-2;)t=t.substring(0,t.length-2);const r=u?s.dotsForObjectNotation?u+"."+t:u+"["+t+"]":t;e(n,s,l,r)})):l.append(u,a):l.append(u,a.toISOString()):s.booleansAsIntegers?l.append(u,a?1:0):l.append(u,a)),l}}}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var i=t[o]={exports:{}};return e[o](i,i.exports,n),i.exports}(()=>{"use strict";function e(e){return new class{el=void 0;constructor(e){this.el=e}traversals={first:"firstElementChild",next:"nextElementSibling",parent:"parentElement"};nodes(){return this.traversals={first:"firstChild",next:"nextSibling",parent:"parentNode"},this}first(){return this.teleportTo(this.el[this.traversals.first])}next(){return this.teleportTo(this.teleportBack(this.el[this.traversals.next]))}before(e){return this.el[this.traversals.parent].insertBefore(e,this.el),e}replace(e){return this.el[this.traversals.parent].replaceChild(e,this.el),e}append(e){return this.el.appendChild(e),e}teleportTo(e){return e&&e._x_teleport?e._x_teleport:e}teleportBack(e){return e&&e._x_teleportBack?e._x_teleportBack:e}}(e)}var t=()=>{},o=()=>{};async function r(n,r,a){let s,l,u,c,f,d,p,h,w,m,y;function v(e){if(y)return o((e||"").replace("\n","\\n"),s,l),new Promise((e=>t=()=>e()))}async function g(t,n){if(function(e,t){return e.nodeType!=t.nodeType||e.nodeName!=t.nodeName||x(e)!=x(t)}(t,n)){let o=function(t,n){if(i(p,t))return;let o=n.cloneNode(!0);if(i(w,o))return;e(t).replace(o),h(t),m(o)}(t,n);return await v("Swap elements"),o}let o=!1;if(!i(f,t,n,(()=>o=!0))){if(window.Alpine&&function(e,t,n){if(1!==e.nodeType)return;e._x_dataStack&&window.Alpine.clone(e,t)}(t,n),3===(r=n).nodeType||8===r.nodeType)return await async function(e,t){let n=t.nodeValue;e.nodeValue!==n&&(e.nodeValue=n,await v("Change text node to: "+n))}(t,n),void d(t,n);var r;o||await async function(e,t){if(e._x_isShown&&!t._x_isShown)return;if(!e._x_isShown&&t._x_isShown)return;let n=Array.from(e.attributes),o=Array.from(t.attributes);for(let o=n.length-1;o>=0;o--){let r=n[o].name;t.hasAttribute(r)||(e.removeAttribute(r),await v("Remove attribute"))}for(let t=o.length-1;t>=0;t--){let n=o[t].name,r=o[t].value;e.getAttribute(n)!==r&&(e.setAttribute(n,r),await v(`Set [${n}] attribute to: "${r}"`))}}(t,n),d(t,n),await async function(t,n){let o=t.childNodes,r=(A(n.childNodes),A(o)),a=e(n).nodes().first(),s=e(t).nodes().first(),l={};for(;a;){let n=x(a),o=x(s);if(!s){if(!n||!l[n]){let n=b(a,t)||{};await v("Add element: "+(n.outerHTML||n.nodeValue)),a=e(a).nodes().next();continue}{let o=l[n];e(t).append(o),s=o,await v("Add element (from key)")}}if(c){let t=e(a).next(),n=!1;for(;!n&&t;)s.isEqualNode(t)&&(n=!0,s=S(a,s),o=x(s),await v("Move element (lookahead)")),t=e(t).next()}if(n!==o){if(!n&&o){l[o]=s,s=S(a,s),l[o].remove(),s=e(s).nodes().next(),a=e(a).nodes().next(),await v('No "to" key');continue}if(n&&!o&&r[n]&&(s=e(s).replace(r[n]),await v('No "from" key')),n&&o){l[o]=s;let t=r[n];if(!t){l[o]=s,s=S(a,s),l[o].remove(),s=e(s).next(),a=e(a).next(),await v("Swap elements with keys");continue}s=e(s).replace(t),await v('Move "from" key')}}let i=s&&e(s).nodes().next();await g(s,a),a=a&&e(a).nodes().next(),s=i}let u=[];for(;s;)i(p,s)||u.push(s),s=e(s).nodes().next();for(;u.length;){let e=u.shift();e.remove(),await v("remove el"),h(e)}}(t,n)}}function x(e){return e&&1===e.nodeType&&u(e)}function A(e){let t={};return e.forEach((e=>{let n=x(e);n&&(t[n]=e)})),t}function b(t,n){if(!i(w,t)){let o=t.cloneNode(!0);return e(n).append(o),m(o),o}return null}function S(t,n){if(!i(w,t)){let o=t.cloneNode(!0);return e(n).before(o),m(o),o}return n}return function(e={}){let t=()=>{};f=e.updating||t,d=e.updated||t,p=e.removing||t,h=e.removed||t,w=e.adding||t,m=e.added||t,u=e.key||(e=>e.getAttribute("key")),c=e.lookahead||!1,y=e.debug||!1}(a),s=n,l=function(e){const t=document.createElement("template");return t.innerHTML=e,t.content.firstElementChild}(r),window.Alpine&&window.Alpine.closestDataStack&&!n._x_dataStack&&(l._x_dataStack=window.Alpine.closestDataStack(n),l._x_dataStack&&window.Alpine.clone(n,l)),await v(),await g(n,l),s=void 0,l=void 0,n}function i(e,...t){let n=!1;return e(...t,(()=>n=!0)),n}r.step=()=>t(),r.log=e=>{o=e};var a=function(e){e.morph=r},s=n(854);const l=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},o=e.closest("[data-wpmorph-component-hash]"),r=o.dataset.wpmorphComponentHash,i={};"string"==typeof t?i[t]=t:Object.assign(i,t),n.onStart&&"function"==typeof n.onStart&&n.onStart(),fetch("/morph/api/v1/morph",{method:"POST",credentials:"same-origin",headers:{"X-Morph-Request":!0,"X-Morph-Hash":r},body:(0,s.serialize)(i)}).then((function(e){if(n.onResponse&&"function"==typeof n.onResponse&&n.onResponse(e),!e.ok)throw new Error(e.statusText);return e.text()})).then((function(e){window.Alpine.morph(o,e),n.onSuccess&&"function"==typeof n.onSuccess&&n.onSuccess(t)})).catch((function(e){n.onError&&"function"==typeof n.onError&&n.onError(e)})).finally((function(){n.onFinish&&"function"==typeof n.onFinish&&n.onFinish()}))},u=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};e=e.replace(/\./g,"/");var o=document.querySelectorAll('[data-wpmorph-component-name="'.concat(e,'"]'))||null;if(0===!o.length)throw new Error('Component(s) not found: "'.concat(e,'"'));o.forEach((function(e){l(e,t,n)}))};document.addEventListener("alpine:init",(function(){Alpine.plugin(a),window.Alpine.magic("wpMorph",(function(e){return function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return l(e,t,n)}})),window.Alpine.magic("wpMorphInvoke",(function(){return function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return u(e,t,n)}}))}))})()})();