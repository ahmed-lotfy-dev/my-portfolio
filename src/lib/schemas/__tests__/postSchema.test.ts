import { describe, it, expect } from "vitest"
import { postSchema } from "../postSchema"

// Helper function to create valid post data
const createValidPost = (overrides = {}): any => ({
  title: "Post Title Here",
  content: "Post Content Description",
  slug: "post-title-here",
  imageLink: "https://example.com/image.jpg",
  postCategories: ["category1", "category2"],
  published: true,
  ...overrides,
})

describe("postSchema", () => {
  // =========================================
  // TITLE VALIDATION - min 5 characters
  // Think: What are ALL the boundary cases?
  // - Below minimum (4 chars) → fail
  // - Exactly minimum (5 chars) → pass
  // - Above minimum → pass
  // - Empty → fail
  // =========================================
  const titleTests = [
    { value: "", shouldPass: false, msg: "Post title required and minimum 5 character" },
    { value: "Test", shouldPass: false, msg: "Post title required and minimum 5 character" }, // 4 chars
    { value: "Titl5", shouldPass: true }, // exactly 5 chars - boundary
    { value: "A Valid Post Title", shouldPass: true }, // normal case
  ]

  describe("title validation", () => {
    for (const t of titleTests) {
      it(`title='${t.value.slice(0, 20)}${t.value.length > 20 ? "..." : ""}' (${t.value.length} chars) → ${t.shouldPass ? "valid" : "invalid"}`, () => {
        const result = postSchema.safeParse(createValidPost({ title: t.value }))
        expect(result.success).toBe(t.shouldPass)
        if (!t.shouldPass && !result.success) {
          const messages = result.error.issues.map((i) => i.message)
          expect(messages).toContain(t.msg)
        }
      })
    }
  })

  // =========================================
  // CONTENT VALIDATION - min 6 characters
  // Think: What are ALL the boundary cases?
  // - Below minimum (5 chars) → fail
  // - Exactly minimum (6 chars) → pass
  // - Above minimum → pass
  // - Empty → fail
  // =========================================
  const contentTests = [
    { value: "", shouldPass: false, msg: "Post description is required and minimum 50 character" },
    { value: "Short", shouldPass: false, msg: "Post description is required and minimum 50 character" }, // 5 chars
    { value: "Cont66", shouldPass: true }, // exactly 6 chars - boundary
    { value: "This is valid content that passes validation", shouldPass: true },
  ]

  describe("content validation", () => {
    for (const t of contentTests) {
      it(`content='${t.value.slice(0, 20)}${t.value.length > 20 ? "..." : ""}' (${t.value.length} chars) → ${t.shouldPass ? "valid" : "invalid"}`, () => {
        const result = postSchema.safeParse(createValidPost({ content: t.value }))
        expect(result.success).toBe(t.shouldPass)
        if (!t.shouldPass && !result.success) {
          const messages = result.error.issues.map((i) => i.message)
          expect(messages).toContain(t.msg)
        }
      })
    }
  })

  // =========================================
  // SLUG VALIDATION - just a string, no constraints
  // =========================================
  const slugTests = [
    { value: "", shouldPass: true },
    { value: "my-post-slug", shouldPass: true },
    { value: "post-slug-2024", shouldPass: true },
  ]

  describe("slug validation", () => {
    for (const t of slugTests) {
      it(`slug='${t.value}' → ${t.shouldPass ? "valid" : "invalid"}`, () => {
        const result = postSchema.safeParse(createValidPost({ slug: t.value }))
        expect(result.success).toBe(t.shouldPass)
      })
    }
  })

  // =========================================
  // IMAGE LINK VALIDATION - just a string
  // =========================================
  const imageLinkTests = [
    { value: "", shouldPass: true },
    { value: "https://example.com/image.png", shouldPass: true },
    { value: "https://cdn.example.com/uploads/post-cover.jpg", shouldPass: true },
  ]

  describe("imageLink validation", () => {
    for (const t of imageLinkTests) {
      it(`imageLink='${t.value.slice(0, 30)}${t.value.length > 30 ? "..." : ""}' → ${t.shouldPass ? "valid" : "invalid"}`, () => {
        const result = postSchema.safeParse(createValidPost({ imageLink: t.value }))
        expect(result.success).toBe(t.shouldPass)
      })
    }
  })

  // =========================================
  // POST CATEGORIES VALIDATION - string array
  // Think: What are the cases for arrays?
  // - Empty array → pass (allowed)
  // - Single item → pass
  // - Multiple items → pass
  // - Non-array → fail
  // - Array with wrong types → fail
  // =========================================
  const postCategoriesTests = [
    { value: [], shouldPass: true, desc: "empty array" },
    { value: ["single"], shouldPass: true, desc: "single category" },
    { value: ["tech", "programming", "web"], shouldPass: true, desc: "multiple categories" },
    { value: "not-an-array", shouldPass: false, desc: "string instead of array" },
    { value: [123, 456], shouldPass: false, desc: "array with numbers" },
    { value: [null], shouldPass: false, desc: "array with null" },
  ]

  describe("postCategories validation", () => {
    for (const t of postCategoriesTests) {
      it(`postCategories=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, () => {
        const result = postSchema.safeParse(createValidPost({ postCategories: t.value }))
        expect(result.success).toBe(t.shouldPass)
      })
    }
  })

  // =========================================
  // PUBLISHED VALIDATION - boolean
  // Think: What values could someone pass?
  // - true → pass
  // - false → pass
  // - "true" string → fail
  // - 1 → fail
  // =========================================
  const publishedTests = [
    { value: true, shouldPass: true, desc: "true" },
    { value: false, shouldPass: true, desc: "false" },
    { value: "true", shouldPass: false, desc: "string 'true'" },
    { value: 1, shouldPass: false, desc: "number 1" },
    { value: 0, shouldPass: false, desc: "number 0" },
  ]

  describe("published validation", () => {
    for (const t of publishedTests) {
      it(`published=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, () => {
        const result = postSchema.safeParse(createValidPost({ published: t.value }))
        expect(result.success).toBe(t.shouldPass)
      })
    }
  })

  // =========================================
  // REQUIRED FIELDS - all fields are required
  // Think: What happens when each field is missing?
  // =========================================
  const requiredFields = ["title", "content", "slug", "imageLink", "postCategories", "published"]

  describe("required fields", () => {
    for (const field of requiredFields) {
      it(`should reject post with missing ${field}`, () => {
        const data = createValidPost()
        delete data[field]

        const result = postSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    }

    it("should reject post with all fields missing", () => {
      const result = postSchema.safeParse({})

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })
  })
})