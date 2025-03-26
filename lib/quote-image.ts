/**
 * Generates a URL for a quote image
 */
export function getQuoteImageUrl(
    quote: {
      text: string
      author: string
      category: string
    },
    theme: "light" | "dark" | "blue" | "green" = "light",
    size: "default" | "mobile" | "square" = "default",
  ): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  
    // Encode the parameters
    const params = new URLSearchParams()
  
    // Safely add parameters, ensuring they're properly encoded
    if (quote.text) params.append("text", quote.text)
    if (quote.author) params.append("author", quote.author)
    if (quote.category) params.append("category", quote.category)
    params.append("theme", theme)
    params.append("size", size)
  
    return `${baseUrl}/api/og?${params.toString()}`
  }
  
  /**
   * Generates a URL for sharing a quote
   */
  export function getQuoteShareUrl(quoteId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    return `${baseUrl}/share?id=${quoteId}`
  }
  
  /**
   * Determines the best image size based on device
   */
  export function getBestImageSize(): "default" | "mobile" | "square" {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return "default"
    }
  
    // Get the screen width
    const width = window.innerWidth
  
    // For mobile devices in portrait mode
    if (width < 768) {
      return "mobile"
    }
  
    // For social media platforms that prefer square images
    if (
      navigator.userAgent.includes("Instagram") ||
      navigator.userAgent.includes("FBAV") ||
      navigator.userAgent.includes("Pinterest")
    ) {
      return "square"
    }
  
    // Default size for most platforms
    return "default"
  }
  
  /**
   * Creates a fallback image URL when OG image generation fails
   */
  export function getFallbackImageUrl(quote: {
    text: string
    author: string
    category: string
  }): string {
    try {
      // Truncate and sanitize the text to avoid URL issues
      const truncatedText = quote.text.length > 50 ? quote.text.substring(0, 50) + "..." : quote.text
      const sanitizedText = truncatedText.replace(/[^\w\s.,!?-]/g, "")
      const sanitizedAuthor = quote.author.replace(/[^\w\s.,!?-]/g, "")
  
      // Use a simple placeholder image service
      const text = encodeURIComponent(`"${sanitizedText}" — ${sanitizedAuthor}`)
      return `https://placehold.co/1200x630/7c3aed/ffffff?text=${text}`
    } catch (error) {
      console.error("Error creating fallback image URL:", error)
      // Return an even simpler fallback if there's an error
      return "https://placehold.co/1200x630/7c3aed/ffffff?text=Quote"
    }
  }
  
  