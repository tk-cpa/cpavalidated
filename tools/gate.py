#!/usr/bin/env python3
"""cpavalidated pre-push quality gate. No page ships unless every check passes.
Usage: python3 tools/gate.py PAGE.html [--template SIBLING.html]
Checks: 1 structural parity (landmark order + div-depth vs template)
        2 class coverage (every used class defined in page CSS or toggled by page JS)
        3 span-row spacing (label/value rows must have a horizontal-separation rule)
        4 string audit (em-dash variants, forbidden strings, last name)
        5 disclaimer + canonical presence
Exit 0 = pass. Exit 1 = blocked, reasons printed. Built June 10, 2026 after two
user-caught rendering defects. Standing rule (register PROC-001): gate the exact
bytes about to be pushed, fetched fresh - never a cached copy."""
import re, sys

FORBIDDEN = ['109025', 'AC58472', 'P00646638', '93250']
EMDASH = ['\u2014', '&mdash;', '&#8212;']
JS_STATE_WHITELIST = {'unsel', 'fc', 'q-ctrl', 'sort-arrow'}
LANDMARKS = ['class="phi"', 'class="back"', 'class="article"', 'class="related"', 'class="source-row"']

def depth_at(c, marker):
    i = c.find(marker)
    if i < 0:
        return None
    d = 0
    for m in re.finditer(r'<div\b|</div>', c[:i]):
        d += 1 if m.group(0) == '<div' else -1
    return d

def defined_classes(c):
    out = set()
    for sm in re.finditer(r'<style[^>]*>(.*?)</style>', c, re.S):
        out |= set(re.findall(r'\.([a-zA-Z0-9_-]+)(?=[^a-zA-Z0-9_-]|$)', sm.group(1)))
    for sc in re.finditer(r'<script[^>]*>(.*?)</script>', c, re.S):
        out |= set(re.findall(r'classList\.(?:add|toggle|remove)\([\'"]([a-zA-Z0-9_-]+)', sc.group(1)))
    return out

def used_classes(c):
    body = re.sub(r'<style[^>]*>.*?</style>|<script[^>]*>.*?</script>', '', c, flags=re.S)
    return {x for grp in re.findall(r'class="([a-zA-Z0-9 _-]+)"', body) for x in grp.split()}

def run(page_path, template_path=None):
    page = open(page_path).read()
    errors = []
    if template_path:
        sib = open(template_path).read()
        order = [page.find(L) for L in LANDMARKS]
        if any(o < 0 for o in order) or order != sorted(order):
            errors.append('GATE1 structural: landmark order broken or landmark missing')
        for L in LANDMARKS:
            if depth_at(page, L) != depth_at(sib, L):
                errors.append('GATE1 structural: div depth at ' + L + ' differs from template')
    used, defined = used_classes(page), defined_classes(page)
    gaps = sorted(x for x in used if x not in defined and x not in JS_STATE_WHITELIST)
    if gaps:
        errors.append('GATE2 coverage: classes used but undefined: ' + str(gaps))
    body = re.sub(r'<style[^>]*>.*?</style>|<script[^>]*>.*?</script>', '', page, flags=re.S)
    css_all = ' '.join(s.group(1) for s in re.finditer(r'<style[^>]*>(.*?)</style>', page, re.S))
    for m in re.finditer(r'<div class="([a-zA-Z0-9_-]+)"[^>]*>\s*<span[^>]*>[^<]*</span><span', body):
        cls = m.group(1)
        bodies = ' '.join(re.findall(r'\.' + re.escape(cls) + r'[^{,]*\{([^}]*)\}', css_all))
        if not re.search(r'display\s*:\s*(flex|grid|table|inline-block)|justify-content|column-gap', bodies):
            errors.append('GATE3 spacing: .' + cls + ' rows lack a horizontal-separation rule (run-together text)')
    for p in EMDASH:
        if p in page:
            errors.append('GATE4 strings: em-dash variant present: ' + repr(p))
    for p in FORBIDDEN:
        if p in page:
            errors.append('GATE4 strings: forbidden string present: ' + p)
    if 'Knyazev' in page:
        errors.append('GATE4 strings: last name present')
    if 'disclaimer.html' not in page and 'about.html' not in page_path:
        errors.append('GATE5 page: disclaimer link missing')
    if 'rel="canonical"' not in page:
        errors.append('GATE5 page: canonical missing')
    return errors

if __name__ == '__main__':
    args = sys.argv[1:]
    tpl = None
    if '--template' in args:
        i = args.index('--template')
        tpl = args[i + 1]
        args = args[:i] + args[i + 2:]
    errs = run(args[0], tpl)
    if errs:
        print('BLOCKED:')
        for e in errs:
            print(' -', e)
        sys.exit(1)
    print('PASS: all gates clean for', args[0])
    sys.exit(0)
