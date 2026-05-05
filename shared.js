/* CPA Validated - shared.js
   Edit here -> Cloudflare Pages live in ~60s.
*/
(function(){

/* ── CSS ──────────────────────────────────────────────────────────── */
/* Inject nav-link decoration override AND nav height lock.
   The scrollbar-gutter rule is in static <style id="cpav-scrollbar-fix">
   on every page, so it is not duplicated here.
   
   The nav height lock forces a deterministic 64px (desktop) / 56px (mobile)
   height on every page. Without this, subtle differences between pages in CSS
   cascade duplication or content-driven box sizing produced visible nav
   height shifts when navigating between pages. The height is set on nav itself
   plus inner align-items:center to vertically center the brand block. */
var s=document.createElement('style');
s.textContent='nav a,nav a:hover,nav a:visited,nav a:active{text-decoration:none!important}'+
/* Lock main nav to deterministic height so it does not shift between pages */
'nav{box-sizing:border-box!important;height:64px!important;min-height:64px!important;max-height:64px!important;align-items:center!important}'+
'@media(max-width:480px){nav{height:56px!important;min-height:56px!important;max-height:56px!important;padding:0 16px!important}}'+
/* Lock cat-nav vertical centering and height. Some subpages had .cat-nav-inner
   without align-items:center, which let links stretch and made the cat-nav
   visibly taller than on index. Force consistency. */
'.cat-nav-inner{align-items:center!important;min-height:40px!important}'+
'.cat-nav{box-sizing:border-box!important}';
document.head.appendChild(s);

/* ── NAV (update in place) ────────────────────────────────────────── */
var LINKS=
  '<a href="/index.html" onmouseover="this.style.textDecoration=\'none\'" onmouseout="this.style.textDecoration=\'none\'" style="display:flex;align-items:center;text-decoration:none;color:#111111;cursor:pointer">'
  +'<div style="font-family:Oswald,Arial Narrow,sans-serif;font-weight:500;font-size:17px;letter-spacing:.05em;text-transform:uppercase;line-height:1.1">CPA Validated'
  +'<small style="display:block;font-family:Inter,-apple-system,sans-serif;font-weight:400;font-size:10px;color:#F65F5A;letter-spacing:.1em;margin-top:3px;text-transform:none">a tk.cpa resource</small>'
  +'</div></a>'
  +'<div style="display:flex;align-items:center;gap:20px">'
  +'<a href="/search.html" onmouseover="this.style.textDecoration=\'none\'" onmouseout="this.style.textDecoration=\'none\'" aria-label="Search" style="display:flex;align-items:center;color:#5E6166;text-decoration:none;padding:4px" title="Search"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></a>'
  +'<a href="/about.html" onmouseover="this.style.textDecoration=\'none\'" onmouseout="this.style.textDecoration=\'none\'" style="font-family:Inter,-apple-system,sans-serif;font-size:13px;font-weight:500;color:#5E6166;text-decoration:none;white-space:nowrap">Mission</a>'
  +'<a href="https://tk.cpa" target="_blank" rel="noopener" onmouseover="this.style.textDecoration=\'none\'" onmouseout="this.style.textDecoration=\'none\'" style="display:inline-block;background:#F65F5A;color:#fff;padding:9px 20px;font-weight:600;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0">tk.cpa</a>'
  +'</div>';

var nav=document.querySelector('nav');
if(nav){
  /* Idempotency: if static nav already has the search icon, it is the canonical
     post-2026.05 structure. Do nothing - the static CSS already styles it correctly,
     and re-applying inline styles via JS causes a subpixel reflow that produces a
     visible width shift on some Safari versions when comparing pages of different
     lengths. */
  var hasSearch=nav.querySelector('a[aria-label="Search"]');
  if(!hasSearch){
    nav.innerHTML=LINKS;
    nav.style.cssText='display:flex!important;align-items:center!important;justify-content:space-between!important;padding:14px 28px!important;border-bottom:1px solid #D9DBDE!important;background:#FAFAF7!important;position:sticky!important;top:0!important;z-index:100!important';
  }
}

/* ── BUTTON STYLE UPGRADE (style only, HTML order is now correct) ── */
function styleButtons(){
  if(document.getElementById('cpa-btns-done'))return;
  var btns=document.querySelectorAll('button');
  var print_=null,share_=null;
  for(var i=0;i<btns.length;i++){
    var oc=btns[i].getAttribute('onclick')||'';
    var isInFooter=btns[i].closest('[style*="border-top:2px solid"]');
    if(isInFooter)continue;
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

/* ── BUTTON FUNCTIONS ───────────────────────────────────────────── */
function doPrint(){
  window.print();
}

function doShare(){
  if(navigator.share){
    navigator.share({
      title:document.title,
      text:'Check this out',
      url:window.location.href
    }).catch(e=>console.log('Share failed',e));
  }else{
    var url=window.location.href;
    if(navigator.clipboard){
      navigator.clipboard.writeText(url).then(()=>{
        alert('Link copied to clipboard');
      }).catch(e=>console.log('Copy failed',e));
    }else{
      alert(url);
    }
  }
}
