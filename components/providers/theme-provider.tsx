"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// next-themes의 ThemeProvider를 감싸는 클라이언트 컴포넌트
// app/layout.tsx를 서버 컴포넌트로 유지하기 위해 분리
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
