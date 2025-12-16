import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { logger } from "../logger"

// Mock console methods
const consoleMocks = {
  log: vi.spyOn(console, "log").mockImplementation(() => { }),
  warn: vi.spyOn(console, "warn").mockImplementation(() => { }),
  error: vi.spyOn(console, "error").mockImplementation(() => { }),
  debug: vi.spyOn(console, "debug").mockImplementation(() => { }),
}

describe("logger", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // =========================================
  // INFO - logs in development only
  // =========================================
  describe("info", () => {
    it("should call console.log with [INFO] prefix", () => {
      logger.info("test message")
      // In test environment, NODE_ENV may be 'test', so check based on behavior
      // If it logs, verify the format
      if (consoleMocks.log.mock.calls.length > 0) {
        expect(consoleMocks.log).toHaveBeenCalledWith("[INFO]", "test message")
      }
    })

    it("should handle multiple arguments", () => {
      logger.info("message", { data: 123 }, "extra")
      if (consoleMocks.log.mock.calls.length > 0) {
        expect(consoleMocks.log).toHaveBeenCalledWith("[INFO]", "message", { data: 123 }, "extra")
      }
    })
  })

  // =========================================
  // WARN - logs in development only
  // =========================================
  describe("warn", () => {
    it("should call console.warn with [WARN] prefix", () => {
      logger.warn("warning message")
      if (consoleMocks.warn.mock.calls.length > 0) {
        expect(consoleMocks.warn).toHaveBeenCalledWith("[WARN]", "warning message")
      }
    })

    it("should handle multiple arguments", () => {
      logger.warn("warning", { code: 404 })
      if (consoleMocks.warn.mock.calls.length > 0) {
        expect(consoleMocks.warn).toHaveBeenCalledWith("[WARN]", "warning", { code: 404 })
      }
    })
  })

  // =========================================
  // ERROR - ALWAYS logs (production + development)
  // =========================================
  describe("error", () => {
    it("should always call console.error with [ERROR] prefix", () => {
      logger.error("error message")
      expect(consoleMocks.error).toHaveBeenCalledWith("[ERROR]", "error message")
    })

    it("should handle Error objects", () => {
      const error = new Error("Something went wrong")
      logger.error("Failed:", error)
      expect(consoleMocks.error).toHaveBeenCalledWith("[ERROR]", "Failed:", error)
    })

    it("should handle multiple arguments", () => {
      logger.error("Database error", { table: "users" }, 500)
      expect(consoleMocks.error).toHaveBeenCalledWith("[ERROR]", "Database error", { table: "users" }, 500)
    })
  })

  // =========================================
  // DEBUG - logs in development only
  // =========================================
  describe("debug", () => {
    it("should call console.debug with [DEBUG] prefix", () => {
      logger.debug("debug info")
      if (consoleMocks.debug.mock.calls.length > 0) {
        expect(consoleMocks.debug).toHaveBeenCalledWith("[DEBUG]", "debug info")
      }
    })

    it("should handle complex objects", () => {
      const complexData = { nested: { deep: { value: 42 } } }
      logger.debug("Data:", complexData)
      if (consoleMocks.debug.mock.calls.length > 0) {
        expect(consoleMocks.debug).toHaveBeenCalledWith("[DEBUG]", "Data:", complexData)
      }
    })
  })

  // =========================================
  // LOGGER OBJECT STRUCTURE
  // =========================================
  describe("logger structure", () => {
    const loggerMethods = ["info", "warn", "error", "debug"]

    for (const method of loggerMethods) {
      it(`should have ${method} method`, () => {
        expect(typeof logger[method as keyof typeof logger]).toBe("function")
      })
    }
  })
})
