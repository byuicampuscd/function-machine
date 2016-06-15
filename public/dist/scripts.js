"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};!function(t,e){t.wand=e()}("undefined"!=typeof window?window:void 0,function(){var t={apndr:function(t,e){if("object"!==("undefined"==typeof t?"undefined":_typeof(t))||"object"!==("undefined"==typeof e?"undefined":_typeof(e))||Array.isArray(e))if("object"!==("undefined"==typeof t?"undefined":_typeof(t)))console.error("First parameter passed is not an object element.");else if("object"!==("undefined"==typeof e?"undefined":_typeof(e)))"string"!=typeof e&&"number"!=typeof e||t.appendChild(this.txt(e));else if(Array.isArray(e))for(var r=e,n=0;n<r.length;n++)this.apndr(t,r[n]);else console.error("Parameters are not compatible in the lib.apndr function.  Hit the arrow on the left for call stack.");else t.appendChild(e)},querApndr:function(t,e,r){var n=document.querySelector(t);if(null!=n){if(Array.isArray(e))for(var o=e,i=0;i<o.length;i++)this.apndr(n,this.crtElm(o[i]));else r?this.apndr(n,this.crtElm(e,r)):this.apndr(n,e);return n}console.error("No tag exists in the DOM. Hit the arrow on the left for call stack.")},querAttr:function(t,e,r){var n=document.querySelector(t);null==n?console.error("No tag exists in the DOM. Hit the arrow on the left for call stack."):e&&n.setAttribute(e,r)},txt:function(t){return"string"==typeof t?document.createTextNode(t):"number"==typeof t?document.createTextNode(t.toString()):void console.error("Parameter passed to lib.txt is not a string nor a number.  Hit the arrow on the left for call stack.")},crtElm:function(t,e){var r,n=document.createElement(t);return e&&("string"==typeof e?(r=this.txt(e),this.apndr(n,r)):console.error("Must pass a string as the second param in lib.crtElm function.  Hit the arrow on the left for call stack.")),n}};return t});
"use strict";function changePlot(n){equPara.innerText="";var a="y = "+n;katex.render(a,equPara),globalEqu=n,graphConfig.equation=a}function dispConfig(n){var a=JSON.parse(n),e=wand.crtElm("select");e.name="equDrop";for(var o=0;o<a.length;o++){var r=wand.crtElm("option",a[o].name);r.value=a[o].equation,wand.apndr(e,r),wand.querApndr("#dropdown",e),0===o&&changePlot(a[o].equation)}}function loadConfig(n,a){var e=new XMLHttpRequest;e.onreadystatechange=function(){4==e.readyState&&200==e.status&&(config=e.responseText,n(config),graphConfig.appConfig=JSON.parse(config))},e.open("GET",a,!0),e.send()}var config,globalEqu,equPara=wand.querApndr("#functionMachine p"),graphConfig={};loadConfig(dispConfig,"../funcMachineSettings.json");
"use strict";function aniConfig(n,t,e,a,o){var i={};return i.begCoorData=n,i.endCoorData=t,i.num=e,i.alphaid=a,i.delay=o,i}function animationTemplate(n){var t=n.begCoorData.top+5,e=n.begCoorData.right-30,a=n.endCoorData.top,o=n.endCoorData.right,i=246,r=wand.querApndr("#numContainer");return n.num.style.position="absolute",n.num.style.top=t+"px",n.num.style.left=e+"px",wand.apndr(r,n.num),lastSheet.insertRule("@keyframes toFuncMachine"+n.alphaid+" {\n                            0% {\n                                opacity: 0;\n                                top: "+t+"px;\n                                left: "+e+"px;\n                            }\n                            10% {\n                                opacity: 1;\n                            }\n                            33% {\n                                top: "+t+"px;\n                                left: "+i+"px;\n                            }\n                            66% {\n                                top: "+a+"px;\n                                left: "+i+"px;\n                            }\n                            90% {\n                                opacity: 1;\n                            }\n                            100% {\n                                opacity: 0;\n                                top: "+a+"px;\n                                left: "+o+"px;\n                            }\n                        }",lastSheet.cssRules.length),n.num.style.animation="toFuncMachine"+n.alphaid+" 3s ease-in-out "+10*n.delay+"s",n.num.style.opacity="0",n.num.style.zIndex="100",new Promise(function(t){window.setTimeout(function(){t(n.num)},3e3*n.delay)})}function animateToStatusBar(){console.log("Animate to status bar and pass the information to the graph function")}function equAppear(n){return new Promise(function(t){setTimeout(function(){equPara.innerHTML="",equPara.style.opacity=0,katex.render("y = "+n,equPara),equPara.style.animation="textAppear 1s ease-in-out",equPara.style.opacity=1,t(n)},1500)})}function equAnimeDisappear(n){return new Promise(function(t){var e;"object"===("undefined"==typeof n?"undefined":_typeof(n))?(e=globalEqu.replace("x","*"+n.innerText),statusBar.innerText="",statusBar.innerText=">> Calculating",setTimeout(function(){equPara.style.animation="textDisappear 1.5s ease-in-out",t(e)},1500)):"string"==typeof n&&(e=math.eval(n),setTimeout(function(){equPara.style.animation="textDisappear 1.5s ease-in-out",t(e)},1500))})}function createAns(n){var t=wand.querApndr("#numContainer"),e=wand.crtElm("p",n.toString());return t.innerHTML="",new Promise(function(n){setTimeout(function(){var t={top:55,right:300},a=aniConfig(t,startingData[0],e,"zz",0);startingData.pop(),n(a)},1500)})}function animatorControl(n){var t=wand.querApndr("#numContainer");t.innerHTML="";for(var e=0;e<n.length;e++){var a=wand.crtElm("p",n[e].num),o={top:55,right:300},i=aniConfig(n[e].coorData,o,a,alphaid[e],e);startingData.push(n[e].coorData),animationTemplate(i).then(equAnimeDisappear).then(equAppear).then(equAnimeDisappear).then(equAppear).then(createAns).then(animationTemplate),console.log(startingData)}}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol?"symbol":typeof n},lastSheet=document.styleSheets[document.styleSheets.length-1],alphaid=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r"],statusBar=wand.querApndr("#status p"),startingData=[];
"use strict";!function(){var n=["input1","input2","input3","input4","input5","input6","input7","input8","input9","input10","input11","input12","input13","input14","input15","input16","input17","input18","input19"],t=[];document.onchange=function(n){"select"===n.target.localName&&changePlot(n.target.value)},document.onclick=function(u){if("Go!"===u.target.value){t=[];for(var i=0;i<n.length;i++){var a=wand.querApndr("[name='"+n[i]+"']");if(a.value){var p={};p.coorData=a.getBoundingClientRect(),p.num=a.value,t.push(p),graphConfig.aniData=p}}animatorControl(t)}}}();
"use strict";!function(){for(var n,d,r,t,a=wand.querApndr("tbody"),w=19,p=1;w>=p;p++)t=wand.crtElm("input"),n=wand.crtElm("td"),d=wand.crtElm("td"),r=wand.crtElm("tr"),t.name="input"+p,t.type="number",wand.apndr(n,t),wand.apndr(r,[n,d]),wand.apndr(a,r)}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhbmQuanMiLCJhamF4LmpzIiwiYW5pbWF0b3Jjb250cm9sLmpzIiwiZXZlbnRzLmpzIiwibWFpbi5qcyJdLCJuYW1lcyI6WyJfdHlwZW9mIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJvYmoiLCJjb25zdHJ1Y3RvciIsImdsbyIsImxpYiIsIndhbmQiLCJ3aW5kb3ciLCJ1bmRlZmluZWQiLCJhcG5kciIsImEiLCJiIiwiQXJyYXkiLCJpc0FycmF5IiwiY29uc29sZSIsImVycm9yIiwiYXBwZW5kQ2hpbGQiLCJ0aGlzIiwidHh0IiwiYXJyIiwiaSIsImxlbmd0aCIsInF1ZXJBcG5kciIsImMiLCJlbGUiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjcnRFbG0iLCJxdWVyQXR0ciIsInNldEF0dHJpYnV0ZSIsImNyZWF0ZVRleHROb2RlIiwidG9TdHJpbmciLCJjcmVhdGVFbGVtZW50IiwiY2hhbmdlUGxvdCIsInZhbCIsImVxdVBhcmEiLCJpbm5lclRleHQiLCJlcXVhdCIsImthdGV4IiwicmVuZGVyIiwiZ2xvYmFsRXF1IiwiZ3JhcGhDb25maWciLCJlcXVhdGlvbiIsImRpc3BDb25maWciLCJwYXJzZWRPYmoiLCJKU09OIiwicGFyc2UiLCJzZWxlY3QiLCJuYW1lIiwib3B0IiwidmFsdWUiLCJsb2FkQ29uZmlnIiwiZnVuYyIsInNlYXJjaCIsInhodHRwIiwiWE1MSHR0cFJlcXVlc3QiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwic3RhdHVzIiwiY29uZmlnIiwicmVzcG9uc2VUZXh0IiwiYXBwQ29uZmlnIiwib3BlbiIsInNlbmQiLCJhbmlDb25maWciLCJiZWdDb29yRGF0YSIsImVuZENvb3JEYXRhIiwibnVtIiwiYWxwaGFpZCIsImFuaW1hdGVDb25maWciLCJkZWxheSIsImFuaW1hdGlvblRlbXBsYXRlIiwic3RhcnRUb3BPZmYiLCJ0b3AiLCJzdGFydFJpZ2h0T2ZmIiwicmlnaHQiLCJlbmRUb3BPZmYiLCJlbmRSaWdodE9mZiIsImhpZ2h3YXlQYXRoIiwibnVtQ29udGFpbmVyIiwic3R5bGUiLCJwb3NpdGlvbiIsImxlZnQiLCJsYXN0U2hlZXQiLCJpbnNlcnRSdWxlIiwiY3NzUnVsZXMiLCJhbmltYXRpb24iLCJvcGFjaXR5IiwiekluZGV4IiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0IiwiYW5pbWF0ZVRvU3RhdHVzQmFyIiwibG9nIiwiZXF1QXBwZWFyIiwiY2hhbmdlRXF1IiwiaW5uZXJIVE1MIiwiZXF1QW5pbWVEaXNhcHBlYXIiLCJyZXBsYWNlIiwic3RhdHVzQmFyIiwibWF0aCIsImV2YWwiLCJjcmVhdGVBbnMiLCJhbnMiLCJmdW5jTWFjaENvb3IiLCJzdGFydGluZ0RhdGEiLCJwb3AiLCJhbmltYXRvckNvbnRyb2wiLCJhdyIsImNvb3JEYXRhIiwicHVzaCIsInRoZW4iLCJzdHlsZVNoZWV0cyIsImlucHV0T3B0IiwiYW5pbWF0ZVdhaXQiLCJvbmNoYW5nZSIsImUiLCJ0YXJnZXQiLCJsb2NhbE5hbWUiLCJvbmNsaWNrIiwiaW5wdXQiLCJhbmlEYXRhIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidGQxIiwidGQyIiwidHIiLCJ0Ym9keSIsInJvd0NvdW50IiwiaiIsInR5cGUiXSwibWFwcGluZ3MiOiJBQUFBLFlBRUEsSUFBSUEsU0FBNEIsa0JBQVhDLFNBQW9ELGdCQUFwQkEsUUFBT0MsU0FBd0IsU0FBVUMsR0FBTyxhQUFjQSxJQUFTLFNBQVVBLEdBQU8sTUFBT0EsSUFBeUIsa0JBQVhGLFNBQXlCRSxFQUFJQyxjQUFnQkgsT0FBUyxlQUFrQkUsS0FJek8sU0FBVUUsRUFBS0MsR0FDWkQsRUFBSUUsS0FBT0QsS0FDSyxtQkFBWEUsUUFBeUJBLE9BQWhDQyxPQUErQyxXQUM3QyxHQUFJSCxJQUNBSSxNQUFPLFNBQVVDLEVBQUdDLEdBQ2hCLEdBQWlCLFlBQWIsbUJBQU9ELEdBQVAsWUFBQVgsUUFBT1csS0FBK0IsWUFBYixtQkFBT0MsR0FBUCxZQUFBWixRQUFPWSxLQUFtQkMsTUFBTUMsUUFB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QmdFLElBQ0EsS0FBSyxHQUFJOUYsR0FBSSxFQUFHQSxFQUFJNkYsRUFBUzVGLE9BQVFELElBQUssQ0FDdEMsR0FBSW9HLEdBQVFsSCxLQUFLZ0IsVUFBTCxVQUF5QjJGLEVBQVM3RixHQUFsQyxLQUNaLElBQUlvRyxFQUFNdEUsTUFBTyxDQUNiLEdBQUl1RSxLQUNKQSxHQUFRWixTQUFXVyxFQUFNRSx3QkFDekJELEVBQVF0RCxJQUFNcUQsRUFBTXRFLE1BQ3BCZ0UsRUFBWUosS0FBS1csR0FHakJoRixZQUFZZ0YsUUFBVUEsR0FHOUJkLGdCQUFnQk87QUMvQjVCLGNBQUMsV0FXRyxJQUFLLEdBTkRTLEdBQ0FDLEVBQ0FDLEVBQ0FMLEVBSkFNLEVBQVF4SCxLQUFLZ0IsVUFBVSxTQUt2QnlHLEVBQVcsR0FFTkMsRUFBSSxFQUFRRCxHQUFMQyxFQUFlQSxJQUMzQlIsRUFBUWxILEtBQUtxQixPQUFPLFNBQ3BCZ0csRUFBTXJILEtBQUtxQixPQUFPLE1BQ2xCaUcsRUFBTXRILEtBQUtxQixPQUFPLE1BQ2xCa0csRUFBS3ZILEtBQUtxQixPQUFPLE1BRWpCNkYsRUFBTXhFLEtBQU4sUUFBcUJnRixFQUNyQlIsRUFBTVMsS0FBTyxTQUViM0gsS0FBS0csTUFBTWtILEVBQUtILEdBQ2hCbEgsS0FBS0csTUFBTW9ILEdBQUtGLEVBQUtDLElBQ3JCdEgsS0FBS0csTUFBTXFILEVBQU9EIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cblRoaXMgaXMgYSBjdXN0b20gbGlicmFyeSB0aGF0IEkgbWFkZSB0byBtYWtlIERPTSBtYW5pcHVsYXRpb24gYSBsaXR0bGUgYml0IGZhc3RlclxuXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuKGZ1bmN0aW9uIChnbG8sIGxpYikge1xuICAgIGdsby53YW5kID0gbGliKCk7XG59KHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxpYiA9IHtcbiAgICAgICAgYXBuZHI6IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGEgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGIgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkoYikpIHtcbiAgICAgICAgICAgICAgICBhLmFwcGVuZENoaWxkKGIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGaXJzdCBwYXJhbWV0ZXIgcGFzc2VkIGlzIG5vdCBhbiBvYmplY3QgZWxlbWVudC5cIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBiICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBiID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBiID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGEuYXBwZW5kQ2hpbGQodGhpcy50eHQoYikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShiKSkge1xuICAgICAgICAgICAgICAgIHZhciBhcnIgPSBiO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBuZHIoYSwgYXJyW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJQYXJhbWV0ZXJzIGFyZSBub3QgY29tcGF0aWJsZSBpbiB0aGUgbGliLmFwbmRyIGZ1bmN0aW9uLiAgSGl0IHRoZSBhcnJvdyBvbiB0aGUgbGVmdCBmb3IgY2FsbCBzdGFjay5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHF1ZXJBcG5kcjogZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgICAgICAgIHZhciBlbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGEpO1xuICAgICAgICAgICAgaWYgKGVsZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIk5vIHRhZyBleGlzdHMgaW4gdGhlIERPTS4gSGl0IHRoZSBhcnJvdyBvbiB0aGUgbGVmdCBmb3IgY2FsbCBzdGFjay5cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnIgPSBiO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcG5kcihlbGUsIHRoaXMuY3J0RWxtKGFycltpXSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXBuZHIoZWxlLCB0aGlzLmNydEVsbShiLCBjKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcG5kcihlbGUsIGIpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBlbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHF1ZXJBdHRyOiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICAgICAgdmFyIGVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYSk7XG4gICAgICAgICAgICBpZiAoZWxlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTm8gdGFnIGV4aXN0cyBpbiB0aGUgRE9NLiBIaXQgdGhlIGFycm93IG9uIHRoZSBsZWZ0IGZvciBjYWxsIHN0YWNrLlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGIpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShiLCBjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHR4dDogZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGEgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlBhcmFtZXRlciBwYXNzZWQgdG8gbGliLnR4dCBpcyBub3QgYSBzdHJpbmcgbm9yIGEgbnVtYmVyLiAgSGl0IHRoZSBhcnJvdyBvbiB0aGUgbGVmdCBmb3IgY2FsbCBzdGFjay5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNydEVsbTogZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGEpLFxuICAgICAgICAgICAgICAgIHR4dDtcbiAgICAgICAgICAgIGlmIChiKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBiID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHR4dCA9IHRoaXMudHh0KGIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwbmRyKGVsZSwgdHh0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTXVzdCBwYXNzIGEgc3RyaW5nIGFzIHRoZSBzZWNvbmQgcGFyYW0gaW4gbGliLmNydEVsbSBmdW5jdGlvbi4gIEhpdCB0aGUgYXJyb3cgb24gdGhlIGxlZnQgZm9yIGNhbGwgc3RhY2suXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBlbGU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGxpYjtcbn0pKTtcbiIsIiAgICB2YXIgY29uZmlnLFxuICAgICAgICBnbG9iYWxFcXUsXG4gICAgICAgIGVxdVBhcmEgPSB3YW5kLnF1ZXJBcG5kcihcIiNmdW5jdGlvbk1hY2hpbmUgcFwiKSxcbiAgICAgICAgZ3JhcGhDb25maWcgPSB7fTtcblxuICAgIC8vRGlwc2xheSBLYXRleCBlcXVhdGlvblxuICAgIGZ1bmN0aW9uIGNoYW5nZVBsb3QodmFsKSB7XG4gICAgICAgIGVxdVBhcmEuaW5uZXJUZXh0ID0gXCJcIjtcbiAgICAgICAgdmFyIGVxdWF0ID0gYHkgPSAke3ZhbH1gXG4gICAgICAgIGthdGV4LnJlbmRlcihlcXVhdCwgZXF1UGFyYSk7XG4gICAgICAgIGdsb2JhbEVxdSA9IHZhbDtcblxuICAgICAgICAvL2dyYXBoQ29uZmlnIGxvY2F0ZWQgaW4gYW5pbWF0b3IuanMgbGluZSA5XG4gICAgICAgIGdyYXBoQ29uZmlnLmVxdWF0aW9uID0gZXF1YXQ7XG4gICAgfVxuXG4gICAgLypBSkFYIFJFUVVFU1QgVE8gRlVOQ01BQ0hJTkVTRVRUSU5HUy5KUyBBTkQgTE9BRCovXG4gICAgZnVuY3Rpb24gZGlzcENvbmZpZyhjKSB7XG4gICAgICAgIHZhciBwYXJzZWRPYmogPSBKU09OLnBhcnNlKGMpLFxuICAgICAgICAgICAgc2VsZWN0ID0gd2FuZC5jcnRFbG0oXCJzZWxlY3RcIik7XG4gICAgICAgIHNlbGVjdC5uYW1lID0gXCJlcXVEcm9wXCI7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyc2VkT2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgb3B0ID0gd2FuZC5jcnRFbG0oXCJvcHRpb25cIiwgcGFyc2VkT2JqW2ldLm5hbWUpO1xuICAgICAgICAgICAgb3B0LnZhbHVlID0gcGFyc2VkT2JqW2ldLmVxdWF0aW9uO1xuICAgICAgICAgICAgLy8gICAgICAgICAgb3B0LmNsYXNzID0gSlNPTi5zdHJpbmdpZnkocGFyc2VkT2JqW2ldLndpbmRvdyk7XG4gICAgICAgICAgICB3YW5kLmFwbmRyKHNlbGVjdCwgb3B0KTtcbiAgICAgICAgICAgIHdhbmQucXVlckFwbmRyKFwiI2Ryb3Bkb3duXCIsIHNlbGVjdCk7XG4gICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNoYW5nZVBsb3QocGFyc2VkT2JqW2ldLmVxdWF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vTG9hZCBpbiB0aGUgY29uZmlndXJhdGlvbiBmaWxlXG4gICAgZnVuY3Rpb24gbG9hZENvbmZpZyhmdW5jLCBzZWFyY2gpIHtcbiAgICAgICAgdmFyIHhodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh4aHR0cC5yZWFkeVN0YXRlID09IDQgJiYgeGh0dHAuc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZyA9IHhodHRwLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgICAgICBmdW5jKGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgZ3JhcGhDb25maWcuYXBwQ29uZmlnID0gSlNPTi5wYXJzZShjb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHR0cC5vcGVuKFwiR0VUXCIsIHNlYXJjaCwgdHJ1ZSk7XG4gICAgICAgIHhodHRwLnNlbmQoKTtcbiAgICB9XG5cbiAgICBsb2FkQ29uZmlnKGRpc3BDb25maWcsIFwiLi4vZnVuY01hY2hpbmVTZXR0aW5ncy5qc29uXCIpO1xuIiwidmFyIGxhc3RTaGVldCA9IGRvY3VtZW50LnN0eWxlU2hlZXRzW2RvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aCAtIDFdO1xuXG4vLyBUT0RPOiBGdW5jdGlvbiBtYWNoaW5lIGluXG5cbi8vQWxwaGEgSUQgaXMgdG8gaWRlbnRpZnkgdGhlIGRpZmZlcmVudCBhbmltYXRpb25zIHRoYXQgY291bGQgaGFwcGVuIGluIHRoZSBhcHBsaWNhdGlvblxudmFyIGFscGhhaWQgPSBbJ2EnLCAnYicsICdjJywgJ2QnLCAnZScsICdmJywgJ2cnLCAnaCcsICdpJywgJ2onLCAnaycsICdsJywgJ20nLCAnbicsICdvJywgJ3AnLCAncScsICdyJ10sXG4gICAgc3RhdHVzQmFyID0gd2FuZC5xdWVyQXBuZHIoXCIjc3RhdHVzIHBcIiksXG4gICAgc3RhcnRpbmdEYXRhID0gW107XG5cbi8qKioqKioqKlwiQ09OU1RSVUNUT1JcIiAobm90IGV4YWN0bHkpIGZ1bmN0aW9ucyoqKioqKioqKiovXG5mdW5jdGlvbiBhbmlDb25maWcoYmVnQ29vckRhdGEsIGVuZENvb3JEYXRhLCBudW0sIGFscGhhaWQsIGkpIHtcbiAgICB2YXIgYW5pbWF0ZUNvbmZpZyA9IHt9O1xuICAgIGFuaW1hdGVDb25maWcuYmVnQ29vckRhdGEgPSBiZWdDb29yRGF0YTtcbiAgICBhbmltYXRlQ29uZmlnLmVuZENvb3JEYXRhID0gZW5kQ29vckRhdGE7XG4gICAgYW5pbWF0ZUNvbmZpZy5udW0gPSBudW07XG4gICAgYW5pbWF0ZUNvbmZpZy5hbHBoYWlkID0gYWxwaGFpZDtcbiAgICBhbmltYXRlQ29uZmlnLmRlbGF5ID0gaTtcbiAgICByZXR1cm4gYW5pbWF0ZUNvbmZpZztcbn1cblxuZnVuY3Rpb24gYW5pbWF0aW9uVGVtcGxhdGUoYW5pbWF0ZUNvbmZpZykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBzdGFydFRvcE9mZiA9IGFuaW1hdGVDb25maWcuYmVnQ29vckRhdGEudG9wICsgNSxcbiAgICAgICAgc3RhcnRSaWdodE9mZiA9IGFuaW1hdGVDb25maWcuYmVnQ29vckRhdGEucmlnaHQgLSAzMCxcbiAgICAgICAgZW5kVG9wT2ZmID0gYW5pbWF0ZUNvbmZpZy5lbmRDb29yRGF0YS50b3AsXG4gICAgICAgIGVuZFJpZ2h0T2ZmID0gYW5pbWF0ZUNvbmZpZy5lbmRDb29yRGF0YS5yaWdodCxcbiAgICAgICAgaGlnaHdheVBhdGggPSAyNDYsXG4gICAgICAgIG51bUNvbnRhaW5lciA9IHdhbmQucXVlckFwbmRyKFwiI251bUNvbnRhaW5lclwiKTtcbiAgICBhbmltYXRlQ29uZmlnLm51bS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICBhbmltYXRlQ29uZmlnLm51bS5zdHlsZS50b3AgPSBgJHtzdGFydFRvcE9mZn1weGA7XG4gICAgYW5pbWF0ZUNvbmZpZy5udW0uc3R5bGUubGVmdCA9IGAke3N0YXJ0UmlnaHRPZmZ9cHhgO1xuICAgIHdhbmQuYXBuZHIobnVtQ29udGFpbmVyLCBhbmltYXRlQ29uZmlnLm51bSk7XG4gICAgbGFzdFNoZWV0Lmluc2VydFJ1bGUoYEBrZXlmcmFtZXMgdG9GdW5jTWFjaGluZSR7YW5pbWF0ZUNvbmZpZy5hbHBoYWlkfSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMCUge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICR7c3RhcnRUb3BPZmZ9cHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICR7c3RhcnRSaWdodE9mZn1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMTAlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgMzMlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAke3N0YXJ0VG9wT2ZmfXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAke2hpZ2h3YXlQYXRofXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA2NiUge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICR7ZW5kVG9wT2ZmfXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAke2hpZ2h3YXlQYXRofXB4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA5MCUge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAxMDAlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAke2VuZFRvcE9mZn1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogJHtlbmRSaWdodE9mZn1weDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9YCwgbGFzdFNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XG4gICAgYW5pbWF0ZUNvbmZpZy5udW0uc3R5bGUuYW5pbWF0aW9uID0gYHRvRnVuY01hY2hpbmUke2FuaW1hdGVDb25maWcuYWxwaGFpZH0gM3MgZWFzZS1pbi1vdXQgJHthbmltYXRlQ29uZmlnLmRlbGF5KjEwfXNgO1xuICAgIGFuaW1hdGVDb25maWcubnVtLnN0eWxlLm9wYWNpdHkgPSAnMCc7XG4gICAgYW5pbWF0ZUNvbmZpZy5udW0uc3R5bGUuekluZGV4ID0gJzEwMCc7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVzb2x2ZShhbmltYXRlQ29uZmlnLm51bSk7XG4gICAgICAgIH0sIGFuaW1hdGVDb25maWcuZGVsYXkgKiAzMDAwKTtcbiAgICB9KTtcbn1cblxuLyoqKioqKioqKioqKkFOSU1BVElPTiBGVU5DVElPTlMqKioqKioqKioqKioqKioqKioqKioqL1xuZnVuY3Rpb24gYW5pbWF0ZVRvU3RhdHVzQmFyKCkge1xuICAgIGNvbnNvbGUubG9nKFwiQW5pbWF0ZSB0byBzdGF0dXMgYmFyIGFuZCBwYXNzIHRoZSBpbmZvcm1hdGlvbiB0byB0aGUgZ3JhcGggZnVuY3Rpb25cIik7XG5cbiAgICAvL1Nob3cgZ3JhcGggY2hlY2tib3hcbiAgICAvL0FuaW1hdGlvbiBjaGVja2JveFxuICAgIC8vRXF1YXRpb25cbiAgICAvL1dpbmRvdyBsaW1pdHNcbiAgICAvL1ggYW5kIFkgdmFsdWVcblxuICAgIC8vZ3JhcGhJdCgpO1xufVxuXG5mdW5jdGlvbiBlcXVBcHBlYXIoY2hhbmdlRXF1KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXF1UGFyYS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgZXF1UGFyYS5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgIGthdGV4LnJlbmRlcihgeSA9ICR7Y2hhbmdlRXF1fWAsIGVxdVBhcmEpO1xuICAgICAgICAgICAgZXF1UGFyYS5zdHlsZS5hbmltYXRpb24gPSAndGV4dEFwcGVhciAxcyBlYXNlLWluLW91dCc7XG4gICAgICAgICAgICBlcXVQYXJhLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICAgICAgcmVzb2x2ZShjaGFuZ2VFcXUpO1xuICAgICAgICB9LCAxNTAwKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZXF1QW5pbWVEaXNhcHBlYXIobnVtKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgIHZhciBjaGFuZ2VFcXU7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBudW0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGNoYW5nZUVxdSA9IGdsb2JhbEVxdS5yZXBsYWNlKFwieFwiLCBgKiR7bnVtLmlubmVyVGV4dH1gKTtcblxuICAgICAgICAgICAgc3RhdHVzQmFyLmlubmVyVGV4dCA9IFwiXCI7XG4gICAgICAgICAgICBzdGF0dXNCYXIuaW5uZXJUZXh0ID0gXCI+PiBDYWxjdWxhdGluZ1wiO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlcXVQYXJhLnN0eWxlLmFuaW1hdGlvbiA9ICd0ZXh0RGlzYXBwZWFyIDEuNXMgZWFzZS1pbi1vdXQnO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoY2hhbmdlRXF1KTtcbiAgICAgICAgICAgIH0sIDE1MDApO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBudW0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIGNoYW5nZUVxdSA9IG1hdGguZXZhbChudW0pO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlcXVQYXJhLnN0eWxlLmFuaW1hdGlvbiA9ICd0ZXh0RGlzYXBwZWFyIDEuNXMgZWFzZS1pbi1vdXQnO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoY2hhbmdlRXF1KTtcbiAgICAgICAgICAgIH0sIDE1MDApO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUFucyhhbnMpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgbnVtQ29udGFpbmVyID0gd2FuZC5xdWVyQXBuZHIoXCIjbnVtQ29udGFpbmVyXCIpLFxuICAgICAgICBudW0gPSB3YW5kLmNydEVsbShcInBcIiwgYW5zLnRvU3RyaW5nKCkpO1xuICAgIG51bUNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGZ1bmNNYWNoQ29vciA9IHtcbiAgICAgICAgICAgICAgICAgICAgdG9wOiA1NSxcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDMwMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYW5pbWF0ZUNvbmZpZyA9IGFuaUNvbmZpZyhmdW5jTWFjaENvb3IsIHN0YXJ0aW5nRGF0YVswXSwgbnVtLCAnenonLCAwKTtcblxuICAgICAgICAgICAgc3RhcnRpbmdEYXRhLnBvcCgpO1xuICAgICAgICAgICAgcmVzb2x2ZShhbmltYXRlQ29uZmlnKTtcbiAgICAgICAgfSwgMTUwMCk7XG4gICAgfSk7XG59XG5cbi8vSGFuZGxlIGFsbCBDU1MgYW5pbWF0aW9uc1xuZnVuY3Rpb24gYW5pbWF0b3JDb250cm9sKGF3KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG51bUNvbnRhaW5lciA9IHdhbmQucXVlckFwbmRyKFwiI251bUNvbnRhaW5lclwiKTtcbiAgICBudW1Db250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG51bSA9IHdhbmQuY3J0RWxtKFwicFwiLCBhd1tpXS5udW0pLFxuICAgICAgICAgICAgZnVuY01hY2hDb29yID0ge1xuICAgICAgICAgICAgICAgIHRvcDogNTUsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IDMwMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGVDb25maWcgPSBhbmlDb25maWcoYXdbaV0uY29vckRhdGEsIGZ1bmNNYWNoQ29vciwgbnVtLCBhbHBoYWlkW2ldLCBpKTtcblxuICAgICAgICBzdGFydGluZ0RhdGEucHVzaChhd1tpXS5jb29yRGF0YSk7XG5cbiAgICAgICAgYW5pbWF0aW9uVGVtcGxhdGUoYW5pbWF0ZUNvbmZpZylcbiAgICAgICAgICAgIC50aGVuKGVxdUFuaW1lRGlzYXBwZWFyKVxuICAgICAgICAgICAgLnRoZW4oZXF1QXBwZWFyKVxuICAgICAgICAgICAgLnRoZW4oZXF1QW5pbWVEaXNhcHBlYXIpXG4gICAgICAgICAgICAudGhlbihlcXVBcHBlYXIpXG4gICAgICAgICAgICAudGhlbihjcmVhdGVBbnMpXG4gICAgICAgICAgICAudGhlbihhbmltYXRpb25UZW1wbGF0ZSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coc3RhcnRpbmdEYXRhKTtcbiAgICB9XG59IiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8vcmVnaXN0ZXIgYWxsIGlucHV0cyBvbiB0aGUgYXBwbGljYXRpb25cbiAgICB2YXIgaW5wdXRPcHQgPSBbXCJpbnB1dDFcIiwgXCJpbnB1dDJcIiwgXCJpbnB1dDNcIiwgXCJpbnB1dDRcIiwgXCJpbnB1dDVcIiwgXCJpbnB1dDZcIiwgXCJpbnB1dDdcIiwgXCJpbnB1dDhcIiwgXCJpbnB1dDlcIiwgXCJpbnB1dDEwXCIsIFwiaW5wdXQxMVwiLCBcImlucHV0MTJcIiwgXCJpbnB1dDEzXCIsIFwiaW5wdXQxNFwiLCBcImlucHV0MTVcIiwgXCJpbnB1dDE2XCIsIFwiaW5wdXQxN1wiLCBcImlucHV0MThcIiwgXCJpbnB1dDE5XCJdLFxuICAgICAgICBhbmltYXRlV2FpdCA9IFtdO1xuXG4gICAgLyoqKipET0NVTUVOVCBPTkNIQU5HRSBFVkVOVCBIQU5ETEVSKioqKi9cbiAgICBkb2N1bWVudC5vbmNoYW5nZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldC5sb2NhbE5hbWUgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgICAgICAgIC8vY2hhbmdlUGxvdCBmdW5jdGlvbiBpbiBhamF4LmpzXG4gICAgICAgICAgICBjaGFuZ2VQbG90KGUudGFyZ2V0LnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKioqKipET0NVTUVOVCBDTElDSyBIQU5ETEVSKioqKiovXG4gICAgZG9jdW1lbnQub25jbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSA9PT0gXCJHbyFcIikge1xuICAgICAgICAgICAgYW5pbWF0ZVdhaXQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXRPcHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSB3YW5kLnF1ZXJBcG5kcihgW25hbWU9JyR7aW5wdXRPcHRbaV19J11gKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5wdXQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuaURhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgYW5pRGF0YS5jb29yRGF0YSA9IGlucHV0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgICAgICBhbmlEYXRhLm51bSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBhbmltYXRlV2FpdC5wdXNoKGFuaURhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vZ3JhcGhDb25maWcgbG9jYXRlZCBpbiBBSkFYLmpzXG4gICAgICAgICAgICAgICAgICAgIGdyYXBoQ29uZmlnLmFuaURhdGEgPSBhbmlEYXRhXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYW5pbWF0b3JDb250cm9sKGFuaW1hdGVXYWl0KTtcbiAgICAgICAgfVxuICAgIH07XG59KCkpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8qKioqVEFCTEUgTUFLRVIqKioqL1xuICAgIHZhciB0Ym9keSA9IHdhbmQucXVlckFwbmRyKFwidGJvZHlcIiksXG4gICAgICAgIHRkMSxcbiAgICAgICAgdGQyLFxuICAgICAgICB0cixcbiAgICAgICAgaW5wdXQsXG4gICAgICAgIHJvd0NvdW50ID0gMTk7XG5cbiAgICBmb3IgKHZhciBqID0gMTsgaiA8PSByb3dDb3VudDsgaisrKSB7XG4gICAgICAgIGlucHV0ID0gd2FuZC5jcnRFbG0oXCJpbnB1dFwiKTtcbiAgICAgICAgdGQxID0gd2FuZC5jcnRFbG0oXCJ0ZFwiKTtcbiAgICAgICAgdGQyID0gd2FuZC5jcnRFbG0oXCJ0ZFwiKTtcbiAgICAgICAgdHIgPSB3YW5kLmNydEVsbShcInRyXCIpO1xuXG4gICAgICAgIGlucHV0Lm5hbWUgPSBgaW5wdXQke2p9YDtcbiAgICAgICAgaW5wdXQudHlwZSA9ICdudW1iZXInO1xuXG4gICAgICAgIHdhbmQuYXBuZHIodGQxLCBpbnB1dCk7XG4gICAgICAgIHdhbmQuYXBuZHIodHIsIFt0ZDEsIHRkMl0pO1xuICAgICAgICB3YW5kLmFwbmRyKHRib2R5LCB0cik7XG4gICAgfVxufSgpKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
