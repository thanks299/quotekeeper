/**
 * Utility for generating quote images using the Canvas API
 */

interface QuoteImageOptions {
    text: string
    author: string
    category?: string
    theme?: "light" | "dark" | "blue" | "green"
    width?: number
    height?: number
  }
  
  interface ThemeColors {
    background: string
    text: string
    accent: string
    secondary: string
  }
  
  // Theme color definitions
  const themes: Record<string, ThemeColors> = {
    light: {
      background: "#ffffff",
      text: "#1a1a1a",
      accent: "#7c3aed",
      secondary: "#64748b",
    },
    dark: {
      background: "#1a1a1a",
      text: "#ffffff",
      accent: "#a78bfa",
      secondary: "#94a3b8",
    },
    blue: {
      background: "#0f172a",
      text: "#f8fafc",
      accent: "#3b82f6",
      secondary: "#cbd5e1",
    },
    green: {
      background: "#064e3b",
      text: "#f0fdfa",
      accent: "#10b981",
      secondary: "#a7f3d0",
    },
  }
  
  /**
   * Generate a quote image using the Canvas API
   */
  export async function generateQuoteImage({
    text,
    author,
    category = "inspiration",
    theme = "light",
    width = 1200,
    height = 630,
  }: QuoteImageOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Create canvas
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
  
        if (!ctx) {
          throw new Error("Could not get canvas context")
        }
  
        // Get theme colors
        const colors = themes[theme] || themes.light
  
        // Fill background
        ctx.fillStyle = colors.background
        ctx.fillRect(0, 0, width, height)
  
        // Draw background pattern
        drawBackgroundPattern(ctx, colors.accent, width, height)
  
        // Draw logo
        drawLogo(ctx, colors.accent, 40, 40)
  
        // Draw category badge
        drawCategoryBadge(ctx, category, colors.accent, width - 40, 40)
  
        // Draw quote
        drawQuote(ctx, text, author, colors, width, height)
  
        // Draw footer
        drawFooter(ctx, colors.secondary, width, height)
  
        // Convert to data URL
        const dataUrl = canvas.toDataURL("image/png")
        resolve(dataUrl)
      } catch (error) {
        console.error("Error generating image:", error)
        reject(error)
      }
    })
  }
  
  /**
   * Draw background pattern
   */
  function drawBackgroundPattern(ctx: CanvasRenderingContext2D, accentColor: string, width: number, height: number) {
    // Create a pattern of dots
    const patternSize = 100
  
    for (let x = 0; x < width; x += patternSize) {
      for (let y = 0; y < height; y += patternSize) {
        // Draw first dot
        ctx.fillStyle = `${accentColor}15`
        ctx.beginPath()
        ctx.arc(x + 25, y + 25, 2, 0, Math.PI * 2)
        ctx.fill()
  
        // Draw second dot
        ctx.fillStyle = `${accentColor}10`
        ctx.beginPath()
        ctx.arc(x + 75, y + 75, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
  
  /**
   * Draw logo
   */
  function drawLogo(ctx: CanvasRenderingContext2D, accentColor: string, x: number, y: number) {
    ctx.fillStyle = accentColor
    ctx.font = "bold 28px sans-serif"
    ctx.textBaseline = "middle"
    ctx.fillText("QuoteApp", x, y)
  }
  
  /**
   * Draw category badge
   */
  function drawCategoryBadge(ctx: CanvasRenderingContext2D, category: string, accentColor: string, x: number, y: number) {
    const categoryText = category.charAt(0).toUpperCase() + category.slice(1)
  
    // Measure text width
    ctx.font = "16px sans-serif"
    const textWidth = ctx.measureText(categoryText).width
  
    // Draw badge background
    ctx.fillStyle = `${accentColor}30`
    const badgeWidth = textWidth + 32
    const badgeHeight = 32
    const badgeX = x - badgeWidth
    const badgeY = y - badgeHeight / 2
  
    roundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 16, true, false)
  
    // Draw badge text
    ctx.fillStyle = accentColor
    ctx.textBaseline = "middle"
    ctx.fillText(categoryText, badgeX + 16, badgeY + badgeHeight / 2)
  }
  
  /**
   * Draw quote
   */
  function drawQuote(
    ctx: CanvasRenderingContext2D,
    text: string,
    author: string,
    colors: ThemeColors,
    width: number,
    height: number,
  ) {
    const maxWidth = width * 0.8
    const centerX = width / 2
    const centerY = height / 2
  
    // Draw quote mark
    ctx.fillStyle = `${colors.accent}40`
    ctx.font = "bold 120px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillText('"', centerX, centerY - 120)
  
    // Truncate text if too long
    let displayText = text
    if (text.length > 280) {
      displayText = text.substring(0, 277) + "..."
    }
  
    // Draw quote text
    ctx.fillStyle = colors.text
    ctx.font = "italic bold 32px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
  
    // Wrap text
    const lines = wrapText(ctx, displayText, maxWidth)
    const lineHeight = 44
    const totalTextHeight = lines.length * lineHeight
  
    // Draw each line
    lines.forEach((line, index) => {
      const y = centerY - totalTextHeight / 2 + index * lineHeight
      ctx.fillText(line, centerX, y)
    })
  
    // Draw author
    ctx.fillStyle = colors.secondary
    ctx.font = "24px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`— ${author}`, centerX, centerY + totalTextHeight / 2 + 40)
  }
  
  /**
   * Draw footer
   */
  function drawFooter(ctx: CanvasRenderingContext2D, secondaryColor: string, width: number, height: number) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "quoteapp.vercel.app"
  
    ctx.fillStyle = secondaryColor
    ctx.font = "16px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(appUrl, width / 2, height - 30)
  }
  
  /**
   * Wrap text to fit within a certain width
   */
  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(" ")
    const lines: string[] = []
    let currentLine = ""
  
    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const metrics = ctx.measureText(testLine)
  
      if (metrics.width > maxWidth && currentLine !== "") {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    })
  
    if (currentLine) {
      lines.push(currentLine)
    }
  
    return lines
  }
  
  /**
   * Draw a rounded rectangle
   */
  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fill: boolean,
    stroke: boolean,
  ) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  
    if (fill) {
      ctx.fill()
    }
  
    if (stroke) {
      ctx.stroke()
    }
  }
  
  /**
   * Convert a data URL to a Blob
   */
  export function dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(",")
    const mime = arr[0].match(/:(.*?);/)![1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
  
    return new Blob([u8arr], { type: mime })
  }
  
  