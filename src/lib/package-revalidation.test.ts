import { describe, expect, test } from "bun:test";
import { getPackageRevalidationPaths } from "./package-revalidation";

describe("getPackageRevalidationPaths", () => {
  test("invalidates public detail and booking pages after a package edit", () => {
    expect(getPackageRevalidationPaths(["cape-courage-vip"])).toEqual([
      "/",
      "/packages",
      "/packages/cape-courage-vip",
      "/booking/cape-courage-vip",
    ]);
  });

  test("invalidates both URLs when an admin changes a package slug", () => {
    expect(getPackageRevalidationPaths(["old-slug", "new-slug"])).toEqual([
      "/",
      "/packages",
      "/packages/old-slug",
      "/booking/old-slug",
      "/packages/new-slug",
      "/booking/new-slug",
    ]);
  });
});
