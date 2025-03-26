"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface EditCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quote: {
    id: string
    text: string
    author: string
    category: string
  }
  categories: string[]
  onSave: (quoteId: string, newCategory: string) => Promise<void>
}

export function EditCategoryDialog({ open, onOpenChange, quote, categories, onSave }: EditCategoryDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState(quote.category)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (selectedCategory === quote.category) {
      onOpenChange(false)
      return
    }

    setIsSaving(true)
    try {
      await onSave(quote.id, selectedCategory)
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving category:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="quote-preview">Quote</Label>
            <div id="quote-preview" className="bg-muted p-3 rounded-md italic">
              "{quote.text}"<div className="text-sm text-muted-foreground mt-1 not-italic">— {quote.author}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

