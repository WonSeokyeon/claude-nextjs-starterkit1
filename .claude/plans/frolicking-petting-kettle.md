# Next.js Starter Kit — 계층적 컴포넌트/레이아웃 아키텍처

## Context
이 프로젝트에는 Next.js 16.2.12(App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui(style: `radix-nova`, baseColor: `neutral`) + lucide-react가 이미 설치되어 있고, shadcn init(`components.json`, `button` 컴포넌트, `lib/utils.ts`)까지 끝난 상태입니다. `app/layout.tsx`/`app/page.tsx`는 여전히 create-next-app 데모 그대로입니다.

이번 요청은 특정 페이지 하나를 예쁘게 만드는 것이 아니라, **"어떤 웹 서비스를 만들든 재사용 가능한 기반"을 계층적으로 구축**하는 것입니다. 사용자가 명시한 4단계 원칙:
1. 어떤 웹에서도 필요한 범용 컴포넌트/레이아웃을 먼저 정리
2. 효과적으로 쓸 수 있도록 컴포넌트를 계층으로 분류
3. shadcn/ui 컴포넌트로 레이아웃을 구현 (커스텀 CSS 최소화)
4. 바퀴를 재발명하지 않고 검증된 유명 라이브러리를 활용

**범위 확정**(사용자 확인 완료): UI 레이아웃 + 핵심 기능 버튼(다크모드, 폼 검증, 토스트, 로딩/에러 경계) 포함. 데이터 테이블·인증·데이터페칭 라이브러리는 제외. 페이지는 레이아웃 프리미티브 조립 확인용 홈 1개만 — 로그인/대시보드 같은 실제 템플릿은 만들지 않음. 랜딩 페이지 문구는 한국어.

**Next.js 16 유의사항**: 설치된 버전은 16.2.12(다운그레이드 안 함). `next lint` 제거로 `package.json`의 `"lint": "eslint"`가 이미 반영됨, Turbopack이 기본값. 이번 범위에서 middleware/proxy나 비동기 params API를 직접 다루지 않으므로 큰 영향은 없음.

## 사전 확인된 사실
- `app/globals.css`에 `.dark` 셀렉터 다크모드 CSS 변수와 `@custom-variant dark (&:is(.dark *))`가 이미 완비 — `next-themes`가 `<html>` class만 토글하면 즉시 동작.
- `app/layout.tsx`의 `<html>`에 `suppressHydrationWarning` 없음 — 추가 필요.
- `components/ui/button.tsx`는 `data-slot`/`data-variant`/`data-size` 컨벤션, `radix-ui` 통합 패키지 사용 — 새 컴포넌트도 이 컨벤션을 따름(shadcn CLI가 자동 처리).
- `tsconfig.json`의 `"@/*": ["./*"]` 단일 alias로 새 폴더(`components/patterns` 등)도 별도 설정 없이 커버됨.

## 계층 구조 설계

shadcn CLI가 관리하는 `components/ui/`(primitive)를 건드리지 않는 것을 최우선 원칙으로, 그 위에 얕은 계층만 추가합니다. Atomic Design의 5단계를 그대로 쓰지 않는 이유는 이번 범위(페이지 템플릿 제외)에서 "templates/pages" 계층이 비어 혼란만 주기 때문입니다 — 실제로 쓰이는 계층만 만듭니다.

```
components/
  ui/            Layer 0 — shadcn CLI 관리 primitive. 직접 수정 최소화
  patterns/      Layer 1 — primitive 조합, 도메인 무관 재사용 "부품"
  layout/        Layer 2 — 페이지 뼈대를 이루는 "구조" 컴포넌트
  providers/     Layer 3 — 전역 컨텍스트/전역 UI (children을 감싸는 wrapper)
```

- Layer 0/1 경계: "shadcn CLI가 생성·관리하는가"로 기계적으로 구분 (향후 `shadcn diff` 재적용 호환성).
- Layer 1/2 경계: "콘텐츠(무엇을 보여줄지) 부품이냐 vs 구조(어디에 배치되는지)냐". ThemeToggle·EmptyState는 어디 놓여도 동일 동작(patterns), SiteHeader·PageContainer는 위치가 고정된 뼈대(layout).
- Providers를 layout과 분리하는 이유: 렌더링 결과물이 아니라 `children`을 감싸는 컨텍스트 공급자라 역할이 다름.
- 폴더 깊이는 `components/<layer>/<name>.tsx` 2단계로 고정, 레이어 내부 추가 하위 폴더 없음 — 이 규모의 starter kit에서는 파일명만으로 충분히 식별 가능.

## "어떤 웹에서도 필요한" 컴포넌트/레이아웃 목록

| 카테고리 | 항목 | 근거 |
|---|---|---|
| 레이아웃 구조 | SiteHeader, SiteFooter, PageContainer, Section | 상단 네비/브랜드, 하단 정보, 콘텐츠 폭 제한, 수직 리듬 구분은 서비스 무관 공통 |
| 테마 | ThemeToggle | 라이트/다크 지원은 현재 사용자 기대치 |
| 상태 표현 | Skeleton(로딩), EmptyState, Error fallback, 404 | 비동기 렌더링·빈 목록·런타임 에러·잘못된 경로는 모든 앱에서 발생 가능 |
| 피드백 | Toast(Sonner), Alert | 액션 결과 비침투적 알림, 정적 경고 메시지는 범용 UX 패턴 |
| 폼 | shadcn Form(react-hook-form+zod 통합), 제출 버튼 상태 | 사용자 입력을 받는 모든 서비스의 최소 단위 |
| 데이터 표시 | Card, Badge, Separator, Avatar | 콘텐츠 그룹화, 상태 라벨, 구분선, 사용자 식별은 거의 모든 UI에 등장 |

데이터 테이블/인증/복잡 네비게이션(Breadcrumb 등)은 범위 밖이라 제외.

## 검증된 라이브러리 선정 ("바퀴를 재발명하지 않는다")

| 기능 | 라이브러리 | 설치 방식 | 근거 |
|---|---|---|---|
| 다크모드 | `next-themes` | `npm install` | Next.js App Router 사실상 표준. class 전략으로 Tailwind `dark:`와 완벽 호환, SSR FOUC 방지 |
| 폼 검증 | `react-hook-form` + `zod` + `@hookform/resolvers` | `npm install` | shadcn 공식 Form 컴포넌트가 채택한 조합. 비제어 컴포넌트로 리렌더링 최소화 + 타입-세이프 스키마 |
| 토스트 | `sonner` | `npm install` (shadcn add 시 자동 설치 여부 확인 필요) | shadcn이 구 toast를 deprecated 처리하고 공식 채택한 라이브러리 |
| 로딩/에러 경계 | 없음 — Next.js App Router 컨벤션(`loading.tsx`/`error.tsx`/`not-found.tsx`) | 프레임워크 내장 | 프레임워크 자체가 제공하는 검증된 표준. 시각 요소만 shadcn `skeleton`/`alert` 사용 |

## shadcn 컴포넌트 설치 목록

```bash
npx shadcn add card badge separator dropdown-menu avatar sonner form input label skeleton alert
```
`input`/`label`/`form`은 이번 페이지에서 실제로 인터랙션으로 노출하지는 않지만, "폼 검증까지 포함"이 확정 범위이므로 설치·배선까지 완료해 즉시 쓸 수 있는 상태로 준비합니다(실제 폼 데모는 넣지 않음 — 아래 판단 근거 참고).

## 실행 순서

1. **npm 패키지 설치**
   ```bash
   npm install next-themes react-hook-form zod @hookform/resolvers sonner
   ```
2. **shadcn 컴포넌트 설치**: 위 `npx shadcn add ...` 명령. 설치 후 `react-hook-form`/`zod`/`sonner`가 중복 설치되지 않는지 `package.json` 확인.
3. **Layer 3 (providers) 생성**: `components/providers/theme-provider.tsx` — next-themes `ThemeProvider`를 `"use client"`로 래핑.
4. **Layer 1 (patterns) 생성**:
   - `components/patterns/theme-toggle.tsx` — DropdownMenu + Button(ghost, icon) + Sun/Moon 아이콘 교차 애니메이션, `useTheme()` 사용
   - `components/patterns/empty-state.tsx` — Card 기반, 아이콘+제목+설명+옵션 액션 버튼 슬롯(props화, 404 페이지와 향후 "검색결과 없음" 등에 재사용)
5. **Layer 2 (layout) 생성**:
   - `components/layout/page-container.tsx` — `mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8`
   - `components/layout/section.tsx` — `py-12 sm:py-16`
   - `components/layout/site-header.tsx` — sticky + `border-b` + `bg-background/95 backdrop-blur`, PageContainer 내부에 브랜드/nav/ThemeToggle
   - `components/layout/site-footer.tsx` — Separator(상단 구분선) + PageContainer, 저작권/보조 링크
6. **`app/layout.tsx` 수정**:
   - `<html lang="ko" suppressHydrationWarning>`
   - `<body>`를 `ThemeProvider`(`attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`)로 감싸고 내부에 `SiteHeader` + `<main className="flex flex-1 flex-col">{children}</main>` + `SiteFooter` + `Toaster`(sonner) 배치
   - `metadata`를 한국어 범용 문구로 교체 (예: `title: "Next.js Starter Kit"`)
   - Geist 폰트 유지
7. **`app/page.tsx` 교체**: create-next-app 데모 제거, 새 레이어 조립 데모로 구성
   - Section+PageContainer 히어로(제목/부제 한국어 + Badge 상태표시 + Button CTA)
   - Card 그리드(다크모드/반응형 레이아웃/폼 검증 준비완료 등 특징 소개, Badge+아이콘+설명)
   - Avatar+Separator를 쓴 간단한 소개 블록 1개(primitive 조합 확인용)
   - 폼은 실제로 렌더링하지 않음
8. **`app/loading.tsx` 신규**: Skeleton 여러 개로 페이지 골격 표현
9. **`app/error.tsx` 신규**: `"use client"`, `error`/`reset` props, Alert(destructive)+재시도 Button
10. **`app/not-found.tsx` 신규**: EmptyState 패턴 재사용, 홈으로 돌아가기 링크

## 애매했던 지점의 판단 근거
- **폼을 랜딩 페이지에 넣지 않음**: "레이아웃 프리미티브 조립 확인용"이라는 페이지 목적과 실제 폼 인터랙션은 결이 다름. Form/react-hook-form/zod는 설치·배선만 완료해 이후 실제 폼이 필요한 페이지에서 바로 꺼내 쓸 수 있게 준비.
- **`<html lang>`을 `"ko"`로 변경**: 페이지 문구가 한국어로 확정되었으므로 실제 콘텐츠 언어와 일치시킴(접근성/SEO 관례).
- **EmptyState를 patterns에 배치**: 404뿐 아니라 향후 "검색결과 없음" 등에도 재사용 가능하도록 범용 컴포넌트로 설계.
- **error.tsx에서 Alert를 직접 사용, 별도 패턴 컴포넌트 미생성**: 사용처가 한 곳뿐이라 패턴화할 재사용성이 아직 없음(과설계 방지).

## 검증
- `npm run dev`로 로컬 구동 후: 다크모드 토글(라이트/다크/시스템) 동작, `<html class="dark">` 토글 확인, hydration 경고 없음 확인
- 랜딩 페이지의 Card/Badge/Avatar/Separator 정상 렌더링 확인
- 강제 에러 발생시켜 `app/error.tsx` 동작 확인, 존재하지 않는 경로 접근해 `app/not-found.tsx` 확인
- `npm run lint` 통과 확인 (Next 16 기준 `eslint` 직접 실행)
- `npm run build`로 타입/빌드 에러 없는지 확인
