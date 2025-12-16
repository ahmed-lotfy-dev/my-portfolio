import { describe, it, expect, vi } from "vitest"
import { getCertificateSchema } from "../certificateSchema"

vi.mock("next-intl/server", () => ({
    getTranslations: async () => {
        return (key: string) => key
    },
}))

// Helper function to create valid certificate data
const createValidCertificate = (overrides = {}): any => ({
    title: "Certificate Title",
    desc: "Certificate Description",
    courseLink: "https://example.com/course",
    profLink: "https://example.com/professor",
    imageLink: "https://example.com/image.png",
    published: true,
    ...overrides,
})

describe("getCertificateSchema", () => {
    it("accepts valid certificate data", async () => {
        const schema = await getCertificateSchema("en")
        const result = schema.safeParse(createValidCertificate())
        expect(result.success).toBe(true)
    })

    // =========================================
    // TITLE VALIDATION - min 6 characters
    // Boundaries: 5 (fail), 6 (pass)
    // =========================================
    const titleTests = [
        { value: "", shouldPass: false, msg: "title_required" },
        { value: "Title", shouldPass: false, msg: "title_required" }, // 5 chars
        { value: "Title6", shouldPass: true }, // exactly 6 chars
        { value: "AWS Solutions Architect", shouldPass: true },
    ]

    describe("title validation", () => {
        for (const t of titleTests) {
            it(`title='${t.value}' (${t.value.length} chars) → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
                const schema = await getCertificateSchema("en")
                const result = schema.safeParse(createValidCertificate({ title: t.value }))
                expect(result.success).toBe(t.shouldPass)
                if (!t.shouldPass && !result.success) {
                    const messages = result.error.issues.map((i) => i.message)
                    expect(messages).toContain(t.msg)
                }
            })
        }
    })

    // =========================================
    // DESC VALIDATION - min 6 characters
    // Boundaries: 5 (fail), 6 (pass)
    // =========================================
    const descTests = [
        { value: "", shouldPass: false, msg: "desc_required" },
        { value: "Short", shouldPass: false, msg: "desc_required" }, // 5 chars
        { value: "Desc66", shouldPass: true }, // exactly 6 chars
        { value: "A comprehensive course on cloud computing", shouldPass: true },
    ]

    describe("desc validation", () => {
        for (const t of descTests) {
            it(`desc='${t.value.slice(0, 20)}${t.value.length > 20 ? "..." : ""}' (${t.value.length} chars) → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
                const schema = await getCertificateSchema("en")
                const result = schema.safeParse(createValidCertificate({ desc: t.value }))
                expect(result.success).toBe(t.shouldPass)
                if (!t.shouldPass && !result.success) {
                    const messages = result.error.issues.map((i) => i.message)
                    expect(messages).toContain(t.msg)
                }
            })
        }
    })

    // =========================================
    // COURSE LINK VALIDATION - valid URL, min 10 chars
    // =========================================
    const courseLinkTests = [
        { value: "", shouldPass: false, msg: "course_link_required", desc: "empty" },
        { value: "not-a-url", shouldPass: false, msg: "course_link_required", desc: "invalid URL" },
        { value: "http://a", shouldPass: false, msg: "course_link_required", desc: "URL < 10 chars" },
        { value: "https://udemy.com/course", shouldPass: true, desc: "valid URL" },
        { value: "https://www.coursera.org/learn/aws-fundamentals", shouldPass: true, desc: "long valid URL" },
    ]

    describe("courseLink validation", () => {
        for (const t of courseLinkTests) {
            it(`courseLink=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
                const schema = await getCertificateSchema("en")
                const result = schema.safeParse(createValidCertificate({ courseLink: t.value }))
                expect(result.success).toBe(t.shouldPass)
                if (!t.shouldPass && !result.success) {
                    const messages = result.error.issues.map((i) => i.message)
                    expect(messages).toContain(t.msg)
                }
            })
        }
    })

    // =========================================
    // PROF LINK VALIDATION - valid URL, min 10 chars
    // =========================================
    const profLinkTests = [
        { value: "", shouldPass: false, msg: "prof_link_required", desc: "empty" },
        { value: "not-a-url", shouldPass: false, msg: "prof_link_required", desc: "invalid URL" },
        { value: "http://a", shouldPass: false, msg: "prof_link_required", desc: "URL < 10 chars" },
        { value: "https://linkedin.com/professor", shouldPass: true, desc: "valid URL" },
    ]

    describe("profLink validation", () => {
        for (const t of profLinkTests) {
            it(`profLink=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
                const schema = await getCertificateSchema("en")
                const result = schema.safeParse(createValidCertificate({ profLink: t.value }))
                expect(result.success).toBe(t.shouldPass)
                if (!t.shouldPass && !result.success) {
                    const messages = result.error.issues.map((i) => i.message)
                    expect(messages).toContain(t.msg)
                }
            })
        }
    })

    // =========================================
    // IMAGE LINK VALIDATION - valid URL, min 10 chars
    // =========================================
    const imageLinkTests = [
        { value: "", shouldPass: false, msg: "image_link_required", desc: "empty" },
        { value: "not-a-url", shouldPass: false, msg: "image_link_required", desc: "invalid URL" },
        { value: "http://a", shouldPass: false, msg: "image_link_required", desc: "URL < 10 chars" },
        { value: "https://s3.amazonaws.com/cert.png", shouldPass: true, desc: "valid URL" },
    ]

    describe("imageLink validation", () => {
        for (const t of imageLinkTests) {
            it(`imageLink=${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
                const schema = await getCertificateSchema("en")
                const result = schema.safeParse(createValidCertificate({ imageLink: t.value }))
                expect(result.success).toBe(t.shouldPass)
                if (!t.shouldPass && !result.success) {
                    const messages = result.error.issues.map((i) => i.message)
                    expect(messages).toContain(t.msg)
                }
            })
        }
    })

    // =========================================
    // OPTIONAL FIELDS - completedAt, published
    // =========================================
    const optionalFieldTests = [
        { field: "completedAt", value: undefined, shouldPass: true, desc: "completedAt omitted" },
        { field: "completedAt", value: "2025-12-15", shouldPass: true, desc: "completedAt with date" },
        { field: "published", value: undefined, shouldPass: true, expectedDefault: true, desc: "published omitted (defaults to true)" },
        { field: "published", value: true, shouldPass: true, desc: "published=true" },
        { field: "published", value: false, shouldPass: true, desc: "published=false" },
    ]

    describe("optional fields", () => {
        for (const t of optionalFieldTests) {
            it(`${t.desc} → ${t.shouldPass ? "valid" : "invalid"}`, async () => {
                const schema = await getCertificateSchema("en")
                const data = createValidCertificate()

                if (t.value === undefined) {
                    delete data[t.field]
                } else {
                    data[t.field] = t.value
                }

                const result = schema.safeParse(data)
                expect(result.success).toBe(t.shouldPass)

                // Check default value for published
                if (t.shouldPass && result.success && t.expectedDefault !== undefined) {
                    expect(result.data.published).toBe(t.expectedDefault)
                }
            })
        }
    })

    // =========================================
    // REQUIRED FIELDS
    // =========================================
    const requiredFields = ["title", "desc", "courseLink", "profLink", "imageLink"]

    describe("required fields", () => {
        for (const field of requiredFields) {
            it(`should reject certificate with missing ${field}`, async () => {
                const schema = await getCertificateSchema("en")
                const data = createValidCertificate()
                delete data[field]
                const result = schema.safeParse(data)
                expect(result.success).toBe(false)
            })
        }

        it("should reject certificate with all fields missing", async () => {
            const schema = await getCertificateSchema("en")
            const result = schema.safeParse({})
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues.length).toBeGreaterThan(0)
            }
        })
    })
})