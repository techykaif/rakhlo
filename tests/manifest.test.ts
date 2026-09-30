import manifest from "../app/manifest";

describe("PWA manifest", () => {
  it("declares the Rakhlo install metadata", () => {
    const value = manifest();

    expect(value.name).toBe("Rakhlo");
    expect(value.short_name).toBe("Rakhlo");
    expect(value.display).toBe("standalone");
    expect(value.start_url).toBe("/");
    expect(value.icons?.length).toBeGreaterThan(0);
  });
});
