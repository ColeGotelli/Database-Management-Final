/**
 * StyleFix 1.0.3 & PrefixFree 1.0.7
 * @author Lea Verou
 * MIT license
 */
(function(){function j(a,c){return[].slice.call((c||document).querySelectorAll(a))}if(window.addEventListener){var g=window.StyleFix={link:function(a){try{if("stylesheet"!==a.rel||a.hasAttribute("data-noprefix"))return}catch(c){return}var i=a.href||a.getAttribute("data-href"),f=i.replace(/[^\/]+$/,""),j=(/^[a-z]{3,10}:/.exec(f)||[""])[0],k=(/^[a-z]{3,10}:\/\/[^\/]+/.exec(f)||[""])[0],h=/^([^?]*)\??/.exec(i)[1],n=a.parentNode,e=new XMLHttpRequest,b;e.onreadystatechange=function(){4===e.readyState&&
b()};b=function(){var c=e.responseText;if(c&&a.parentNode&&(!e.status||400>e.status||600<e.status)){c=g.fix(c,!0,a);if(f)var c=c.replace(/url\(\s*?((?:"|')?)(.+?)\1\s*?\)/gi,function(a,c,b){return/^([a-z]{3,10}:|#)/i.test(b)?a:/^\/\//.test(b)?'url("'+j+b+'")':/^\//.test(b)?'url("'+k+b+'")':/^\?/.test(b)?'url("'+h+b+'")':'url("'+f+b+'")'}),b=f.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,"\\$1"),c=c.replace(RegExp("\\b(behavior:\\s*?url\\('?\"?)"+b,"gi"),"$1");b=document.createElement("style");b.textContent=
c;b.media=a.media;b.disabled=a.disabled;b.setAttribute("data-href",a.getAttribute("href"));n.insertBefore(b,a);n.removeChild(a);b.media=a.media}};try{e.open("GET",i),e.send(null)}catch(r){"undefined"!=typeof XDomainRequest&&(e=new XDomainRequest,e.onerror=e.onprogress=function(){},e.onload=b,e.open("GET",i),e.send(null))}a.setAttribute("data-inprogress","")},styleElement:function(a){if(!a.hasAttribute("data-noprefix")){var c=a.disabled;a.textContent=g.fix(a.textContent,!0,a);a.disabled=c}},styleAttribute:function(a){var c=
a.getAttribute("style"),c=g.fix(c,!1,a);a.setAttribute("style",c)},process:function(){j('link[rel="stylesheet"]:not([data-inprogress])').forEach(StyleFix.link);j("style").forEach(StyleFix.styleElement);j("[style]").forEach(StyleFix.styleAttribute)},register:function(a,c){(g.fixers=g.fixers||[]).splice(void 0===c?g.fixers.length:c,0,a)},fix:function(a,c,i){for(var f=0;f<g.fixers.length;f++)a=g.fixers[f](a,c,i)||a;return a},camelCase:function(a){return a.replace(/-([a-z])/g,function(a,g){return g.toUpperCase()}).replace("-",
"")},deCamelCase:function(a){return a.replace(/[A-Z]/g,function(a){return"-"+a.toLowerCase()})}};setTimeout(function(){j('link[rel="stylesheet"]').forEach(StyleFix.link)},10);document.addEventListener("DOMContentLoaded",StyleFix.process,!1)}})();
(function(j){function g(d,b,c,e,f){d=a[d];d.length&&(d=RegExp(b+"("+d.join("|")+")"+c,"gi"),f=f.replace(d,e));return f}if(window.StyleFix&&window.getComputedStyle){var a=window.PrefixFree={prefixCSS:function(d,b){var c=a.prefix;-1<a.functions.indexOf("linear-gradient")&&(d=d.replace(/(\s|:|,)(repeating-)?linear-gradient\(\s*(-?\d*\.?\d*)deg/ig,function(a,d,b,c){return d+(b||"")+"linear-gradient("+(90-c)+"deg"}));d=g("functions","(\\s|:|,)","\\s*\\(","$1"+c+"$2(",d);d=g("keywords","(\\s|:)","(\\s|;|\\}|$)",
"$1"+c+"$2$3",d);d=g("properties","(^|\\{|\\s|;)","\\s*:","$1"+c+"$2:",d);if(a.properties.length)var e=RegExp("\\b("+a.properties.join("|")+")(?!:)","gi"),d=g("valueProperties","\\b",":(.+?);",function(a){return a.replace(e,c+"$1")},d);b&&(d=g("selectors","","\\b",a.prefixSelector,d),d=g("atrules","@","\\b","@"+c+"$1",d));d=d.replace(RegExp("-"+c,"g"),"-");return d=d.replace(/-\*-(?=[a-z]+)/gi,a.prefix)},property:function(d){return(a.properties.indexOf(d)?a.prefix:"")+d},value:function(d){d=g("functions",
"(^|\\s|,)","\\s*\\(","$1"+a.prefix+"$2(",d);return d=g("keywords","(^|\\s)","(\\s|$)","$1"+a.prefix+"$2$3",d)},prefixSelector:function(d){return d.replace(/^:{1,2}/,function(d){return d+a.prefix})},prefixProperty:function(d,b){var c=a.prefix+d;return b?StyleFix.camelCase(c):c}},c={},i=[],f=getComputedStyle(document.documentElement,null),p=document.createElement("div").style,k=function(a){if("-"===a.charAt(0)){i.push(a);var a=a.split("-"),b=a[1];for(c[b]=++c[b]||1;3<a.length;)a.pop(),b=a.join("-"),
StyleFix.camelCase(b)in p&&-1===i.indexOf(b)&&i.push(b)}};if(0<f.length)for(var h=0;h<f.length;h++)k(f[h]);else for(var n in f)k(StyleFix.deCamelCase(n));var h=0,e,b;for(b in c)f=c[b],h<f&&(e=b,h=f);a.prefix="-"+e+"-";a.Prefix=StyleFix.camelCase(a.prefix);a.properties=[];for(h=0;h<i.length;h++)n=i[h],0===n.indexOf(a.prefix)&&(e=n.slice(a.prefix.length),StyleFix.camelCase(e)in p||a.properties.push(e));"Ms"==a.Prefix&&(!("transform"in p)&&!("MsTransform"in p)&&"msTransform"in p)&&a.properties.push("transform",
"transform-origin");a.properties.sort();e=function(a,b){r[b]="";r[b]=a;return!!r[b]};b={"linear-gradient":{property:"backgroundImage",params:"red, teal"},calc:{property:"width",params:"1px + 5%"},element:{property:"backgroundImage",params:"#foo"},"cross-fade":{property:"backgroundImage",params:"url(a.png), url(b.png), 50%"}};b["repeating-linear-gradient"]=b["repeating-radial-gradient"]=b["radial-gradient"]=b["linear-gradient"];h={initial:"color","zoom-in":"cursor","zoom-out":"cursor",box:"display",
flexbox:"display","inline-flexbox":"display",flex:"display","inline-flex":"display"};a.functions=[];a.keywords=[];var r=document.createElement("div").style,l;for(l in b)k=b[l],f=k.property,k=l+"("+k.params+")",!e(k,f)&&e(a.prefix+k,f)&&a.functions.push(l);for(var m in h)f=h[m],!e(m,f)&&e(a.prefix+m,f)&&a.keywords.push(m);l=function(a){s.textContent=a+"{}";return!!s.sheet.cssRules.length};m={":read-only":null,":read-write":null,":any-link":null,"::selection":null};e={keyframes:"name",viewport:null,
document:'regexp(".")'};a.selectors=[];a.atrules=[];var s=j.appendChild(document.createElement("style")),q;for(q in m)b=q+(m[q]?"("+m[q]+")":""),!l(b)&&l(a.prefixSelector(b))&&a.selectors.push(q);for(var t in e)b=t+" "+(e[t]||""),!l("@"+b)&&l("@"+a.prefix+b)&&a.atrules.push(t);j.removeChild(s);a.valueProperties=["transition","transition-property"];j.className+=" "+a.prefix;StyleFix.register(a.prefixCSS)}})(document.documentElement);

var x, i, j, selElmnt, a, b, c;
/* Look for any elements with the class "custom-select": */
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < selElmnt.length; j++) {
    /* For each option in the original select element,
    create a new DIV that will act as an option item: */
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
    /* When the select box is clicked, close any other select boxes,
    and open/close the current select box: */
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

/* If the user clicks anywhere outside the select box,
then close all select boxes: */
document.addEventListener("click", closeAllSelect);
