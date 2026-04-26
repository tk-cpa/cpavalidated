# CPA Validated - Maintenance & AI Handoff Guide

**Site:** cpavalidated.com  
**Repo:** https://github.com/tk-cpa/cpavalidated  
**Branch:** main (auto-deploys to Cloudflare Pages ~60 seconds after push)  
**Owner:** Timur Knyazev, CPA, EA  
**Practice:** tk.cpa  

---

## 1. Authentication

**GitHub PAT** (owner holds the current token - request from owner if expired):  
The token format is `ghp_...` and grants write access to this repo only.

**Push method:** GitHub Contents API - no git clone required.

```python
import urllib.request, json, base64

TOKEN = "OWNER_PROVIDES_TOKEN"
REPO = "tk-cpa/cpavalidated"
H = {"Authorization": f"token {TOKEN}", "Accept": "application/vnd.github.v3+json",
     "Content-Type": "application/json", "User-Agent": "cpavalidated"}

def push(local_path, remote_filename, commit_message):
    with open(local_path, "rb") as f:
        content = base64.b64encode(f.read()).decode()
    url = f"https://api.github.com/repos/{REPO}/contents/{remote_filename}"
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=H)) as r:
            sha = json.loads(r.read()).get("sha")
    except:
        sha = None
    body = {"message": commit_message, "content": content, "branch": "main"}
    if sha:
        body["sha"] = sha
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=H, method="PUT")
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read()).get("commit", {}).get("sha", "")[:7]
```

---

## 2. Site Architecture

```
cpavalidated.com/
├── index.html              # Homepage - 8 domain sections + featured cards
├── about.html              # About - Timur Knyazev, CPA, EA (no license numbers)
├── vetted-resources.html   # Curated US-only resource links
├── disclaimer.html         # Legal disclaimer
├── sitemap.xml             # All pages, updated with every addition
├── llms.txt                # AI/LLM index - one line per page
├── robots.txt              # Allows all, points to sitemap
├── MAINTENANCE.md          # This file
│
├── CATEGORY HUB PAGES (8)
│   individual-tax.html, business-entity.html, real-estate-tax.html,
│   international-tax.html, retirement-savings.html, investments-capital.html,
│   estate-gifts.html, state-compliance.html
│
└── CONTENT PAGES (130+)
    Guides: [topic]-guide.html
    Tools: [topic]-calculator.html, [topic]-checker.html
```

---

## 3. CANONICAL HEADER - Copy Exactly

Every page must have this header, in this order:

```html
<nav>
  <a href="index.html" class="brand">
    <div class="wm">CPA Validated<small style="text-transform:none!important">a tk.cpa resource</small></div>
  </a>
  <a href="https://tk.cpa" target="_blank" rel="noopener" class="nav-cta">tk.cpa</a>
</nav>
<div class="cat-nav" role="navigation" aria-label="Topics">
  <div class="cat-nav-inner">
    <a href="individual-tax.html">Individual Tax</a>
    <a href="business-entity.html">Business &amp; Entity</a>
    <a href="real-estate-tax.html">Real Estate</a>
    <a href="international-tax.html">International Tax</a>
    <a href="retirement-savings.html">Retirement &amp; Savings</a>
    <a href="investments-capital.html">Investments &amp; Capital</a>
    <a href="estate-gifts.html">Estate &amp; Gifts</a>
    <a href="state-compliance.html">State &amp; Compliance</a>
  </div>
</div>
```

Add `class="active"` to the relevant cat-nav link for the page's domain.

**Required CSS (inject before `</style>`):**
```css
nav{display:flex!important;align-items:center!important;justify-content:space-between!important;padding:14px 28px!important;border-bottom:1px solid var(--ink-20,#D9DBDE)!important;background:var(--paper,#FAFAF7)!important;position:sticky!important;top:0!important;z-index:100!important}
.brand{display:flex;align-items:center;text-decoration:none;color:var(--ink,#111111)}
.wm{font-family:var(--font-display,'Oswald',sans-serif);font-weight:500;font-size:17px;letter-spacing:.05em;text-transform:uppercase;line-height:1.1;color:var(--ink,#111111)}
.wm small{display:block;font-family:var(--font-sans,'Inter',sans-serif);font-weight:400;font-size:10px;color:var(--coral,#F65F5A);letter-spacing:.1em;margin-top:3px;text-transform:none!important}
.nav-cta{display:inline-block!important;background:var(--coral,#F65F5A)!important;color:#fff!important;padding:9px 20px!important;font-family:var(--font-sans,'Inter',sans-serif)!important;font-weight:600!important;font-size:13px!important;text-decoration:none!important;letter-spacing:.03em!important;white-space:nowrap!important;flex-shrink:0!important}
.nav-cta:hover{opacity:.88!important}
.cat-nav{background:var(--ink,#111111);border-bottom:1px solid rgba(255,255,255,.08);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.cat-nav::-webkit-scrollbar{display:none}
.cat-nav-inner{display:flex;min-width:max-content;padding:0 16px}
.cat-nav a{display:inline-block;padding:10px 14px;font-family:var(--font-sans,'Inter',sans-serif);font-size:11.5px;font-weight:500;color:rgba(255,255,255,.55);text-decoration:none;letter-spacing:.04em;white-space:nowrap;border-bottom:2px solid transparent;transition:color .15s,border-color .15s}
.cat-nav a:hover,.cat-nav a.active{color:#fff!important;border-bottom-color:var(--coral,#F65F5A);text-decoration:none}
@media(max-width:480px){nav{padding:12px 16px!important}.nav-cta{padding:8px 14px!important;font-size:12px!important}}
```

---

## 4. CANONICAL FOOTER - Copy Exactly

Place immediately before `</body>`. Uses inline styles only - self-contained, cannot be overridden.

```html
<div style="background:var(--ink,#111111);border-top:2px solid var(--coral,#F65F5A);margin-top:60px;padding:16px 0">
  <div style="max-width:800px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between">
    <span style="font-family:var(--font-mono,'Courier New',monospace);font-size:11px;color:rgba(255,255,255,.38);letter-spacing:.08em">a tk.cpa resource</span>
    <a href="https://tk.cpa" target="_blank" rel="noopener" style="font-family:var(--font-sans,'Inter',sans-serif);font-size:12px;font-weight:600;color:var(--coral,#F65F5A);text-decoration:none;letter-spacing:.03em">tk.cpa</a>
  </div>
</div>
```

---

## 5. CANONICAL DISCLAIMER - Place Before Footer on Guide/Calculator Pages

```html
<button onclick="window.print()" style="background:var(--coral,#F65F5A);color:#fff;border:none;padding:11px 24px;font-family:var(--font-sans,'Inter',sans-serif);font-size:13px;font-weight:600;cursor:pointer;margin:20px 0 4px;letter-spacing:.03em;display:inline-block">Print / Save as PDF</button>
<div class="disc">A <a href="https://tk.cpa" target="_blank" style="color:inherit">tk.cpa</a> resource. For informational purposes only - not legal or tax advice. No professional relationship is created by using this site. Tax law changes; verify against current authority before acting. <a href="disclaimer.html">Full disclaimer.</a></div>
```

---

## 6. Design Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--ink` | `#111111` | Text, nav/footer background |
| `--paper` | `#FAFAF7` | Page background |
| `--coral` | `#F65F5A` | Brand accent: buttons, borders, links |
| `--ink-20` | `#D9DBDE` | Dividers and borders |
| `--ink-60` | `#5E6166` | Secondary/muted text |
| Font Display | Oswald | H1, H2, nav wordmark |
| Font Sans | Inter | Body, UI labels |
| Font Mono | Courier New | Code, authority citations, metadata |

---

## 7. Hard Rules - Never Violate

- No em dashes (—). Short hyphens (-) only.
- No license numbers on public pages. About page says "CPA, EA - NY & FL licensed" only.
- No "Need Professional Help?" CTAs. Site is not accepting new clients.
- No booking or consultation links.
- Every tax position cites a specific primary authority (IRC section, Treas. Reg., Rev. Rul., IRS form instructions).
- No fabricated citations of any kind.
- US domestic focus. No foreign tax authority links.
- No commercial tool links (Avalara, TaxJar, Bankrate, broker calculators).

---

## 8. Adding a New Page - Checklist

1. Create HTML file following the template in Section 3-5 above
2. Push the HTML file
3. Add to `sitemap.xml`:
   ```xml
   <url>
     <loc>https://cpavalidated.com/[filename].html</loc>
     <lastmod>YYYY-MM-DD</lastmod>
     <changefreq>yearly</changefreq>
     <priority>0.8</priority>
   </url>
   ```
4. Add to `llms.txt`: `- [filename].html: [brief description of content]`
5. Add a card to the relevant hub page (`[domain].html`)
6. Add a card to `index.html` in the relevant domain section

**Filename convention:** `[topic]-guide.html`, `[topic]-calculator.html`, `[topic]-checker.html`

---

## 9. Sitewide Audit Script

Run this to check all pages for header/footer compliance:

```python
import urllib.request, json, re

TOKEN = "OWNER_PROVIDES_TOKEN"
H = {"Authorization": f"token {TOKEN}", "User-Agent": "cpavalidated"}

with urllib.request.urlopen(urllib.request.Request(
    "https://api.github.com/repos/tk-cpa/cpavalidated/contents/", headers=H)) as r:
    files = [f['name'] for f in json.loads(r.read()) if f['name'].endswith('.html')]

SKIP = {'firpta-foreign-sellers.html', 'eci-fdap-explained.html', 'backdoor-roth-guide.html'}
issues = []

for fname in files:
    if fname in SKIP:
        continue
    with urllib.request.urlopen(
        f"https://raw.githubusercontent.com/tk-cpa/cpavalidated/main/{fname}") as r:
        c = r.read().decode()
    p = []
    if 'class="nav-cta"' not in c:         p.append("missing nav-cta button")
    if 'cat-nav' not in c:                  p.append("missing category nav bar")
    if 'a tk.cpa resource' not in c:        p.append("missing footer")
    if 'flex-shrink:0' not in c:            p.append("nav CSS missing flex-shrink")
    if 'Need Professional Help' in c:       p.append("CTA block present - REMOVE")
    if '—' in c or '&mdash;' in c:          p.append("em dash found")
    if re.search(r'#\d{5,}', c):            p.append("license number found")
    if p:
        issues.append(f"{fname}: {', '.join(p)}")

print(f"Pages: {len(files)-len(SKIP)} checked | Issues: {len(issues)}")
for i in issues:
    print(f"  {i}")
```

---

## 10. Infrastructure

| Component | Details |
|-----------|---------|
| Domain | cpavalidated.com - GoDaddy (auto-renew ON) |
| Hosting | Cloudflare Pages (free, auto-deploys from GitHub main) |
| SSL | Cloudflare automatic |
| Deploy time | ~60 seconds after push to main |
| CDN cache | raw.githubusercontent.com has 1-2 min delay after push |

---

## 11. Owner Context (for AI continuity)

- **Timur Knyazev** - CPA licensed in NY and FL, IRS Enrolled Agent, Big Four background (EY, PwC)
- Practice focus: international tax, HNW individuals, Russian-speaking community, cross-border structures
- This site is a pro bono public resource - no paywall, no ads, no client solicitation
- Content standard: every position must cite a specific primary authority
- The site is updated annually for tax law changes (especially post-OBBBA 2025)
- Tone: authoritative but accessible. Not a law firm. Not academic. Practitioner voice.

---

*This document is the single source of truth for maintaining cpavalidated.com.*  
*Any AI maintaining this site should read this file first and refer back to it for every decision.*
