module.exports=function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(r){return e[r]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=92)}({92:function(e,r,t){var n=t(93);global.result=void 0,global.params=void 0,global.wasp=void 0,process.on("message",function(e){if(e.order&&e.order.data){var r=e.order,t=e.script;params=r.data.params,r.data.value={},new Promise(function(e,r){wasp=n.createScript("result = (".concat(t,").apply(null, params)")),e(wasp.runInThisContext())}).then(function(){r.data.value=result,process.send({order:r})}).catch(function(e){return console.log(e)})}})},93:function(e,r){e.exports=require("vm")}});