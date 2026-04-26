# CPA Validated - Site Maintenance & Operations Manual

**Site:** cpavalidated.com
**GitHub Repo:** https://github.com/tk-cpa/cpavalidated
**Branch:** main (auto-deploys via Cloudflare Pages, ~60 seconds after push)
**Owner:** Timur Knyazev, CPA, EA | tk.cpa

---

## Table of Contents

1. Quick Reference
2. Deployment Architecture
3. GitHub Push Workflow
4. Canonical Page Components (Nav, Cat-Nav, Footer)
5. Design System & CSS
6. Creating a New Guide Page (template)
7. Updating Homepage & Hub Pages
8. Sitemap & llms.txt
9. Content Rules (Non-Negotiable)
10. SEO Requirements
11. Category System & Domain Mapping
12. Things That Break the Site
13. Current Page Inventory

---

## 1. Quick Reference

| Item | Value |
|------|-------|
| GitHub Repo | https://github.com/tk-cpa/cpavalidated |
| GitHub PAT | Obtain from Timur - keep secure, never commit to public repo |
| Cloudflare Pages | Auto-deploys from main branch on every push |
| Deploy time | ~60 seconds after push |
| Live URL | https://cpavalidated.com |
| Total pages (April 2026) | 143+ |
| Coral accent | #F65F5A |
| Background (paper) | #FAFAF7 |
| Primary text (ink) | #111111 |

---

## 2. Deployment Architecture

There is no build step, no npm, no webpack. Every file is plain HTML/CSS/JS.

```
Write or edit HTML file locally
        |
        v
Push via GitHub API (see Section 3)
        |
        v
main branch commit on GitHub
        |
        v
Cloudflare Pages auto-deploy (~60 seconds)
        |
        v
cpavalidated.com is live
```

Push the file, it is live. That is the entire pipeline.

---

## 3. GitHub Push Workflow

Use this Python function for every file push:

```python
import urllib.request, json, base64

TOKEN = "YOUR_GITHUB_PAT_HERE"  # Never commit the real PAT
REPO  = "tk-cpa/cpavalidated"
API   = "https://api.github.com"

H = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    "User-Agent": "cpavalidated"
}

def push(local_path, remote_name, message):
    with open(local_path, "rb") as f:
        content = base64.b64encode(f.read()).decode()
    url = f"{API}/repos/{REPO}/contents/{remote_name}"
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=H)) as r:
            sha = json.loads(r.read()).get("sha")
    except:
        sha = None  # New file - no SHA needed
    body = {"message": message, "content": content, "branch": "main"}
    if sha: body["sha"] = sha
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=H, method="PUT")
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read()).get("commit", {}).get("sha", "")[:7]

# Example usage:
# commit_sha = push("my-guide.html", "my-guide.html", "add: guide on topic X")
```

**409 Conflict errors:** Means the SHA is stale (file was just updated elsewhere). Fetch a fresh SHA and retry. 409s in a batch often mean the files already went through successfully - verify by checking the live repo.

---

## 4. Canonical Page Components

Every page must have all four of these, in this exact order.

### 4A. Canonical Nav (sticky top bar)

```html
<nav>
  <a href="index.html" class="brand">
    <div class="wm">CPA Validated<small style="text-transform:none!important">a tk.cpa resource</small></div>
  </a>
  <a href="https://tk.cpa" target="_blank" rel="noopener" class="nav-cta">tk.cpa</a>
</nav>
```

### 4B. Category Nav Bar (immediately after </nav>)

```html
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

To highlight the active category, add class="active" to the relevant link:
```html
<a href="international-tax.html" class="active">International Tax</a>
```

### 4C. Page Bottom (guides - before footer bar)

```html
<div class="source-row">Authority: IRC §XXX (description); Treas. Reg. §X.XXX (description).</div>

<button onclick="window.print()" style="background:var(--coral,#F65F5A);color:#fff;border:none;padding:11px 24px;font-family:var(--font-sans,'Inter',sans-serif);font-size:13px;font-weight:600;cursor:pointer;margin:20px 0 4px;letter-spacing:.03em;display:inline-block">Print / Save as PDF</button>

<div class="disc">A <a href="https://tk.cpa" target="_blank" style="color:inherit">tk.cpa</a> resource. For informational purposes only - not legal or tax advice. No professional relationship is created by using this site. Tax law changes; verify against current authority before acting. <a href="disclaimer.html">Full disclaimer.</a></div>
```

### 4D. Footer Bar (immediately before </body> - ALL pages)

```html
<div style="background:var(--ink,#111);border-top:2px solid var(--coral,#F65F5A);margin-top:60px;padding:16px 0">
  <div style="max-width:800px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between">
    <span style="font-family:var(--font-mono,'Courier New',monospace);font-size:11px;color:rgba(255,255,255,.38);letter-spacing:.08em">a tk.cpa resource</span>
    <a href="https://tk.cpa" target="_blank" rel="noopener" style="font-family:var(--font-sans,'Inter',sans-serif);font-size:12px;font-weight:600;color:var(--coral,#F65F5A);text-decoration:none;letter-spacing:.03em">tk.cpa</a>
  </div>
</div>
```

NOTE: Hub pages use max-width:960px in the inner div instead of max-width:800px.

---

## 5. Design System & CSS

### CSS Variables (required in :root on every page)

```css
:root {
  --ink:      #111111;
  --ink-80:   #343A40;
  --ink-60:   #5E6166;
  --ink-40:   #9BA0A6;
  --ink-20:   #D9DBDE;
  --ink-10:   #EDEEF0;
  --paper:    #FAFAF7;
  --white:    #FFFFFF;
  --coral:    #F65F5A;
  --green:    #4A7459;
  --green-bg: #E2EDE6;
  --green-b:  #9BBDAA;
  --amber:    #8B6535;
  --amber-bg: #EDE8D8;
  --amber-b:  #C8A878;
  --red:      #9B3D3D;
  --red-bg:   #EDE0DC;
  --red-b:    #C8A8A4;
  --font-display: 'Oswald', 'Arial Narrow', sans-serif;
  --font-sans:    'Inter', -apple-system, sans-serif;
  --font-mono:    'Courier New', monospace;
}
```

### Required Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Canonical Nav CSS (required in every page style block)

```css
/* === canonical nav === */
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
/* === end canonical nav === */
```

### Callout Box Styles

```css
.callout{background:var(--ink);color:#fff;padding:20px 22px;margin:24px 0;border-left:4px solid var(--coral)}
.callout-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--coral);margin-bottom:8px}
.callout p{font-size:13.5px;color:rgba(255,255,255,.85);line-height:1.65;margin-bottom:8px}

.note-box{background:var(--amber-bg);border-left:3px solid var(--amber);padding:12px 16px;margin:20px 0;font-size:13px;color:var(--amber);line-height:1.6}

.green-box{background:var(--green-bg);border-left:3px solid var(--green-b);padding:12px 16px;margin:20px 0;font-size:13px;color:var(--green);line-height:1.6}

.red-box{background:var(--red-bg);border-left:3px solid var(--red-b);padding:12px 16px;margin:20px 0;font-size:13px;color:var(--red);line-height:1.6}
```

---

## 6. Creating a New Guide Page

### Step 1: Create the HTML file using this template

Copy this skeleton and fill in the bracketed sections:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[TITLE - include primary keyword] | CPA Validated</title>
<meta name="description" content="[150-160 chars. Lead with keyword. Include IRC section number.]">
<link rel="canonical" href="https://cpavalidated.com/[filename].html">
<meta property="og:type" content="article">
<meta property="og:title" content="[TITLE] | CPA Validated">
<meta property="og:description" content="[Description]">
<meta property="og:url" content="https://cpavalidated.com/[filename].html">
<meta property="og:site_name" content="CPA Validated">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"[TITLE]","url":"https://cpavalidated.com/[filename].html","author":{"@type":"Person","name":"Timur Knyazev, CPA, EA","url":"https://tk.cpa"},"publisher":{"@type":"Organization","name":"CPA Validated","url":"https://cpavalidated.com"},"isAccessibleForFree":true,"inLanguage":"en-US"}
</script>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
/* Copy the full CSS block from any existing guide (e.g. amt-guide.html) */
/* Must include: :root variables, * reset, body, canonical nav CSS, article styles */
</style>
</head>
<body>
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
<div class="ph"><div class="phi">
  <h1>[PAGE TITLE]</h1>
  <div class="sub">[Subtitle 1] &nbsp;&bull;&nbsp; [Subtitle 2] &nbsp;&bull;&nbsp; Updated [YEAR]</div>
  <div class="meta">
    <span class="ph-meta-item">IRC §XXX</span>
    <span class="ph-meta-item">Form XXXX</span>
  </div>
</div></div>
<div class="back"><a href="[hub-page].html">&#8592; [Hub Page Name]</a></div>
<div class="article">
  <p class="lead">[Opening summary paragraph - 2-4 sentences. Most important point first.]</p>

  <h2>[SECTION HEADING]</h2>
  <p>[Content paragraph]</p>

  <!-- Add more sections, callout boxes, tables as needed -->

  <div class="related">
    <div class="related-title">Related Tools &amp; Articles</div>
    <div class="related-links">
      <a href="[page].html" class="related-link">[Title]<span>[Description]</span></a>
    </div>
  </div>

  <div class="source-row">Authority: IRC §XXX (description); Treas. Reg. §X.XXX (description).</div>
  <button onclick="window.print()" style="background:var(--coral,#F65F5A);color:#fff;border:none;padding:11px 24px;font-family:var(--font-sans,'Inter',sans-serif);font-size:13px;font-weight:600;cursor:pointer;margin:20px 0 4px;letter-spacing:.03em;display:inline-block">Print / Save as PDF</button>
  <div class="disc">A <a href="https://tk.cpa" target="_blank" style="color:inherit">tk.cpa</a> resource. For informational purposes only - not legal or tax advice. No professional relationship is created by using this site. Tax law changes; verify against current authority before acting. <a href="disclaimer.html">Full disclaimer.</a></div>
</div>
<div style="background:var(--ink,#111);border-top:2px solid var(--coral,#F65F5A);margin-top:60px;padding:16px 0">
  <div style="max-width:800px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between">
    <span style="font-family:var(--font-mono,'Courier New',monospace);font-size:11px;color:rgba(255,255,255,.38);letter-spacing:.08em">a tk.cpa resource</span>
    <a href="https://tk.cpa" target="_blank" rel="noopener" style="font-family:var(--font-sans,'Inter',sans-serif);font-size:12px;font-weight:600;color:var(--coral,#F65F5A);text-decoration:none;letter-spacing:.03em">tk.cpa</a>
  </div>
</div>
</body>
</html>
```

### Step 2: Push the file to GitHub
```python
push("my-guide.html", "my-guide.html", "add: [description of guide]")
```

### Step 3: Update sitemap.xml
Add this block before `</urlset>`:
```xml
  <url>
    <loc>https://cpavalidated.com/my-guide.html</loc>
    <lastmod>YYYY-MM-DD</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>
```

### Step 4: Update llms.txt
Add one line at the bottom:
```
- my-guide.html: Guide Title - Brief description of what the guide covers, ~140 chars.
```

### Step 5: Add a card to the relevant hub page and homepage domain section

---

## 7. Updating Homepage & Hub Pages

### Homepage domain sections
The homepage (index.html) has 8 domain sections. Each has this structure:

```html
<div class="domain-section">
  <div class="domain-head">
    <div>
      <span class="domain-label">Domain Name</span>
      <span class="domain-count">X+ resources</span>
    </div>
    <a href="domain-hub.html" class="domain-browse">Browse all &rarr;</a>
  </div>
  <div class="tool-grid">
    <!-- tool-card elements here -->
  </div>
</div>
```

Each tool card:
```html
<a href="guide.html" class="tool-card">
  <span class="tool-tag tt-planning">Guide</span>
  <div class="tool-name">Guide Name</div>
  <div class="tool-desc">Short description</div>
  <div class="tool-authority">IRC §XXX &middot; Form XXXX</div>
  <span class="tool-link">Read Guide</span>
</a>
```

Tag CSS classes: tt-international, tt-planning, tt-compliance, tt-reside

### Hub pages
Each hub page uses hub-card elements:
```html
<a href="guide.html" class="hub-card">
  <div class="hub-card-tag">Guide</div>
  <div class="hub-card-name">Guide Name</div>
  <div class="hub-card-desc">Short description</div>
</a>
```

ABSOLUTE RULE: Hub pages must never contain a "Need Professional Help?" CTA block. This was removed permanently. The site is not accepting new clients.

---

## 8. Sitemap & llms.txt

**sitemap.xml** priority guidelines:
- 1.0 = index.html
- 0.9 = hub pages, calculators
- 0.8 = guide pages
- 0.7 = utility pages (about, disclaimer, vetted-resources)

**llms.txt** makes site content accessible to AI systems (ChatGPT, Claude, Perplexity). Keep it updated. Format: `- filename.html: Title - Description (~140 chars)`

---

## 9. Content Rules (Non-Negotiable)

### HARD RULES - NEVER VIOLATE

- NO em dashes anywhere (use hyphens - only)
- NO "Need Professional Help?" CTA blocks on any page
- NO "Book a Consultation" or calendar links
- NO solicitation of new clients in any form
- NO branding or "Prepared by" on deliverables
- NO fabricated citations, Code sections, or case law
- Capitalize "Client" and "Clients"
- Full 4-digit years (2026 not '26)

### Tax Content Standards

Every tax position requires a specific primary authority:
- IRC section number
- Treasury regulation with section (e.g., Treas. Reg. §1.6038A-1(c))
- Revenue Ruling or Revenue Procedure with number
- Case citation with reporter
- Treaty article
- IRS form instructions with form number and line

Never state a rate, threshold, deadline, or form line number without verified authority. When uncertain: "I need to verify this before stating a position."

### Russian-language content
Always use "вы" (never "ты"). Formal professional register.

---

## 10. SEO Requirements

Every page requires in <head>:

```html
<!-- Core meta -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[Primary keyword phrase] | CPA Validated</title>
<meta name="description" content="[150-160 chars. Lead with keyword.]">
<link rel="canonical" href="https://cpavalidated.com/[filename].html">

<!-- Open Graph -->
<meta property="og:type" content="article">
<meta property="og:title" content="[Title]">
<meta property="og:description" content="[Description]">
<meta property="og:url" content="https://cpavalidated.com/[filename].html">
<meta property="og:site_name" content="CPA Validated">

<!-- JSON-LD (Article for guides, WebApplication for calculators) -->
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"[Title]","url":"https://cpavalidated.com/[filename].html","author":{"@type":"Person","name":"Timur Knyazev, CPA, EA","url":"https://tk.cpa"},"publisher":{"@type":"Organization","name":"CPA Validated","url":"https://cpavalidated.com"},"isAccessibleForFree":true,"inLanguage":"en-US"}
</script>
```

---

## 11. Category System & Domain Mapping

8 domains - every interior page belongs to one:

| Domain | Hub File | Active Nav Text |
|--------|----------|-----------------|
| Individual Tax | individual-tax.html | Individual Tax |
| Business & Entity | business-entity.html | Business & Entity |
| Real Estate | real-estate-tax.html | Real Estate |
| International Tax | international-tax.html | International Tax |
| Retirement & Savings | retirement-savings.html | Retirement & Savings |
| Investments & Capital | investments-capital.html | Investments & Capital |
| Estate & Gifts | estate-gifts.html | Estate & Gifts |
| State & Compliance | state-compliance.html | State & Compliance |

The active category is shown by adding class="active" to the relevant cat-nav link.

---

## 12. Things That Break the Site

1. **Cat-nav inside nav instead of after it** - the cat-nav div must be a sibling of nav, not nested inside it
2. **Multiple canonical nav CSS blocks** - strip old blocks before injecting new ones. Pattern: `/* === canonical nav === */` ... `/* === end canonical nav === */`
3. **Using </nav>\n as injection pattern** - some pages have `</nav> <!-- comment -->`. Use regex: `re.sub(r'(</nav>)(\s*<!--[^>]*-->)?', r'\1\n' + CAT_NAV, html, count=1)`
4. **Stale SHA on push** - always fetch current SHA immediately before pushing
5. **Em dashes** - breaks content rules, affects professional presentation
6. **Re-adding CTA blocks** - removed permanently, do not re-add
7. **Fabricating citations** - never state a tax position without real verifiable authority

---

## 13. Current Page Inventory (April 2026)

Total: 143+ pages

**Hub pages (8):** individual-tax, business-entity, real-estate-tax, international-tax, retirement-savings, investments-capital, estate-gifts, state-compliance

**International Tax (40+ pages):** fbar-checker, fbar-penalties, fbar-penalty-estimator, form-8938-fatca-guide, form-5471-checker, form-5472-guide, international-information-returns, streamlined-checker, pre-immigration-planning, gilti-explained, subpart-f-cfc-basics, section-962-election, pfic-guide, pfic-guide-deep, form-3520-guide, form-3520-foreign-trusts, foreign-pension-reporting, expatriation-tax-guide, form-8854, form-8233-guide, dual-status-returns, firpta-explained, nra-estate-tax, us-expat-tax-guide, feie-guide, irs-mailing-addresses-abroad, us-canada-tax-treaty, rrsp-rrif-us-persons, canadian-residency, canadian-tax-hub, cross-border-snowbirds, russia-treaty-suspension, us-canada-tax-planning, foreign-tax-credit-guide, treaty-navigator, transfer-pricing-guide

**Business & Entity (25+):** scorp-vs-llc, scorp-compensation, s-corporation-basics, partnership-tax-basics, business-entity-comparison, self-employment-tax-guide, payroll-tax-guide, section-199a-guide, qbi-deduction-guide, qbi-calculator, section-83b-guide, executive-compensation-guide, rd-tax-credit-guide, meals-and-entertainment-guide, home-office-calculator, asc-740-guide, asc-740-tax-provision, form-3115-guide, form-1099-guide, obbba-guide, bonus-depreciation-guide, section-163j-guide, business-sale-planning

**Individual Tax (20+):** spt-calculator, closer-connection, tax-estimator, w4-optimizer, social-security-tax, social-security-taxation-guide, niit-guide, amt-calculator, amt-guide, passive-activity-loss, at-risk-rules-guide, net-operating-loss-guide, hobby-loss-rules-guide, state-residency-hnw, state-income-tax-nexus, remote-worker-state-tax, no-income-tax-states, salt-planning-guide, hnw-planning-guide, penalty-calculator, tax-extension-guide, individual-extension, corporate-extension, tax-calendar, education-tax-benefits

**Real Estate (15+):** real-estate-tax-guide, 1031-exchange-guide, like-kind-exchange-deep, depreciation-calculator, vehicle-depreciation, depreciation-recapture-guide, florida-property-tax, section-121-exclusion, qoz-guide, passive-activity-loss, safe-harbor, augusta-rule

**Retirement & Savings:** ira-basics-guide, ira-guide, roth-conversion, backdoor-roth, rmd-guide, social-security-taxation-guide

**Investments & Capital:** capital-gains-calculator, tax-loss-harvesting-guide, cryptocurrency-tax-guide, crypto-tax-guide, section-1202-qsbs, charitable-giving-strategies, charitable-deduction-guide

**Estate & Gifts:** gift-estate-tax-guide, trust-guide, estate-planning-basics, hnw-planning-guide

**State & Compliance:** state-income-tax-nexus, irs-audit-guide, salt-planning-guide, florida-property-tax, act60-estimator, usvi-edc-estimator, irs-payments-guide, irs-accounts-guide, itin-guide, tax-calendar, streamlined-checker

**Utility pages:** index, about, disclaimer, vetted-resources, sitemap.xml, llms.txt, robots.txt

---

*Last updated: April 2026 | cpavalidated.com | a tk.cpa resource*
