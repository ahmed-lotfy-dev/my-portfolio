# Schema Testing Patterns & Best Practices

This document outlines the standard patterns we use for testing Zod schemas in this project. Following these patterns ensures consistency, readability, and comprehensive coverage.

## 1. Test File Organization

### Directory Structure
Tests should be located in a `__tests__` directory adjacent to the schema files:

```
src/lib/schemas/
├── contactSchema.ts
└── __tests__/
    └── contactSchema.test.ts
```

### Describe Block Hierarchy
Use a flat structure for fields, and nest only for sub-concerns:

```typescript
// ✅ GOOD PATTERN
describe("getContactSchema", () => { ... }) // Main schema test
describe("name validation", () => { ... })    // Field 1
describe("email validation", () => { ... })   // Field 2
describe("message validation", () => {        // Field 3
  it("checks min length", ...)
  
  describe("links validation", () => { ... }) // Nested sub-concern
})
```

## 2. The Helper Function Pattern

Always create a helper function to generate valid data. This keeps tests DRY and readable.

```typescript
// Helper function to create valid data with overrides
const createValidContact = (overrides = {}): any => ({
  name: "Default Valid Name",
  email: "valid@email.com",
  subject: "Valid Subject",
  message: "Valid message content",
  ...overrides, // Allows overriding specific fields for tests
})

// Usage in tests
it("should reject empty name", async () => {
  const schema = await getContactSchema("en")
  // Only specify what you're testing, everything else is valid
  const result = schema.safeParse(createValidContact({ name: "" }))
  expect(result.success).toBe(false)
})
```

**Note**: Return type `: any` is allowed for the helper to enable testing invalid types (like missing fields) without TypeScript complaints in the test file.

## 3. Essential Test Cases Checklist

For each field in your schema, ensure you test:

### String Fields
- [ ] **Min Length**: `shorter than min` (fail) vs `exactly min` (pass)
- [ ] **Max Length**: `longer than max` (fail) vs `exactly max` (pass)
- [ ] **Empty String**: if required
- [ ] **Missing Field**: `delete data.field` constraint

### Email/URL Fields
- [ ] **Invalid Format**: "not-an-email"
- [ ] **Empty String**
- [ ] **Valid Format**

### Optional Fields
- [ ] **Omitted**: Should pass
- [ ] **Provided**: Should pass with valid value
- [ ] **Default Value**: Check if default is applied when omitted

## 4. Assertion Best Practices

### Checking Failure
Don't just check `toBe(false)`. Also verify the **correct error message key**.

```typescript
// ✅ GOOD
if (!result.success) {
  const messages = result.error.issues.map(i => i.message)
  expect(messages).toContain("name_min") // Check specific error key
}

// ❌ BAD
expect(result.success).toBe(false) // Too vague, could fail for wrong reason
```

### Mocking Dependencies
Mock external dependencies like `next-intl` to keep unit tests isolated:

```typescript
vi.mock("next-intl/server", () => ({
  getTranslations: async () => {
    return (key: string) => key // simply return the key
  },
}))
```

## 5. AAA Pattern (Arrange, Act, Assert)

Structure every test clearly:

```typescript
it("should reject name shorter than 5 characters", async () => {
  // ARRANGE
  const schema = await getContactSchema("en")

  // ACT
  const result = schema.safeParse(createValidContact({ name: "Ahme" }))

  // ASSERT
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(messages).toContain("name_min")
  }
})
```
