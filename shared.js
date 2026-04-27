/* CPA Validated - Shared Navigation
   Edit this single file to update the nav across all pages.
   Cloudflare Pages: changes deploy in ~60 seconds.
*/
(function() {
  var NAV_HTML = '<nav style="display:flex!important;align-items:center!important;justify-content:space-between!important;padding:14px 28px!important;border-bottom:1px solid #D9DBDE!important;background:#FAFAF7!important;position:sticky!important;top:0!important;z-index:100!important">'
    + '<a href="/index.html" style="display:flex;align-items:center;text-decoration:none;color:#111111">'
    + '<div style="font-family:Oswald,Arial Narrow,sans-serif;font-weight:500;font-size:17px;letter-spacing:.05em;text-transform:uppercase;line-height:1.1">'
    + 'CPA Validated'
    + '<small style="display:block;font-family:Inter,-apple-system,sans-serif;font-weight:400;font-size:10px;color:#F65F5A;letter-spacing:.1em;margin-top:3px;text-transform:none">a tk.cpa resource</small>'
    + '</div></a>'
    + '<div style="display:flex;align-items:center;gap:20px">'
    + '<a href="/about.html" style="font-family:Inter,-apple-system,sans-serif;font-size:13px;font-weight:500;color:#5E6166;text-decoration:none;white-space:nowrap">Mission</a>'
    + '<a href="https://tk.cpa" target="_blank" rel="noopener" style="display:inline-block;background:#F65F5A;color:#fff;padding:9px 20px;font-weight:600;font-size:13px;text-decoration:none;white-space:nowrap;flex-shrink:0">tk.cpa</a>'
    + '</div></nav>';

  var existingNav = document.querySelector('nav');
  if (existingNav) {
    existingNav.outerHTML = NAV_HTML;
  }
})();
