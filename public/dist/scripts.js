"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};!function(t,e){t.wand=e()}("undefined"!=typeof window?window:void 0,function(){var t={apndr:function(t,e){if("object"!==("undefined"==typeof t?"undefined":_typeof(t))||"object"!==("undefined"==typeof e?"undefined":_typeof(e))||Array.isArray(e))if("object"!==("undefined"==typeof t?"undefined":_typeof(t)))console.error("First parameter passed is not an object element.");else if("object"!==("undefined"==typeof e?"undefined":_typeof(e)))"string"!=typeof e&&"number"!=typeof e||t.appendChild(this.txt(e));else if(Array.isArray(e))for(var r=e,n=0;n<r.length;n++)this.apndr(t,r[n]);else console.error("Parameters are not compatible in the lib.apndr function.  Hit the arrow on the left for call stack.");else t.appendChild(e)},querApndr:function(t,e,r){var n=document.querySelector(t);if(null!=n){if(Array.isArray(e))for(var o=e,i=0;i<o.length;i++)this.apndr(n,this.crtElm(o[i]));else r?this.apndr(n,this.crtElm(e,r)):this.apndr(n,e);return n}console.error("No tag exists in the DOM. Hit the arrow on the left for call stack.")},querAttr:function(t,e,r){var n=document.querySelector(t);null==n?console.error("No tag exists in the DOM. Hit the arrow on the left for call stack."):e&&n.setAttribute(e,r)},txt:function(t){return"string"==typeof t?document.createTextNode(t):"number"==typeof t?document.createTextNode(t.toString()):void console.error("Parameter passed to lib.txt is not a string nor a number.  Hit the arrow on the left for call stack.")},crtElm:function(t,e){var r,n=document.createElement(t);return e&&("string"==typeof e?(r=this.txt(e),this.apndr(n,r)):console.error("Must pass a string as the second param in lib.crtElm function.  Hit the arrow on the left for call stack.")),n}};return t});
"use strict";function changePlot(n){equPara.innerText="";var a="y = ",e=""+n;katex.render(a,yPara),katex.render(e,equPara),globalEqu=n,graphConfig.equation=e}function dispConfig(n){var a=JSON.parse(n),e=wand.crtElm("select");e.name="equDrop";for(var o=0;o<a.length;o++){var r=wand.crtElm("option",a[o].name);r.value=a[o].equation,wand.apndr(e,r),wand.querApndr("#dropdown",e),0===o&&changePlot(a[o].equation)}}function loadConfig(n,a){var e=new XMLHttpRequest;e.onreadystatechange=function(){4==e.readyState&&200==e.status&&(config=e.responseText,n(config),graphConfig.appConfig=JSON.parse(config))},e.open("GET",a,!0),e.send()}var config,globalEqu,equPara=wand.querApndr("#functionMachine #equ"),yPara=wand.querApndr("#functionMachine #y"),graphConfig={};loadConfig(dispConfig,"../funcMachineSettings.json");
"use strict";function aniConfig(t,n,e,a,o){var r={};return r.begCoorData=t,r.endCoorData=n,r.num=e,r.alphaid=a,r.delay=o,r}function animationTemplate(t){var n=t.begCoorData.top+5,e=t.begCoorData.right-30,a=t.endCoorData.top,o=t.endCoorData.right,r=246,i=wand.querApndr("#numContainer");return t.num.style.position="absolute",t.num.style.top=n+"px",t.num.style.left=e+"px",wand.apndr(i,t.num),lastSheet.insertRule("@keyframes toFuncMachine"+t.alphaid+" {\n                            0% {\n                                opacity: 0;\n                                top: "+n+"px;\n                                left: "+e+"px;\n                            }\n                            10% {\n                                opacity: 1;\n                            }\n                            33% {\n                                top: "+n+"px;\n                                left: "+r+"px;\n                            }\n                            66% {\n                                top: "+a+"px;\n                                left: "+r+"px;\n                            }\n                            90% {\n                                opacity: 1;\n                            }\n                            100% {\n                                opacity: 0;\n                                top: "+a+"px;\n                                left: "+o+"px;\n                            }\n                        }",lastSheet.cssRules.length),t.num.style.animation="toFuncMachine"+t.alphaid+" 3s ease-in-out "+14*t.delay+"s",t.num.style.opacity="0",t.num.style.zIndex="100",new Promise(function(n){window.setTimeout(function(){n(t.num)},3e3*t.delay)})}function animateToStatusBar(){console.log("Animate to status bar and pass the information to the graph function")}function equAppear(t){return new Promise(function(n){setTimeout(function(){"number"==typeof t&&(statusBar.innerText="",statusBar.innerText=">> Returning answer."),equPara.innerHTML="",equPara.style.opacity=0,katex.render(""+t,equPara),equPara.style.animation="textAppear 1s ease-in-out",equPara.style.opacity=1,n(t)},1500)})}function equAnimeDisappear(t){return new Promise(function(n){var e;if("object"===("undefined"==typeof t?"undefined":_typeof(t)))e=globalEqu.replace("x","*("+t.innerText+")"),statusBar.innerText="",statusBar.innerText=">> Calculating",setTimeout(function(){equPara.style.animation="textDisappear 1.5s ease-in-out",n(e)},1500);else{if("string"!=typeof t)return;e=math.eval(t),setTimeout(function(){equPara.style.animation="textDisappear 1.5s ease-in-out",n(e)},1500)}})}function createAns(t){var n=wand.querApndr("#numContainer"),e=wand.crtElm("p",t.toString());return n.innerHTML="",new Promise(function(t){setTimeout(function(){var n={top:55,right:300},a={};a.top=startingData[0].top+7.5,a.right=startingData[0].right;var o=aniConfig(n,a,e,"zz",0);startingData.pop(),t(o)},1500)})}function animate(t,n){var e=wand.crtElm("p",n[t].num),a={top:55,right:300},o=aniConfig(n[t].coorData,a,e,alphaid[t],t),r=n[t].inputTag.name.match(/\d+/);startingData.push(n[t].coorData),animationTemplate(o).then(equAnimeDisappear).then(equAppear).then(equAnimeDisappear).then(equAppear).then(createAns).then(animationTemplate).then(function(e){return new Promise(function(a){setTimeout(function(){var i=wand.querApndr("#row"+1*r[0]+" td:nth-child(2)"),u="y = ",s=""+globalEqu,p=e.innerText,l={top:150,right:400};katex.render(u,yPara),katex.render(s,equPara),wand.apndr(i,p),o=aniConfig(n[t].coorData,l,e,"za",0),statusBar.innerText="",statusBar.innerText=">> Plotting answer.",a(o)},3e3)})}).then(animationTemplate)}function animatorControl(t,n){var e=wand.querApndr("#numContainer");e.innerHTML="";for(var a=0;a<t.length;a++)animate(a,t)}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},lastSheet=document.styleSheets[document.styleSheets.length-1],alphaid=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r"],statusBar=wand.querApndr("#status p"),startingData=[];
"use strict";!function(){function n(){u=[];for(var n=0;n<t.length;n++){var i=wand.querApndr("[name='"+t[n]+"']");if(i.value){var a={};a.coorData=i.getBoundingClientRect(),a.num=i.value,a.inputTag=i,u.push(a),graphConfig.aniData=a}}animatorControl(u)}var t=["input1","input2","input3","input4","input5","input6","input7","input8","input9","input10","input11","input12","input13","input14","input15","input16","input17","input18","input19"],u=[];document.onchange=function(n){"select"===n.target.localName&&changePlot(n.target.value)},document.onkeydown=function(t){13===t.keyCode&&n()},document.onclick=function(t){"Go!"===t.target.value&&n()}}();
"use strict";!function(){for(var n,d,r,t,a=wand.querApndr("tbody"),w=19,p=1;w>=p;p++)t=wand.crtElm("input"),n=wand.crtElm("td"),d=wand.crtElm("td"),r=wand.crtElm("tr"),r.id="row"+p,t.name="input"+p,t.type="number",wand.apndr(n,t),wand.apndr(r,[n,d]),wand.apndr(a,r)}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhbmQuanMiLCJhamF4LmpzIiwiYW5pbWF0b3Jjb250cm9sLmpzIiwiZXZlbnRzLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6WyJfdHlwZW9mIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJvYmoiLCJjb25zdHJ1Y3RvciIsImdsbyIsImxpYiIsIndhbmQiLCJ3aW5kb3ciLCJ1bmRlZmluZWQiLCJhcG5kciIsImEiLCJiIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uc29sZSIsImVycm9yIiwiYXBwZW5kQ2hpbGQiLCJ0aGlzIiwidHh0IiwiYXJyIiwiaSIsImxlbmd0aCIsInF1ZXJBcG5kciIsImMiLCJlbGUiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjcnRFbG0iLCJxdWVyQXR0ciIsInNldEF0dHJpYnV0ZSIsImNyZWF0ZVRleHROb2RlIiwidG9TdHJpbmciLCJjcmVhdGVFbGVtZW50IiwiY2hhbmdlUGxvdCIsInZhbCIsImVxdVBhcmEiLCJpbm5lclRleHQiLCJ5IiwiZXF1YXQiLCJrYXRleCIsInJlbmRlciIsInlQYXJhIiwiZ2xvYmFsRXF1IiwiZ3JhcGhDb25maWciLCJlcXVhdGlvbiIsImRpc3BDb25maWciLCJwYXJzZWRPYmoiLCJKU09OIiwicGFyc2UiLCJzZWxlY3QiLCJuYW1lIiwib3B0IiwidmFsdWUiLCJsb2FkQ29uZmlnIiwiZnVuYyIsInNlYXJjaCIsInhodHRwIiwiWE1MSHR0cFJlcXVlc3QiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwic3RhdHVzIiwiY29uZmlnIiwicmVzcG9uc2VUZXh0IiwiYXBwQ29uZmlnIiwib3BlbiIsInNlbmQiLCJhbmlDb25maWciLCJiZWdDb29yRGF0YSIsImVuZENvb3JEYXRhIiwibnVtIiwiYWxwaGFpZCIsImFuaW1hdGVDb25maWciLCJkZWxheSIsImFuaW1hdGlvblRlbXBsYXRlIiwic3RhcnRUb3BPZmYiLCJ0b3AiLCJzdGFydFJpZ2h0T2ZmIiwicmlnaHQiLCJlbmRUb3BPZmYiLCJlbmRSaWdodE9mZiIsImhpZ2h3YXlQYXRoIiwibnVtQ29udGFpbmVyIiwic3R5bGUiLCJwb3NpdGlvbiIsImxlZnQiLCJsYXN0U2hlZXQiLCJpbnNlcnRSdWxlIiwiY3NzUnVsZXMiLCJhbmltYXRpb24iLCJvcGFjaXR5IiwiekluZGV4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0IiwiYW5pbWF0ZVRvU3RhdHVzQmFyIiwibG9nIiwiZXF1QXBwZWFyIiwiY2hhbmdlRXF1Iiwic3RhdHVzQmFyIiwiaW5uZXJIVE1MIiwiZXF1QW5pbWVEaXNhcHBlYXIiLCJyZXBsYWNlIiwibWF0aCIsImV2YWwiLCJjcmVhdGVBbnMiLCJhbnMiLCJmdW5jTWFjaENvb3IiLCJzdGFydGluZ0RhdGEiLCJwb3AiLCJhbmltYXRlIiwiYXciLCJjb29yRGF0YSIsIm51bWJlcklucHV0IiwiaW5wdXRUYWciLCJtYXRjaCIsInB1c2giLCJ0aGVuIiwieXZhbCIsInRkIiwieXZhbHVlIiwic3RhdHVzQmFyQ29vciIsImFuaW1hdG9yQ29udHJvbCIsImFuaSIsInN0eWxlU2hlZXRzIiwic3RhcnRGdW5jTWFjaCIsImFuaW1hdGVXYWl0IiwiaW5wdXRPcHQiLCJpbnB1dCIsImFuaURhdGEiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJvbmNoYW5nZSIsImUiLCJ0YXJnZXQiLCJsb2NhbE5hbWUiLCJvbmtleWRvd24iLCJrZXlDb2RlIiwib25jbGljayIsInRkMSIsInRkMiIsInRyIiwidGJvZHkiLCJyb3dDb3VudCIsImoiLCJpZCIsInR5cGUiXSwibWFwcGluZ3MiOiJBQUFBLFlBRUEsSUFBSUEsU0FBNEIsa0JBQVhDLFNBQW9ELGdCQUFwQkEsUUFBT0MsU0FBd0IsU0FBVUMsR0FBTyxhQUFjQSxJQUFTLFNBQVVBLEdBQU8sTUFBT0EsSUFBeUIsa0JBQVhGLFNBQXlCRSxFQUFJQyxjQUFnQkgsT0FBUyxlQUFrQkUsS0FJek8sU0FBVUUsRUFBS0MsR0FDWkQsRUFBSUUsS0FBT0QsS0FDSyxtQkFBWEUsUUFBeUJB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U0FBVSxTQUFVLFNBQVUsU0FBVSxTQUFVLFNBQVUsU0FBVSxVQUFXLFVBQVcsVUFBVyxVQUFXLFVBQVcsVUFBVyxVQUFXLFVBQVcsVUFBVyxXQUN6TUQsSUFxQkpwRyxVQUFTeUcsU0FBVyxTQUFTQyxHQUNFLFdBQXZCQSxFQUFFQyxPQUFPQyxXQUNUcEcsV0FBV2tHLEVBQUVDLE9BQU9oRixRQUs1QjNCLFNBQVM2RyxVQUFZLFNBQVVILEdBQ1QsS0FBZEEsRUFBRUksU0FDRlgsS0FLUm5HLFNBQVMrRyxRQUFVLFNBQVVMLEdBQ0YsUUFBbkJBLEVBQUVDLE9BQU9oRixPQUNUd0U7QUMxQ1osY0FBQyxXQVdHLElBQUssR0FORGEsR0FDQUMsRUFDQUMsRUFDQVosRUFKQWEsRUFBUXRJLEtBQUtnQixVQUFVLFNBS3ZCdUgsRUFBVyxHQUVOQyxFQUFJLEVBQVFELEdBQUxDLEVBQWVBLElBQzNCZixFQUFRekgsS0FBS3FCLE9BQU8sU0FDcEI4RyxFQUFNbkksS0FBS3FCLE9BQU8sTUFDbEIrRyxFQUFNcEksS0FBS3FCLE9BQU8sTUFDbEJnSCxFQUFLckksS0FBS3FCLE9BQU8sTUFFakJnSCxFQUFHSSxHQUFILE1BQWNELEVBRWRmLEVBQU03RSxLQUFOLFFBQXFCNEYsRUFDckJmLEVBQU1pQixLQUFPLFNBRWIxSSxLQUFLRyxNQUFNZ0ksRUFBS1YsR0FDaEJ6SCxLQUFLRyxNQUFNa0ksR0FBS0YsRUFBS0MsSUFDckJwSSxLQUFLRyxNQUFNbUksRUFBT0QiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuVGhpcyBpcyBhIGN1c3RvbSBsaWJyYXJ5IHRoYXQgSSBtYWRlIHRvIG1ha2UgRE9NIG1hbmlwdWxhdGlvbiBhIGxpdHRsZSBiaXQgZmFzdGVyXG5cbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4oZnVuY3Rpb24gKGdsbywgbGliKSB7XG4gICAgZ2xvLndhbmQgPSBsaWIoKTtcbn0odHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbGliID0ge1xuICAgICAgICBhcG5kcjogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgYiA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShiKSkge1xuICAgICAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQoYik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZpcnN0IHBhcmFtZXRlciBwYXNzZWQgaXMgbm90IGFuIG9iamVjdCBlbGVtZW50LlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGIgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGIgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgYS5hcHBlbmRDaGlsZCh0aGlzLnR4dChiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGIpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyciA9IGI7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcG5kcihhLCBhcnJbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlBhcmFtZXRlcnMgYXJlIG5vdCBjb21wYXRpYmxlIGluIHRoZSBsaWIuYXBuZHIgZnVuY3Rpb24uICBIaXQgdGhlIGFycm93IG9uIHRoZSBsZWZ0IGZvciBjYWxsIHN0YWNrLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcXVlckFwbmRyOiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICAgICAgdmFyIGVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYSk7XG4gICAgICAgICAgICBpZiAoZWxlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTm8gdGFnIGV4aXN0cyBpbiB0aGUgRE9NLiBIaXQgdGhlIGFycm93IG9uIHRoZSBsZWZ0IGZvciBjYWxsIHN0YWNrLlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyciA9IGI7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFwbmRyKGVsZSwgdGhpcy5jcnRFbG0oYXJyW2ldKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcG5kcihlbGUsIHRoaXMuY3J0RWxtKGIsIGMpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwbmRyKGVsZSwgYilcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcXVlckF0dHI6IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgICAgICB2YXIgZWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihhKTtcbiAgICAgICAgICAgIGlmIChlbGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJObyB0YWcgZXhpc3RzIGluIHRoZSBET00uIEhpdCB0aGUgYXJyb3cgb24gdGhlIGxlZnQgZm9yIGNhbGwgc3RhY2suXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYikge1xuICAgICAgICAgICAgICAgICAgICBlbGUuc2V0QXR0cmlidXRlKGIsIGMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdHh0OiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUGFyYW1ldGVyIHBhc3NlZCB0byBsaWIudHh0IGlzIG5vdCBhIHN0cmluZyBub3IgYSBudW1iZXIuICBIaXQgdGhlIGFycm93IG9uIHRoZSBsZWZ0IGZvciBjYWxsIHN0YWNrLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY3J0RWxtOiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIGVsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYSksXG4gICAgICAgICAgICAgICAgdHh0O1xuICAgICAgICAgICAgaWYgKGIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGIgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHh0ID0gdGhpcy50eHQoYik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBuZHIoZWxlLCB0eHQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJNdXN0IHBhc3MgYSBzdHJpbmcgYXMgdGhlIHNlY29uZCBwYXJhbSBpbiBsaWIuY3J0RWxtIGZ1bmN0aW9uLiAgSGl0IHRoZSBhcnJvdyBvbiB0aGUgbGVmdCBmb3IgY2FsbCBzdGFjay5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVsZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGliO1xufSkpO1xuIiwiICAgIHZhciBjb25maWcsXG4gICAgICAgIGdsb2JhbEVxdSxcbiAgICAgICAgZXF1UGFyYSA9IHdhbmQucXVlckFwbmRyKFwiI2Z1bmN0aW9uTWFjaGluZSAjZXF1XCIpLFxuICAgICAgICB5UGFyYSA9IHdhbmQucXVlckFwbmRyKFwiI2Z1bmN0aW9uTWFjaGluZSAjeVwiKSxcbiAgICAgICAgZ3JhcGhDb25maWcgPSB7fTtcblxuICAgIC8vRGlwc2xheSBLYXRleCBlcXVhdGlvblxuICAgIGZ1bmN0aW9uIGNoYW5nZVBsb3QodmFsKSB7XG4gICAgICAgIGVxdVBhcmEuaW5uZXJUZXh0ID0gXCJcIjtcbiAgICAgICAgdmFyIHkgPSBgeSA9IGAsXG4gICAgICAgICAgICBlcXVhdCA9IGAke3ZhbH1gO1xuICAgICAgICBrYXRleC5yZW5kZXIoeSwgeVBhcmEpO1xuICAgICAgICBrYXRleC5yZW5kZXIoZXF1YXQsIGVxdVBhcmEpO1xuICAgICAgICBnbG9iYWxFcXUgPSB2YWw7XG5cbiAgICAgICAgLy9ncmFwaENvbmZpZyBsb2NhdGVkIGluIGFuaW1hdG9yLmpzIGxpbmUgOVxuICAgICAgICBncmFwaENvbmZpZy5lcXVhdGlvbiA9IGVxdWF0O1xuICAgIH1cblxuICAgIC8qQUpBWCBSRVFVRVNUIFRPIEZVTkNNQUNISU5FU0VUVElOR1MuSlMgQU5EIExPQUQqL1xuICAgIGZ1bmN0aW9uIGRpc3BDb25maWcoYykge1xuICAgICAgICB2YXIgcGFyc2VkT2JqID0gSlNPTi5wYXJzZShjKSxcbiAgICAgICAgICAgIHNlbGVjdCA9IHdhbmQuY3J0RWxtKFwic2VsZWN0XCIpO1xuICAgICAgICBzZWxlY3QubmFtZSA9IFwiZXF1RHJvcFwiO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnNlZE9iai5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG9wdCA9IHdhbmQuY3J0RWxtKFwib3B0aW9uXCIsIHBhcnNlZE9ialtpXS5uYW1lKTtcbiAgICAgICAgICAgIG9wdC52YWx1ZSA9IHBhcnNlZE9ialtpXS5lcXVhdGlvbjtcbiAgICAgICAgICAgIC8vICAgICAgICAgIG9wdC5jbGFzcyA9IEpTT04uc3RyaW5naWZ5KHBhcnNlZE9ialtpXS53aW5kb3cpO1xuICAgICAgICAgICAgd2FuZC5hcG5kcihzZWxlY3QsIG9wdCk7XG4gICAgICAgICAgICB3YW5kLnF1ZXJBcG5kcihcIiNkcm9wZG93blwiLCBzZWxlY3QpO1xuICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VQbG90KHBhcnNlZE9ialtpXS5lcXVhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL0xvYWQgaW4gdGhlIGNvbmZpZ3VyYXRpb24gZmlsZVxuICAgIGZ1bmN0aW9uIGxvYWRDb25maWcoZnVuYywgc2VhcmNoKSB7XG4gICAgICAgIHZhciB4aHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoeGh0dHAucmVhZHlTdGF0ZSA9PSA0ICYmIHhodHRwLnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICBjb25maWcgPSB4aHR0cC5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICAgICAgZnVuYyhjb25maWcpO1xuICAgICAgICAgICAgICAgIGdyYXBoQ29uZmlnLmFwcENvbmZpZyA9IEpTT04ucGFyc2UoY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGh0dHAub3BlbihcIkdFVFwiLCBzZWFyY2gsIHRydWUpO1xuICAgICAgICB4aHR0cC5zZW5kKCk7XG4gICAgfVxuXG4gICAgbG9hZENvbmZpZyhkaXNwQ29uZmlnLCBcIi4uL2Z1bmNNYWNoaW5lU2V0dGluZ3MuanNvblwiKTtcbiIsInZhciBsYXN0U2hlZXQgPSBkb2N1bWVudC5zdHlsZVNoZWV0c1tkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGggLSAxXTtcblxuLy8gVE9ETzogRnVuY3Rpb24gbWFjaGluZSBpblxuXG4vL0FscGhhIElEIGlzIHRvIGlkZW50aWZ5IHRoZSBkaWZmZXJlbnQgYW5pbWF0aW9ucyB0aGF0IGNvdWxkIGhhcHBlbiBpbiB0aGUgYXBwbGljYXRpb25cbnZhciBhbHBoYWlkID0gWydhJywgJ2InLCAnYycsICdkJywgJ2UnLCAnZicsICdnJywgJ2gnLCAnaScsICdqJywgJ2snLCAnbCcsICdtJywgJ24nLCAnbycsICdwJywgJ3EnLCAnciddLFxuICAgIHN0YXR1c0JhciA9IHdhbmQucXVlckFwbmRyKFwiI3N0YXR1cyBwXCIpLFxuICAgIHN0YXJ0aW5nRGF0YSA9IFtdO1xuXG4vKioqKioqKipcIkNPTlNUUlVDVE9SXCIgKG5vdCBleGFjdGx5KSBmdW5jdGlvbnMqKioqKioqKioqL1xuZnVuY3Rpb24gYW5pQ29uZmlnKGJlZ0Nvb3JEYXRhLCBlbmRDb29yRGF0YSwgbnVtLCBhbHBoYWlkLCBpKSB7XG4gICAgdmFyIGFuaW1hdGVDb25maWcgPSB7fTtcbiAgICBhbmltYXRlQ29uZmlnLmJlZ0Nvb3JEYXRhID0gYmVnQ29vckRhdGE7XG4gICAgYW5pbWF0ZUNvbmZpZy5lbmRDb29yRGF0YSA9IGVuZENvb3JEYXRhO1xuICAgIGFuaW1hdGVDb25maWcubnVtID0gbnVtO1xuICAgIGFuaW1hdGVDb25maWcuYWxwaGFpZCA9IGFscGhhaWQ7XG4gICAgYW5pbWF0ZUNvbmZpZy5kZWxheSA9IGk7XG4gICAgcmV0dXJuIGFuaW1hdGVDb25maWc7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGlvblRlbXBsYXRlKGFuaW1hdGVDb25maWcpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgc3RhcnRUb3BPZmYgPSBhbmltYXRlQ29uZmlnLmJlZ0Nvb3JEYXRhLnRvcCArIDUsXG4gICAgICAgIHN0YXJ0UmlnaHRPZmYgPSBhbmltYXRlQ29uZmlnLmJlZ0Nvb3JEYXRhLnJpZ2h0IC0gMzAsXG4gICAgICAgIGVuZFRvcE9mZiA9IGFuaW1hdGVDb25maWcuZW5kQ29vckRhdGEudG9wLFxuICAgICAgICBlbmRSaWdodE9mZiA9IGFuaW1hdGVDb25maWcuZW5kQ29vckRhdGEucmlnaHQsXG4gICAgICAgIGhpZ2h3YXlQYXRoID0gMjQ2LFxuICAgICAgICBudW1Db250YWluZXIgPSB3YW5kLnF1ZXJBcG5kcihcIiNudW1Db250YWluZXJcIik7XG4gICAgYW5pbWF0ZUNvbmZpZy5udW0uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgYW5pbWF0ZUNvbmZpZy5udW0uc3R5bGUudG9wID0gYCR7c3RhcnRUb3BPZmZ9cHhgO1xuICAgIGFuaW1hdGVDb25maWcubnVtLnN0eWxlLmxlZnQgPSBgJHtzdGFydFJpZ2h0T2ZmfXB4YDtcbiAgICB3YW5kLmFwbmRyKG51bUNvbnRhaW5lciwgYW5pbWF0ZUNvbmZpZy5udW0pO1xuICAgIGxhc3RTaGVldC5pbnNlcnRSdWxlKGBAa2V5ZnJhbWVzIHRvRnVuY01hY2hpbmUke2FuaW1hdGVDb25maWcuYWxwaGFpZH0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAke3N0YXJ0VG9wT2ZmfXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAke3N0YXJ0UmlnaHRPZmZ9cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEwJSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDMzJSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogJHtzdGFydFRvcE9mZn1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJHtoaWdod2F5UGF0aH1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgNjYlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAke2VuZFRvcE9mZn1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJHtoaWdod2F5UGF0aH1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOTAlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMTAwJSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogJHtlbmRUb3BPZmZ9cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7ZW5kUmlnaHRPZmZ9cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfWAsIGxhc3RTaGVldC5jc3NSdWxlcy5sZW5ndGgpO1xuICAgIGFuaW1hdGVDb25maWcubnVtLnN0eWxlLmFuaW1hdGlvbiA9IGB0b0Z1bmNNYWNoaW5lJHthbmltYXRlQ29uZmlnLmFscGhhaWR9IDNzIGVhc2UtaW4tb3V0ICR7YW5pbWF0ZUNvbmZpZy5kZWxheSoxNH1zYDtcbiAgICBhbmltYXRlQ29uZmlnLm51bS5zdHlsZS5vcGFjaXR5ID0gJzAnO1xuICAgIGFuaW1hdGVDb25maWcubnVtLnN0eWxlLnpJbmRleCA9ICcxMDAnO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlc29sdmUoYW5pbWF0ZUNvbmZpZy5udW0pO1xuICAgICAgICB9LCBhbmltYXRlQ29uZmlnLmRlbGF5ICogMzAwMCk7XG4gICAgfSk7XG59XG5cbi8qKioqKioqKioqKipBTklNQVRJT04gRlVOQ1RJT05TKioqKioqKioqKioqKioqKioqKioqKi9cbmZ1bmN0aW9uIGFuaW1hdGVUb1N0YXR1c0JhcigpIHtcbiAgICBjb25zb2xlLmxvZyhcIkFuaW1hdGUgdG8gc3RhdHVzIGJhciBhbmQgcGFzcyB0aGUgaW5mb3JtYXRpb24gdG8gdGhlIGdyYXBoIGZ1bmN0aW9uXCIpO1xuXG4gICAgLy9TaG93IGdyYXBoIGNoZWNrYm94XG4gICAgLy9BbmltYXRpb24gY2hlY2tib3hcbiAgICAvL0VxdWF0aW9uXG4gICAgLy9XaW5kb3cgbGltaXRzXG4gICAgLy9YIGFuZCBZIHZhbHVlXG5cbiAgICAvL2dyYXBoSXQoKTtcbn1cblxuZnVuY3Rpb24gZXF1QXBwZWFyKGNoYW5nZUVxdSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2hhbmdlRXF1ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzQmFyLmlubmVyVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgc3RhdHVzQmFyLmlubmVyVGV4dCA9IFwiPj4gUmV0dXJuaW5nIGFuc3dlci5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVxdVBhcmEuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgICAgIGVxdVBhcmEuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICBrYXRleC5yZW5kZXIoYCR7Y2hhbmdlRXF1fWAsIGVxdVBhcmEpO1xuICAgICAgICAgICAgZXF1UGFyYS5zdHlsZS5hbmltYXRpb24gPSAndGV4dEFwcGVhciAxcyBlYXNlLWluLW91dCc7XG4gICAgICAgICAgICBlcXVQYXJhLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICAgICAgcmVzb2x2ZShjaGFuZ2VFcXUpO1xuICAgICAgICB9LCAxNTAwKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZXF1QW5pbWVEaXNhcHBlYXIobnVtKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgIHZhciBjaGFuZ2VFcXU7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBudW0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGNoYW5nZUVxdSA9IGdsb2JhbEVxdS5yZXBsYWNlKFwieFwiLCBgKigke251bS5pbm5lclRleHR9KWApO1xuXG4gICAgICAgICAgICBzdGF0dXNCYXIuaW5uZXJUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIHN0YXR1c0Jhci5pbm5lclRleHQgPSBcIj4+IENhbGN1bGF0aW5nXCI7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGVxdVBhcmEuc3R5bGUuYW5pbWF0aW9uID0gJ3RleHREaXNhcHBlYXIgMS41cyBlYXNlLWluLW91dCc7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShjaGFuZ2VFcXUpO1xuICAgICAgICAgICAgfSwgMTUwMCk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG51bSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgY2hhbmdlRXF1ID0gbWF0aC5ldmFsKG51bSk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGVxdVBhcmEuc3R5bGUuYW5pbWF0aW9uID0gJ3RleHREaXNhcHBlYXIgMS41cyBlYXNlLWluLW91dCc7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShjaGFuZ2VFcXUpO1xuICAgICAgICAgICAgfSwgMTUwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQW5zKGFucykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBudW1Db250YWluZXIgPSB3YW5kLnF1ZXJBcG5kcihcIiNudW1Db250YWluZXJcIiksXG4gICAgICAgIG51bSA9IHdhbmQuY3J0RWxtKFwicFwiLCBhbnMudG9TdHJpbmcoKSk7XG4gICAgbnVtQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZnVuY01hY2hDb29yID0ge1xuICAgICAgICAgICAgICAgICAgICB0b3A6IDU1LFxuICAgICAgICAgICAgICAgICAgICByaWdodDogMzAwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlbmRDb29yRGF0YSA9IHt9O1xuXG4gICAgICAgICAgICBlbmRDb29yRGF0YS50b3AgPSBzdGFydGluZ0RhdGFbMF0udG9wICsgNy41O1xuICAgICAgICAgICAgZW5kQ29vckRhdGEucmlnaHQgPSBzdGFydGluZ0RhdGFbMF0ucmlnaHQ7XG5cbiAgICAgICAgICAgIHZhciBhbmltYXRlQ29uZmlnID0gYW5pQ29uZmlnKGZ1bmNNYWNoQ29vciwgZW5kQ29vckRhdGEsIG51bSwgJ3p6JywgMCk7XG5cbiAgICAgICAgICAgIHN0YXJ0aW5nRGF0YS5wb3AoKTtcbiAgICAgICAgICAgIHJlc29sdmUoYW5pbWF0ZUNvbmZpZyk7XG4gICAgICAgIH0sIDE1MDApO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBhbmltYXRlKGksIGF3KSB7XG4gICAgdmFyIG51bSA9IHdhbmQuY3J0RWxtKFwicFwiLCBhd1tpXS5udW0pLFxuICAgICAgICBmdW5jTWFjaENvb3IgPSB7XG4gICAgICAgICAgICB0b3A6IDU1LFxuICAgICAgICAgICAgcmlnaHQ6IDMwMFxuICAgICAgICB9LFxuICAgICAgICBhbmltYXRlQ29uZmlnID0gYW5pQ29uZmlnKGF3W2ldLmNvb3JEYXRhLCBmdW5jTWFjaENvb3IsIG51bSwgYWxwaGFpZFtpXSwgaSksXG4gICAgICAgIG51bWJlcklucHV0ID0gYXdbaV0uaW5wdXRUYWcubmFtZS5tYXRjaCgvXFxkKy8pO1xuXG4gICAgc3RhcnRpbmdEYXRhLnB1c2goYXdbaV0uY29vckRhdGEpO1xuXG4gICAgYW5pbWF0aW9uVGVtcGxhdGUoYW5pbWF0ZUNvbmZpZylcbiAgICAgICAgLnRoZW4oZXF1QW5pbWVEaXNhcHBlYXIpXG4gICAgICAgIC50aGVuKGVxdUFwcGVhcilcbiAgICAgICAgLnRoZW4oZXF1QW5pbWVEaXNhcHBlYXIpXG4gICAgICAgIC50aGVuKGVxdUFwcGVhcilcbiAgICAgICAgLnRoZW4oY3JlYXRlQW5zKVxuICAgICAgICAudGhlbihhbmltYXRpb25UZW1wbGF0ZSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHl2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGQgPSB3YW5kLnF1ZXJBcG5kcihgI3JvdyR7KG51bWJlcklucHV0WzBdKjEpfSB0ZDpudGgtY2hpbGQoMilgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHkgPSBgeSA9IGAsXG4gICAgICAgICAgICAgICAgICAgICAgICBlcXVhdCA9IGAke2dsb2JhbEVxdX1gLFxuICAgICAgICAgICAgICAgICAgICAgICAgeXZhbHVlID0geXZhbC5pbm5lclRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXNCYXJDb29yID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogMTUwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiA0MDBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZUNvbmZpZztcblxuICAgICAgICAgICAgICAgICAgICBrYXRleC5yZW5kZXIoeSwgeVBhcmEpO1xuICAgICAgICAgICAgICAgICAgICBrYXRleC5yZW5kZXIoZXF1YXQsIGVxdVBhcmEpO1xuICAgICAgICAgICAgICAgICAgICB3YW5kLmFwbmRyKHRkLCB5dmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVDb25maWcgPSBhbmlDb25maWcoYXdbaV0uY29vckRhdGEsIHN0YXR1c0JhckNvb3IsIHl2YWwsIFwiemFcIiwgMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzQmFyLmlubmVyVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c0Jhci5pbm5lclRleHQgPSBcIj4+IFBsb3R0aW5nIGFuc3dlci5cIjtcblxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFuaW1hdGVDb25maWcpO1xuICAgICAgICAgICAgICAgIH0sIDMwMDApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGFuaW1hdGlvblRlbXBsYXRlKTtcbn1cblxuLy9IYW5kbGUgYWxsIENTUyBhbmltYXRpb25zXG5mdW5jdGlvbiBhbmltYXRvckNvbnRyb2woYXcsIGFuaSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBudW1Db250YWluZXIgPSB3YW5kLnF1ZXJBcG5kcihcIiNudW1Db250YWluZXJcIik7XG4gICAgbnVtQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF3Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFuaW1hdGUoaSwgYXcpO1xuICAgIH1cbn0iLCIoZnVuY3Rpb24gKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy9yZWdpc3RlciBhbGwgaW5wdXRzIG9uIHRoZSBhcHBsaWNhdGlvblxuICAgIHZhciBpbnB1dE9wdCA9IFtcImlucHV0MVwiLCBcImlucHV0MlwiLCBcImlucHV0M1wiLCBcImlucHV0NFwiLCBcImlucHV0NVwiLCBcImlucHV0NlwiLCBcImlucHV0N1wiLCBcImlucHV0OFwiLCBcImlucHV0OVwiLCBcImlucHV0MTBcIiwgXCJpbnB1dDExXCIsIFwiaW5wdXQxMlwiLCBcImlucHV0MTNcIiwgXCJpbnB1dDE0XCIsIFwiaW5wdXQxNVwiLCBcImlucHV0MTZcIiwgXCJpbnB1dDE3XCIsIFwiaW5wdXQxOFwiLCBcImlucHV0MTlcIl0sXG4gICAgICAgIGFuaW1hdGVXYWl0ID0gW107XG5cbiAgICBmdW5jdGlvbiBzdGFydEZ1bmNNYWNoKCkge1xuICAgICAgICBhbmltYXRlV2FpdCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0T3B0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXQgPSB3YW5kLnF1ZXJBcG5kcihgW25hbWU9JyR7aW5wdXRPcHRbaV19J11gKTtcbiAgICAgICAgICAgIGlmIChpbnB1dC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBhbmlEYXRhID0ge307XG4gICAgICAgICAgICAgICAgYW5pRGF0YS5jb29yRGF0YSA9IGlucHV0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIGFuaURhdGEubnVtID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICAgICAgYW5pRGF0YS5pbnB1dFRhZyA9IGlucHV0OyBcbiAgICAgICAgICAgICAgICBhbmltYXRlV2FpdC5wdXNoKGFuaURhdGEpO1xuXG4gICAgICAgICAgICAgICAgLy9ncmFwaENvbmZpZyBsb2NhdGVkIGluIEFKQVguanNcbiAgICAgICAgICAgICAgICBncmFwaENvbmZpZy5hbmlEYXRhID0gYW5pRGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFuaW1hdG9yQ29udHJvbChhbmltYXRlV2FpdCk7XG4gICAgfVxuXG4gICAgLyoqKioqRE9DVU1FTlQgb25jaGFuZ2UgRVZFTlQgSEFORExFUioqKioqL1xuICAgIGRvY3VtZW50Lm9uY2hhbmdlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS50YXJnZXQubG9jYWxOYW1lID09PSBcInNlbGVjdFwiKSB7XG4gICAgICAgICAgICBjaGFuZ2VQbG90KGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKioqRE9DVU1FTlQga2V5ZG93biBFVkVOVCBIQU5ETEVSKioqKi9cbiAgICBkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgc3RhcnRGdW5jTWFjaCgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKioqKipET0NVTUVOVCBDTElDSyBIQU5ETEVSKioqKiovXG4gICAgZG9jdW1lbnQub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSA9PT0gXCJHbyFcIikge1xuICAgICAgICAgICAgc3RhcnRGdW5jTWFjaCgpXG4gICAgICAgIH1cbiAgICB9O1xufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvKioqKlRBQkxFIE1BS0VSKioqKi9cbiAgICB2YXIgdGJvZHkgPSB3YW5kLnF1ZXJBcG5kcihcInRib2R5XCIpLFxuICAgICAgICB0ZDEsXG4gICAgICAgIHRkMixcbiAgICAgICAgdHIsXG4gICAgICAgIGlucHV0LFxuICAgICAgICByb3dDb3VudCA9IDE5O1xuXG4gICAgZm9yICh2YXIgaiA9IDE7IGogPD0gcm93Q291bnQ7IGorKykge1xuICAgICAgICBpbnB1dCA9IHdhbmQuY3J0RWxtKFwiaW5wdXRcIik7XG4gICAgICAgIHRkMSA9IHdhbmQuY3J0RWxtKFwidGRcIik7XG4gICAgICAgIHRkMiA9IHdhbmQuY3J0RWxtKFwidGRcIik7XG4gICAgICAgIHRyID0gd2FuZC5jcnRFbG0oXCJ0clwiKTtcblxuICAgICAgICB0ci5pZCA9IGByb3cke2p9YDtcblxuICAgICAgICBpbnB1dC5uYW1lID0gYGlucHV0JHtqfWA7XG4gICAgICAgIGlucHV0LnR5cGUgPSAnbnVtYmVyJztcblxuICAgICAgICB3YW5kLmFwbmRyKHRkMSwgaW5wdXQpO1xuICAgICAgICB3YW5kLmFwbmRyKHRyLCBbdGQxLCB0ZDJdKTtcbiAgICAgICAgd2FuZC5hcG5kcih0Ym9keSwgdHIpO1xuICAgIH1cbn0oKSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
