import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuoteIcon, ChevronLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <QuoteIcon className="h-6 w-6 text-primary" />
            <span>QuoteKeeper</span>
          </Link>
        </div>
      </header>

      <main className="container py-10 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cookie Policy</h1>
            <p className="text-muted-foreground mt-2">Last updated: March 25, 2024</p>
          </div>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Introduction</h2>
            <p>
              This Cookie Policy explains how QuoteKeeper ("we", "us", or "our") uses cookies and similar technologies
              to recognize you when you visit our website. It explains what these technologies are and why we use them,
              as well as your rights to control our use of them.
            </p>
            <p>
              By continuing to use our website, you are agreeing to our use of cookies as described in this Cookie
              Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">What are cookies?</h2>
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website.
              Cookies are widely used by website owners in order to make their websites work, or to work more
              efficiently, as well as to provide reporting information.
            </p>
            <p>
              Cookies set by the website owner (in this case, QuoteKeeper) are called "first-party cookies". Cookies set
              by parties other than the website owner are called "third-party cookies". Third-party cookies enable
              third-party features or functionality to be provided on or through the website (e.g., advertising,
              interactive content and analytics).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Types of cookies we use</h2>

            <div className="space-y-3">
              <h3 className="text-xl font-medium">Necessary Cookies</h3>
              <p>
                These cookies are essential for the website to function properly. They enable basic functions like page
                navigation, access to secure areas, and security features. The website cannot function properly without
                these cookies.
              </p>
              <p className="text-sm text-muted-foreground">Examples: Session cookies, authentication cookies</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium">Functional Cookies</h3>
              <p>
                These cookies enable the website to provide enhanced functionality and personalization. They may be set
                by us or by third-party providers whose services we have added to our pages.
              </p>
              <p className="text-sm text-muted-foreground">
                Examples: Language preference cookies, theme preference cookies
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium">Analytics Cookies</h3>
              <p>
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance
                of our site. They help us know which pages are the most and least popular and see how visitors move
                around the site.
              </p>
              <p className="text-sm text-muted-foreground">
                Examples: Google Analytics cookies, performance measurement cookies
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium">Marketing Cookies</h3>
              <p>
                These cookies may be set through our site by our advertising partners. They may be used by those
                companies to build a profile of your interests and show you relevant ads on other sites.
              </p>
              <p className="text-sm text-muted-foreground">Examples: Advertising cookies, social media cookies</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">How can you control cookies?</h2>
            <p>
              You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject
              cookies, you may still use our website though your access to some functionality and areas of our website
              may be restricted.
            </p>
            <p>
              You can also control your cookie preferences directly on our website through our Cookie Settings
              interface, which allows you to select which categories of cookies you accept or reject.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">How to delete cookies</h2>
            <p>
              Most web browsers allow some control of most cookies through the browser settings. To find out more about
              cookies, including how to see what cookies have been set, visit{" "}
              <a href="https://www.allaboutcookies.org" className="text-primary hover:underline">
                www.allaboutcookies.org
              </a>
              .
            </p>
            <p>Find out how to manage cookies on popular browsers:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <a href="https://support.google.com/accounts/answer/32050" className="text-primary hover:underline">
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox"
                  className="text-primary hover:underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  className="text-primary hover:underline"
                >
                  Microsoft Edge
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/en-us/HT201265" className="text-primary hover:underline">
                  Safari (Desktop)
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/en-us/HT201265" className="text-primary hover:underline">
                  Safari (Mobile)
                </a>
              </li>
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DAndroid"
                  className="text-primary hover:underline"
                >
                  Android Browser
                </a>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Changes to this Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time in order to reflect, for example, changes to the
              cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this
              Cookie Policy regularly to stay informed about our use of cookies and related technologies.
            </p>
            <p>The date at the top of this Cookie Policy indicates when it was last updated.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact us</h2>
            <p>
              If you have any questions about our use of cookies or other technologies, please email us at
              privacy@quotekeeper.com or contact us through our website.
            </p>
          </section>
        </div>
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
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

