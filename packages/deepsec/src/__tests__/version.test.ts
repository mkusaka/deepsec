import fs from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("fork package resolution", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("uses the local checkout for development", async () => {
    const { getDeepsecWorkspaceDependency } = await import("../version.js");
    expect(getDeepsecWorkspaceDependency()).toMatch(/^file:.*\/packages\/deepsec$/);
  });

  it("pins the fork under the deepsec alias for published installs", async () => {
    const existsSync = fs.existsSync;
    vi.spyOn(fs, "existsSync").mockImplementation((file) =>
      String(file).endsWith("/src/cli.ts") ? false : existsSync(file),
    );
    const { getDeepsecVersion, getDeepsecWorkspaceDependency } = await import("../version.js");
    expect(getDeepsecWorkspaceDependency()).toBe(`npm:@mkusaka/deepsec@${getDeepsecVersion()}`);
  });
});
