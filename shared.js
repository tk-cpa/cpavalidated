/* CPA Validated - shared.js
   Single source of truth for nav and global UX fixes.
   Edit here -> Cloudflare Pages deploys in ~60 seconds.
   --------------------------------------------------------
   Handles:
   1. Nav injection with About->Mission, no Validators
   2. Fix hover underline on brand link
   3. Fix scrollbar-caused layout shift
   4. Upgrade print/share button styling
*/

(function() {

  // ── 1. GLOBAL CSS FIXES ────────────────────────────────────────────────────
  var css = [
    // Prevent underline on nav/brand hover
    'nav a:hover { text-decoration:none !important }',
    'nav a .wm:hover { text-decoration:none !important }',
    // Always show scrollbar to prevent layout shift on click
    'html { overflow-y:scroll; scrollbar-gutter:stable }',
    // Consistent nav brand cursor
    'nav .brand, nav .brand:hover { text-decoration:none !important; cursor:pointer }',
  ].join('\n');
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── 2. NAV ────────────────────────────────────────────────────────────────
  var isActive = location.pathname === '/about.html' ? ' style="color:#F65F5A!important"' : '';
  var NAV_HTML = '<nav style="display:flex!important;align-items:center!important;justify-content:space-between!important;padding:14px 28px!important;border-bottom:1px solid #D9DBDE!important;background:#FAFAF7!important;position:sticky!important;top:0!important;z-index:100!important">'
    + '<a href="/index.html" style="display:flex;align-items:center;text-decoration:none!important;color:#111111;cursor:pointer">'
    + '<div style="font-family:Oswald,Arial Narrow,sans-serif;font-weight:500;font-size:17px;letter-spacing:.05em;text-transform:uppercase;line-height:1.1">'
    + 'CPA Validated'
    + '<small style="display:block;font-family:Inter,-apple-system,sans-serif;font-weight:400;font-size:10px;color:#F65F5A;letter-spacing:.1em;margin-top:3px;text-transform:none">a tk.cpa resource</small>'
    + '</div></a>'
    + '<div style="display:flex;align-items:center;gap:20px">'
    + '<a href="/about.html"' + isActive + ' style="font-family:Inter,-apple-system,sans-serif;font-size:13px;font-weight:500;color:#5E6166;text-decoration:none!important;white-space:nowrap">Mission</a>'
    + '<a href="https://tk.cpa" target="_blank" rel="noopener" style="display:inline-block;background:#F65F5A;color:#fff;padding:9px 20px;font-weight:600;font-size:13px;text-decoration:none!important;white-space:nowrap;flex-shrink:0">tk.cpa</a>'
    + '</div></nav>';

  var existingNav = document.querySelector('nav');
  if (existingNav) {
    existingNav.outerHTML = NAV_HTML;
  }

  // ── 3. UPGRADE SHARE BUTTONS ───────────────────────────────────────────────
  // Run after DOM settles
  function upgradeButtons() {
    // Find print and share buttons by their onclick content
    var allBtns = document.querySelectorAll('button');
    var printBtn = null, shareBtn = null;

    for (var i = 0; i < allBtns.length; i++) {
      var oc = allBtns[i].getAttribute('onclick') || '';
      if (!printBtn && (oc.indexOf('print') !== -1 || oc.indexOf('Print') !== -1)) {
        printBtn = allBtns[i];
      }
      if (!shareBtn && (oc.indexOf('share') !== -1 || oc.indexOf('Share') !== -1)) {
        shareBtn = allBtns[i];
      }
    }

    if (!printBtn && !shareBtn) return;

    // Build new styled container
    var wrap = document.createElement('div');
    wrap.style.cssText = [
      'margin:36px 0 8px',
      'padding-top:24px',
      'border-top:1px solid #D9DBDE',
      'display:flex',
      'align-items:center',
      'gap:10px',
      'flex-wrap:wrap',
    ].join(';');

    // Style: Share = primary coral, Print = secondary ghost
    var shareStyle = [
      'display:inline-flex', 'align-items:center', 'gap:6px',
      'background:#F65F5A', 'color:#fff', 'border:none',
      'padding:12px 26px',
      'font-family:Inter,-apple-system,sans-serif',
      'font-size:13px', 'font-weight:600', 'cursor:pointer',
      'letter-spacing:.04em', 'text-transform:none',
    ].join(';');

    var printStyle = [
      'display:inline-flex', 'align-items:center',
      'background:transparent', 'color:#5E6166',
      'border:1px solid #D9DBDE',
      'padding:11px 22px',
      'font-family:Inter,-apple-system,sans-serif',
      'font-size:13px', 'font-weight:500', 'cursor:pointer',
      'letter-spacing:.03em',
    ].join(';');

    if (shareBtn) {
      shareBtn.setAttribute('style', shareStyle);
      shareBtn.innerHTML = '&#8679;&nbsp; Share This Guide';
      wrap.appendChild(shareBtn);
    }
    if (printBtn) {
      printBtn.setAttribute('style', printStyle);
      printBtn.innerHTML = 'Print / PDF';
      wrap.appendChild(printBtn);
    }

    // Insert wrap before old button location (share or print, whichever came first in DOM)
    var anchor = shareBtn || printBtn;
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(wrap, anchor);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', upgradeButtons);
  } else {
    upgradeButtons();
  }

})();
