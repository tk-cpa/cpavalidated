/* CPA Validated - Shared Components
   Update this file to instantly update nav and footer across all pages.
   Deployed via Cloudflare Pages - changes live in ~60 seconds after push.
*/

(function() {

  // ── NAVIGATION ──────────────────────────────────────────────────────────
  var NAV_HTML = '<nav style="display:flex!important;align-items:center!important;justify-content:space-between!important;padding:14px 28px!important;border-bottom:1px solid #D9DBDE!important;background:#FAFAF7!important;position:sticky!important;top:0!important;z-index:100!important">'
    + '<a href="/index.html" style="display:flex;align-items:center;text-decoration:none;color:#111111">'
    + '<div style="font-family:Oswald,Arial Narrow,sans-serif;font-weight:500;font-size:17px;letter-spacing:.05em;text-transform:uppercase;line-height:1.1">'
    + 'CPA Validated'
    + '<small style="display:block;font-family:Inter,-apple-system,sans-serif;font-weight:400;font-size:10px;color:#F65F5A;letter-spacing:.1em;margin-top:3px;text-transform:none">a tk.cpa resource</small>'
    + '</div></a>'
    + '<div style="display:flex;align-items:center;gap:20px">'
    + '<a href="/about.html" style="font-family:Inter,-apple-system,sans-serif;font-size:13px;font-weight:500;color:#5E6166;text-decoration:none;white-space:nowrap">About</a>'
    + '<a href="/validators.html" style="font-family:Inter,-apple-system,sans-serif;font-size:13px;font-weight:500;color:#5E6166;text-decoration:none;white-space:nowrap">Validators</a>'
    + '<a href="https://tk.cpa" target="_blank" rel="noopener" style="display:inline-block;background:#F65F5A;color:#fff;padding:9px 20px;font-weight:600;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0">tk.cpa</a>'
    + '</div></nav>';

  // ── FOOTER ───────────────────────────────────────────────────────────────
  var FOOTER_HTML = '<div style="background:#111111;border-top:2px solid #F65F5A;margin-top:60px;padding:16px 0">'
    + '<div style="max-width:800px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between">'
    + '<span style="font-family:Courier New,monospace;font-size:11px;color:rgba(255,255,255,.38);letter-spacing:.08em">tk.cpa AI Lab &nbsp;&bull;&nbsp; a tk.cpa resource</span>'
    + '<div style="display:flex;align-items:center;gap:16px">'
    + '<a href="/validators.html" style="font-family:Inter,-apple-system,sans-serif;font-size:11px;font-weight:500;color:rgba(255,255,255,.35);text-decoration:none;letter-spacing:.04em">Validators</a>'
    + '<a href="https://tk.cpa" target="_blank" rel="noopener" style="font-family:Inter,-apple-system,sans-serif;font-size:12px;font-weight:600;color:#F65F5A;text-decoration:none;letter-spacing:.03em">tk.cpa</a>'
    + '</div></div></div>';

  // ── INJECT ───────────────────────────────────────────────────────────────
  // Replace existing nav if present; otherwise prepend to body
  var existingNav = document.querySelector('nav');
  if (existingNav) {
    existingNav.outerHTML = NAV_HTML;
  }

  // Replace existing footer div if present; otherwise append to body
  // Footer is identified by containing 'tk.cpa AI Lab' text
  var allDivs = document.querySelectorAll('body > div');
  var footerReplaced = false;
  for (var i = allDivs.length - 1; i >= 0; i--) {
    if (allDivs[i].innerHTML && allDivs[i].innerHTML.indexOf('tk.cpa AI Lab') > -1) {
      allDivs[i].outerHTML = FOOTER_HTML;
      footerReplaced = true;
      break;
    }
  }
  if (!footerReplaced) {
    document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
  }

})();
