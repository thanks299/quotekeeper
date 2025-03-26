import type React from "react"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabaseClient"
import { getQuoteImageUrl, getQuoteShareUrl } from "@/lib/quote-image"

// Define the type for the params
type Props = {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  // Read the id from search params
  const id = searchParams.id as string

  // Default metadata
  let metadata: Metadata = {
    title: "Shared Quote | QuoteApp",
    description: "View this inspirational quote shared from QuoteApp.",
  }

  // If we have an ID, try to fetch the quote
  if (id) {
    try {
      const { data: quote } = await supabase.from("quotes").select("*").eq("id", id).single()

      if (quote) {
        const quoteText = `"${quote.text}" — ${quote.author}`
        const imageUrl = getQuoteImageUrl(quote)
        const shareUrl = getQuoteShareUrl(quote.id)

        metadata = {
          title: `Quote by ${quote.author} | QuoteApp`,
          description: quoteText,
          openGraph: {
            title: `Quote by ${quote.author}`,
            description: quoteText,
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: `Quote by ${quote.author}`,
              },
            ],
            url: shareUrl,
            siteName: "QuoteApp",
            type: "website",
          },
          twitter: {
            card: "summary_large_image",
            title: `Quote by ${quote.author}`,
            description: quoteText,
            images: [imageUrl],
          },
        }
      }
    } catch (error) {
      console.error("Error fetching quote for metadata:", error)
    }
  }

  return metadata
}

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="share-layout">{children}</div>
}

