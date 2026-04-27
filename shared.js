/* CPA Validated - shared.js
   Edit here -> Cloudflare Pages live in ~60s.
*/
(function(){

/* ── CSS ──────────────────────────────────────────────────────────── */
var s=document.createElement('style');
s.textContent='html{overflow-y:scroll;scrollbar-gutter:stable}nav a,nav a:hover,nav a:visited,nav a:active{text-decoration:none!important}';
document.head.appendChild(s);

/* ── NAV (update in place) ────────────────────────────────────────── */
var LINKS=
  '<a href="/index.html" onmouseover="this.style.textDecoration=\'none\'" onmouseout="this.style.textDecoration=\'none\'" style="display:flex;align-items:center;text-decoration:none;color:#111111;cursor:pointer">'
  +'<div style="font-family:Oswald,Arial Narrow,sans-serif;font-weight:500;font-size:17px;letter-spacing:.05em;text-transform:uppercase;line-height:1.1">CPA Validated'
  +'<small style="display:block;font-family:Inter,-apple-system,sans-serif;font-weight:400;font-size:10px;color:#F65F5A;letter-spacing:.1em;margin-top:3px;text-transform:none">a tk.cpa resource</small>'
  +'</div></a>'
  +'<div style="display:flex;align-items:center;gap:20px">'
  +'<a href="/about.html" onmouseover="this.style.textDecoration=\'none\'" onmouseout="this.style.textDecoration=\'none\'" style="font-family:Inter,-apple-system,sans-serif;font-size:13px;font-weight:500;color:#5E6166;text-decoration:none;white-space:nowrap">Mission</a>'
  +'<a href="https://tk.cpa" target="_blank" rel="noopener" onmouseover="this.style.textDecoration=\'none\'" onmouseout="this.style.textDecoration=\'none\'" style="display:inline-block;background:#F65F5A;color:#fff;padding:9px 20px;font-weight:600;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0">tk.cpa</a>'
  +'</div>';

var nav=document.querySelector('nav');
if(nav){
  nav.innerHTML=LINKS;
  nav.style.cssText='display:flex!important;align-items:center!important;justify-content:space-between!important;padding:14px 28px!important;border-bottom:1px solid #D9DBDE!important;background:#FAFAF7!important;position:sticky!important;top:0!important;z-index:100!important';
}

/* ── BUTTON STYLE UPGRADE (style only, HTML order is now correct) ── */
function styleButtons(){
  if(document.getElementById('cpa-btns-done'))return;
  var btns=document.querySelectorAll('button');
  var print_=null,share_=null;
  for(var i=0;i<btns.length;i++){
    var oc=btns[i].getAttribute('onclick')||'';
    if(!print_&&(oc.indexOf('print')>-1||oc.indexOf('Print')>-1))print_=btns[i];
    if(!share_&&(oc.indexOf('share')>-1||oc.indexOf('Share')>-1))share_=btns[i];
  }
  if(share_){
    share_.style.cssText='background:#F65F5A;color:#fff;border:none;padding:12px 28px;font-family:Inter,-apple-system,sans-serif;font-size:13px;font-weight:600;cursor:pointer;letter-spacing:.04em';
    share_.textContent='Share This Page';
  }
  if(print_){
    print_.style.cssText='background:transparent;color:#5E6166;border:1px solid #D9DBDE;padding:11px 22px;font-family:Inter,-apple-system,sans-serif;font-size:13px;font-weight:500;cursor:pointer;letter-spacing:.03em;margin-left:8px';
    print_.textContent='Print / PDF';
  }
  // Mark done
  var done=document.createElement('span');
  done.id='cpa-btns-done';
  done.style.display='none';
  document.body.appendChild(done);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',styleButtons);
}else{
  styleButtons();
}

})();
