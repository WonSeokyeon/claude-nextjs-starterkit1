import { Skeleton } from "@/components/ui/skeleton"
import { PageContainer } from "@/components/layout/page-container"
import { Section } from "@/components/layout/section"

export default function Loading() {
  return (
    <>
      <Section className="py-16 sm:py-24">
        <PageContainer>
          <div className="space-y-6">
            {/* 뱃지 라인 */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>

            {/* 제목과 부제 */}
            <div className="space-y-3 text-center">
              <Skeleton className="mx-auto h-10 w-64 rounded-lg" />
              <Skeleton className="mx-auto h-6 w-96 rounded-lg" />
            </div>

            {/* 버튼들 */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Skeleton className="h-11 w-40 rounded-md" />
              <Skeleton className="h-11 w-40 rounded-md" />
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* 카드 그리드 스켈레톤 */}
      <Section>
        <PageContainer>
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <Skeleton className="mx-auto h-8 w-48 rounded-lg" />
              <Skeleton className="mx-auto h-5 w-64 rounded-lg" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg border border-border p-6 space-y-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-5 w-32 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                </div>
              ))}
            </div>
          </div>
        </PageContainer>
      </Section>
    </>
  )
}
