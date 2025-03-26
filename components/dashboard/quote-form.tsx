"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { PlusCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { suggestCategory } from "@/lib/auto-categorize"

// Define the form schema
const formSchema = z.object({
  text: z.string().min(1, "Quote text is required"),
  author: z.string().optional(),
  category: z.string().min(1, "Category is required"),
})

type FormValues = z.infer<typeof formSchema>

interface QuoteFormProps {
  onSubmit: (data: { text: string; author: string; category: string }) => Promise<void>
  categories: string[]
  onAddCategory: (name: string) => Promise<void>
}

export function QuoteForm({ onSubmit, categories, onAddCategory }: QuoteFormProps) {
  const [newCategory, setNewCategory] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useAutoCategory, setUseAutoCategory] = useState(true)
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      author: "",
      category: categories.length > 0 ? categories[0] : "",
    },
  })

  // Watch for changes in text and author to suggest category
  const quoteText = watch("text")
  const quoteAuthor = watch("author") || ""

  useEffect(() => {
    if (quoteText && useAutoCategory) {
      const suggested = suggestCategory(quoteText, quoteAuthor)
      setSuggestedCategory(suggested)

      // Only auto-set the category if it's available in the categories list
      if (categories.includes(suggested)) {
        setValue("category", suggested)
      }
    }
  }, [quoteText, quoteAuthor, useAutoCategory, categories, setValue])

  const handleFormSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        text: data.text,
        author: data.author || "Unknown",
        category: data.category,
      })
      reset()
      setSuggestedCategory(null)
    } catch (error) {
      console.error("Error submitting quote:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return

    try {
      await onAddCategory(newCategory.trim().toLowerCase())
      setNewCategory("")
      setIsAddingCategory(false)
    } catch (error) {
      console.error("Error adding category:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">Quote</Label>
        <Textarea id="text" placeholder="Enter your quote here..." className="min-h-[100px]" {...register("text")} />
        {errors.text && <p className="text-sm text-destructive">{errors.text.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author (optional)</Label>
        <Input id="author" placeholder="Author name" {...register("author")} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="category">Category</Label>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Auto-categorize</span>
                    <Switch checked={useAutoCategory} onCheckedChange={setUseAutoCategory} id="auto-categorize" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Automatically suggest a category based on quote content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {suggestedCategory && useAutoCategory && (
          <div className="mb-2">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              <Sparkles className="h-3 w-3 mr-1" />
              Suggested: {suggestedCategory.charAt(0).toUpperCase() + suggestedCategory.slice(1)}
            </Badge>
          </div>
        )}

        {isAddingCategory ? (
          <div className="flex space-x-2">
            <Input
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1"
            />
            <Button type="button" onClick={handleAddCategory}>
              Add
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsAddingCategory(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Select value={watch("category")} onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger id="category" className="flex-1">
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
            <Button type="button" variant="outline" onClick={() => setIsAddingCategory(true)}>
              <PlusCircle className="h-4 w-4 mr-1" /> New
            </Button>
          </div>
        )}
        {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Quote"}
      </Button>
    </form>
  )
}

