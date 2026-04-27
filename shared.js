/* CPA Validated - shared.js
   Safe nav update: updates innerHTML of existing nav in place.
   No DOM reordering. No insertion issues.
   Edit here -> Cloudflare Pages deploys in ~60 seconds.
*/
(function() {

  // ── 1. GLOBAL CSS ──────────────────────────────────────────────────────────
  var styleEl = document.createElement('style');
  styleEl.textContent = 'nav a:hover{text-decoration:none!important}nav a{text-decoration:none!important}html{overflow-y:scroll;scrollbar-gutter:stable}';
  document.head.appendChild(styleEl);

  // ── 2. NAV - update inner content only, never move the element ─────────────
  // This avoids any DOM reordering or double-nav issues.
  var NAV_INNER =
    '<a href="/index.html" style="display:flex;align-items:center;text-decoration:none!important;color:#111111">'
    + '<div style="font-family:Oswald,Arial Narrow,sans-serif;font-weight:500;font-size:17px;letter-spacing:.05em;text-transform:uppercase;line-height:1.1">'
    + 'CPA Validated'
    + '<small style="display:block;font-family:Inter,-apple-system,sans-serif;font-weight:400;font-size:10px;color:#F65F5A;letter-spacing:.1em;margin-top:3px;text-transform:none">a tk.cpa resource</small>'
    + '</div></a>'
    + '<div style="display:flex;align-items:center;gap:20px">'
    + '<a href="/about.html" style="font-family:Inter,-apple-system,sans-serif;font-size:13px;font-weight:500;color:#5E6166;text-decoration:none!important;white-space:nowrap">Mission</a>'
    + '<a href="https://tk.cpa" target="_blank" rel="noopener" style="display:inline-block;background:#F65F5A;color:#fff;padding:9px 20px;font-weight:600;font-size:13px;text-decoration:none!important;white-space:nowrap;flex-shrink:0">tk.cpa</a>'
    + '</div>';

  var existingNav = document.querySelector('nav');
  if (existingNav) {
    existingNav.innerHTML = NAV_INNER;
    // Ensure nav has the right sticky styles
    existingNav.style.cssText = [
      'display:flex!important',
      'align-items:center!important',
      'justify-content:space-between!important',
      'padding:14px 28px!important',
      'border-bottom:1px solid #D9DBDE!important',
      'background:#FAFAF7!important',
      'position:sticky!important',
      'top:0!important',
      'z-index:100!important',
    ].join(';');
  }

  // ── 3. SHARE/PRINT BUTTON UPGRADE ─────────────────────────────────────────
  function upgradeButtons() {
    if (document.getElementById('cpa-btns-wrap')) return;

    var allBtns = document.querySelectorAll('button');
    var printBtn = null, shareBtn = null;

    for (var i = 0; i < allBtns.length; i++) {
      var oc = allBtns[i].getAttribute('onclick') || '';
      if (!printBtn && (oc.indexOf('print') > -1 || oc.indexOf('Print') > -1)) printBtn = allBtns[i];
      if (!shareBtn && (oc.indexOf('share') > -1 || oc.indexOf('Share') > -1)) shareBtn = allBtns[i];
    }

    if (!shareBtn && !printBtn) return;

    // Build wrapper
    var wrap = document.createElement('div');
    wrap.id = 'cpa-btns-wrap';
    wrap.style.cssText = 'margin:36px 0 8px;padding-top:24px;border-top:1px solid #D9DBDE;display:flex;align-items:center;gap:10px;flex-wrap:wrap';

    var shareS = 'display:inline-flex;align-items:center;gap:6px;background:#F65F5A;color:#fff;border:none;padding:12px 26px;font-family:Inter,-apple-system,sans-serif;font-size:13px;font-weight:600;cursor:pointer;letter-spacing:.04em;white-space:nowrap';
    var printS = 'display:inline-flex;align-items:center;background:transparent;color:#5E6166;border:1px solid #D9DBDE;padding:11px 22px;font-family:Inter,-apple-system,sans-serif;font-size:13px;font-weight:500;cursor:pointer;letter-spacing:.03em;white-space:nowrap';

    if (shareBtn) { shareBtn.setAttribute('style', shareS); shareBtn.innerHTML = '&#8679;&nbsp; Share'; wrap.appendChild(shareBtn); }
    if (printBtn) { printBtn.setAttribute('style', printS); printBtn.innerHTML = 'Print / PDF'; wrap.appendChild(printBtn); }

    // Insert wrap before whichever button came first in DOM
    var anchor = (shareBtn && shareBtn.parentNode) ? shareBtn : printBtn;
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(wrap, anchor);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', upgradeButtons);
  } else {
    upgradeButtons();
  }

})();
