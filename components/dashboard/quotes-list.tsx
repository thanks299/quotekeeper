"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { QuoteCard } from "./quote-card"
import { Skeleton } from "@/components/ui/skeleton"

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
  onUpdateCategory?: (quoteId: string, newCategory: string) => Promise<void>
  isLoading: boolean
}

export function QuotesList({
  quotes,
  categories,
  activeCategory,
  onCategoryChange,
  onEditQuote,
  onDeleteQuote,
  onUpdateCategory,
  isLoading,
}: QuotesListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter quotes by active category and search term
  const filteredQuotes = quotes.filter((quote) => {
    const matchesCategory = activeCategory === "all" || quote.category === activeCategory
    const matchesSearch =
      searchTerm === "" ||
      quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.author.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Handle category change
  const handleCategoryChange = (category: string) => {
    onCategoryChange(category)
  }

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange("all")}
            className="transition-all duration-200"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className="transition-all duration-200"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search quotes..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full sm:w-64 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {filteredQuotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No quotes found. Try a different category or search term.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredQuotes.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                categories={categories}
                onEdit={onEditQuote}
                onDelete={onDeleteQuote}
                className="h-full"
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

