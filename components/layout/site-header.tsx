import Link from "next/link"
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
          {/* 추후 서브페이지 추가 시 네비게이션 링크를 넣을 자리 */}
          <nav className="flex items-center gap-4" />
          <ThemeToggle />
        </div>
      </PageContainer>
    </header>
  )
}
