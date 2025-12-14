/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
        "primary-dark": "var(--color-primary-dark)",
        accent: "var(--color-accent)",
        bg: "var(--color-bg)",
        "bg-muted": "var(--color-bg-muted)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        success: "var(--color-success)",
        error: "var(--color-error)",
        info: "var(--color-info)",
        warning: "var(--color-warning)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        scrollX: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        scrollXReverse: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        scrollX: "scrollX 30s linear infinite",
        scrollXReverse: "scrollXReverse 30s linear infinite",
      },
      transitionProperty: {
        colors: "background-color, color",
      },
      fontFamily: {
        main: "var(--main-font)",
        heading: "var(--heading-font)",
        arabic: "var(--arabic-font)",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground))', // Base text color
            fontSize: theme('fontSize.base'),
            lineHeight: theme('lineHeight.relaxed'),

            // Headings
            h1: {
              color: 'hsl(var(--foreground))',
              fontSize: theme('fontSize.4xl'),
              fontWeight: theme('fontWeight.extrabold'),
              lineHeight: theme('lineHeight.tight'),
              marginTop: theme('spacing.12'),
              marginBottom: theme('spacing.6'),
            },
            h2: {
              color: 'hsl(var(--foreground))',
              fontSize: theme('fontSize.3xl'),
              fontWeight: theme('fontWeight.bold'),
              lineHeight: theme('lineHeight.tight'),
              borderBottom: `1px solid hsl(var(--border) / 0.4)`,
              paddingBottom: theme('spacing.2'),
              marginTop: theme('spacing.10'),
              marginBottom: theme('spacing.4'),
            },
            h3: {
              color: 'hsl(var(--foreground))',
              fontSize: theme('fontSize.2xl'),
              fontWeight: theme('fontWeight.semibold'),
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.3'),
            },
            h4: {
              color: 'hsl(var(--foreground))',
              fontSize: theme('fontSize.xl'),
              fontWeight: theme('fontWeight.semibold'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.2'),
            },
            h5: {
              color: 'hsl(var(--foreground))',
              fontSize: theme('fontSize.lg'),
              fontWeight: theme('fontWeight.semibold'),
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.1'),
            },
            h6: {
              color: 'hsl(var(--foreground))',
              fontSize: theme('fontSize.base'),
              fontWeight: theme('fontWeight.medium'),
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.1'),
            },

            // Paragraphs
            p: {
              color: 'hsl(var(--foreground))',
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.4'),
            },

            // Links
            a: {
              color: 'hsl(var(--primary))',
              textDecoration: 'underline',
              fontWeight: theme('fontWeight.medium'),
              '&:hover': {
                color: 'hsl(var(--primary-dark))', // Using a dark variant for hover
                textDecoration: 'none',
              },
            },
            
            // Strong text
            strong: {
              color: 'hsl(var(--foreground))',
              fontWeight: theme('fontWeight.bold'),
            },

            // Lists
            ul: {
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              marginLeft: theme('spacing.6'),
              listStyleType: 'disc',
              paddingLeft: theme('spacing.4'),
              '& > li': {
                marginTop: theme('spacing.2'),
              },
            },
            ol: {
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              marginLeft: theme('spacing.6'),
              listStyleType: 'decimal',
              paddingLeft: theme('spacing.4'),
              '& > li': {
                marginTop: theme('spacing.2'),
              },
            },
            'ol > li::marker': {
              color: 'hsl(var(--primary))',
            },
            'ul > li::marker': {
              color: 'hsl(var(--primary))',
            },

            // Horizontal Rule
            hr: {
              borderColor: 'hsl(var(--border))',
              borderWidth: '1px',
              marginTop: theme('spacing.10'),
              marginBottom: theme('spacing.10'),
            },

            // Blockquote
            blockquote: {
              color: 'hsl(var(--foreground))',
              borderLeftColor: 'hsl(var(--primary))',
              borderLeftWidth: theme('borderWidth.4'),
              paddingLeft: theme('spacing.6'),
              paddingTop: theme('spacing.2'),
              paddingBottom: theme('spacing.2'),
              backgroundColor: 'hsl(var(--secondary) / 0.3)',
              borderRadius: theme('borderRadius.lg'),
              fontStyle: 'italic',
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
            },

            // Code (inline)
            code: {
              color: 'hsl(var(--primary))',
              backgroundColor: 'hsl(var(--secondary) / 0.5)',
              borderRadius: theme('borderRadius.md'),
              paddingLeft: theme('spacing.2'),
              paddingRight: theme('spacing.2'),
              paddingTop: theme('spacing.1'),
              paddingBottom: theme('spacing.1'),
              fontWeight: theme('fontWeight.medium'),
            },
            'code::before': { content: 'none' }, // Remove default prose backticks
            'code::after': { content: 'none' }, // Remove default prose backticks

            // Preformatted text (code blocks handled by SyntaxHighlighter, but some defaults)
            pre: {
              backgroundColor: 'hsl(var(--secondary))', // Fallback, SyntaxHighlighter theme usually overrides
              color: 'hsl(var(--foreground))',
              borderRadius: theme('borderRadius.lg'),
              border: `1px solid hsl(var(--border))`,
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.8'),
              padding: theme('spacing.4'),
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },

            // Tables
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.8'),
            },
            thead: {
              borderBottomColor: 'hsl(var(--border))',
              borderBottomWidth: '2px',
            },
            'tbody tr': {
              borderBottomColor: 'hsl(var(--border) / 0.7)',
              borderBottomWidth: '1px',
            },
            th: {
              backgroundColor: 'hsl(var(--secondary) / 0.3)',
              padding: theme('spacing.3'),
              textAlign: 'left',
              fontWeight: theme('fontWeight.bold'),
              border: `1px solid hsl(var(--border))`,
            },
            td: {
              padding: theme('spacing.3'),
              border: `1px solid hsl(var(--border))`,
            },

            // Images
            img: {
              borderRadius: theme('borderRadius.lg'),
              boxShadow: theme('boxShadow.md'),
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.8'),
              display: 'block', // Center images if desired
              marginLeft: 'auto',
              marginRight: 'auto',
            },
          },
        },
        // Custom typography sizes if needed (e.g., small, large)
        // sm: {
        //   css: {
        //     fontSize: theme('fontSize.sm'),
        //   },
        // },
        // lg: {
        //   css: {
        //     fontSize: theme('fontSize.lg'),
        //   },
        // },
      }),
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
