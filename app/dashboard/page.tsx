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
import { Share2 } from "lucide-react"

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
  const [sharingQuote, setSharingQuote] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [usingLocalStorage, setUsingLocalStorage] = useState(false)

  // Handle database fallback
  const handleDatabaseFallback = () => {
    const useLocalStorage = () => {
      setUsingLocalStorage(true)
      try {
        const storedQuotes = localStorage.getItem("quotes")
        if (storedQuotes) setQuotes(JSON.parse(storedQuotes))

        const storedCategories = localStorage.getItem("categories")
        if (storedCategories) setCategories(JSON.parse(storedCategories))

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

  // Fetch quotes and categories
  useEffect(() => {
    const fetchData = async () => {
      if (!authLoading && user) {
        try {
          setErrorMessage(null)
          setLoading(true)

          const quotesData = await getQuotes()
          const categoriesData = await getCategories()

          setQuotes(quotesData || [])
          if (categoriesData?.length > 0) setCategories(categoriesData)

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

  // Handle share quote
  const handleShareQuote = async (quoteId: string) => {
    setSharingQuote(true)
    try {
      const quote = quotes.find(q => q.id === quoteId)
      if (!quote) return

      const shareUrl = `${window.location.origin}/share?id=${encodeURIComponent(quoteId)}`
      
      if (navigator.share) {
        await navigator.share({
          title: `Quote by ${quote.author}`,
          text: `"${quote.text}" - ${quote.author}`,
          url: shareUrl
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast({
          title: "Link copied!",
          description: "Share link copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Sharing failed:", error)
      toast({
        variant: "destructive",
        title: "Sharing failed",
        description: "Couldn't share the quote. Please try again.",
      })
    } finally {
      setSharingQuote(false)
    }
  }

  // Handle adding a quote
  const handleAddQuote = async (quoteData: { text: string; author: string; category: string }) => {
    setAddingQuote(true)
    try {
      if (usingLocalStorage) {
        const newQuote = {
          id: crypto.randomUUID(),
          ...quoteData,
          author: quoteData.author || "Unknown"
        }
        setQuotes([...quotes, newQuote])
        toast({ title: "Quote added locally" })
      } else {
        const newQuote = await addQuote({
          ...quoteData,
          author: quoteData.author || "Unknown"
        })
        setQuotes([...quotes, newQuote])
        toast({ title: "Quote added" })
      }
      router.push("/dashboard?tab=quotes")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add quote.",
      })
    } finally {
      setAddingQuote(false)
    }
  }

  // Handle deleting a quote
  const handleDeleteQuote = async (id: string) => {
    try {
      if (usingLocalStorage) {
        setQuotes(quotes.filter(quote => quote.id !== id))
        toast({ title: "Quote deleted locally" })
      } else {
        await deleteQuote(id)
        setQuotes(quotes.filter(quote => quote.id !== id))
        toast({ title: "Quote deleted" })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete quote.",
      })
    }
  }

  // Handle editing a quote
  const handleEditQuote = async (editedQuote: Quote) => {
    try {
      if (usingLocalStorage) {
        setQuotes(quotes.map(q => q.id === editedQuote.id ? editedQuote : q))
        toast({ title: "Quote updated locally" })
      } else {
        await updateQuote(editedQuote)
        setQuotes(quotes.map(q => q.id === editedQuote.id ? editedQuote : q))
        toast({ title: "Quote updated" })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update quote.",
      })
    }
  }

  // Handle adding a category
  const handleAddCategory = async (name: string) => {
    if (name.trim() === "" || categories.includes(name.toLowerCase())) return
    try {
      if (usingLocalStorage) {
        setCategories([...categories, name.toLowerCase()])
        toast({ title: "Category added locally" })
      } else {
        await addCategory(name.toLowerCase())
        setCategories([...categories, name.toLowerCase()])
        toast({ title: "Category added" })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add category.",
      })
    }
  }

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardTour userId={user?.id} />
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
              <TabsList className="mb-4">
                <TabsTrigger value="quotes">My Quotes</TabsTrigger>
                <TabsTrigger value="add">Add Quote</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>

              <TabsContent value="quotes" className="space-y-4">
                <QuotesList
                  quotes={quotes}
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  onEditQuote={handleEditQuote}
                  onDeleteQuote={handleDeleteQuote}
                  onShareQuote={handleShareQuote}
                  isSharing={sharingQuote}
                  isLoading={loading}
                />
              </TabsContent>

              <TabsContent value="add" className="space-y-4">
                <QuoteForm 
                  categories={categories} 
                  onAddQuote={handleAddQuote} 
                  isSubmitting={addingQuote} 
                />
              </TabsContent>

              <TabsContent value="categories" className="space-y-4">
                <CategoryForm 
                  categories={categories} 
                  onAddCategory={handleAddCategory} 
                />
              </TabsContent>
            </Tabs>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  )
}