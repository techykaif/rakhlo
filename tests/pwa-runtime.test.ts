import fs from "node:fs";
import path from "node:path";

describe("PWA runtime", () => {
  it("provides a cache-safe offline document fallback", () => {
    const sw = fs.readFileSync(path.join(process.cwd(), "public/sw.js"), "utf8");
    const offline = fs.readFileSync(path.join(process.cwd(), "public/offline.html"), "utf8");

    expect(sw).toContain('const CACHE = "rakhlo-static-v7"');
    expect(sw).toContain('const OFFLINE_URL = "/offline.html"');
    expect(sw).toContain('fetch(request).catch(() =>');
    expect(sw).toContain('caches.match(OFFLINE_URL)');
    expect(sw).toContain('const MAX_IMMUTABLE_ENTRIES = 80');
    expect(sw).toContain('/_next/static/');
    expect(sw).toContain('/notification-badge.svg');
    expect(sw).not.toContain('icon.svg');
    expect(offline).toContain("You’re offline right now.");
    expect(offline).toContain("No account data is cached");
  });
});
