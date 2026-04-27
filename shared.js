/* CPA Validated - shared.js
   Edit here -> Cloudflare Pages deploys in ~60 seconds.
   Handles: nav update, button styling, button positioning above footer.
*/
(function() {

  // ── 1. CSS ─────────────────────────────────────────────────────────────────
  var styleEl = document.createElement('style');
  styleEl.textContent = [
    'nav a:hover{text-decoration:none!important}',
    'nav a{text-decoration:none!important}',
    'html{overflow-y:scroll;scrollbar-gutter:stable}',
  ].join('');
  document.head.appendChild(styleEl);

  // ── 2. NAV - update in place, never move ──────────────────────────────────
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
    existingNav.style.cssText = 'display:flex!important;align-items:center!important;justify-content:space-between!important;padding:14px 28px!important;border-bottom:1px solid #D9DBDE!important;background:#FAFAF7!important;position:sticky!important;top:0!important;z-index:100!important';
  }

  // ── 3. BUTTONS - style and move ABOVE footer ───────────────────────────────
  function upgradeButtons() {
    if (document.getElementById('cpa-btns-wrap')) return;

    // Find buttons
    var allBtns = document.querySelectorAll('button');
    var printBtn = null, shareBtn = null;
    for (var i = 0; i < allBtns.length; i++) {
      var oc = allBtns[i].getAttribute('onclick') || '';
      if (!printBtn && (oc.indexOf('print') > -1 || oc.indexOf('Print') > -1)) printBtn = allBtns[i];
      if (!shareBtn && (oc.indexOf('share') > -1 || oc.indexOf('Share') > -1)) shareBtn = allBtns[i];
    }
    if (!shareBtn && !printBtn) return;

    // Style buttons
    var shareS = 'display:inline-flex;align-items:center;gap:6px;background:#F65F5A;color:#fff;border:none;padding:12px 26px;font-family:Inter,-apple-system,sans-serif;font-size:13px;font-weight:600;cursor:pointer;letter-spacing:.04em;white-space:nowrap';
    var printS = 'display:inline-flex;align-items:center;background:transparent;color:#5E6166;border:1px solid #D9DBDE;padding:11px 22px;font-family:Inter,-apple-system,sans-serif;font-size:13px;font-weight:500;cursor:pointer;letter-spacing:.03em;white-space:nowrap';

    // Build wrapper with separator
    var wrap = document.createElement('div');
    wrap.id = 'cpa-btns-wrap';
    wrap.style.cssText = 'padding:24px 0 8px;border-top:1px solid #D9DBDE;display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 0 0';

    if (shareBtn) { shareBtn.setAttribute('style', shareS); shareBtn.innerHTML = '&#8679;&nbsp; Share'; wrap.appendChild(shareBtn); }
    if (printBtn) { printBtn.setAttribute('style', printS); printBtn.innerHTML = 'Print / PDF'; wrap.appendChild(printBtn); }

    // Find the site footer - insert buttons BEFORE it
    var siteFooter = null;
    var allDivs = document.querySelectorAll('body > div');
    for (var j = 0; j < allDivs.length; j++) {
      var bg = allDivs[j].style.background || allDivs[j].getAttribute('style') || '';
      if (bg.indexOf('#111') > -1 || bg.indexOf('var(--ink') > -1) {
        // Check it's the footer by looking for tk.cpa AI Lab text
        if (allDivs[j].textContent.indexOf('tk.cpa AI Lab') > -1) {
          siteFooter = allDivs[j];
          break;
        }
      }
    }

    if (siteFooter) {
      // Insert wrap with margin before footer
      wrap.style.margin = '40px 24px 0';
      siteFooter.parentNode.insertBefore(wrap, siteFooter);
      // Remove original button location (if buttons were elsewhere, their parent may be empty now)
    } else {
      // Fallback: insert before first button's parent
      var anchor = (shareBtn && shareBtn.parentNode) ? shareBtn : printBtn;
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(wrap, anchor);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', upgradeButtons);
  } else {
    upgradeButtons();
  }

})();
