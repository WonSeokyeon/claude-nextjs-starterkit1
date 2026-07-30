import Link from "next/link"
import { Sparkles, Code2, Moon, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PageContainer } from "@/components/layout/page-container"
import { Section } from "@/components/layout/section"

const features = [
  {
    icon: Sparkles,
    title: "다크모드 지원",
    description: "next-themes로 라이트/다크/시스템 테마를 손쉽게 전환",
  },
  {
    icon: Code2,
    title: "TypeScript + React 19",
    description: "타입 안전성과 최신 React 기능으로 견고한 개발",
  },
  {
    icon: Zap,
    title: "Tailwind CSS v4",
    description: "CSS 변수 기반 테마 시스템으로 유연한 스타일링",
  },
  {
    icon: Moon,
    title: "shadcn/ui 프리미티브",
    description: "재사용 가능한 고접근성 컴포넌트 기반",
  },
]

const layers = [
  {
    name: "Layer 0 — Primitives",
    description: "shadcn/ui가 제공하는 원자 단위 컴포넌트",
  },
  {
    name: "Layer 1 — Patterns",
    description: "여러 primitive를 조합한 재사용 가능한 부품",
  },
  {
    name: "Layer 2 — Layout",
    description: "페이지 뼈대를 이루는 구조 컴포넌트",
  },
  {
    name: "Layer 3 — Providers",
    description: "앱 전역에 적용되는 컨텍스트",
  },
]

export default function Home() {
  return (
    <>
      {/* 히어로 섹션 */}
      <Section className="py-16 sm:py-24">
        <PageContainer>
          <div className="space-y-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge variant="secondary">Next.js 16</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">Tailwind CSS v4</Badge>
              <Badge variant="secondary">shadcn/ui</Badge>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Next.js Starter Kit
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                모던 웹 개발을 위한 계층적 컴포넌트 아키텍처. 어떤 웹 서비스를
                만들든 바로 시작할 수 있는 견고한 기반입니다.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="#features">특징 알아보기</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="https://github.com">GitHub 보기</Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </Section>

      <Separator />

      {/* 핵심 특징 */}
      <Section id="features">
        <PageContainer>
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">핵심 특징</h2>
              <p className="mt-2 text-muted-foreground">
                어떤 웹 서비스에서도 필요한 요소들이 미리 준비되어 있습니다.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <Card key={feature.title}>
                    <CardHeader>
                      <div className="mb-3 inline-block rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        </PageContainer>
      </Section>

      <Separator />

      {/* 계층 구조 소개 */}
      <Section>
        <PageContainer>
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">계층적 아키텍처</h2>
              <p className="mt-2 text-muted-foreground">
                4단계 계층으로 체계적이고 확장성 있는 컴포넌트 구조
              </p>
            </div>
            <div className="space-y-3">
              {layers.map((layer, idx) => (
                <Card key={layer.name}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Badge
                        variant={
                          idx === 0
                            ? "default"
                            : idx === 1
                              ? "secondary"
                              : "outline"
                        }
                        className="mt-1"
                      >
                        {idx + 1}
                      </Badge>
                      <div>
                        <CardTitle className="text-lg">{layer.name}</CardTitle>
                        <CardDescription>{layer.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </PageContainer>
      </Section>

      <Separator />

      {/* 제작자 소개 (Avatar 활용) */}
      <Section>
        <PageContainer>
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">시작하기</h2>
              <p className="mt-2 text-muted-foreground">
                이 스타터 킷을 기반으로 자신의 프로젝트를 시작하세요.
              </p>
            </div>
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>SK</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <CardTitle>파일 수정해서 바로 시작하세요</CardTitle>
                    <CardDescription className="mt-2">
                      <code className="rounded bg-muted px-2 py-1 text-sm">
                        app/page.tsx
                      </code>
                      {" "}
                      파일을 열어 콘텐츠를 수정하면 바로 적용됩니다. 레이아웃
                      프리미티브(`SiteHeader`, `PageContainer`, `Section` 등)와
                      shadcn 컴포넌트(`Card`, `Badge` 등)를 조립해서 어떤
                      페이지라도 만들 수 있습니다.
                    </CardDescription>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <Button variant="outline" asChild>
                        <Link href="https://nextjs.org/docs">
                          Next.js 문서
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="https://ui.shadcn.com">
                          shadcn/ui 컴포넌트
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </PageContainer>
      </Section>
    </>
  )
}
