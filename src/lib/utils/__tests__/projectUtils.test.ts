import { describe, it, expect } from "vitest";
import { shouldShowApk } from "../projectUtils";

describe("shouldShowApk", () => {
  describe("Edge Cases", () => {
    it("should return false for null, undefined, or empty array", () => {
      expect(shouldShowApk(null)).toBe(false);
      expect(shouldShowApk(undefined)).toBe(false);
      expect(shouldShowApk([])).toBe(false);
    });
  });

  describe("Should Show APK", () => {
    it("should return true for mobile, app, or android categories", () => {
      expect(shouldShowApk(["mobile"])).toBe(true);
      expect(shouldShowApk(["app"])).toBe(true);
      expect(shouldShowApk(["android"])).toBe(true);
    });

    it("should return true for uppercase/mixed case", () => {
      expect(shouldShowApk(["MOBILE"])).toBe(true);
      expect(shouldShowApk(["MoBiLe"])).toBe(true);
      expect(shouldShowApk(["ANDROID"])).toBe(true);
    });

    it("should return true for categories with whitespace", () => {
      expect(shouldShowApk(["  mobile  "])).toBe(true);
      expect(shouldShowApk(["\tandroid\n"])).toBe(true);
    });

    it("should return true for substring matches", () => {
      expect(shouldShowApk(["mobile-app"])).toBe(true);
      expect(shouldShowApk(["android-development"])).toBe(true);
      expect(shouldShowApk(["mobile-application"])).toBe(true);
    });
  });

  describe("Web Exclusion Rule", () => {
    it("should return false for pure web projects", () => {
      expect(shouldShowApk(["web"])).toBe(false);
    });

    it("should return false when both mobile and web are present", () => {
      expect(shouldShowApk(["mobile", "web"])).toBe(false);
      expect(shouldShowApk(["android", "web"])).toBe(false);
      expect(shouldShowApk(["app", "web"])).toBe(false);
    });
  });

  describe("Should NOT Show APK", () => {
    it("should return false for non-mobile categories", () => {
      expect(shouldShowApk(["backend"])).toBe(false);
      expect(shouldShowApk(["desktop"])).toBe(false);
      expect(shouldShowApk(["api"])).toBe(false);
      expect(shouldShowApk(["design", "prototype"])).toBe(false);
    });
  });
});