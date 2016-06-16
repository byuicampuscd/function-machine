"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};!function(t,e){t.wand=e()}("undefined"!=typeof window?window:void 0,function(){var t={apndr:function(t,e){if("object"!==("undefined"==typeof t?"undefined":_typeof(t))||"object"!==("undefined"==typeof e?"undefined":_typeof(e))||Array.isArray(e))if("object"!==("undefined"==typeof t?"undefined":_typeof(t)))console.error("First parameter passed is not an object element.");else if("object"!==("undefined"==typeof e?"undefined":_typeof(e)))"string"!=typeof e&&"number"!=typeof e||t.appendChild(this.txt(e));else if(Array.isArray(e))for(var r=e,n=0;n<r.length;n++)this.apndr(t,r[n]);else console.error("Parameters are not compatible in the lib.apndr function.  Hit the arrow on the left for call stack.");else t.appendChild(e)},querApndr:function(t,e,r){var n=document.querySelector(t);if(null!=n){if(Array.isArray(e))for(var o=e,i=0;i<o.length;i++)this.apndr(n,this.crtElm(o[i]));else r?this.apndr(n,this.crtElm(e,r)):this.apndr(n,e);return n}console.error("No tag exists in the DOM. Hit the arrow on the left for call stack.")},querAttr:function(t,e,r){var n=document.querySelector(t);null==n?console.error("No tag exists in the DOM. Hit the arrow on the left for call stack."):e&&n.setAttribute(e,r)},txt:function(t){return"string"==typeof t?document.createTextNode(t):"number"==typeof t?document.createTextNode(t.toString()):void console.error("Parameter passed to lib.txt is not a string nor a number.  Hit the arrow on the left for call stack.")},crtElm:function(t,e){var r,n=document.createElement(t);return e&&("string"==typeof e?(r=this.txt(e),this.apndr(n,r)):console.error("Must pass a string as the second param in lib.crtElm function.  Hit the arrow on the left for call stack.")),n}};return t});
"use strict";function changePlot(n){equPara.innerText="";var a="y = ",e=""+n;katex.render(a,yPara),katex.render(e,equPara),globalEqu=n,graphConfig.equation=e}function dispConfig(n){var a=JSON.parse(n),e=wand.crtElm("select");e.name="equDrop";for(var o=0;o<a.length;o++){var r=wand.crtElm("option",a[o].name);r.value=a[o].equation,wand.apndr(e,r),wand.querApndr("#dropdown",e),0===o&&changePlot(a[o].equation)}}function loadConfig(n,a){var e=new XMLHttpRequest;e.onreadystatechange=function(){4==e.readyState&&200==e.status&&(config=e.responseText,n(config),graphConfig.appConfig=JSON.parse(config))},e.open("GET",a,!0),e.send()}var config,globalEqu,equPara=wand.querApndr("#functionMachine #equ"),yPara=wand.querApndr("#functionMachine #y"),graphConfig={};loadConfig(dispConfig,"../funcMachineSettings.json");
"use strict";function aniConfig(t,n,e,a,o){var r={};return r.begCoorData=t,r.endCoorData=n,r.num=e,r.alphaid=a,r.delay=o,r}function animationTemplate(t){var n=t.begCoorData.top+5,e=t.begCoorData.right-30,a=t.endCoorData.top,o=t.endCoorData.right,r=246,i=wand.querApndr("#numContainer");return t.num.style.position="absolute",t.num.style.top=n+"px",t.num.style.left=e+"px",wand.apndr(i,t.num),lastSheet.insertRule("@keyframes toFuncMachine"+t.alphaid+" {\n                            0% {\n                                opacity: 0;\n                                top: "+n+"px;\n                                left: "+e+"px;\n                            }\n                            10% {\n                                opacity: 1;\n                            }\n                            33% {\n                                top: "+n+"px;\n                                left: "+r+"px;\n                            }\n                            66% {\n                                top: "+a+"px;\n                                left: "+r+"px;\n                            }\n                            90% {\n                                opacity: 1;\n                            }\n                            100% {\n                                opacity: 0;\n                                top: "+a+"px;\n                                left: "+o+"px;\n                            }\n                        }",lastSheet.cssRules.length),t.num.style.animation="toFuncMachine"+t.alphaid+" 3s ease-in-out "+10*t.delay+"s",t.num.style.opacity="0",t.num.style.zIndex="100",new Promise(function(n){window.setTimeout(function(){n(t.num)},3e3*t.delay)})}function animateToStatusBar(){console.log("Animate to status bar and pass the information to the graph function")}function equAppear(t){return new Promise(function(n){setTimeout(function(){"number"==typeof t&&(statusBar.innerText="",statusBar.innerText=">> Returning answer."),equPara.innerHTML="",equPara.style.opacity=0,katex.render(""+t,equPara),equPara.style.animation="textAppear 1s ease-in-out",equPara.style.opacity=1,n(t)},1500)})}function equAnimeDisappear(t){return new Promise(function(n){var e;if("object"===("undefined"==typeof t?"undefined":_typeof(t)))e=globalEqu.replace("x","*("+t.innerText+")"),statusBar.innerText="",statusBar.innerText=">> Calculating",setTimeout(function(){equPara.style.animation="textDisappear 1.5s ease-in-out",n(e)},1500);else{if("string"!=typeof t)return;e=math.eval(t),setTimeout(function(){equPara.style.animation="textDisappear 1.5s ease-in-out",n(e)},1500)}})}function createAns(t){var n=wand.querApndr("#numContainer"),e=wand.crtElm("p",t.toString());return n.innerHTML="",new Promise(function(t){setTimeout(function(){var n={top:55,right:300},a={};a.top=startingData[0].top+5,a.right=startingData[0].right;var o=aniConfig(n,a,e,"zz",0);startingData.pop(),t(o)},1500)})}function animate(t,n){var e=wand.crtElm("p",n[t].num),a={top:55,right:300},o=aniConfig(n[t].coorData,a,e,alphaid[t],t);startingData.push(n[t].coorData),animationTemplate(o).then(equAnimeDisappear).then(equAppear).then(equAnimeDisappear).then(equAppear).then(createAns).then(animationTemplate).then(function(e){return new Promise(function(a){setTimeout(function(){var r=wand.querApndr("#row"+(t+1)+" td:nth-child(2)"),i="y = ",u=""+globalEqu,s=e.innerText,p={top:175,right:300};katex.render(i,yPara),katex.render(u,equPara),wand.apndr(r,s),o=aniConfig(n[t].coorData,p,e,"za",0),statusBar.innerText="",statusBar.innerText=">> Plotting answer.",a(o)},3e3)})}).then(animationTemplate)}function animatorControl(t,n){var e=wand.querApndr("#numContainer");e.innerHTML="";for(var a=0;a<t.length;a++)animate(a,t)}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t},lastSheet=document.styleSheets[document.styleSheets.length-1],alphaid=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r"],statusBar=wand.querApndr("#status p"),startingData=[];
"use strict";!function(){var n=["input1","input2","input3","input4","input5","input6","input7","input8","input9","input10","input11","input12","input13","input14","input15","input16","input17","input18","input19"],t=[];document.onchange=function(n){"select"===n.target.localName&&changePlot(n.target.value)},document.onclick=function(u){if("Go!"===u.target.value){t=[];for(var i=0;i<n.length;i++){var a=wand.querApndr("[name='"+n[i]+"']");if(a.value){var p={};p.coorData=a.getBoundingClientRect(),p.num=a.value,t.push(p),graphConfig.aniData=p}}animatorControl(t)}}}();
"use strict";!function(){for(var n,d,r,t,a=wand.querApndr("tbody"),w=19,p=1;w>=p;p++)t=wand.crtElm("input"),n=wand.crtElm("td"),d=wand.crtElm("td"),r=wand.crtElm("tr"),r.id="row"+p,t.name="input"+p,t.type="number",wand.apndr(n,t),wand.apndr(r,[n,d]),wand.apndr(a,r)}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhbmQuanMiLCJhamF4LmpzIiwiYW5pbWF0b3Jjb250cm9sLmpzIiwiZXZlbnRzLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6WyJfdHlwZW9mIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJvYmoiLCJjb25zdHJ1Y3RvciIsImdsbyIsImxpYiIsIndhbmQiLCJ3aW5kb3ciLCJ1bmRlZmluZWQiLCJhcG5kciIsImEiLCJiIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uc29sZSIsImVycm9yIiwiYXBwZW5kQ2hpbGQiLCJ0aGlzIiwidHh0IiwiYXJyIiwiaSIsImxlbmd0aCIsInF1ZXJBcG5kciIsImMiLCJlbGUiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjcnRFbG0iLCJxdWVyQXR0ciIsInNldEF0dHJpYnV0ZSIsImNyZWF0ZVRleHROb2RlIiwidG9TdHJpbmciLCJjcmVhdGVFbGVtZW50IiwiY2hhbmdlUGxvdCIsInZhbCIsImVxdVBhcmEiLCJpbm5lclRleHQiLCJ5IiwiZXF1YXQiLCJrYXRleCIsInJlbmRlciIsInlQYXJhIiwiZ2xvYmFsRXF1IiwiZ3JhcGhDb25maWciLCJlcXVhdGlvbiIsImRpc3BDb25maWciLCJwYXJzZWRPYmoiLCJKU09OIiwicGFyc2UiLCJzZWxlY3QiLCJuYW1lIiwib3B0IiwidmFsdWUiLCJsb2FkQ29uZmlnIiwiZnVuYyIsInNlYXJjaCIsInhodHRwIiwiWE1MSHR0cFJlcXVlc3QiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwic3RhdHVzIiwiY29uZmlnIiwicmVzcG9uc2VUZXh0IiwiYXBwQ29uZmlnIiwib3BlbiIsInNlbmQiLCJhbmlDb25maWciLCJiZWdDb29yRGF0YSIsImVuZENvb3JEYXRhIiwibnVtIiwiYWxwaGFpZCIsImFuaW1hdGVDb25maWciLCJkZWxheSIsImFuaW1hdGlvblRlbXBsYXRlIiwic3RhcnRUb3BPZmYiLCJ0b3AiLCJzdGFydFJpZ2h0T2ZmIiwicmlnaHQiLCJlbmRUb3BPZmYiLCJlbmRSaWdodE9mZiIsImhpZ2h3YXlQYXRoIiwibnVtQ29udGFpbmVyIiwic3R5bGUiLCJwb3NpdGlvbiIsImxlZnQiLCJsYXN0U2hlZXQiLCJpbnNlcnRSdWxlIiwiY3NzUnVsZXMiLCJhbmltYXRpb24iLCJvcGFjaXR5IiwiekluZGV4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0IiwiYW5pbWF0ZVRvU3RhdHVzQmFyIiwibG9nIiwiZXF1QXBwZWFyIiwiY2hhbmdlRXF1Iiwic3RhdHVzQmFyIiwiaW5uZXJIVE1MIiwiZXF1QW5pbWVEaXNhcHBlYXIiLCJyZXBsYWNlIiwibWF0aCIsImV2YWwiLCJjcmVhdGVBbnMiLCJhbnMiLCJmdW5jTWFjaENvb3IiLCJzdGFydGluZ0RhdGEiLCJwb3AiLCJhbmltYXRlIiwiYXciLCJjb29yRGF0YSIsInB1c2giLCJ0aGVuIiwieXZhbCIsInRkIiwieXZhbHVlIiwic3RhdHVzQmFyQ29vciIsImFuaW1hdG9yQ29udHJvbCIsImFuaSIsInN0eWxlU2hlZXRzIiwiaW5wdXRPcHQiLCJhbmltYXRlV2FpdCIsIm9uY2hhbmdlIiwiZSIsInRhcmdldCIsImxvY2FsTmFtZSIsIm9uY2xpY2siLCJpbnB1dCIsImFuaURhdGEiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0ZDEiLCJ0ZDIiLCJ0ciIsInRib2R5Iiwicm93Q291bnQiLCJqIiwiaWQiLCJ0eXBlIl0sIm1hcHBpbmdzIjoiQUFBQSxZQUVBLElBQUlBLFNBQTRCLGtCQUFYQyxTQUFvRCxnQkFBcEJBLFFBQU9DLFNBQXdCLFNBQVVDLEdBQU8sYUFBY0EsSUFBUyxTQUFVQSxHQUFPLE1BQU9BLElBQXlCLGtCQUFYRixTQUF5QkUsRUFBSUMsY0FBZ0JILE9BQVMsZUFBa0JFLEtBSXpPLFNBQVVFLEVBQUtDLEdBQ1pELEVBQUlFLEtBQU9ELEtBQ0ssbUJBQVhFLFFBQXlCQSxPQUFoQ0MsT0FBK0MsV0FDN0MsR0FBSUgsSUFDQUksTUFBTyxTQUFVQyxFQUFHQyxHQUNoQixHQUFpQixZQUFiLG1CQUFP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QUFNMkQsRUFBTTVFLE1BQ3BCc0UsRUFBWVYsS0FBS2lCLEdBR2pCdEYsWUFBWXNGLFFBQVVBLEdBRzlCWCxnQkFBZ0JJO0FDL0I1QixjQUFDLFdBV0csSUFBSyxHQU5EUyxHQUNBQyxFQUNBQyxFQUNBTCxFQUpBTSxFQUFRaEksS0FBS2dCLFVBQVUsU0FLdkJpSCxFQUFXLEdBRU5DLEVBQUksRUFBUUQsR0FBTEMsRUFBZUEsSUFDM0JSLEVBQVExSCxLQUFLcUIsT0FBTyxTQUNwQndHLEVBQU03SCxLQUFLcUIsT0FBTyxNQUNsQnlHLEVBQU05SCxLQUFLcUIsT0FBTyxNQUNsQjBHLEVBQUsvSCxLQUFLcUIsT0FBTyxNQUVqQjBHLEVBQUdJLEdBQUgsTUFBY0QsRUFFZFIsRUFBTTlFLEtBQU4sUUFBcUJzRixFQUNyQlIsRUFBTVUsS0FBTyxTQUVicEksS0FBS0csTUFBTTBILEVBQUtILEdBQ2hCMUgsS0FBS0csTUFBTTRILEdBQUtGLEVBQUtDLElBQ3JCOUgsS0FBS0csTUFBTTZILEVBQU9EIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cblRoaXMgaXMgYSBjdXN0b20gbGlicmFyeSB0aGF0IEkgbWFkZSB0byBtYWtlIERPTSBtYW5pcHVsYXRpb24gYSBsaXR0bGUgYml0IGZhc3RlclxuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuKGZ1bmN0aW9uIChnbG8sIGxpYikge1xuICAgIGdsby53YW5kID0gbGliKCk7XG59KHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxpYiA9IHtcbiAgICAgICAgYXBuZHI6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGEgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGIgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkoYikpIHtcbiAgICAgICAgICAgICAgICBhLmFwcGVuZENoaWxkKGIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGaXJzdCBwYXJhbWV0ZXIgcGFzc2VkIGlzIG5vdCBhbiBvYmplY3QgZWxlbWVudC5cIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBiICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBiID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBiID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQodGhpcy50eHQoYikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShiKSkge1xuICAgICAgICAgICAgICAgIHZhciBhcnIgPSBiO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBuZHIoYSwgYXJyW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJQYXJhbWV0ZXJzIGFyZSBub3QgY29tcGF0aWJsZSBpbiB0aGUgbGliLmFwbmRyIGZ1bmN0aW9uLiAgSGl0IHRoZSBhcnJvdyBvbiB0aGUgbGVmdCBmb3IgY2FsbCBzdGFjay5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHF1ZXJBcG5kcjogZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHZhciBlbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGEpO1xuICAgICAgICAgICAgaWYgKGVsZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk5vIHRhZyBleGlzdHMgaW4gdGhlIERPTS4gSGl0IHRoZSBhcnJvdyBvbiB0aGUgbGVmdCBmb3IgY2FsbCBzdGFjay5cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnIgPSBiO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcG5kcihlbGUsIHRoaXMuY3J0RWxtKGFycltpXSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBuZHIoZWxlLCB0aGlzLmNydEVsbShiLCBjKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcG5kcihlbGUsIGIpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBlbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHF1ZXJBdHRyOiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICAgICAgdmFyIGVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYSk7XG4gICAgICAgICAgICBpZiAoZWxlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTm8gdGFnIGV4aXN0cyBpbiB0aGUgRE9NLiBIaXQgdGhlIGFycm93IG9uIHRoZSBsZWZ0IGZvciBjYWxsIHN0YWNrLlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGIpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShiLCBjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHR4dDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlBhcmFtZXRlciBwYXNzZWQgdG8gbGliLnR4dCBpcyBub3QgYSBzdHJpbmcgbm9yIGEgbnVtYmVyLiAgSGl0IHRoZSBhcnJvdyBvbiB0aGUgbGVmdCBmb3IgY2FsbCBzdGFjay5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNydEVsbTogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGEpLFxuICAgICAgICAgICAgICAgIHR4dDtcbiAgICAgICAgICAgIGlmIChiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBiID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHR4dCA9IHRoaXMudHh0KGIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwbmRyKGVsZSwgdHh0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTXVzdCBwYXNzIGEgc3RyaW5nIGFzIHRoZSBzZWNvbmQgcGFyYW0gaW4gbGliLmNydEVsbSBmdW5jdGlvbi4gIEhpdCB0aGUgYXJyb3cgb24gdGhlIGxlZnQgZm9yIGNhbGwgc3RhY2suXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbGU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxpYjtcbn0pKTtcbiIsIiAgICB2YXIgY29uZmlnLFxuICAgICAgICBnbG9iYWxFcXUsXG4gICAgICAgIGVxdVBhcmEgPSB3YW5kLnF1ZXJBcG5kcihcIiNmdW5jdGlvbk1hY2hpbmUgI2VxdVwiKSxcbiAgICAgICAgeVBhcmEgPSB3YW5kLnF1ZXJBcG5kcihcIiNmdW5jdGlvbk1hY2hpbmUgI3lcIiksXG4gICAgICAgIGdyYXBoQ29uZmlnID0ge307XG5cbiAgICAvL0RpcHNsYXkgS2F0ZXggZXF1YXRpb25cbiAgICBmdW5jdGlvbiBjaGFuZ2VQbG90KHZhbCkge1xuICAgICAgICBlcXVQYXJhLmlubmVyVGV4dCA9IFwiXCI7XG4gICAgICAgIHZhciB5ID0gYHkgPSBgLFxuICAgICAgICAgICAgZXF1YXQgPSBgJHt2YWx9YDtcbiAgICAgICAga2F0ZXgucmVuZGVyKHksIHlQYXJhKTtcbiAgICAgICAga2F0ZXgucmVuZGVyKGVxdWF0LCBlcXVQYXJhKTtcbiAgICAgICAgZ2xvYmFsRXF1ID0gdmFsO1xuXG4gICAgICAgIC8vZ3JhcGhDb25maWcgbG9jYXRlZCBpbiBhbmltYXRvci5qcyBsaW5lIDlcbiAgICAgICAgZ3JhcGhDb25maWcuZXF1YXRpb24gPSBlcXVhdDtcbiAgICB9XG5cbiAgICAvKkFKQVggUkVRVUVTVCBUTyBGVU5DTUFDSElORVNFVFRJTkdTLkpTIEFORCBMT0FEKi9cbiAgICBmdW5jdGlvbiBkaXNwQ29uZmlnKGMpIHtcbiAgICAgICAgdmFyIHBhcnNlZE9iaiA9IEpTT04ucGFyc2UoYyksXG4gICAgICAgICAgICBzZWxlY3QgPSB3YW5kLmNydEVsbShcInNlbGVjdFwiKTtcbiAgICAgICAgc2VsZWN0Lm5hbWUgPSBcImVxdURyb3BcIjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJzZWRPYmoubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBvcHQgPSB3YW5kLmNydEVsbShcIm9wdGlvblwiLCBwYXJzZWRPYmpbaV0ubmFtZSk7XG4gICAgICAgICAgICBvcHQudmFsdWUgPSBwYXJzZWRPYmpbaV0uZXF1YXRpb247XG4gICAgICAgICAgICAvLyAgICAgICAgICBvcHQuY2xhc3MgPSBKU09OLnN0cmluZ2lmeShwYXJzZWRPYmpbaV0ud2luZG93KTtcbiAgICAgICAgICAgIHdhbmQuYXBuZHIoc2VsZWN0LCBvcHQpO1xuICAgICAgICAgICAgd2FuZC5xdWVyQXBuZHIoXCIjZHJvcGRvd25cIiwgc2VsZWN0KTtcbiAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY2hhbmdlUGxvdChwYXJzZWRPYmpbaV0uZXF1YXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9Mb2FkIGluIHRoZSBjb25maWd1cmF0aW9uIGZpbGVcbiAgICBmdW5jdGlvbiBsb2FkQ29uZmlnKGZ1bmMsIHNlYXJjaCkge1xuICAgICAgICB2YXIgeGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHhodHRwLnJlYWR5U3RhdGUgPT0gNCAmJiB4aHR0cC5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnID0geGh0dHAucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgICAgIGZ1bmMoY29uZmlnKTtcbiAgICAgICAgICAgICAgICBncmFwaENvbmZpZy5hcHBDb25maWcgPSBKU09OLnBhcnNlKGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhodHRwLm9wZW4oXCJHRVRcIiwgc2VhcmNoLCB0cnVlKTtcbiAgICAgICAgeGh0dHAuc2VuZCgpO1xuICAgIH1cblxuICAgIGxvYWRDb25maWcoZGlzcENvbmZpZywgXCIuLi9mdW5jTWFjaGluZVNldHRpbmdzLmpzb25cIik7XG4iLCJ2YXIgbGFzdFNoZWV0ID0gZG9jdW1lbnQuc3R5bGVTaGVldHNbZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoIC0gMV07XG5cbi8vIFRPRE86IEZ1bmN0aW9uIG1hY2hpbmUgaW5cblxuLy9BbHBoYSBJRCBpcyB0byBpZGVudGlmeSB0aGUgZGlmZmVyZW50IGFuaW1hdGlvbnMgdGhhdCBjb3VsZCBoYXBwZW4gaW4gdGhlIGFwcGxpY2F0aW9uXG52YXIgYWxwaGFpZCA9IFsnYScsICdiJywgJ2MnLCAnZCcsICdlJywgJ2YnLCAnZycsICdoJywgJ2knLCAnaicsICdrJywgJ2wnLCAnbScsICduJywgJ28nLCAncCcsICdxJywgJ3InXSxcbiAgICBzdGF0dXNCYXIgPSB3YW5kLnF1ZXJBcG5kcihcIiNzdGF0dXMgcFwiKSxcbiAgICBzdGFydGluZ0RhdGEgPSBbXTtcblxuLyoqKioqKioqXCJDT05TVFJVQ1RPUlwiIChub3QgZXhhY3RseSkgZnVuY3Rpb25zKioqKioqKioqKi9cbmZ1bmN0aW9uIGFuaUNvbmZpZyhiZWdDb29yRGF0YSwgZW5kQ29vckRhdGEsIG51bSwgYWxwaGFpZCwgaSkge1xuICAgIHZhciBhbmltYXRlQ29uZmlnID0ge307XG4gICAgYW5pbWF0ZUNvbmZpZy5iZWdDb29yRGF0YSA9IGJlZ0Nvb3JEYXRhO1xuICAgIGFuaW1hdGVDb25maWcuZW5kQ29vckRhdGEgPSBlbmRDb29yRGF0YTtcbiAgICBhbmltYXRlQ29uZmlnLm51bSA9IG51bTtcbiAgICBhbmltYXRlQ29uZmlnLmFscGhhaWQgPSBhbHBoYWlkO1xuICAgIGFuaW1hdGVDb25maWcuZGVsYXkgPSBpO1xuICAgIHJldHVybiBhbmltYXRlQ29uZmlnO1xufVxuXG5mdW5jdGlvbiBhbmltYXRpb25UZW1wbGF0ZShhbmltYXRlQ29uZmlnKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHN0YXJ0VG9wT2ZmID0gYW5pbWF0ZUNvbmZpZy5iZWdDb29yRGF0YS50b3AgKyA1LFxuICAgICAgICBzdGFydFJpZ2h0T2ZmID0gYW5pbWF0ZUNvbmZpZy5iZWdDb29yRGF0YS5yaWdodCAtIDMwLFxuICAgICAgICBlbmRUb3BPZmYgPSBhbmltYXRlQ29uZmlnLmVuZENvb3JEYXRhLnRvcCxcbiAgICAgICAgZW5kUmlnaHRPZmYgPSBhbmltYXRlQ29uZmlnLmVuZENvb3JEYXRhLnJpZ2h0LFxuICAgICAgICBoaWdod2F5UGF0aCA9IDI0NixcbiAgICAgICAgbnVtQ29udGFpbmVyID0gd2FuZC5xdWVyQXBuZHIoXCIjbnVtQ29udGFpbmVyXCIpO1xuICAgIGFuaW1hdGVDb25maWcubnVtLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgIGFuaW1hdGVDb25maWcubnVtLnN0eWxlLnRvcCA9IGAke3N0YXJ0VG9wT2ZmfXB4YDtcbiAgICBhbmltYXRlQ29uZmlnLm51bS5zdHlsZS5sZWZ0ID0gYCR7c3RhcnRSaWdodE9mZn1weGA7XG4gICAgd2FuZC5hcG5kcihudW1Db250YWluZXIsIGFuaW1hdGVDb25maWcubnVtKTtcbiAgICBsYXN0U2hlZXQuaW5zZXJ0UnVsZShgQGtleWZyYW1lcyB0b0Z1bmNNYWNoaW5lJHthbmltYXRlQ29uZmlnLmFscGhhaWR9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAwJSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogJHtzdGFydFRvcE9mZn1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJHtzdGFydFJpZ2h0T2ZmfXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxMCUge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAzMyUge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICR7c3RhcnRUb3BPZmZ9cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7aGlnaHdheVBhdGh9cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDY2JSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogJHtlbmRUb3BPZmZ9cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7aGlnaHdheVBhdGh9cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDkwJSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEwMCUge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICR7ZW5kVG9wT2ZmfXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAke2VuZFJpZ2h0T2ZmfXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1gLCBsYXN0U2hlZXQuY3NzUnVsZXMubGVuZ3RoKTtcbiAgICBhbmltYXRlQ29uZmlnLm51bS5zdHlsZS5hbmltYXRpb24gPSBgdG9GdW5jTWFjaGluZSR7YW5pbWF0ZUNvbmZpZy5hbHBoYWlkfSAzcyBlYXNlLWluLW91dCAke2FuaW1hdGVDb25maWcuZGVsYXkqMTB9c2A7XG4gICAgYW5pbWF0ZUNvbmZpZy5udW0uc3R5bGUub3BhY2l0eSA9ICcwJztcbiAgICBhbmltYXRlQ29uZmlnLm51bS5zdHlsZS56SW5kZXggPSAnMTAwJztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXNvbHZlKGFuaW1hdGVDb25maWcubnVtKTtcbiAgICAgICAgfSwgYW5pbWF0ZUNvbmZpZy5kZWxheSAqIDMwMDApO1xuICAgIH0pO1xufVxuXG4vKioqKioqKioqKioqQU5JTUFUSU9OIEZVTkNUSU9OUyoqKioqKioqKioqKioqKioqKioqKiovXG5mdW5jdGlvbiBhbmltYXRlVG9TdGF0dXNCYXIoKSB7XG4gICAgY29uc29sZS5sb2coXCJBbmltYXRlIHRvIHN0YXR1cyBiYXIgYW5kIHBhc3MgdGhlIGluZm9ybWF0aW9uIHRvIHRoZSBncmFwaCBmdW5jdGlvblwiKTtcblxuICAgIC8vU2hvdyBncmFwaCBjaGVja2JveFxuICAgIC8vQW5pbWF0aW9uIGNoZWNrYm94XG4gICAgLy9FcXVhdGlvblxuICAgIC8vV2luZG93IGxpbWl0c1xuICAgIC8vWCBhbmQgWSB2YWx1ZVxuXG4gICAgLy9ncmFwaEl0KCk7XG59XG5cbmZ1bmN0aW9uIGVxdUFwcGVhcihjaGFuZ2VFcXUpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNoYW5nZUVxdSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHN0YXR1c0Jhci5pbm5lclRleHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHN0YXR1c0Jhci5pbm5lclRleHQgPSBcIj4+IFJldHVybmluZyBhbnN3ZXIuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlcXVQYXJhLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICBlcXVQYXJhLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAga2F0ZXgucmVuZGVyKGAke2NoYW5nZUVxdX1gLCBlcXVQYXJhKTtcbiAgICAgICAgICAgIGVxdVBhcmEuc3R5bGUuYW5pbWF0aW9uID0gJ3RleHRBcHBlYXIgMXMgZWFzZS1pbi1vdXQnO1xuICAgICAgICAgICAgZXF1UGFyYS5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgICAgIHJlc29sdmUoY2hhbmdlRXF1KTtcbiAgICAgICAgfSwgMTUwMCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGVxdUFuaW1lRGlzYXBwZWFyKG51bSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICB2YXIgY2hhbmdlRXF1O1xuXG4gICAgICAgIGlmICh0eXBlb2YgbnVtID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBjaGFuZ2VFcXUgPSBnbG9iYWxFcXUucmVwbGFjZShcInhcIiwgYCooJHtudW0uaW5uZXJUZXh0fSlgKTtcblxuICAgICAgICAgICAgc3RhdHVzQmFyLmlubmVyVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICBzdGF0dXNCYXIuaW5uZXJUZXh0ID0gXCI+PiBDYWxjdWxhdGluZ1wiO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlcXVQYXJhLnN0eWxlLmFuaW1hdGlvbiA9ICd0ZXh0RGlzYXBwZWFyIDEuNXMgZWFzZS1pbi1vdXQnO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoY2hhbmdlRXF1KTtcbiAgICAgICAgICAgIH0sIDE1MDApO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBudW0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGNoYW5nZUVxdSA9IG1hdGguZXZhbChudW0pO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlcXVQYXJhLnN0eWxlLmFuaW1hdGlvbiA9ICd0ZXh0RGlzYXBwZWFyIDEuNXMgZWFzZS1pbi1vdXQnO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoY2hhbmdlRXF1KTtcbiAgICAgICAgICAgIH0sIDE1MDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUFucyhhbnMpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgbnVtQ29udGFpbmVyID0gd2FuZC5xdWVyQXBuZHIoXCIjbnVtQ29udGFpbmVyXCIpLFxuICAgICAgICBudW0gPSB3YW5kLmNydEVsbShcInBcIiwgYW5zLnRvU3RyaW5nKCkpO1xuICAgIG51bUNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGZ1bmNNYWNoQ29vciA9IHtcbiAgICAgICAgICAgICAgICAgICAgdG9wOiA1NSxcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDMwMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZW5kQ29vckRhdGEgPSB7fTtcblxuICAgICAgICAgICAgZW5kQ29vckRhdGEudG9wID0gc3RhcnRpbmdEYXRhWzBdLnRvcCArIDU7XG4gICAgICAgICAgICBlbmRDb29yRGF0YS5yaWdodCA9IHN0YXJ0aW5nRGF0YVswXS5yaWdodDtcblxuICAgICAgICAgICAgdmFyIGFuaW1hdGVDb25maWcgPSBhbmlDb25maWcoZnVuY01hY2hDb29yLCBlbmRDb29yRGF0YSwgbnVtLCAnenonLCAwKTtcblxuICAgICAgICAgICAgc3RhcnRpbmdEYXRhLnBvcCgpO1xuICAgICAgICAgICAgcmVzb2x2ZShhbmltYXRlQ29uZmlnKTtcbiAgICAgICAgfSwgMTUwMCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGFuaW1hdGUoaSwgYXcpIHtcbiAgICB2YXIgbnVtID0gd2FuZC5jcnRFbG0oXCJwXCIsIGF3W2ldLm51bSksXG4gICAgICAgIGZ1bmNNYWNoQ29vciA9IHtcbiAgICAgICAgICAgIHRvcDogNTUsXG4gICAgICAgICAgICByaWdodDogMzAwXG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGVDb25maWcgPSBhbmlDb25maWcoYXdbaV0uY29vckRhdGEsIGZ1bmNNYWNoQ29vciwgbnVtLCBhbHBoYWlkW2ldLCBpKTtcblxuICAgIHN0YXJ0aW5nRGF0YS5wdXNoKGF3W2ldLmNvb3JEYXRhKTtcblxuICAgIGFuaW1hdGlvblRlbXBsYXRlKGFuaW1hdGVDb25maWcpXG4gICAgICAgIC50aGVuKGVxdUFuaW1lRGlzYXBwZWFyKVxuICAgICAgICAudGhlbihlcXVBcHBlYXIpXG4gICAgICAgIC50aGVuKGVxdUFuaW1lRGlzYXBwZWFyKVxuICAgICAgICAudGhlbihlcXVBcHBlYXIpXG4gICAgICAgIC50aGVuKGNyZWF0ZUFucylcbiAgICAgICAgLnRoZW4oYW5pbWF0aW9uVGVtcGxhdGUpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICh5dmFsKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRkID0gd2FuZC5xdWVyQXBuZHIoYCNyb3cke2krMX0gdGQ6bnRoLWNoaWxkKDIpYCksXG4gICAgICAgICAgICAgICAgICAgICAgICB5ID0gYHkgPSBgLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXF1YXQgPSBgJHtnbG9iYWxFcXV9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHl2YWx1ZSA9IHl2YWwuaW5uZXJUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdHVzQmFyQ29vciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDE3NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogMzAwXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGVDb25maWc7XG5cbiAgICAgICAgICAgICAgICAgICAga2F0ZXgucmVuZGVyKHksIHlQYXJhKTtcbiAgICAgICAgICAgICAgICAgICAga2F0ZXgucmVuZGVyKGVxdWF0LCBlcXVQYXJhKTtcbiAgICAgICAgICAgICAgICAgICAgd2FuZC5hcG5kcih0ZCwgeXZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlQ29uZmlnID0gYW5pQ29uZmlnKGF3W2ldLmNvb3JEYXRhLCBzdGF0dXNCYXJDb29yLCB5dmFsLCBcInphXCIsIDApO1xuXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c0Jhci5pbm5lclRleHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXNCYXIuaW5uZXJUZXh0ID0gXCI+PiBQbG90dGluZyBhbnN3ZXIuXCI7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhbmltYXRlQ29uZmlnKTtcbiAgICAgICAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihhbmltYXRpb25UZW1wbGF0ZSk7XG59XG5cbi8vSGFuZGxlIGFsbCBDU1MgYW5pbWF0aW9uc1xuZnVuY3Rpb24gYW5pbWF0b3JDb250cm9sKGF3LCBhbmkpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgbnVtQ29udGFpbmVyID0gd2FuZC5xdWVyQXBuZHIoXCIjbnVtQ29udGFpbmVyXCIpO1xuICAgIG51bUNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdy5sZW5ndGg7IGkrKykge1xuICAgICAgICBhbmltYXRlKGksIGF3KTtcbiAgICB9XG59IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8vcmVnaXN0ZXIgYWxsIGlucHV0cyBvbiB0aGUgYXBwbGljYXRpb25cbiAgICB2YXIgaW5wdXRPcHQgPSBbXCJpbnB1dDFcIiwgXCJpbnB1dDJcIiwgXCJpbnB1dDNcIiwgXCJpbnB1dDRcIiwgXCJpbnB1dDVcIiwgXCJpbnB1dDZcIiwgXCJpbnB1dDdcIiwgXCJpbnB1dDhcIiwgXCJpbnB1dDlcIiwgXCJpbnB1dDEwXCIsIFwiaW5wdXQxMVwiLCBcImlucHV0MTJcIiwgXCJpbnB1dDEzXCIsIFwiaW5wdXQxNFwiLCBcImlucHV0MTVcIiwgXCJpbnB1dDE2XCIsIFwiaW5wdXQxN1wiLCBcImlucHV0MThcIiwgXCJpbnB1dDE5XCJdLFxuICAgICAgICBhbmltYXRlV2FpdCA9IFtdO1xuXG4gICAgLyoqKipET0NVTUVOVCBPTkNIQU5HRSBFVkVOVCBIQU5ETEVSKioqKi9cbiAgICBkb2N1bWVudC5vbmNoYW5nZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldC5sb2NhbE5hbWUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgICAgICAgIC8vY2hhbmdlUGxvdCBmdW5jdGlvbiBpbiBhamF4LmpzXG4gICAgICAgICAgICBjaGFuZ2VQbG90KGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKioqKipET0NVTUVOVCBDTElDSyBIQU5ETEVSKioqKiovXG4gICAgZG9jdW1lbnQub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSA9PT0gXCJHbyFcIikge1xuICAgICAgICAgICAgYW5pbWF0ZVdhaXQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXRPcHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSB3YW5kLnF1ZXJBcG5kcihgW25hbWU9JyR7aW5wdXRPcHRbaV19J11gKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaURhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgYW5pRGF0YS5jb29yRGF0YSA9IGlucHV0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICBhbmlEYXRhLm51bSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRlV2FpdC5wdXNoKGFuaURhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vZ3JhcGhDb25maWcgbG9jYXRlZCBpbiBBSkFYLmpzXG4gICAgICAgICAgICAgICAgICAgIGdyYXBoQ29uZmlnLmFuaURhdGEgPSBhbmlEYXRhXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5pbWF0b3JDb250cm9sKGFuaW1hdGVXYWl0KTtcbiAgICAgICAgfVxuICAgIH07XG59KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKioqVEFCTEUgTUFLRVIqKioqL1xuICAgIHZhciB0Ym9keSA9IHdhbmQucXVlckFwbmRyKFwidGJvZHlcIiksXG4gICAgICAgIHRkMSxcbiAgICAgICAgdGQyLFxuICAgICAgICB0cixcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIHJvd0NvdW50ID0gMTk7XG5cbiAgICBmb3IgKHZhciBqID0gMTsgaiA8PSByb3dDb3VudDsgaisrKSB7XG4gICAgICAgIGlucHV0ID0gd2FuZC5jcnRFbG0oXCJpbnB1dFwiKTtcbiAgICAgICAgdGQxID0gd2FuZC5jcnRFbG0oXCJ0ZFwiKTtcbiAgICAgICAgdGQyID0gd2FuZC5jcnRFbG0oXCJ0ZFwiKTtcbiAgICAgICAgdHIgPSB3YW5kLmNydEVsbShcInRyXCIpO1xuXG4gICAgICAgIHRyLmlkID0gYHJvdyR7an1gO1xuXG4gICAgICAgIGlucHV0Lm5hbWUgPSBgaW5wdXQke2p9YDtcbiAgICAgICAgaW5wdXQudHlwZSA9ICdudW1iZXInO1xuXG4gICAgICAgIHdhbmQuYXBuZHIodGQxLCBpbnB1dCk7XG4gICAgICAgIHdhbmQuYXBuZHIodHIsIFt0ZDEsIHRkMl0pO1xuICAgICAgICB3YW5kLmFwbmRyKHRib2R5LCB0cik7XG4gICAgfVxufSgpKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
