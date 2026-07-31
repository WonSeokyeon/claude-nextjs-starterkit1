---
description: "가독성·성능·안정성·프로젝트 컨벤션 기준으로 코드를 심층 리뷰합니다"
allowed-tools:
  [
    "Read",
    "Grep",
    "Glob",
    "Bash(git diff:*)",
    "Bash(git status:*)",
  ]
---

# Claude 명령어: Review

입력된 코드를 심층적으로 분석하고 개선점을 제안합니다.

## 사용법

```
/code:review
```
현재 git 변경사항(staged 있으면 staged, 없으면 unstaged)을 자동 리뷰 대상으로 삼습니다.

```
/code:review <파일 경로>
```
특정 파일(예: `components/patterns/theme-toggle.tsx`)을 지정해 리뷰합니다.

## 프로세스

1. 인자 여부 확인 — `$ARGUMENTS`가 있으면 해당 파일/경로를 리뷰 대상으로, 없으면 `git status`로 staged 파일 존재 확인 후 `git diff --staged` 또는 `git diff`로 대상 확정
2. 대상 코드/변경사항 읽기
3. 아래 4대 기준으로 분석
4. 지정된 출력 형식으로 결과 작성

## 리뷰 기준

### 1. 가독성 & 유지보수성
- 변수/함수명이 의도를 명확히 드러내는가
- 중복 코드가 없거나 적절히 추상화되었는가
- 컴포넌트 분리가 필요한 경우는 없는가 (과도한 크기, 책임 혼재)

### 2. 성능 & 효율성
- 불필요한 리렌더링은 없는가 (`useEffect`, `useMemo`, `useCallback` 의존성 배열 검증, `key` prop 누락)
- 메모리 누수 위험은 없는가 (cleanup 함수, 타이머/리스너 제거)
- 비동기 처리가 최적화되었는가 (waterfall 방지, 에러 미처리 Promise 없음, 불필요한 `await` 중첩 없음)

### 3. 예외 처리 & 안정성
- edge case를 적절히 처리했는가
- null/undefined 체크가 충분한가
- TypeScript 타입이 안전한가 (`any` 남용 없음, 타입 단언 오남용 없음, 비옵셔널 타입에 undefined 대입 없음)

### 4. 프로젝트 컨벤션 준수 (이 프로젝트 고유)
- `components/ui/` 파일을 직접 수정하지는 않았는가 (shadcn CLI 관리 영역이므로 `shadcn diff` 호환성 유지 필수)
- 4계층(`ui` → `patterns` → `layout` → `providers`) 경계를 위반하지 않았는가 (예: patterns 파일이 layout 파일을 임포트하면 안 됨)
- 폴더 깊이가 `components/<layer>/<name>.tsx` 2단계로 유지되었는가 (하위 폴더 없음)
- Next.js 16 비동기 API(`params`, `searchParams`, `cookies`, `headers`)를 사용했다면 `await`를 붙였는가
- 검증된 라이브러리(react-hook-form + zod, sonner, next-themes) 대신 직접 구현한 부분은 없는가

## 출력 형식

### 🛠 총평 및 주요 포인트 summary
— 1~2 문장 (또는 bullet 3개 이하)으로 리뷰 대상 코드의 전반적 품질, 강점, 주요 이슈를 간결히 정리합니다.

### 🔍 개선 필요 사항
— 파일명:라인번호 형식으로 각 이슈를 나열하고 이유를 설명합니다. 개선점이 없으면 이 섹션 자체를 생략 가능합니다.

예:
```
- components/patterns/my-button.tsx:15 — setIsLoading의 의존성 배열에 isDisabled 누락 (isDisabled 변경 시 useEffect 미재실행)
- app/page.tsx:42 — cookies() 호출에 await 누락 (Next.js 16에서 required)
```

### ✨ 개선 제안
— 전체 파일 재작성이 아니라, 변경이 필요한 부분의 diff 또는 스니펫 형태로 제시합니다. 파일이 크거나 변경 범위가 크면 대표적인 부분만 보여줍니다.

예:
```diff
- const handleClick = () => {
-   setCount(count + 1);
- }
+ const handleClick = useCallback(() => {
+   setCount(c => c + 1);
+ }, [])
```

마지막에 "위 제안을 실제 파일에 적용할지 확인 후 진행하겠습니다."라는 문구를 포함해 사용자가 명시적으로 수정을 요청할 때만 파일을 편집하도록 합니다.

## 참고사항

- 리뷰는 **읽기 전용** — 사용자가 명시적으로 요청하기 전까지 파일을 수정하지 않습니다
- 개선점이 없거나 미미한 경우, 억지로 트집 잡지 않고 "특이사항 없음" 또는 "코드 품질이 양호합니다" 정도로 짧게 보고합니다
- 프로젝트 컨벤션 위반(예: `components/ui/` 직접 수정, 계층 경계 위반)은 다른 기준의 이슈보다 **높은 우선순위**로 지적합니다
