import { describe, it, expect, vi } from "vitest"
import { getContactSchema } from "../contactSchema"

vi.mock("next-intl/server", () => ({
  getTranslations: async () => {
    return (key: string) => key
  },
}))

// Helper function to create valid contact data
const createValidContact = (overrides = {}): any => ({
  name: "Ahmed Lotfy",
  email: "ahmed@example.com",
  subject: "Project Inquiry",
  message: "I would like to discuss a potential project with you.",
  ...overrides,
})

describe("getContactSchema", () => {
  it("accepts valid contact data", async () => {
    const schema = await getContactSchema("en")
    const result = schema.safeParse(createValidContact())
    expect(result.success).toBe(true)
  })

  // =========================================
  // NAME VALIDATION - min 5, max 80 characters
  // Boundaries: 4 (fail), 5 (pass), 80 (pass), 81 (fail)
  // =========================================
  const nameTests = [
    { value: "", shouldPass: false, msg: "name_min" },
    { value: "Ahme", shouldPass: false, msg: "name_min" }, // 4 chars
    { value: "Ahmed", shouldPass: true }, // exactly 5 chars
    { value: "Ahmed Lotfy", shouldPass: true }, // normal
    { value: "a".repeat(80), shouldPass: true }, // exactly 80 chars
    { value: "a".repeat(81), shouldPass: false, msg: "name_max" }, // 81 chars
  ]

  describe("name validation", () => {
    for (const t of nameTests) {
      it(`name='${t.value.slice(0, 15)}${t.value.length > 15 ? "..." : ""}' (${t.value.length} chars) → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getContactSchema("en")
        const result = schema.safeParse(createValidContact({ name: t.value }))
        expect(result.success).toBe(t.shouldPass)
        if (!t.shouldPass && !result.success) {
          const messages = result.error.issues.map((i) => i.message)
          expect(messages).toContain(t.msg)
        }
      })
    }
  })

  // =========================================
  // EMAIL VALIDATION - valid email format
  // =========================================
  const emailTests = [
    { value: "", shouldPass: false, desc: "empty" },
    { value: "invalid-email", shouldPass: false, msg: "email_invalid", desc: "no @" },
    { value: "test@", shouldPass: false, msg: "email_invalid", desc: "no domain" },
    { value: "@example.com", shouldPass: false, msg: "email_invalid", desc: "no local part" },
    { value: "ahmed@example.com", shouldPass: true, desc: "valid email" },
    { value: "user.name+tag@example.co.uk", shouldPass: true, desc: "complex valid email" },
  ]

  describe("email validation", () => {
    for (const t of emailTests) {
      it(`email=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getContactSchema("en")
        const result = schema.safeParse(createValidContact({ email: t.value }))
        expect(result.success).toBe(t.shouldPass)
        if (!t.shouldPass && !result.success && t.msg) {
          const messages = result.error.issues.map((i) => i.message)
          expect(messages).toContain(t.msg)
        }
      })
    }
  })

  // =========================================
  // SUBJECT VALIDATION - min 6 characters
  // Boundaries: 5 (fail), 6 (pass)
  // =========================================
  const subjectTests = [
    { value: "", shouldPass: false, msg: "subject_min" },
    { value: "Short", shouldPass: false, msg: "subject_min" }, // 5 chars
    { value: "Subj66", shouldPass: true }, // exactly 6 chars
    { value: "Project Inquiry About Website", shouldPass: true },
  ]

  describe("subject validation", () => {
    for (const t of subjectTests) {
      it(`subject='${t.value.slice(0, 20)}${t.value.length > 20 ? "..." : ""}' (${t.value.length} chars) → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getContactSchema("en")
        const result = schema.safeParse(createValidContact({ subject: t.value }))
        expect(result.success).toBe(t.shouldPass)
        if (!t.shouldPass && !result.success) {
          const messages = result.error.issues.map((i) => i.message)
          expect(messages).toContain(t.msg)
        }
      })
    }
  })

  // =========================================
  // MESSAGE VALIDATION - min 10 chars + no links
  // Boundaries: 9 (fail), 10 (pass)
  // Special: http/https/ftp links rejected
  // =========================================
  const messageTests = [
    { value: "", shouldPass: false, msg: "message_min", desc: "empty" },
    { value: "Too short", shouldPass: false, msg: "message_min", desc: "9 chars" },
    { value: "Ten chars.", shouldPass: true, desc: "exactly 10 chars" },
    { value: "This is a valid message without any links.", shouldPass: true, desc: "normal message" },
    { value: "Check this https://evil.com link", shouldPass: false, msg: "message_links", desc: "https link" },
    { value: "Check this http://evil.com link", shouldPass: false, msg: "message_links", desc: "http link" },
    { value: "Check this ftp://evil.com link", shouldPass: false, msg: "message_links", desc: "ftp link" },
    { value: "Visit example.com for more info", shouldPass: true, desc: "domain without protocol" },
  ]

  describe("message validation", () => {
    for (const t of messageTests) {
      it(`message=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
        const schema = await getContactSchema("en")
        const result = schema.safeParse(createValidContact({ message: t.value }))
        expect(result.success).toBe(t.shouldPass)
        if (!t.shouldPass && !result.success) {
          const messages = result.error.issues.map((i) => i.message)
          expect(messages).toContain(t.msg)
        }
      })
    }
  })

  // =========================================
  // REQUIRED FIELDS
  // =========================================
  const requiredFields = ["name", "email", "subject", "message"]

  describe("required fields", () => {
    for (const field of requiredFields) {
      it(`should reject contact with missing ${field}`, async () => {
        const schema = await getContactSchema("en")
        const data = createValidContact()
        delete data[field]
        const result = schema.safeParse(data)
        expect(result.success).toBe(false)
      })
    }

    it("should reject contact with all fields missing", async () => {
      const schema = await getContactSchema("en")
      const result = schema.safeParse({})
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    })
  })
})