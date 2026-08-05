import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/patterns/theme-toggle"
import { PageContainer } from "@/components/layout/page-container"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <PageContainer>
        <div className="flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight hover:opacity-80 transition-opacity"
          >
            Next.js Starter Kit
          </Link>
          <div className="flex items-center gap-3">
            <Button size="sm" asChild>
              <Link href="/login">로그인하기</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </PageContainer>
    </header>
  )
}
