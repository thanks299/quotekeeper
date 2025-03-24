"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QuoteFormData {
  text: string
  author: string
  category: string
}

interface QuoteFormProps {
  categories: string[]
  onAddQuote: (quoteData: QuoteFormData) => Promise<void>
  isSubmitting: boolean
}

export function QuoteForm({ categories, onAddQuote, isSubmitting }: QuoteFormProps) {
  const [quoteToBeAdded, setQuoteToBeAdded] = useState<QuoteFormData>({
    text: "",
    author: "",
    category: "inspiration",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with data:", quoteToBeAdded)

    if (quoteToBeAdded.text.trim() === "") {
      console.log("Quote text is empty, not submitting")
      return
    }

    try {
      console.log("Calling onAddQuote...")
      await onAddQuote(quoteToBeAdded)
      console.log("Quote added successfully")
      // Reset form after successful submission
      setQuoteToBeAdded({ text: "", author: "", category: "inspiration" })
    } catch (error) {
      console.error("Error adding quote:", error)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quote-text">Quote</Label>
              <Textarea
                id="quote-text"
                placeholder="Enter your quote here..."
                value={quoteToBeAdded.text}
                onChange={(e) => setQuoteToBeAdded({ ...quoteToBeAdded, text: e.target.value })}
                className="min-h-[100px] transition-all duration-200 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote-author">Author</Label>
              <Input
                id="quote-author"
                placeholder="Author name (optional)"
                value={quoteToBeAdded.author}
                onChange={(e) => setQuoteToBeAdded({ ...quoteToBeAdded, author: e.target.value })}
                className="transition-all duration-200 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote-category">Category</Label>
              <Select
                value={quoteToBeAdded.category}
                onValueChange={(value) => setQuoteToBeAdded({ ...quoteToBeAdded, category: value })}
              >
                <SelectTrigger id="quote-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full interactive-button bg-gradient-to-r from-primary to-turquoise-light text-white shadow-lg shadow-primary/20"
              disabled={quoteToBeAdded.text.trim() === "" || isSubmitting}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {isSubmitting ? "Adding Quote..." : "Add Quote"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

