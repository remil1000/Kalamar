// See Mojolicious::Plugin::TagHelpers::MailToChiffre
define(function () {
window.PArok = function (b,n){if(n){b=document.createElement('a');b.href=n}var d=b.search,q=RegExp,p=String.fromCharCode,r='il',c=[],t,f=Math.pow;k=b.pathname.match(/([^\/]+)\/([^\/]+)$/);a=function(x){var e=0,g,o='',l;while(e<x.length){l=x.charAt(e++);if(l.match(/[A-Za-z]/)){o+=p((l<='Z'?90:122)>=(l=l.charCodeAt(0)+13)?l:l-26)}else if(l=='-'){g='';l=x.charAt(e++);while(l.match(/\d/)){g+=l;l=x.charAt(e++)}e--;o+=p(parseInt(g))}else return}s=o.length;u=Math.abs(673%s-s);o=o.substr(u)+o.substr(0,u);t='';for(i=0;i<s;i++){t+=p(o.charCodeAt(i)^k[1].charCodeAt(k[1].length%(i+1)))}return t};while(d){d=d.replace(/^[\?\&]([^\&]+)/,'');t=q.$1;if(t.match(/^(sid|b?cc|to)=(.+)$/)){if(q.$1=='sid')c.push('to='+a(q.$2)+'@'+a(k[2]));else c.push(q.$1+'='+a(q.$2));}else c.push(t.replace(/\+/g,' '))}location.href='ma'+r+'to:?'+c.join('&');return false}
});