"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardNav } from "@/components/dashboard-nav"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { addQuote, deleteQuote, updateQuote, getQuotes, addCategory, getCategories } from "@/app/actions"
import { ErrorDisplay } from "@/components/dashboard/error-display"
import { QuotesList } from "@/components/dashboard/quotes-list"
import { QuoteForm } from "@/components/dashboard/quote-form"
import { CategoryForm } from "@/components/dashboard/category-form"
import { ErrorBoundary } from "@/components/error-boundary"
import { DashboardTour } from "@/components/dashboard/dashboard-tour"

interface Quote {
  id: string
  text: string
  author: string
  category: string
}

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, loading: authLoading } = useAuth()

  // Get the tab from URL or default to 'quotes'
  const tabParam = searchParams.get("tab")
  const activeTab = tabParam && ["quotes", "add", "categories"].includes(tabParam) ? tabParam : "quotes"

  const [quotes, setQuotes] = useState<Quote[]>([])
  const [categories, setCategories] = useState<string[]>(["inspiration", "motivation", "wisdom", "humor", "other"])
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [addingQuote, setAddingQuote] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [usingLocalStorage, setUsingLocalStorage] = useState(false)

  // Handle database fallback
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

        setErrorMessage("Database connection failed. Using local storage temporarily.")
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
          setErrorMessage(null)
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
          setErrorMessage("Failed to load your data. Please check your database connection.")
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

  // Handle tab change
  const handleTabChange = (value: string) => {
    router.push(`?tab=${value}`)
  }

  // Handle adding a quote
  const handleAddQuote = async (quoteData: { text: string; author: string; category: string }) => {
    setAddingQuote(true)

    try {
      if (usingLocalStorage) {
        // Add quote to local state when using local storage fallback
        const newQuoteData = {
          id: crypto.randomUUID(),
          text: quoteData.text,
          author: quoteData.author || "Unknown",
          category: quoteData.category,
        }

        setQuotes([...quotes, newQuoteData])

        toast({
          title: "Quote added locally",
          description: "Your quote has been added to local storage.",
        })
      } else {
        // Add quote to database
        const newQuoteData = await addQuote({
          text: quoteData.text,
          author: quoteData.author || "Unknown",
          category: quoteData.category,
        })

        setQuotes([...quotes, newQuoteData])

        toast({
          title: "Quote added",
          description: "Your quote has been added successfully.",
        })
      }

      // Switch to quotes tab after adding
      router.push("/dashboard?tab=quotes")
    } catch (error) {
      console.error("Error adding quote:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add quote. Please check your database connection.",
      })
    } finally {
      setAddingQuote(false)
    }
  }

  // Handle deleting a quote
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

  // Handle editing a quote
  const handleEditQuote = async (editedQuote: Quote) => {
    try {
      if (usingLocalStorage) {
        // Update quote in local state when using local storage fallback
        setQuotes(quotes.map((q) => (q.id === editedQuote.id ? editedQuote : q)))

        toast({
          title: "Quote updated locally",
          description: "Your quote has been updated in local storage.",
        })
      } else {
        // Update quote in database
        await updateQuote(editedQuote)
        setQuotes(quotes.map((q) => (q.id === editedQuote.id ? editedQuote : q)))

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
    }
  }

  // Handle updating just the category of a quote
  const handleUpdateCategory = async (quoteId: string, newCategory: string) => {
    const quoteToUpdate = quotes.find((q) => q.id === quoteId)
    if (!quoteToUpdate) return

    const updatedQuote = { ...quoteToUpdate, category: newCategory }
    await handleEditQuote(updatedQuote)
  }

  // Handle adding a category
  const handleAddCategory = async (name: string) => {
    if (name.trim() === "" || categories.includes(name.toLowerCase())) return

    try {
      if (usingLocalStorage) {
        // Add category to local state when using local storage fallback
        setCategories([...categories, name.toLowerCase()])

        toast({
          title: "Category added locally",
          description: "Your category has been added to local storage.",
        })
      } else {
        // Add category to database
        await addCategory(name.toLowerCase())
        setCategories([...categories, name.toLowerCase()])

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

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Add the tour component */}
      {user && <DashboardTour userId={user.id} />}

      <div className="dashboard-header">
        <DashboardNav />
      </div>

      <main className="container py-6 md:py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your personal collection of quotes</p>
          </div>

          <ErrorBoundary>
            {errorMessage && <ErrorDisplay errorMessage={errorMessage} isUsingLocalStorage={usingLocalStorage} />}

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-4 tabs-list">
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

              <TabsContent value="quotes" className="space-y-4 quotes-tab-content">
                <QuotesList
                  quotes={quotes}
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  onEditQuote={handleEditQuote}
                  onDeleteQuote={handleDeleteQuote}
                  onUpdateCategory={handleUpdateCategory}
                  isLoading={loading}
                />
              </TabsContent>

              <TabsContent value="add" className="space-y-4">
                <QuoteForm categories={categories} onAddQuote={handleAddQuote} isSubmitting={addingQuote} />
              </TabsContent>

              <TabsContent value="categories" className="space-y-4">
                <CategoryForm categories={categories} onAddCategory={handleAddCategory} />
              </TabsContent>
            </Tabs>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  )
}

