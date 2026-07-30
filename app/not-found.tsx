import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/patterns/empty-state"
import { PageContainer } from "@/components/layout/page-container"
import { Section } from "@/components/layout/section"

export default function NotFound() {
  return (
    <Section className="flex items-center py-24">
      <PageContainer className="max-w-md">
        <EmptyState
          icon={<FileQuestion className="h-16 w-16 text-muted-foreground" />}
          title="페이지를 찾을 수 없습니다"
          description="요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다."
          action={
            <Button asChild>
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          }
        />
      </PageContainer>
    </Section>
  )
}
