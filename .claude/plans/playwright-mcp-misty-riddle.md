# CLAUDE.md 생성

## Context (배경)

`/init` 명령으로 이 저장소용 `CLAUDE.md`를 새로 생성해달라는 요청입니다. 현재 프로젝트 루트의 `CLAUDE.md`는 `@AGENTS.md` 한 줄만 있어(AGENTS.md를 import), Claude Code에게 프로젝트 고유의 명령어나 아키텍처 정보를 전혀 제공하지 못하고 있습니다. `AGENTS.md`는 "설치된 Next.js 16이 학습 데이터와 다르니 `node_modules/next/dist/docs/`를 먼저 읽어라"는 한 가지 경고만 담고 있습니다.

이 요청은 새 코드를 작성하는 것이 아니라, 이미 조사된 프로젝트 구조와 설계 의도를 압축해 향후 세션이 빠르게 생산적으로 작업할 수 있도록 문서화하는 작업입니다. 이미 이번 세션과 이전 세션에서 프로젝트를 충분히 조사했으므로 추가 Explore/Plan 서브에이전트 없이 바로 작성 계획을 세웁니다.

### 조사된 사실

**명령어** (`package.json`):
- `npm run dev` — Turbopack 기반 개발 서버 (Next.js 16부터 Turbopack이 기본값)
- `npm run build` — 프로덕션 빌드
- `npm run start` — 프로덕션 서버 실행
- `npm run lint` — `eslint` 직접 실행 (Next.js 16에서 `next lint` 명령 자체가 제거되었기 때문에 `"lint": "eslint"`로 되어 있음 — 표준이 아니라 버전 변경에 따른 의도적 조치)
- 단일 테스트 실행 명령 없음 — 테스트 프레임워크 자체가 설치되어 있지 않음(`package.json`에 jest/vitest/playwright-test 등 없음). "테스트 없음"을 명시해야 함.
- 타입 체크: 전용 스크립트는 없지만 `npx tsc --noEmit`으로 확인 가능(이전 세션에서 사용, 에러 0건 확인됨)

**핵심 아키텍처 — 계층적 컴포넌트 구조** (`.claude/plans/frolicking-petting-kettle.md`에서 발췌, 가장 중요한 섹션):
```
components/
  ui/            Layer 0 — shadcn CLI가 생성·관리하는 primitive. 직접 수정 최소화
  patterns/      Layer 1 — primitive 조합, 도메인 무관 재사용 "부품" (예: ThemeToggle, EmptyState)
  layout/        Layer 2 — 페이지 뼈대를 이루는 "구조" 컴포넌트 (예: SiteHeader, PageContainer, Section)
  providers/     Layer 3 — 전역 컨텍스트/전역 UI, children을 감싸는 wrapper (예: ThemeProvider)
```
- Layer 0/1 경계 기준: "shadcn CLI가 생성·관리하는가" (향후 `shadcn diff` 재적용 호환성 유지 목적)
- Layer 1/2 경계 기준: "콘텐츠(무엇을 보여줄지) 부품이냐 vs 구조(어디에 배치되는지)냐"
- Providers가 layout과 분리된 이유: 렌더링 결과물이 아니라 children을 감싸는 컨텍스트 공급자라 역할이 다름
- 폴더 깊이는 `components/<layer>/<name>.tsx` 2단계로 고정 — 하위 폴더 없음

이 구조는 Atomic Design 5단계를 그대로 쓰지 않고, 이 프로젝트 범위(페이지 템플릿 제외)에서 실제로 쓰이는 계층만 남긴 의도적 설계입니다.

**Next.js 16 관련 특이사항** (AGENTS.md + `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`에서 확인):
- 설치된 버전은 `next@16.2.12`, `react@19.2.4` — 학습 데이터보다 최신이라 관례가 다를 수 있음. 코드 작성 전 `node_modules/next/dist/docs/`의 관련 문서를 먼저 확인해야 함(AGENTS.md 지시사항, 이미 CLAUDE.md에 `@AGENTS.md`로 포함되어 있으니 새 CLAUDE.md에서 중복 서술 불필요 — 다만 실용적 포인트만 요약)
- Turbopack이 `next dev`/`next build`에 기본 적용
- `next lint` 명령 제거 → `eslint` 직접 사용
- `params`/`searchParams`/`cookies`/`headers` 완전 비동기화(이 프로젝트는 현재 라우트 파라미터를 쓰지 않아 해당 없음이지만, 향후 라우트 추가 시 유의 필요)

**shadcn/ui 설정** (`components.json`):
- `style: "radix-nova"` (최신 shadcn 프리셋), `baseColor: "neutral"`, `iconLibrary: "lucide"`
- Tailwind CSS v4 방식: `app/globals.css`에서 `@import "shadcn/tailwind.css"`로 CSS 변수/유틸리티를 불러옴 (npm 패키지 `shadcn`이 CSS 자산까지 배포하는 최신 방식 — 과거 CLI 전용 방식과 다름)
- 다크모드는 `next-themes`(class 전략) + `@custom-variant dark (&:is(.dark *))` 조합으로 동작, `<html>`에 `suppressHydrationWarning` 필수
- `components/ui/`는 shadcn CLI(`npx shadcn add <name>`)로만 추가/갱신 — 수동 편집 최소화 원칙

**라우트/파일 구조**:
- App Router, 페이지는 홈(`/`) 1개뿐
- `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx`가 Next.js 컨벤션대로 구현되어 있고 각각 Skeleton/Alert/EmptyState(patterns)를 재사용
- `src/` 디렉토리 없음 — `app/`, `components/`, `lib/`가 프로젝트 루트에 직접 위치, `tsconfig.json`의 `"@/*": ["./*"]` alias로 접근

**검증된 라이브러리 스택** (바퀴 재발명 방지 원칙, frolicking-petting-kettle.md 표에서 발췌):
| 기능 | 라이브러리 |
|---|---|
| 다크모드 | next-themes |
| 폼 검증 | react-hook-form + zod + @hookform/resolvers (설치·배선만 완료, 실제 폼 미노출) |
| 토스트 | sonner |
| 로딩/에러 경계 | Next.js App Router 내장 컨벤션(loading/error/not-found) |

## 목표

위 조사 내용을 압축하여 `D:\claude\claude-nextjs-starterkit\CLAUDE.md`를 작성합니다. 현재 파일은 `@AGENTS.md` 한 줄뿐이므로, 이를 유지하면서(AGENTS.md의 경고는 여전히 유효하고 중요) 그 아래에 명령어와 아키텍처 섹션을 추가합니다.

## 실행 단계

1. **명령어 필수 안내 텍스트로 시작**: 요청에 명시된 접두사를 정확히 포함
   ```
   # CLAUDE.md

   This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
   ```
2. **`@AGENTS.md` 참조 유지**: 기존 최상단 지시(Next.js 16 문서 우선 확인)를 그대로 보존 — 삭제하면 안 됨. 이 지시는 이미 실전에서 유용함이 검증됨(이전 세션에서 이 지시 덕분에 `node_modules/next/dist/docs/`를 먼저 확인하고 정확한 breaking change 목록을 파악할 수 있었음).
3. **Commands 섹션**: dev/build/start/lint, 타입체크(`npx tsc --noEmit`), 테스트 프레임워크 부재 명시
4. **Architecture 섹션**: 계층적 컴포넌트 구조(Layer 0~3)와 각 계층 경계 판단 기준을 표/목록으로 정리. shadcn/ui 설정 특이사항(radix-nova 스타일, `shadcn/tailwind.css` import 방식), 다크모드 동작 원리, 검증된 라이브러리 스택을 포함.
5. **불필요한 내용 배제**: README.md는 create-next-app 기본 템플릿 그대로라 프로젝트 고유 정보 없음 → 참조하지 않음. "에러 핸들링을 잘 하라" 같은 일반론, 컴포넌트 파일 전체 목록 나열(쉽게 재발견 가능)은 넣지 않음.

## 검증
- 작성된 CLAUDE.md가 간결하게 스캔 가능한 분량인지(과도하게 길지 않은지) 확인
- `@AGENTS.md` 참조가 보존되었는지 확인
- 요청된 접두사 텍스트가 정확히 포함되었는지 확인
