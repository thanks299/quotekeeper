"use client"

import { motion } from "framer-motion"
import { QuoteIcon } from "lucide-react"
import { useState, useEffect } from "react"

const quotes = [
  {
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    color: "primary",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    color: "secondary",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    color: "accent",
  },
  // {
  //   text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  //   author: "Winston Churchill",
  //   color: "primary",
  // },
  // {
  //   text: "The best way to predict the future is to create it.",
  //   author: "Peter Drucker",
  //   color: "secondary",
  // },
]

export function HeroQuotes() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % quotes.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-[400px] w-full">
      {quotes.map((quote, index) => {
        const isActive = index === activeIndex
        const prevActive = index === (activeIndex - 1 + quotes.length) % quotes.length

        return (
          <motion.div
            key={index}
            className={`absolute top-0 left-0 w-full p-6 quote-bubble ${
              quote.color === "primary"
                ? "border-primary/20"
                : quote.color === "secondary"
                  ? "border-secondary/20"
                  : "border-accent/20"
            }`}
            initial={{ opacity: 0, scale: 0.8, y: 40, x: 0, rotate: -5 }}
            animate={{
              opacity: isActive ? 1 : prevActive ? 0.3 : 0,
              scale: isActive ? 1 : 0.8,
              y: isActive ? 0 : prevActive ? 60 : 40,
              x: isActive ? 0 : prevActive ? -40 : 0,
              rotate: isActive ? 0 : -5,
              zIndex: isActive ? 10 : 0,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            <div
              className={`quote-icon ${
                quote.color === "primary"
                  ? "bg-primary text-primary-foreground"
                  : quote.color === "secondary"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-accent text-accent-foreground"
              }`}
            >
              <QuoteIcon className="h-4 w-4" />
            </div>
            <blockquote className="text-xl italic mb-4 pt-2">"{quote.text}"</blockquote>
            <p className="text-sm text-muted-foreground">— {quote.author}</p>
          </motion.div>
        )
      })}

      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-4">
        {quotes.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`View quote ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

