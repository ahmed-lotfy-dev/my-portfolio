import { describe, it, expect, vi } from "vitest"
import { getProjectSchema } from "../projectSchema"

vi.mock("next-intl/server", () => ({
  getTranslations: async () => {
    return (key: string) => key
  },
}))

// Helper function to create valid project data
const createValidProject = (overrides = {}): any => ({
  title_en: "Project Title Here",
  title_ar: "عنوان المشروع",
  desc_en: "Project Description Here that is long enough",
  desc_ar: "وصف المشروع بالعربية",
  slug: "project-title-here",
  content_en: "Project Content Here",
  content_ar: "محتوى المشروع",
  repoLink: "https://github.com/username/project",
  liveLink: "https://project.com",
  coverImage: "https://example.com/image1.jpg",
  images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  categories: ["category1", "category2"],
  ...overrides,
})

describe("getProjectSchema", () => {
  it("accepts valid project data", async () => {
    const schema = await getProjectSchema("en")
    const result = schema.safeParse(createValidProject())
    expect(result.success).toBe(true)
  })

  // =========================================
  // TITLE_EN VALIDATION - min 3 characters (required)
  // Boundaries: 2 (fail), 3 (pass)
  // =========================================
  const titleEnTests = [
    { value: "", shouldPass: false, msg: "title_en_required" },
    { value: "AB", shouldPass: false, msg: "title_en_required" }, // 2 chars
    { value: "ABC", shouldPass: true }, // exactly 3 chars
    { value: "A Valid Project Title", shouldPass: true },
  ]

  describe("title_en validation", () => {
    for (const t of titleEnTests) {
      it(`title_en='${t.value}' (${t.value.length} chars) → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getProjectSchema("en")
        const result = schema.safeParse(createValidProject({ title_en: t.value }))
        expect(result.success).toBe(t.shouldPass)
        if (!t.shouldPass && !result.success) {
          const messages = result.error.issues.map((i) => i.message)
          expect(messages).toContain(t.msg)
        }
      })
    }
  })

  // =========================================
  // TITLE_AR VALIDATION - optional string
  // =========================================
  const titleArTests = [
    { value: undefined, shouldPass: true, desc: "omitted" },
    { value: "", shouldPass: true, desc: "empty string" },
    { value: "عنوان المشروع", shouldPass: true, desc: "Arabic title" },
    { value: "English Title", shouldPass: true, desc: "English string" },
  ]

  describe("title_ar validation", () => {
    for (const t of titleArTests) {
      it(`title_ar=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getProjectSchema("en")
        const data = createValidProject()
        if (t.value === undefined) {
          delete data.title_ar
        } else {
          data.title_ar = t.value
        }
        const result = schema.safeParse(data)
        expect(result.success).toBe(t.shouldPass)
      })
    }
  })

  // =========================================
  // DESC_EN VALIDATION - min 10 characters (required)
  // Boundaries: 9 (fail), 10 (pass)
  // =========================================
  const descEnTests = [
    { value: "", shouldPass: false, msg: "desc_en_required" },
    { value: "Too short", shouldPass: false, msg: "desc_en_required" }, // 9 chars
    { value: "Ten chars.", shouldPass: true }, // exactly 10 chars
    { value: "A comprehensive project description", shouldPass: true },
  ]

  describe("desc_en validation", () => {
    for (const t of descEnTests) {
      it(`desc_en='${t.value.slice(0, 15)}${t.value.length > 15 ? "..." : ""}' (${t.value.length} chars) → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getProjectSchema("en")
        const result = schema.safeParse(createValidProject({ desc_en: t.value }))
        expect(result.success).toBe(t.shouldPass)
        if (!t.shouldPass && !result.success) {
          const messages = result.error.issues.map((i) => i.message)
          expect(messages).toContain(t.msg)
        }
      })
    }
  })

  // =========================================
  // DESC_AR VALIDATION - optional string
  // =========================================
  const descArTests = [
    { value: undefined, shouldPass: true, desc: "omitted" },
    { value: "", shouldPass: true, desc: "empty string" },
    { value: "وصف المشروع بالعربية", shouldPass: true, desc: "Arabic description" },
  ]

  describe("desc_ar validation", () => {
    for (const t of descArTests) {
      it(`desc_ar=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getProjectSchema("en")
        const data = createValidProject()
        if (t.value === undefined) {
          delete data.desc_ar
        } else {
          data.desc_ar = t.value
        }
        const result = schema.safeParse(data)
        expect(result.success).toBe(t.shouldPass)
      })
    }
  })

  // =========================================
  // SLUG VALIDATION - min 3 chars, optional, or empty string
  // =========================================
  const slugTests = [
    { value: undefined, shouldPass: true, desc: "omitted" },
    { value: "", shouldPass: true, desc: "empty string" },
    { value: "ab", shouldPass: false, desc: "2 chars (below min)" },
    { value: "abc", shouldPass: true, desc: "exactly 3 chars" },
    { value: "my-project-slug", shouldPass: true, desc: "valid slug" },
  ]

  describe("slug validation", () => {
    for (const t of slugTests) {
      it(`slug=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getProjectSchema("en")
        const data = createValidProject()
        if (t.value === undefined) {
          delete data.slug
        } else {
          data.slug = t.value
        }
        const result = schema.safeParse(data)
        expect(result.success).toBe(t.shouldPass)
      })
    }
  })

  // =========================================
  // CONTENT_EN & CONTENT_AR - optional strings
  // =========================================
  const contentTests = [
    { field: "content_en", value: undefined, shouldPass: true, desc: "content_en omitted" },
    { field: "content_en", value: "", shouldPass: true, desc: "content_en empty" },
    { field: "content_en", value: "# Project README\n\nThis is markdown content.", shouldPass: true, desc: "content_en with markdown" },
    { field: "content_ar", value: undefined, shouldPass: true, desc: "content_ar omitted" },
    { field: "content_ar", value: "", shouldPass: true, desc: "content_ar empty" },
    { field: "content_ar", value: "محتوى المشروع بالعربية", shouldPass: true, desc: "content_ar with Arabic" },
  ]

  describe("content validation", () => {
    for (const t of contentTests) {
      it(`${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getProjectSchema("en")
        const data = createValidProject()
        if (t.value === undefined) {
          delete data[t.field]
        } else {
          data[t.field] = t.value
        }
        const result = schema.safeParse(data)
        expect(result.success).toBe(t.shouldPass)
      })
    }
  })

  // =========================================
  // REPO LINK VALIDATION - valid URL (required)
  // =========================================
  const repoLinkTests = [
    { value: "", shouldPass: false, msg: "repo_link_invalid", desc: "empty" },
    { value: "not-a-url", shouldPass: false, msg: "repo_link_invalid", desc: "invalid URL" },
    { value: "https://github.com/user/repo", shouldPass: true, desc: "GitHub URL" },
    { value: "https://gitlab.com/user/repo", shouldPass: true, desc: "GitLab URL" },
  ]

  describe("repoLink validation", () => {
    for (const t of repoLinkTests) {
      it(`repoLink=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getProjectSchema("en")
        const result = schema.safeParse(createValidProject({ repoLink: t.value }))
        expect(result.success).toBe(t.shouldPass)
        if (!t.shouldPass && !result.success) {
          const messages = result.error.issues.map((i) => i.message)
          expect(messages).toContain(t.msg)
        }
      })
    }
  })

  // =========================================
  // LIVE LINK VALIDATION - valid URL (required)
  // =========================================
  const liveLinkTests = [
    { value: "", shouldPass: false, msg: "live_link_invalid", desc: "empty" },
    { value: "not-a-url", shouldPass: false, msg: "live_link_invalid", desc: "invalid URL" },
    { value: "https://myproject.com", shouldPass: true, desc: "production URL" },
    { value: "https://my-project.vercel.app", shouldPass: true, desc: "Vercel URL" },
  ]

  describe("liveLink validation", () => {
    for (const t of liveLinkTests) {
      it(`liveLink=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getProjectSchema("en")
        const result = schema.safeParse(createValidProject({ liveLink: t.value }))
        expect(result.success).toBe(t.shouldPass)
        if (!t.shouldPass && !result.success) {
          const messages = result.error.issues.map((i) => i.message)
          expect(messages).toContain(t.msg)
        }
      })
    }
  })

  // =========================================
  // COVER IMAGE VALIDATION - valid URL, optional, or empty
  // Must be included in images array if provided
  // =========================================
  const coverImageTests = [
    { value: undefined, shouldPass: true, desc: "omitted" },
    { value: "", shouldPass: true, desc: "empty string" },
    { value: "not-a-url", shouldPass: false, msg: "image_link_required", desc: "invalid URL" },
    { value: "https://example.com/image1.jpg", shouldPass: true, desc: "valid URL in images array" },
  ]

  describe("coverImage validation", () => {
    for (const t of coverImageTests) {
      it(`coverImage=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getProjectSchema("en")
        const data = createValidProject()
        if (t.value === undefined) {
          delete data.coverImage
        } else {
          data.coverImage = t.value
        }
        const result = schema.safeParse(data)
        expect(result.success).toBe(t.shouldPass)
        if (!t.shouldPass && !result.success && t.msg) {
          const messages = result.error.issues.map((i) => i.message)
          expect(messages).toContain(t.msg)
        }
      })
    }

    it("should reject coverImage not in images array", async () => {
      const schema = await getProjectSchema("en")
      const result = schema.safeParse(
        createValidProject({
          coverImage: "https://example.com/different-image.jpg",
          images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
        })
      )
      expect(result.success).toBe(false)
      if (!result.success) {
        const messages = result.error.issues.map((i) => i.message)
        expect(messages).toContain("Cover image must be one of the project images")
      }
    })
  })

  // =========================================
  // IMAGES VALIDATION - string array, optional, defaults to []
  // =========================================
  const imagesTests = [
    { value: undefined, shouldPass: true, expectedDefault: [], desc: "omitted (defaults to [])" },
    { value: [], shouldPass: true, desc: "empty array" },
    { value: ["https://example.com/img1.jpg"], shouldPass: true, desc: "single image" },
    { value: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"], shouldPass: true, desc: "multiple images" },
  ]

  describe("images validation", () => {
    for (const t of imagesTests) {
      it(`images=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getProjectSchema("en")
        const data = createValidProject({ coverImage: "" }) // Clear coverImage to avoid refine check
        if (t.value === undefined) {
          delete data.images
        } else {
          data.images = t.value
        }
        const result = schema.safeParse(data)
        expect(result.success).toBe(t.shouldPass)
        if (t.shouldPass && result.success && t.expectedDefault !== undefined) {
          expect(result.data.images).toEqual(t.expectedDefault)
        }
      })
    }
  })

  // =========================================
  // CATEGORIES VALIDATION - string array, optional, defaults to []
  // =========================================
  const categoriesTests = [
    { value: undefined, shouldPass: true, expectedDefault: [], desc: "omitted (defaults to [])" },
    { value: [], shouldPass: true, desc: "empty array" },
    { value: ["web"], shouldPass: true, desc: "single category" },
    { value: ["web", "react", "typescript"], shouldPass: true, desc: "multiple categories" },
  ]

  describe("categories validation", () => {
    for (const t of categoriesTests) {
      it(`categories=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getProjectSchema("en")
        const data = createValidProject()
        if (t.value === undefined) {
          delete data.categories
        } else {
          data.categories = t.value
        }
        const result = schema.safeParse(data)
        expect(result.success).toBe(t.shouldPass)
        if (t.shouldPass && result.success && t.expectedDefault !== undefined) {
          expect(result.data.categories).toEqual(t.expectedDefault)
        }
      })
    }
  })

  // =========================================
  // REQUIRED FIELDS
  // =========================================
  const requiredFields = ["title_en", "desc_en", "repoLink", "liveLink"]

  describe("required fields", () => {
    for (const field of requiredFields) {
      it(`should reject project with missing ${field}`, async () => {
        const schema = await getProjectSchema("en")
        const data = createValidProject()
        delete data[field]
        const result = schema.safeParse(data)
        expect(result.success).toBe(false)
      })
    }

    it("should reject project with all fields missing", async () => {
      const schema = await getProjectSchema("en")
      const result = schema.safeParse({})
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })
  })

  // =========================================
  // OPTIONAL FIELDS - should accept when omitted
  // =========================================
  const optionalFields = ["title_ar", "desc_ar", "slug", "content_en", "content_ar", "coverImage", "images", "categories"]

  describe("optional fields", () => {
    it("should accept project with all optional fields omitted", async () => {
      const schema = await getProjectSchema("en")
      const data = {
        title_en: "Project Title",
        desc_en: "Project Description Here",
        repoLink: "https://github.com/user/repo",
        liveLink: "https://project.com",
      }
      const result = schema.safeParse(data)
      expect(result.success).toBe(true)
    })

    for (const field of optionalFields) {
      it(`should accept project with ${field} omitted`, async () => {
        const schema = await getProjectSchema("en")
        const data = createValidProject({ coverImage: "" }) // Clear coverImage to avoid refine
        delete data[field]
        const result = schema.safeParse(data)
        expect(result.success).toBe(true)
      })
    }
  })
})
