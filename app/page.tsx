import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuoteIcon, ChevronRight, Sparkles, BookOpen, Users, Star } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { FadeIn, FadeInStagger } from "@/components/fade-in"
import { HeroQuotes } from "@/components/hero-quotes"

const images = [
  'image-url-1.jpg',
  'image-url-3.jpg',
  'image-url-4.jpg',
  'image-url-2.jpg',
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 hero-gradient relative">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <FadeIn className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                  <Sparkles className="inline-block w-4 h-4 mr-2" />
                  Your personal quote collection
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Capture{" "}
                  <span className="text-primary relative px-1 py-0.5 rounded bg-primary/10 dark:bg-primary/20">
                    wisdom
                  </span>
                  , find{" "}
                  <span className="text-secondary relative px-1 py-0.5 rounded bg-secondary/10 dark:bg-secondary/20">
                    inspiration
                  </span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">
                  Create your personal collection of inspiring quotes. Organize, categorize, and access your favorite
                  wisdom anytime, anywhere.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      className="interactive-button bg-gradient-to-r from-primary to-turquoise-light text-white shadow-lg shadow-primary/20 w-full sm:w-auto"
                    >
                      Get Started
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button
                      variant="outline"
                      size="lg"
                      className="interactive-button border-secondary text-secondary hover:text-secondary-foreground hover:bg-secondary w-full sm:w-auto"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                  <div className="flex -space-x-2">
                    {images.map((image, index) => (
                      <div key={index} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background flex justify-center items-center">
                        <img src={image} alt="User image" className="w-6 h-6 rounded-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <p>
                    Join <span className="font-bold text-foreground">1,000+</span> users collecting wisdom
                  </p>
                </div>
              </FadeIn>

              <FadeIn className="relative hidden lg:block">
                <HeroQuotes />
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <FadeInStagger className="text-center mb-12">
              <FadeIn>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose QuoteKeeper?</h2>
                <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                  Designed for quote enthusiasts who want to build their personal collection of wisdom
                </p>
              </FadeIn>
            </FadeInStagger>

            <FadeInStagger className="grid gap-8 md:grid-cols-3 md:gap-12 mt-12">
              <FadeIn>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-card rounded-lg p-6 h-full">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Personal Collection</h3>
                    <p className="text-muted-foreground">
                      Create your own private collection of quotes that inspire you. Add, edit, and organize them your
                      way.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-accent rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-card rounded-lg p-6 h-full">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Smart Organization</h3>
                    <p className="text-muted-foreground">
                      Categorize and tag your quotes for easy reference. Find exactly what you need when you need it.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-primary rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-card rounded-lg p-6 h-full">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <Star className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Access Anywhere</h3>
                    <p className="text-muted-foreground">
                      Your quotes are synced across all your devices. Access them on desktop, tablet, or mobile.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </FadeInStagger>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <FadeInStagger className="text-center mb-12">
              <FadeIn>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Wisdom from Our Collection
                </h2>
                <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                  Explore some of the inspiring quotes from our users
                </p>
              </FadeIn>
            </FadeInStagger>

            <FadeInStagger className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
              {[
                {
                  quote: "The only limit to our realization of tomorrow will be our doubts of today.",
                  author: "Franklin D. Roosevelt",
                  category: "Inspiration",
                },
                {
                  quote: "The future belongs to those who believe in the beauty of their dreams.",
                  author: "Eleanor Roosevelt",
                  category: "Dreams",
                },
                {
                  quote: "It does not matter how slowly you go as long as you do not stop.",
                  author: "Confucius",
                  category: "Perseverance",
                },
                {
                  quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
                  author: "Winston Churchill",
                  category: "Success",
                },
                {
                  quote: "The best way to predict the future is to create it.",
                  author: "Peter Drucker",
                  category: "Motivation",
                },
                {
                  quote: "Believe you can and you're halfway there.",
                  author: "Theodore Roosevelt",
                  category: "Belief",
                },
              ].map((item, i) => (
                <FadeIn key={i}>
                  <div className="quote-card bg-card rounded-lg p-6 h-full">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{item.category}</span>
                      <QuoteIcon className="h-5 w-5 text-secondary" />
                    </div>
                    <blockquote className="text-lg italic mb-4">"{item.quote}"</blockquote>
                    <p className="text-sm text-muted-foreground">— {item.author}</p>
                  </div>
                </FadeIn>
              ))}
            </FadeInStagger>

            <div className="text-center mt-12">
              <Link href="/sign-up">
                <Button className="interactive-button bg-gradient-to-r from-secondary to-terracotta-light text-white shadow-lg shadow-secondary/20">
                  Start Your Collection
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 bg-muted/50">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <div className="flex items-center gap-2 font-semibold">
            <QuoteIcon className="h-6 w-6 text-primary" />
            <span>QuoteKeeper</span>
          </div>

          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2024 QuoteKeeper. All rights reserved.
          </p>

          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

