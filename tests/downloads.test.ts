import { describe, expect, test } from "bun:test";
import { formatSize, pickDownloads } from "@/lib/downloads";

const asset = (name: string, size = 1024 * 1024) => ({ name, url: `https://x/${name}`, size });

describe("pickDownloads", () => {
  test("prefers the Qt desktop builds over the Tauri ones", () => {
    const d = pickDownloads([
      asset("SerikaCord_2.0.0_x64-setup.exe"),
      asset("SerikaCord-2.0.0-qt-windows.zip"),
      asset("SerikaCord_2.0.0_aarch64.dmg"),
      asset("SerikaCord-2.0.0-qt.dmg"),
      asset("SerikaCord_2.0.0_amd64.AppImage"),
      asset("SerikaCord-2.0.0-qt.AppImage"),
      asset("serikacord-qt_2.0.0_amd64.deb"),
      asset("SerikaCord_2.0.0_amd64.deb"),
      asset("SerikaCord-v2.0.0.apk"),
    ]);
    expect(d.mac.map((f) => f.name)).toEqual(["SerikaCord-2.0.0-qt.dmg"]);
    expect(d.linux.map((f) => f.name)).toEqual(["SerikaCord-2.0.0-qt.AppImage", "serikacord-qt_2.0.0_amd64.deb"]);
    expect(d.android[0].name).toBe("SerikaCord-v2.0.0.apk");
    expect(d.windows.map((f) => f.label)).toEqual(["Installer", ".zip"]);
  });

  test("falls back to the Tauri files and skips signatures and manifests", () => {
    const d = pickDownloads([
      asset("latest.json"),
      asset("SerikaCord_2.0.0_x64-setup.exe.sig"),
      asset("SerikaCord_2.0.0_x64-setup.exe"),
      asset("SerikaCord_2.0.0_x64_en-US.msi"),
      asset("SerikaCord.app.tar.gz"),
      asset("SerikaCord_2.0.0_amd64.AppImage.asc"),
      asset("SerikaCord_2.0.0_amd64.AppImage"),
      asset("SerikaCord-2.0.0-1.x86_64.rpm"),
    ]);
    expect(d.windows.map((f) => f.name)).toEqual(["SerikaCord_2.0.0_x64-setup.exe", "SerikaCord_2.0.0_x64_en-US.msi"]);
    expect(d.linux.map((f) => f.label)).toEqual(["AppImage", ".rpm"]);
    expect(d.mac).toEqual([]);
  });
});

describe("formatSize", () => {
  test("formats megabytes", () => {
    expect(formatSize(5 * 1024 * 1024)).toBe("5.0 MB");
    expect(formatSize(150 * 1024 * 1024)).toBe("150 MB");
    expect(formatSize(0)).toBe("");
  });
});
