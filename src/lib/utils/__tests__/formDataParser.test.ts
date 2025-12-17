import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { parseBoolean, parseCategories, parseImageArray } from "../formDataParser";
import { logger } from "@/src/lib/utils/logger";

vi.mock("@/src/lib/utils/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe("parseBoolean", () => {
  it("returns default if field is missing", () => {
    const data = new FormData();
    expect(parseBoolean(data, "active", true)).toBe(true);
    expect(parseBoolean(data, "active", false)).toBe(false);
  });

  it("returns true for 'true' string", () => {
    const data = new FormData();
    data.set("active", "true");
    expect(parseBoolean(data, "active")).toBe(true);
  });

  it("returns false for 'false' string", () => {
    const data = new FormData();
    data.set("active", "false");
    expect(parseBoolean(data, "active")).toBe(false);
  });

  it("returns default for non-string values", () => {
    const data = new FormData();
    data.append("active", new Blob());
    expect(parseBoolean(data, "active", true)).toBe(true);
  });
});

describe("parseCategories", () => {
  it("returns empty array if field is missing", () => {
    const data = new FormData();
    expect(parseCategories(data)).toEqual([]);
  });

  it("splits comma-separated string", () => {
    const data = new FormData();
    data.set("categories", "a,b,c");
    expect(parseCategories(data)).toEqual(["a", "b", "c"]);
  });

  it("trims whitespace and ignores empty categories", () => {
    const data = new FormData();
    data.set("categories", " a , , b ,c ");
    expect(parseCategories(data)).toEqual(["a", "b", "c"]);
  });
});

describe("parseImageArray", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns valid array from JSON string", () => {
    const data = new FormData();
    data.append("images", '["img1.png","img2.png"]');
    expect(parseImageArray(data)).toEqual(["img1.png", "img2.png"]);
  });

  it("returns empty array if no valid JSON", () => {
    const data = new FormData();
    data.append("images", "not-json");
    expect(parseImageArray(data)).toEqual([]);
    expect(logger.debug).toHaveBeenCalled();
  });

  it("picks first valid array and ignores invalid entries", () => {
    const data = new FormData();
    data.append("images", "invalid");
    data.append("images", '["valid.png"]');
    expect(parseImageArray(data)).toEqual(["valid.png"]);
  });

  it("ignores File objects in FormData", () => {
    const data = new FormData();
    data.append("images", new File([""], "file.png"));
    expect(parseImageArray(data)).toEqual([]);
  });
});
