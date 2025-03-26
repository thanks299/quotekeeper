import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get quote parameters from the URL
    const text = searchParams.get("text") || "Inspirational quote"
    const author = searchParams.get("author") || "Unknown"
    const category = searchParams.get("category") || "inspiration"
    const theme = searchParams.get("theme") || "light"
    const size = searchParams.get("size") || "default" // default, mobile, square

    // Define theme colors
    const themes = {
      light: {
        bg: "#ffffff",
        text: "#1a1a1a",
        accent: "#7c3aed",
        secondary: "#64748b",
      },
      dark: {
        bg: "#1a1a1a",
        text: "#ffffff",
        accent: "#a78bfa",
        secondary: "#94a3b8",
      },
      blue: {
        bg: "#0f172a",
        text: "#f8fafc",
        accent: "#3b82f6",
        secondary: "#cbd5e1",
      },
      green: {
        bg: "#064e3b",
        text: "#f0fdfa",
        accent: "#10b981",
        secondary: "#a7f3d0",
      },
    }

    // Get colors based on theme
    const colors = themes[theme as keyof typeof themes] || themes.light

    // Set dimensions based on size parameter
    let width = 1200
    let height = 630

    if (size === "mobile") {
      width = 800
      height = 1200
    } else if (size === "square") {
      width = 1080
      height = 1080
    }

    // Adjust font sizes based on dimensions
    const quoteFontSize = size === "mobile" ? 36 : 32
    const authorFontSize = size === "mobile" ? 28 : 24
    const logoFontSize = size === "mobile" ? 28 : 24

    // Calculate text max width based on image dimensions
    const textMaxWidth = Math.floor(width * 0.8)

    // Truncate text if too long
    let displayText = text
    if (text.length > 280) {
      displayText = text.substring(0, 277) + "..."
    }

    // Generate the image without loading custom fonts
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.bg,
          padding: "40px",
          position: "relative",
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 25px 25px, ${colors.accent}15 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${colors.accent}10 2%, transparent 0%)`,
            backgroundSize: "100px 100px",
            zIndex: 0,
          }}
        />

        {/* Logo and branding */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            display: "flex",
            alignItems: "center",
            fontFamily: "sans-serif",
            fontWeight: "bold",
            fontSize: `${logoFontSize}px`,
            color: colors.accent,
          }}
        >
          QuoteApp
        </div>

        {/* Category badge */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            backgroundColor: `${colors.accent}30`,
            color: colors.accent,
            padding: "8px 16px",
            borderRadius: "9999px",
            fontSize: "16px",
            fontFamily: "sans-serif",
          }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </div>

        {/* Quote content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: `${textMaxWidth}px`,
            zIndex: 1,
          }}
        >
          {/* Quote marks */}
          <div
            style={{
              fontSize: "120px",
              color: `${colors.accent}40`,
              lineHeight: "1",
              marginBottom: "-40px",
              fontFamily: "sans-serif",
              fontWeight: "bold",
            }}
          >
            "
          </div>

          {/* Quote text */}
          <div
            style={{
              fontSize: `${quoteFontSize}px`,
              fontFamily: "sans-serif",
              fontWeight: "bold",
              color: colors.text,
              lineHeight: "1.4",
              margin: "20px 0",
              fontStyle: "italic",
              maxWidth: "90%",
            }}
          >
            {displayText}
          </div>

          {/* Author */}
          <div
            style={{
              fontSize: `${authorFontSize}px`,
              fontFamily: "sans-serif",
              color: colors.secondary,
              marginTop: "16px",
            }}
          >
            — {author}
          </div>
        </div>

        {/* Footer with URL */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            color: colors.secondary,
            fontSize: "16px",
            fontFamily: "sans-serif",
          }}
        >
          {process.env.NEXT_PUBLIC_APP_URL || "quoteapp.vercel.app"}
        </div>
      </div>,
      {
        width,
        height,
      },
    )
  } catch (e: any) {
    console.error(`Error generating image: ${e.message}`)
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    })
  }
}

