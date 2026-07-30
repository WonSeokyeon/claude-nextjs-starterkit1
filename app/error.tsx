"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"
import { Section } from "@/components/layout/section"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Section className="flex items-center py-24">
      <PageContainer>
        <div className="space-y-6 text-center">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>오류가 발생했습니다</AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              {error.message || "예상치 못한 오류가 발생했습니다. 다시 시도해주세요."}
            </AlertDescription>
          </Alert>
          <div>
            <h2 className="text-2xl font-semibold">문제가 발생했어요</h2>
            <p className="mt-2 text-muted-foreground">
              페이지를 불러오는 중에 오류가 발생했습니다.
            </p>
          </div>
          <Button onClick={reset} size="lg">
            다시 시도
          </Button>
        </div>
      </PageContainer>
    </Section>
  )
}
