import manifest from "../app/manifest";

describe("PWA manifest", () => {
  it("declares installable app metadata and raster icon sizes", () => {
    const value = manifest();

    expect(value.name).toBe("Rakhlo");
    expect(value.short_name).toBe("Rakhlo");
    expect(value.display).toBe("standalone");
    expect(value.start_url).toBe("/");
    expect(value.scope).toBe("/");
    expect(value.orientation).toBe("portrait");

    expect(value.icons).toEqual([
      { src: "/icon1", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
    ]);
  });
});
