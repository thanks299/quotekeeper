// Define category keywords for better matching
const categoryKeywords: Record<string, string[]> = {
    inspiration: [
      "inspire",
      "dream",
      "achieve",
      "possible",
      "potential",
      "believe",
      "courage",
      "hope",
      "future",
      "aspire",
      "overcome",
      "journey",
    ],
    motivation: [
      "motivate",
      "drive",
      "success",
      "goal",
      "achieve",
      "determination",
      "perseverance",
      "discipline",
      "focus",
      "ambition",
      "excellence",
      "progress",
    ],
    wisdom: [
      "wisdom",
      "knowledge",
      "learn",
      "understand",
      "experience",
      "insight",
      "perspective",
      "truth",
      "philosophy",
      "reflection",
      "thought",
      "mind",
    ],
    humor: [
      "humor",
      "funny",
      "laugh",
      "joke",
      "comedy",
      "smile",
      "wit",
      "amusing",
      "entertain",
      "hilarious",
      "irony",
      "sarcasm",
    ],
    other: [], // Default category if no match is found
  }
  
  /**
   * Analyzes quote text and suggests the most appropriate category
   */
  export function suggestCategory(text: string, author: string): string {
    // Combine text and author for analysis
    const content = `${text} ${author}`.toLowerCase()
  
    // Score each category based on keyword matches
    const scores: Record<string, number> = {}
  
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      // Skip the "other" category as it's our fallback
      if (category === "other") continue
  
      // Calculate score based on keyword matches
      let score = 0
      for (const keyword of keywords) {
        // Check if the keyword appears in the content
        if (content.includes(keyword)) {
          score += 1
  
          // Bonus points for exact word matches (not just substrings)
          const regex = new RegExp(`\\b${keyword}\\b`, "i")
          if (regex.test(content)) {
            score += 0.5
          }
        }
      }
  
      scores[category] = score
    }
  
    // Find the category with the highest score
    let bestCategory = "other"
    let highestScore = 0
  
    for (const [category, score] of Object.entries(scores)) {
      if (score > highestScore) {
        highestScore = score
        bestCategory = category
      }
    }
  
    // If no significant matches found, return "other"
    return bestCategory
  }
  
  /**
   * Checks if a quote should be auto-categorized based on its content
   */
  export function shouldAutoCategorizeBe(text: string, author: string): boolean {
    // Simple heuristic: if the quote is too short, don't auto-categorize
    if (text.length < 10) return false
  
    // Get the suggested category
    const category = suggestCategory(text, author)
  
    // If the category is "other", we don't have a strong match
    return category !== "other"
  }
  
  