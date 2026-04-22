"use client"

import { useEffect } from "react"

import { localizedPath, siteConfig } from "@/src/lib/agent-ready/site"

type WebMcpTool = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute: (input?: Record<string, unknown>) => Promise<Record<string, unknown>>
}

declare global {
  interface Navigator {
    modelContext?: {
      provideContext?: (payload: { tools: WebMcpTool[] }) => void | Promise<void>
    }
  }
}

function normalizeLocale(input: unknown) {
  return input === "ar" ? "ar" : "en"
}

function createNavigationResult(url: string, message: string) {
  window.location.assign(url)

  return {
    ok: true,
    url,
    message,
  }
}

export function WebMcpProvider() {
  useEffect(() => {
    const provideContext = navigator.modelContext?.provideContext

    if (typeof provideContext !== "function") {
      return
    }

    const tools: WebMcpTool[] = [
      {
        name: "open_projects",
        description: "Open the public projects listing for a chosen locale.",
        inputSchema: {
          type: "object",
          properties: {
            locale: {
              type: "string",
              enum: [...siteConfig.locales],
              default: siteConfig.defaultLocale,
            },
          },
        },
        execute: async (input = {}) => {
          const locale = normalizeLocale(input.locale)
          const url = localizedPath(locale, "/projects")
          return createNavigationResult(url, "Opened public projects page.")
        },
      },
      {
        name: "open_contact",
        description: "Jump to the homepage contact section for a chosen locale.",
        inputSchema: {
          type: "object",
          properties: {
            locale: {
              type: "string",
              enum: [...siteConfig.locales],
              default: siteConfig.defaultLocale,
            },
          },
        },
        execute: async (input = {}) => {
          const locale = normalizeLocale(input.locale)
          const url = `${localizedPath(locale)}#contact`
          return createNavigationResult(url, "Opened contact section.")
        },
      },
      {
        name: "open_resume",
        description: "Open Ahmed Shoman's resume PDF.",
        inputSchema: {
          type: "object",
          properties: {},
        },
        execute: async () => {
          return createNavigationResult(siteConfig.resumePath, "Opened resume PDF.")
        },
      },
    ]

    void Promise.resolve(provideContext({ tools })).catch(() => {
      // Ignore registration failures in unsupported or experimental browsers.
    })
  }, [])

  return null
}
