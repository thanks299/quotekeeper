"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy, Facebook, Twitter, MessageCircle, Instagram, Download, Share2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getQuoteShareUrl } from "@/lib/quote-image"
import { useMediaQuery } from "@/hooks/use-media-query"
import { generateQuoteImage, dataURLtoBlob } from "@/lib/canvas-image-generator"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quote: {
    id: string
    text: string
    author: string
    category: string
  }
}

export function ShareDialog({ open, onOpenChange, quote }: ShareDialogProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("link")
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "blue" | "green">("light")
  const [imageUrl, setImageUrl] = useState("")
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  // Check if device is mobile
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Create share URL
  const shareUrl = getQuoteShareUrl(quote.id)

  // Format quote for sharing
  const shareText = `"${quote.text}" — ${quote.author}`
  const encodedShareText = encodeURIComponent(shareText)

  // Social media share URLs
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodeURIComponent(shareUrl)}`
  const whatsappShareUrl = `https://wa.me/?text=${encodedShareText}%20${encodeURIComponent(shareUrl)}`
  const instagramCaption = `${shareText}\n\n${shareUrl}`

  // Generate image when theme changes or dialog opens
  useEffect(() => {
    if (open) {
      setIsImageLoading(true)
      setImageError(false)

      // Generate image using Canvas API
      const generateImage = async () => {
        try {
          // Set dimensions based on device
          const width = isMobile ? 800 : 1200
          const height = isMobile ? 1200 : 630

          // Generate image
          const dataUrl = await generateQuoteImage({
            text: quote.text,
            author: quote.author,
            category: quote.category,
            theme: selectedTheme,
            width,
            height,
          })

          setImageUrl(dataUrl)
          setIsImageLoading(false)
        } catch (error) {
          console.error("Error generating image:", error)
          setImageError(true)
          setIsImageLoading(false)

          // Use a simple fallback
          setImageUrl(
            `https://placehold.co/1200x630/7c3aed/ffffff?text=${encodeURIComponent(`"${quote.text.substring(0, 50)}..." — ${quote.author}`)}`,
          )
        }
      }

      generateImage()
    }
  }, [open, quote, selectedTheme, isMobile])

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)

    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  // Open share link in new window
  const openShareLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  // Download image
  const downloadImage = async () => {
    try {
      if (imageUrl.startsWith("data:")) {
        // For data URLs, convert to blob and download
        const blob = dataURLtoBlob(imageUrl)
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `quote-${quote.id}.png`
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(url)
      } else {
        // For regular URLs, fetch and download
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `quote-${quote.id}.png`
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(url)
      }

      toast({
        title: "Image downloaded",
        description: "The quote image has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Error downloading image:", error)
      toast({
        title: "Download failed",
        description: "There was an error downloading the image. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Native share API for mobile devices - IMPORTANT: This must be called directly from a user interaction
  const nativeShare = async (event: React.MouseEvent) => {
    // This function must be called directly from a click event
    if (!navigator.share) {
      // Fallback for devices without native sharing
      copyToClipboard(`${shareText}\n\n${shareUrl}`)
      return
    }

    try {
      // For image sharing on mobile
      let shareData: ShareData = {
        title: `Quote by ${quote.author}`,
        text: shareText,
        url: shareUrl,
      }

      // Try to share with the image if possible
      if (activeTab === "image" && !imageError && imageUrl) {
        try {
          let blob: Blob

          if (imageUrl.startsWith("data:")) {
            // Convert data URL to blob
            blob = dataURLtoBlob(imageUrl)
          } else {
            // Fetch image and convert to blob
            const response = await fetch(imageUrl)
            blob = await response.blob()
          }

          const file = new File([blob], `quote-${quote.id}.png`, { type: "image/png" })

          shareData = {
            ...shareData,
            files: [file],
          }
        } catch (error) {
          console.error("Error preparing image for sharing:", error)
          // Continue with text sharing if image sharing fails
        }
      }

      await navigator.share(shareData)

      toast({
        title: "Shared successfully",
        description: "The quote has been shared successfully.",
      })
    } catch (error) {
      console.error("Error sharing:", error)
      if ((error as Error).name !== "AbortError") {
        toast({
          title: "Sharing failed",
          description: "There was an error sharing the quote. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Share to Instagram (requires downloading the image first)
  const shareToInstagram = () => {
    if (isMobile) {
      // Try to open Instagram app with the image
      const instagramUrl = `instagram://library?AssetPath=${encodeURIComponent(imageUrl)}`
      window.location.href = instagramUrl

      // Fallback in case the deep link doesn't work
      setTimeout(() => {
        toast({
          title: "Instagram sharing",
          description: "Download the image and share it on Instagram with the provided caption.",
        })

        // Copy the caption to clipboard
        copyToClipboard(instagramCaption)

        // Download the image
        downloadImage()
      }, 1000)
    } else {
      toast({
        title: "Instagram sharing",
        description: "Download the image and share it on Instagram with the provided caption.",
      })

      // Copy the caption to clipboard
      copyToClipboard(instagramCaption)

      // Download the image
      downloadImage()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-md ${isMobile ? "p-4" : "p-6"}`}>
        <DialogHeader>
          <DialogTitle>Share this quote</DialogTitle>
          <DialogDescription>
            Share this quote with your friends and family on social media or copy the link.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Link & Text</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div className="bg-muted p-3 rounded-md italic">
              "{quote.text}"<div className="text-sm text-muted-foreground mt-1 not-italic">— {quote.author}</div>
            </div>

            <div className="flex items-center space-x-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button size="icon" onClick={() => copyToClipboard(shareUrl)}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {/* Native share button for mobile */}
            {navigator.share && (
              <Button className="w-full flex items-center justify-center gap-2" onClick={nativeShare}>
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            )}

            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => openShareLink(facebookShareUrl)}
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                {!isMobile && "Facebook"}
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => openShareLink(twitterShareUrl)}
              >
                <Twitter className="h-4 w-4 text-sky-500" />
                {!isMobile && "Twitter"}
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => openShareLink(whatsappShareUrl)}
              >
                <MessageCircle className="h-4 w-4 text-green-500" />
                {!isMobile && "WhatsApp"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4">
            <div className="flex justify-center mb-2">
              <div className="grid grid-cols-4 gap-2">
                {(["light", "dark", "blue", "green"] as const).map((theme) => (
                  <Button
                    key={theme}
                    variant={selectedTheme === theme ? "default" : "outline"}
                    className={`h-8 capitalize ${
                      theme === "light"
                        ? "bg-white text-black border"
                        : theme === "dark"
                          ? "bg-gray-900 text-white"
                          : theme === "blue"
                            ? "bg-blue-900 text-white"
                            : "bg-green-900 text-white"
                    } ${selectedTheme === theme ? "ring-2 ring-primary" : ""}`}
                    onClick={() => setSelectedTheme(theme)}
                  >
                    {isMobile ? theme.charAt(0).toUpperCase() : theme}
                  </Button>
                ))}
              </div>
            </div>

            <div className="border rounded-md overflow-hidden relative">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              )}

              {imageError && !isImageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/10 p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Image generation failed. Using a simplified version instead.
                  </p>
                </div>
              )}

              <img
                src={imageUrl || "/placeholder.svg"}
                alt={`Quote by ${quote.author}`}
                className="w-full h-auto"
                style={{
                  maxHeight: isMobile ? "150px" : "200px",
                  objectFit: "cover",
                  opacity: isImageLoading ? 0.5 : 1,
                }}
                onLoad={() => setIsImageLoading(false)}
                onError={() => {
                  setIsImageLoading(false)
                  setImageError(true)
                  setImageUrl(
                    `https://placehold.co/1200x630/7c3aed/ffffff?text=${encodeURIComponent(`"${quote.text.substring(0, 50)}..." — ${quote.author}`)}`,
                  )
                }}
              />
            </div>

            {/* Native share button for mobile */}
            {navigator.share && (
              <Button className="w-full flex items-center justify-center gap-2" onClick={nativeShare}>
                <Share2 className="h-4 w-4" />
                Share Image
              </Button>
            )}

            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" className="flex items-center gap-2" onClick={downloadImage}>
                <Download className="h-4 w-4" />
                {!isMobile && "Download"}
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => copyToClipboard(imageUrl)}>
                <Copy className="h-4 w-4" />
                {!isMobile && "Copy URL"}
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={shareToInstagram}>
                <Instagram className="h-4 w-4 text-pink-500" />
                {!isMobile && "Instagram"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

