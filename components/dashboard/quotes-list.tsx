"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, PenSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QuoteCard } from "@/components/dashboard/quote-card"
import { useRouter } from "next/navigation"

interface Quote {
  id: string
  text: string
  author: string
  category: string
}

interface QuotesListProps {
  quotes: Quote[]
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  onEditQuote: (editedQuote: Quote) => Promise<void>
  onDeleteQuote: (id: string) => Promise<void>
  isLoading: boolean
}

export function QuotesList({
  quotes,
  categories,
  activeCategory,
  onCategoryChange,
  onEditQuote,
  onDeleteQuote,
  isLoading,
}: QuotesListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // Filter quotes by category and search query
  const filteredQuotes = quotes.filter((quote) => {
    const matchesCategory = activeCategory === "all" || quote.category === activeCategory
    const matchesSearch =
      searchQuery === "" ||
      quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.author.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const handleAddQuoteClick = () => {
    // Use the router to navigate to the "add" tab
    router.push("/dashboard?tab=add")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange("all")}
            className="transition-all duration-200 hover:scale-105"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className="transition-all duration-200 hover:scale-105"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quotes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading quotes...</div>
      ) : filteredQuotes.length === 0 ? (
        <motion.div
          className="text-center py-12 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {activeCategory === "all" && searchQuery === ""
            ? "You don't have any quotes yet. Add your first quote!"
            : searchQuery !== ""
              ? `No quotes found matching "${searchQuery}"`
              : `No quotes in the "${activeCategory}" category.`}
        </motion.div>
      ) : (
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {filteredQuotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                categories={categories}
                onEdit={onEditQuote}
                onDelete={onDeleteQuote}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Floating Action Button for adding quotes */}
      <div className="fixed bottom-6 right-6 z-10">
        <Button
          onClick={handleAddQuoteClick}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-primary to-turquoise-light hover:shadow-xl transition-all duration-300"
        >
          <PenSquare className="h-6 w-6" />
          <span className="sr-only">Add Quote</span>
        </Button>
      </div>
    </div>
  )
}

