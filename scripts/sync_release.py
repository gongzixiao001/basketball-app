"""Refresh the static website from a real, published GitHub APK release. Standard library only."""
from pathlib import Path
import datetime, hashlib, json, re, urllib.request

ROOT = Path(__file__).resolve().parents[1]
REPO = "gongzixiao001/basketball-app"
HEADERS = {"User-Agent": "CourtSide-Website", "Accept": "application/vnd.github+json"}

def main():
    request = urllib.request.Request(f"https://api.github.com/repos/{REPO}/releases", headers=HEADERS)
    with urllib.request.urlopen(request, timeout=30) as response:
        releases = json.load(response)
    choices = [(release, asset) for release in releases if not release["draft"] and not release["prerelease"]
               for asset in release["assets"] if asset["name"].lower().endswith(".apk") and asset.get("state") == "uploaded"]
    if not choices:
        print("No published APK. Existing download state is retained; no fabricated URL or date.")
        return
    release, asset = max(choices, key=lambda pair: pair[0]["published_at"])
    url = asset["browser_download_url"]
    if not url.startswith(f"https://github.com/{REPO}/releases/download/"):
        raise RuntimeError("Unexpected APK host or repository")
    digest = asset.get("digest", "")
    if re.fullmatch(r"sha256:[a-f0-9]{64}", digest):
        checksum = digest.split(":", 1)[1]
    else:
        h = hashlib.sha256()
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent":"CourtSide-Website"}), timeout=60) as response:
            for chunk in iter(lambda: response.read(1024 * 1024), b""):
                h.update(chunk)
        checksum = h.hexdigest()
    data = {"repository": REPO, "version": release["tag_name"].removeprefix("v"),
            "status": "published", "apkName": asset["name"], "sizeBytes": asset["size"],
            "sha256": checksum, "publishedAt": release["published_at"], "apkUrl": url,
            "releaseUrl": release["html_url"], "verifiedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "source": "GitHub Releases REST API; uploaded APK asset"}
    target = ROOT / "data/release.json"
    target.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {target.name}: v{data['version']}, {data['sizeBytes']} bytes, {data['publishedAt']}")

if __name__ == "__main__":
    main()
