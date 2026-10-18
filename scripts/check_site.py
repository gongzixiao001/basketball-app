"""Check project-site paths, language coverage, media provenance and release metadata."""
from pathlib import Path
from html.parser import HTMLParser
import json, re

ROOT = Path(__file__).resolve().parents[1]

class Site(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=set(); self.links=[]; self.assets=[]; self.keys=set()
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if "id" in a:
            assert a["id"] not in self.ids, f"Duplicate ID: {a['id']}"
            self.ids.add(a["id"])
        for key in ["data-i18n","data-i18n-aria","data-i18n-alt"]:
            if key in a:self.keys.add(a[key])
        for key in ["href","src"]:
            value=a.get(key,"")
            if not value:continue
            if value.startswith("#"):self.links.append(value)
            elif not value.startswith(("http:","https:","mailto:","data:")):self.assets.append(value)
            assert not value.startswith("/"), f"Root-relative URL breaks project Pages: {value}"

def main():
    site=Site();site.feed((ROOT/"index.html").read_text(encoding="utf-8"))
    for link in site.links:
        assert link=="#" or link[1:] in site.ids, f"Broken anchor: {link}"
    css=(ROOT/"styles.css").read_text(encoding="utf-8")
    site.assets += re.findall(r"url\(['\"]?([^)'\"]+)",css)
    for item in site.assets:assert (ROOT/item).is_file(),f"Missing asset: {item}"
    translations=json.loads((ROOT/"data/i18n.json").read_text(encoding="utf-8"))
    assert set(translations)=={"zh-CN","zh-TW","en","ja"}
    for locale,strings in translations.items():
        assert set(strings)==set(translations["zh-CN"]),f"Keys differ: {locale}"
        assert site.keys<=strings.keys(),f"HTML translations absent: {locale}"
        assert all(isinstance(s,str) and s.strip() for s in strings.values())
    release=json.loads((ROOT/"data/release.json").read_text(encoding="utf-8"))
    assert release["sizeBytes"]>0 and re.fullmatch("[0-9a-f]{64}",release["sha256"])
    if release["status"]=="published":
        assert release["publishedAt"] and release["apkUrl"].startswith("https://github.com/gongzixiao001/basketball-app/releases/download/")
    else:assert release["apkUrl"] is None and release["publishedAt"] is None
    for item in json.loads((ROOT/"docs/screenshot-sources.json").read_text(encoding="utf-8")):
        assert (ROOT/item["asset"]).is_file()
        assert item["sourceVersion"]=="3.4.7" and "actual running APK" in item["origin"]
    assert "prefers-reduced-motion" in css
    assert "backdrop-filter" in css
    print(f"PASS: {len(site.assets)} asset references, anchors, {len(translations['zh-CN'])} strings x 4 languages, real screenshot inventory and release state")

if __name__=="__main__":main()
