# CPA Validated - Maintenance Guide

**Site:** https://cpavalidated.com  
**GitHub:** https://github.com/tk-cpa/cpavalidated  
**Backup URL:** https://tk-cpa.github.io/cpavalidated/ (always live, domain-independent)  
**Repo:** tk-cpa/cpavalidated (main branch)  
**Owner:** tk.cpa - Timur Knyazev, CPA, EA  

---

## For Any AI Maintaining This Site

This file is your complete briefing. Read it at the start of every maintenance session. Everything you need is here.

### How to Push Files

```python
import urllib.request, json, base64, os

TOKEN = "[STORED SEPARATELY - ASK OWNER]"
REPO = "tk-cpa/cpavalidated"
API = "https://api.github.com"
headers = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    "User-Agent": "cpavalidated"
}

def push(local_path, remote_filename, message="update"):
    with open(local_path, 'rb') as f:
        content = base64.b64encode(f.read()).decode()
    req = urllib.request.Request(f"{API}/repos/{REPO}/contents/{remote_filename}", headers=headers)
    try:
        with urllib.request.urlopen(req) as r:
            sha = json.loads(r.read()).get('sha')
    except: sha = None
    payload = {"message": message, "content": content, "branch": "main"}
    if sha: payload["sha"] = sha
    req2 = urllib.request.Request(
        f"{API}/repos/{REPO}/contents/{remote_filename}",
        data=json.dumps(payload).encode(), headers=headers, method="PUT"
    )
    with urllib.request.urlopen(req2) as r:
        return json.loads(r.read()).get('commit',{}).get('sha','')[:7]
```

Files are deployed to GitHub Pages automatically within ~60 seconds of pushing.

---

## Annual Update Protocol (Every January)

Run this when the IRS publishes the new Rev. Proc. (typically October/November each year, applies to the coming tax year).

### Step 1 - Update these thresholds in these files:

| Threshold | Current (2026) | File(s) to Update |
|-----------|---------------|-------------------|
| FEIE exclusion | $126,500 | `us-expat-tax-guide.html`, `no-income-tax-countries.html`, `llms.txt` |
| Standard deduction (single) | $15,000 | `tax-estimator.html` |
| Standard deduction (MFJ) | $30,000 | `tax-estimator.html` |
| QBI phase-in threshold (single) | $197,300 | `qbi-deduction-guide.html` |
| QBI phase-in threshold (MFJ) | $394,600 | `qbi-deduction-guide.html` |
| §179 expensing limit | $1,220,000 | `vehicle-depreciation.html`, `bonus-depreciation-guide.html` |
| §179 phase-out | $3,050,000 | `bonus-depreciation-guide.html` |
| SUV §179 limit | $28,900 | `vehicle-depreciation.html` |
| §280F auto caps (passenger) | Projected 2026 - update when Rev. Proc. published | `vehicle-depreciation.html` |
| Gift tax annual exclusion | $19,000 | `form-3520-guide.html` |
| Form 3520 corporate threshold | $19,570 | `form-3520-guide.html` |
| NIIT thresholds | $200K/$250K (statutory, no adjustment) | No change needed |
| Social Security wage base | $176,100 (est.) | `us-expat-tax-guide.html` |
| FBAR threshold | $10,000 (statutory, no adjustment) | No change needed |
| Form 8938 thresholds (domestic) | $50K/$75K (statutory) | No change needed |
| Form 8938 thresholds (abroad) | $200K/$300K (statutory) | No change needed |

### Step 2 - Bonus depreciation rate (OBBBA - permanent 100%):

OBBBA (P.L. 119-21, signed 7/4/2025) permanently restored 100% bonus depreciation for property placed in service after January 19, 2025. The TCJA phase-down schedule (40%/20%/0%) is repealed for qualifying property. **Do not update bonus depreciation rates annually** - 100% is permanent under current law. The only exception is property subject to a written binding contract entered into before January 20, 2025 (locked into the TCJA phase-down rate of 40% for 2025 placed-in-service).

If Congress later changes the rate, update:
- `vehicle-depreciation.html` (JS constant `BONUS_RATE`)
- `bonus-depreciation-guide.html` (comparison table and narrative)
- `depreciation-calculator.html` (bonus rate logic)

### Step 3 - Update "Updated 2026" tags:

Run this Python in each session to update year tags sitewide:
```python
import glob, re
for fpath in glob.glob('/home/claude/*.html'):
    with open(fpath) as f: content = f.read()
    updated = content.replace('Updated 2026', 'Updated 2027')  # change years
    if updated != content:
        with open(fpath, 'w') as f: f.write(updated)
        print(f"Updated: {fpath}")
```

### Step 4 - Update tax calendar:

`tax-calendar.html` is inherently annual. Rebuild it each January with the new year's dates. Key items that shift annually:
- March 15/16 (S-Corp/Partnership) - check for weekend shifts using IRC §7503
- April 15 - check for weekend shifts
- Estimated tax payment dates (April 15, June 16, September 15, January 15)

### Step 5 - Push everything and update sitemap:

After all updates, push all modified files. Verify sitemap.xml includes all pages.

---

## Triggered Updates (When Legislation Passes)

When a major tax bill passes Congress, check which articles are affected:

| Legislation Type | Likely Affected Files |
|-----------------|----------------------|
| Tax rate changes | `tax-estimator.html`, `niit-guide.html` |
| Depreciation changes | `depreciation-calculator.html`, `vehicle-depreciation.html`, `bonus-depreciation-guide.html` |
| International tax changes | `gilti-explained.html`, `us-expat-tax-guide.html`, `form-5471-checker.html` |
| Estate/gift tax changes | `form-3520-guide.html` |
| Pass-through changes | `qbi-deduction-guide.html`, `scorp-vs-llc.html` |
| FBAR/FATCA changes | `fbar-checker.html`, `fbar-penalties.html`, `streamlined-checker.html` |

---

## Site Architecture

**Technology:** Static HTML only. No database. No server. No framework. No dependencies.  
**Hosting:** GitHub Pages (free, permanent, no billing)  
**Domain:** cpavalidated.com (custom domain pointing to GitHub Pages)  
**Fallback:** tk-cpa.github.io/cpavalidated/ (always works even if domain is lost)  
**Design system:** Art Deco, coral #F65F5A, ink #111111, paper #FAFAF7, Oswald + Inter fonts  

### File inventory (as of April 2026):

**Interactive Tools (13):**
- `spt-calculator.html` - Substantial Presence Test
- `closer-connection.html` - Form 8840 checker
- `fbar-checker.html` - FBAR/Form 8938 thresholds
- `safe-harbor.html` - Estimated tax safe harbor (all 50 states)
- `form-5472.html` - Form 5472 obligation checker
- `tax-estimator.html` - Personal and corporate tax estimator 2026
- `act60-estimator.html` - Puerto Rico Act 60
- `usvi-edc-estimator.html` - USVI EDC benefits
- `tax-calendar.html` - Federal tax calendar 2026
- `depreciation-calculator.html` - Real estate MACRS
- `vehicle-depreciation.html` - Section 179/bonus/luxury auto
- `form-5471-checker.html` - CFC/Form 5471 checker
- `streamlined-checker.html` - Streamlined filing eligibility

**Extension Reference Tools (2):**
- `corporate-extension.html` - C-Corp Form 1120, 59 jurisdictions, verified March 2026
- `individual-extension.html` - Form 1040, 59 jurisdictions, verified March 2026

**Reference Guides (15+):**
- `no-income-tax-states.html`, `no-income-tax-countries.html`
- `fbar-penalties.html`, `pre-immigration-planning.html`
- `foreign-pension-reporting.html`, `gilti-explained.html`
- `scorp-vs-llc.html`, `form-3520-guide.html`
- `1031-exchange-guide.html`, `crypto-tax-guide.html`
- `qbi-deduction-guide.html`, `niit-guide.html`
- `bonus-depreciation-guide.html`, `us-expat-tax-guide.html`
- `tax-extension-guide.html`

**Special Pages:**
- `index.html` - Homepage
- `about.html` - Mission statement
- `vetted-resources.html` - Curated external resource directory

**Infrastructure:**
- `sitemap.xml` - All pages listed
- `llms.txt` - AI-readable site index
- `robots.txt` - Search engine directives
- `README.md` - GitHub repo description
- `CNAME` - Custom domain (cpavalidated.com) - DO NOT DELETE

---

## Design Rules (Never Violate)

- No em dashes anywhere. Short dashes (-) only.
- Zero branding text on deliverables. No firm name in headers.
- Every tax position cites a specific IRC section or primary authority.
- Never fabricate citations, thresholds, or form numbers.
- Font: Oswald (display), Inter (body), Courier New (mono)
- Colors: coral #F65F5A, ink #111111, paper #FAFAF7, white #FFFFFF
- All tools have "Updated [YEAR]" tag - update every January
- All tools have disclaimer: "...does not constitute legal or tax advice. Consult a qualified tax professional. Maintained by the tk.cpa AI lab. A tk.cpa resource."

---

## Key Decisions Already Made

1. No advertising, no paywall, no account required - ever
2. No "built with AI" disclosures - the credential is what matters
3. "Maintained by the tk.cpa AI lab" - appears in footers and about page
4. Tagline: "Where tax law gets validated."
5. Section names: Tools / Guides / Credentials / About / Resources
6. Tool types: Calculators (number in, number out) vs. Validators (question-answer determination)
7. No IRS audit probability/red flag guides - Circular 230 caution
8. No opinionated content - strictly law-driven, citeable positions only

---

## Owner Context

**Practice:** tk.cpa - boutique international tax, referral-only, HNW individuals, Russian-speaking community  
**Credentials:** NY CPA #109025, FL CPA #AC58472, IRS EA #93250, PTIN P00646638, MST (Baruch/Zicklin), EY + PwC background  
**Standard client links:** https://cpa.inc/ (rate.pdf, join, calendar.pdf, w9.pdf, docs)  
**Founded:** April 2026, after Tax Day  
**Mission:** Free, perpetual public good. Pro bono contribution from the CPA community.

---

## What's Next (Pending Build List)

- W-4 Withholding Optimizer (interactive - IRC §3402)
- PFIC / Form 8621 Checker (IRC §1291-1298)
- Foreign Tax Credit Calculator (Form 1116, IRC §901)
- IRS Penalty & Interest Calculator (IRC §6651, §6654, §6601)
- State Nexus Guide for Remote Workers
- Tax Treaty Navigator (key treaty provisions by country)

---

*Last updated: April 2026. Maintained by the tk.cpa AI lab.*
