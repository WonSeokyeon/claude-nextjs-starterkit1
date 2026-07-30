import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { PageContainer } from "@/components/layout/page-container"

export function SiteFooter() {
  return (
    <footer className="w-full">
      <Separator />
      <PageContainer className="py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 Next.js Starter Kit. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link
              href="https://github.com"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://nextjs.org"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Next.js
            </Link>
          </nav>
        </div>
      </PageContainer>
    </footer>
  )
}
