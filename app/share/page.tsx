"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, QuoteIcon, Share2, Download } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getQuoteImageUrl, getFallbackImageUrl } from "@/lib/quote-image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/components/ui/use-toast";

interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
}

// Disable static generation and force dynamic rendering
export const dynamic = 'force-dynamic';

export default function SharePage() {
  const searchParams = useSearchParams();
  const quoteId = searchParams?.get("id");
  const { toast } = useToast();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isMobile = useMediaQuery("(max-width: 640px)");

  // Handle case when no quoteId is provided
  if (!quoteId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
          </Link>
          <Card className="border-primary/20 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-destructive mb-2">Error: No quote ID provided</div>
              <p className="text-muted-foreground">
                Please provide a valid quote ID in the URL.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  useEffect(() => {
    async function fetchQuote() {
      try {
        const { data, error } = await supabase
          .from("quotes")
          .select("*")
          .eq("id", quoteId)
          .single();

        if (error) throw error;

        if (!data) {
          setError("Quote not found");
          return;
        }

        setQuote(data);

        // Generate image URL
        const size = isMobile ? "mobile" : "default";
        const url = getQuoteImageUrl(data, "light", size);
        setImageUrl(url);
        setImageLoading(true);

        // Preload image
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          setImageError(false);
          setImageLoading(false);
        };
        img.onerror = () => {
          console.error("Failed to load image, using fallback");
          setImageError(true);
          setImageLoading(false);
          setImageUrl(getFallbackImageUrl(data));
        };
        img.src = url;
      } catch (err) {
        console.error("Error fetching quote:", err);
        setError("Failed to load quote");
      } finally {
        setLoading(false);
      }
    }

    fetchQuote();
  }, [quoteId, isMobile]);

  const handleShare = async () => {
    if (!quote) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Quote by ${quote.author}`,
          text: `"${quote.text}" — ${quote.author}`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "The link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quote-${quoteId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Image downloaded",
        description: "The quote image has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error downloading image:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
        </Link>

        <Card className="border-primary/20 shadow-lg">
          {loading ? (
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          ) : error ? (
            <CardContent className="p-6 text-center">
              <div className="text-destructive mb-2">Error: {error}</div>
              <p className="text-muted-foreground">
                The quote you're looking for might have been removed or doesn't exist.
              </p>
            </CardContent>
          ) : (
            <>
              <CardContent className="p-6">
                <div className="mb-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {quote?.category ? quote.category.charAt(0).toUpperCase() + quote.category.slice(1) : "Unknown"}
                  </span>
                </div>
                <blockquote className="text-xl italic">"{quote?.text}"</blockquote>
                <p className="text-sm text-muted-foreground mt-2">— {quote?.author}</p>

                {imageUrl && (
                  <div className="mt-6 border rounded-md overflow-hidden">
                    {imageLoading && <Skeleton className="w-full h-48" />}
                    <img
                      src={imageUrl}
                      alt={`Quote by ${quote?.author}`}
                      className={`w-full h-auto ${imageLoading ? 'hidden' : 'block'}`}
                      onLoad={() => setImageLoading(false)}
                      onError={() => {
                        setImageError(true);
                        setImageLoading(false);
                        if (quote) setImageUrl(getFallbackImageUrl(quote));
                      }}
                    />
                  </div>
                )}
              </CardContent>

              <CardFooter className="bg-muted/30 p-4 flex flex-wrap gap-2 justify-between">
                {quote && (
                  <div className="flex gap-2">
                    {"share" in navigator && (
                      <Button size="sm" onClick={handleShare} className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" /> Share
                      </Button>
                    )}
                    {imageUrl && (
                      <Button size="sm" variant="outline" onClick={downloadImage} className="flex items-center gap-1">
                        <Download className="h-4 w-4" /> Image
                      </Button>
                    )}
                  </div>
                )}
                <Link href="/sign-up">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <QuoteIcon className="mr-2 h-4 w-4" /> Create Your Own
                  </Button>
                </Link>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}