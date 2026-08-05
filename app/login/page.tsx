import { Metadata } from "next"

import { LoginForm } from "@/components/patterns/login-form"
import { Section } from "@/components/layout/section"
import { PageContainer } from "@/components/layout/page-container"

export const metadata: Metadata = {
  title: "로그인 | Next.js Starter Kit",
  description: "계정에 로그인하여 서비스를 이용하세요",
}

export default function LoginPage() {
  return (
    <Section className="flex flex-1 items-center py-12 sm:py-16">
      <PageContainer className="max-w-sm">
        <LoginForm />
      </PageContainer>
    </Section>
  )
}
