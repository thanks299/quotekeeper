import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuoteIcon, ChevronLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPolicyPage() {
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
            <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground mt-2">Last updated: March 25, 2024</p>
          </div>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Introduction</h2>
            <p>
              QuoteKeeper ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you visit our website or use our
              service.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy,
              please do not access the site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Information We Collect</h2>

            <div className="space-y-3">
              <h3 className="text-xl font-medium">Personal Information</h3>
              <p>
                We may collect personal information that you voluntarily provide to us when you register on the website,
                express interest in obtaining information about us or our products and services, or otherwise contact
                us.
              </p>
              <p>The personal information we collect may include:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>Password (stored in encrypted form)</li>
                <li>Content you create, such as quotes you save</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium">Automatically Collected Information</h3>
              <p>
                When you visit our website, we may automatically collect certain information about your device,
                including:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Operating system</li>
                <li>Pages visited</li>
                <li>Time and date of your visit</li>
                <li>Time spent on pages</li>
                <li>Referring website addresses</li>
              </ul>
              <p>
                This information is used to analyze trends, administer the site, track users' movements around the site,
                and gather demographic information.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium">Cookies and Similar Technologies</h3>
              <p>
                We use cookies and similar tracking technologies to track activity on our website and store certain
                information. For more information about our use of cookies, please see our{" "}
                <Link href="/cookie-policy" className="text-primary hover:underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
            <p>We may use the information we collect from you for various purposes, including to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Create and manage your account</li>
              <li>Provide and maintain our service</li>
              <li>Notify you about changes to our service</li>
              <li>Allow you to participate in interactive features of our service</li>
              <li>Provide customer support</li>
              <li>Monitor usage of our service</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Improve our website and services</li>
              <li>Send you updates, newsletters, and marketing communications (if you have opted in)</li>
              <li>Respond to legal requests and prevent harm</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Disclosure of Your Information</h2>
            <p>
              We may share information we have collected about you in certain situations. Your information may be
              disclosed as follows:
            </p>

            <div className="space-y-3">
              <h3 className="text-xl font-medium">By Law or to Protect Rights</h3>
              <p>
                If we believe the release of information about you is necessary to respond to legal process, to
                investigate or remedy potential violations of our policies, or to protect the rights, property, and
                safety of others, we may share your information as permitted or required by any applicable law, rule, or
                regulation.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium">Third-Party Service Providers</h3>
              <p>
                We may share your information with third parties that perform services for us or on our behalf,
                including payment processing, data analysis, email delivery, hosting services, customer service, and
                marketing assistance.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-medium">Business Transfers</h3>
              <p>
                If we are involved in a merger, acquisition, or sale of all or a portion of our assets, you will be
                notified via email and/or a prominent notice on our website of any change in ownership or uses of your
                personal information, as well as any choices you may have regarding your personal information.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The right to access personal information we hold about you</li>
              <li>The right to request correction of inaccurate personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to object to processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section
              below.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Data Security</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the
              security of any personal information we process. However, despite our safeguards and efforts to secure
              your information, no electronic transmission over the Internet or information storage technology can be
              guaranteed to be 100% secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Children's Privacy</h2>
            <p>
              Our service is not directed to anyone under the age of 13. We do not knowingly collect personal
              information from children under 13. If you are a parent or guardian and you are aware that your child has
              provided us with personal information, please contact us.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
              are effective when they are posted on this page.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <p>
              Email: privacy@quotekeeper.com
              <br />
              Address: 123 Quote Street, Wisdom City, WS 12345
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

