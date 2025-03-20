"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Trash2, Edit, Check, X, Search, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardNav } from "@/components/dashboard-nav"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { addQuote, deleteQuote, updateQuote, getQuotes, addCategory, getCategories } from "@/app/actions"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

interface Quote {
  id: string
  text: string
  author: string
  category: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [categories, setCategories] = useState<string[]>(["inspiration", "motivation", "wisdom", "humor", "other"])
  const [newQuote, setNewQuote] = useState({ text: "", author: "", category: "inspiration" })
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [addingQuote, setAddingQuote] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingLocalStorage, setUsingLocalStorage] = useState(false)

  // Add a function to handle database fallback
  const handleDatabaseFallback = () => {
    // If we can't connect to the database, we'll use local storage as a fallback
    const useLocalStorage = () => {
      setUsingLocalStorage(true)

      // Load quotes from local storage
      try {
        const storedQuotes = localStorage.getItem("quotes")
        if (storedQuotes) {
          setQuotes(JSON.parse(storedQuotes))
        }

        const storedCategories = localStorage.getItem("categories")
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories))
        }

        setError("Database connection failed. Using local storage temporarily.")
      } catch (e) {
        console.error("Local storage fallback failed:", e)
      } finally {
        setLoading(false)
      }
    }

    return useLocalStorage
  }

  // Save to local storage when using fallback
  useEffect(() => {
    if (usingLocalStorage) {
      localStorage.setItem("quotes", JSON.stringify(quotes))
      localStorage.setItem("categories", JSON.stringify(categories))
    }
  }, [usingLocalStorage, quotes, categories])

  // Fetch quotes and categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!authLoading && user) {
        try {
          setError(null)
          setLoading(true)

          // Try to get quotes first as a connection test
          const quotesData = await getQuotes()

          // If we got here, connection worked, so get categories
          const categoriesData = await getCategories()

          setQuotes(quotesData || [])
          if (categoriesData && categoriesData.length > 0) {
            setCategories(categoriesData)
          }

          // If we previously used local storage but now DB works, clear the flag
          if (usingLocalStorage) {
            setUsingLocalStorage(false)
            toast({
              title: "Database connection restored",
              description: "Your quotes are now being saved to the database.",
            })
          }
        } catch (error) {
          console.error("Data fetch error:", error)
          setError("Failed to load your data. Please check your database connection.")
          toast({
            variant: "destructive",
            title: "Database Connection Error",
            description: "Failed to connect to the database. Using local storage temporarily.",
          })
          handleDatabaseFallback()()
        } finally {
          setLoading(false)
        }
      } else if (!authLoading && !user) {
        router.push("/sign-in")
      }
    }

    fetchData()
  }, [user, authLoading, router, toast, usingLocalStorage])

  const handleAddQuote = async () => {
    if (newQuote.text.trim() === "") return

    setAddingQuote(true)

    try {
      if (usingLocalStorage) {
        // Add quote to local state when using local storage fallback
        const newQuoteData = {
          id: crypto.randomUUID(),
          text: newQuote.text,
          author: newQuote.author || "Unknown",
          category: newQuote.category,
        }

        setQuotes([...quotes, newQuoteData])
        setNewQuote({ text: "", author: "", category: "inspiration" })

        toast({
          title: "Quote added locally",
          description: "Your quote has been added to local storage.",
        })
      } else {
        // Add quote to database
        const newQuoteData = await addQuote({
          text: newQuote.text,
          author: newQuote.author || "Unknown",
          category: newQuote.category,
        })

        setQuotes([...quotes, newQuoteData])
        setNewQuote({ text: "", author: "", category: "inspiration" })

        toast({
          title: "Quote added",
          description: "Your quote has been added successfully.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add quote. Please check your database connection.",
      })
    } finally {
      setAddingQuote(false)
    }
  }

  const handleDeleteQuote = async (id: string) => {
    try {
      if (usingLocalStorage) {
        // Delete quote from local state when using local storage fallback
        setQuotes(quotes.filter((quote) => quote.id !== id))

        toast({
          title: "Quote deleted locally",
          description: "Your quote has been deleted from local storage.",
        })
      } else {
        // Delete quote from database
        await deleteQuote(id)
        setQuotes(quotes.filter((quote) => quote.id !== id))

        toast({
          title: "Quote deleted",
          description: "Your quote has been deleted successfully.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete quote. Please check your database connection.",
      })
    }
  }

  const startEditQuote = (quote: Quote) => {
    setEditingQuote(quote)
  }

  const saveEditedQuote = async () => {
    if (!editingQuote) return

    try {
      if (usingLocalStorage) {
        // Update quote in local state when using local storage fallback
        setQuotes(quotes.map((q) => (q.id === editingQuote.id ? editingQuote : q)))

        toast({
          title: "Quote updated locally",
          description: "Your quote has been updated in local storage.",
        })
      } else {
        // Update quote in database
        await updateQuote(editingQuote)
        setQuotes(quotes.map((q) => (q.id === editingQuote.id ? editingQuote : q)))

        toast({
          title: "Quote updated",
          description: "Your quote has been updated successfully.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update quote. Please check your database connection.",
      })
    } finally {
      setEditingQuote(null)
    }
  }

  const cancelEditQuote = () => {
    setEditingQuote(null)
  }

  const handleAddCategory = async () => {
    if (newCategory.trim() === "" || categories.includes(newCategory.toLowerCase())) return

    try {
      if (usingLocalStorage) {
        // Add category to local state when using local storage fallback
        setCategories([...categories, newCategory.toLowerCase()])
        setNewCategory("")

        toast({
          title: "Category added locally",
          description: "Your category has been added to local storage.",
        })
      } else {
        // Add category to database
        await addCategory(newCategory.toLowerCase())
        setCategories([...categories, newCategory.toLowerCase()])
        setNewCategory("")

        toast({
          title: "Category added",
          description: "Your category has been added successfully.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add category. Please check your database connection.",
      })
    }
  }

  // Filter quotes by category and search query
  const filteredQuotes = quotes.filter((quote) => {
    const matchesCategory = activeCategory === "all" || quote.category === activeCategory
    const matchesSearch =
      searchQuery === "" ||
      quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.author.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="container py-6 md:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Your Quote Dashboard</h1>
            <p className="text-muted-foreground">Manage your personal collection of quotes</p>
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{error}</p>
                <p className="text-sm mt-1">
                  {usingLocalStorage
                    ? "Your quotes are being saved to local storage. They will be available only on this device and browser."
                    : "Please make sure your database is properly configured and the DATABASE_URL environment variable is set correctly."}
                </p>
                {usingLocalStorage && (
                  <p className="text-sm mt-2">
                    <strong>Note:</strong> When the database connection is restored, you'll need to manually transfer
                    your quotes.
                  </p>
                )}
              </div>
            </div>
          )}

          <Tabs defaultValue="quotes" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="quotes" className="transition-all duration-200">
                My Quotes
              </TabsTrigger>
              <TabsTrigger value="add" className="transition-all duration-200">
                Add Quote
              </TabsTrigger>
              <TabsTrigger value="categories" className="transition-all duration-200">
                Categories
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quotes" className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={activeCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory("all")}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(category)}
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

              {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <Skeleton className="h-5 w-20" />
                            <div className="flex gap-1">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                          </div>
                          <Skeleton className="h-20 w-full" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                      <motion.div
                        key={quote.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        layout
                      >
                        <Card className="overflow-hidden h-full border-primary/10 hover:border-primary/30 transition-colors">
                          <CardContent className="p-6">
                            {editingQuote && editingQuote.id === quote.id ? (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-quote-${quote.id}`}>Quote</Label>
                                  <Textarea
                                    id={`edit-quote-${quote.id}`}
                                    value={editingQuote.text}
                                    onChange={(e) => setEditingQuote({ ...editingQuote, text: e.target.value })}
                                    className="min-h-[100px] transition-all duration-200 focus:ring-primary"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-author-${quote.id}`}>Author</Label>
                                  <Input
                                    id={`edit-author-${quote.id}`}
                                    value={editingQuote.author}
                                    onChange={(e) => setEditingQuote({ ...editingQuote, author: e.target.value })}
                                    className="transition-all duration-200 focus:ring-primary"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`edit-category-${quote.id}`}>Category</Label>
                                  <Select
                                    value={editingQuote.category}
                                    onValueChange={(value) => setEditingQuote({ ...editingQuote, category: value })}
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
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={cancelEditQuote}
                                    className="transition-all duration-200"
                                  >
                                    <X className="h-4 w-4 mr-1" /> Cancel
                                  </Button>
                                  <Button size="sm" onClick={saveEditedQuote} className="transition-all duration-200">
                                    <Check className="h-4 w-4 mr-1" /> Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                    {quote.category.charAt(0).toUpperCase() + quote.category.slice(1)}
                                  </span>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => startEditQuote(quote)}
                                      className="h-8 w-8 transition-all duration-200 hover:scale-110"
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteQuote(quote.id)}
                                      className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10 transition-all duration-200 hover:scale-110"
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
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="add" className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="quote-text">Quote</Label>
                        <Textarea
                          id="quote-text"
                          placeholder="Enter your quote here..."
                          value={newQuote.text}
                          onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
                          className="min-h-[100px] transition-all duration-200 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quote-author">Author</Label>
                        <Input
                          id="quote-author"
                          placeholder="Author name (optional)"
                          value={newQuote.author}
                          onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
                          className="transition-all duration-200 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quote-category">Category</Label>
                        <Select
                          value={newQuote.category}
                          onValueChange={(value) => setNewQuote({ ...newQuote, category: value })}
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
                        onClick={handleAddQuote}
                        className="w-full interactive-button bg-gradient-to-r from-primary to-turquoise-light text-white shadow-lg shadow-primary/20"
                        disabled={newQuote.text.trim() === "" || addingQuote}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {addingQuote ? "Adding Quote..." : "Add Quote"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-category">Add New Category</Label>
                        <div className="flex gap-2">
                          <Input
                            id="new-category"
                            placeholder="Enter category name"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="transition-all duration-200 focus:ring-primary"
                          />
                          <Button
                            onClick={handleAddCategory}
                            disabled={newCategory.trim() === ""}
                            className="transition-all duration-200 hover:scale-105 bg-gradient-to-r from-secondary to-terracotta-light"
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Current Categories</Label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                            <motion.div
                              key={category}
                              className="px-3 py-1 rounded-full bg-primary/10 text-primary"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

