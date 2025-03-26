"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit, Trash2, Check, X, Share2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAnalytics } from "@/lib/analytics-service"
import { useFunctional } from "@/lib/functional-service"
import { ShareDialog } from "./share-dialog"
import { EditCategoryDialog } from "./edit-category-dialog"

interface QuoteData {
  id: string
  text: string
  author: string
  category: string
}

interface QuoteCardProps {
  quote: QuoteData
  categories: string[]
  onEdit: (editedQuote: QuoteData) => Promise<void>
  onDelete: (id: string) => Promise<void>
  className?: string
}

export function QuoteCard({ quote, categories, onEdit, onDelete, className }: QuoteCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedQuote, setEditedQuote] = useState<QuoteData>(quote)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false)

  // Track quote views with analytics
  const analytics = useAnalytics()
  const functional = useFunctional()

  useEffect(() => {
    // Track that this quote was viewed
    analytics.trackEvent("quote_viewed", {
      quote_id: quote.id,
      quote_author: quote.author,
      quote_category: quote.category,
    })

    // Save this quote to recently viewed quotes
    const lastViewedQuotes = functional.getLastViewedQuotes()
    if (!lastViewedQuotes.includes(quote.id)) {
      functional.saveLastViewedQuotes([quote.id, ...lastViewedQuotes])
    }
  }, [quote.id, quote.author, quote.category, analytics, functional])

  const handleStartEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditedQuote(quote)
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    await onEdit(editedQuote)
    setIsEditing(false)
  }

  const handleDeleteQuote = async () => {
    await onDelete(quote.id)
  }

  const handleShare = () => {
    setShareDialogOpen(true)
    analytics.trackEvent("quote_shared", {
      quote_id: quote.id,
      quote_author: quote.author,
      quote_category: quote.category,
    })
  }

  const handleEditCategory = () => {
    setEditCategoryDialogOpen(true)
  }

  const handleSaveCategory = async (quoteId: string, newCategory: string) => {
    await onEdit({
      ...quote,
      category: newCategory,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      layout
      className={className}
    >
      <Card className="overflow-hidden h-full border-primary/10 hover:border-primary/30 transition-colors">
        <CardContent className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`edit-quote-${quote.id}`}>Quote</Label>
                <Textarea
                  id={`edit-quote-${quote.id}`}
                  value={editedQuote.text}
                  onChange={(e) => setEditedQuote({ ...editedQuote, text: e.target.value })}
                  className="min-h-[100px] transition-all duration-200 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`edit-author-${quote.id}`}>Author</Label>
                <Input
                  id={`edit-author-${quote.id}`}
                  value={editedQuote.author}
                  onChange={(e) => setEditedQuote({ ...editedQuote, author: e.target.value })}
                  className="transition-all duration-200 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`edit-category-${quote.id}`}>Category</Label>
                <Select
                  value={editedQuote.category}
                  onValueChange={(value) => setEditedQuote({ ...editedQuote, category: value })}
                >
                  <SelectTrigger id={`edit-category-${quote.id}`}>
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
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="outline" onClick={handleCancelEdit} className="transition-all duration-200">
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit} className="transition-all duration-200">
                  <Check className="h-4 w-4 mr-1" /> Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {quote.category.charAt(0).toUpperCase() + quote.category.slice(1)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEditCategory}
                    className="h-6 w-6 transition-all duration-200 hover:scale-110"
                    title="Edit Category"
                  >
                    <Tag className="h-3 w-3" />
                    <span className="sr-only">Edit Category</span>
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    className="h-8 w-8 transition-all duration-200 hover:scale-110"
                    title="Share Quote"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleStartEdit}
                    className="h-8 w-8 transition-all duration-200 hover:scale-110"
                    title="Edit Quote"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDeleteQuote}
                    className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10 transition-all duration-200 hover:scale-110"
                    title="Delete Quote"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
              <blockquote className="text-lg italic">"{quote.text}"</blockquote>
              <p className="text-sm text-muted-foreground">— {quote.author}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <ShareDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} quote={quote} />

      {/* Edit Category Dialog */}
      <EditCategoryDialog
        open={editCategoryDialogOpen}
        onOpenChange={setEditCategoryDialogOpen}
        quote={quote}
        categories={categories}
        onSave={handleSaveCategory}
      />
    </motion.div>
  )
}

