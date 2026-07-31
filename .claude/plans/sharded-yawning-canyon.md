# `/code:review` 커스텀 슬래시 커맨드 신설

## Context (배경)

사용자가 제시한 `/review [코드 또는 변경사항]` 스펙(가독성/성능/안정성 3대 기준 + 총평·개선사항·리팩토링코드 3단 출력)을 그대로 쓰지 않고, 이 프로젝트에 맞게 다듬어 커스텀 커맨드로 만들어달라는 요청입니다.

기존에 이미 `.claude/commands/git/commit.md`라는 커스텀 커맨드가 확립되어 있고, 이 커맨드는 다음과 같은 구조적 관례를 갖고 있습니다(참고: `.claude/commands/git/commit.md:1-11`):
- YAML frontmatter에 `description`(커맨드 목록에 노출되는 한 줄 설명)과 `allowed-tools`(이 커맨드가 사용할 수 있는 도구를 화이트리스트로 제한, 예: `"Bash(git diff:*)"`)를 명시
- 본문은 `# Claude 명령어: <이름>` 제목 → `## 사용법` → `## 프로세스` → 기준/포맷 관련 섹션 → `## 참고사항` 순서로 구성
- 네임스페이스 디렉토리(`git/`)로 분류되어 `/git:commit`으로 호출됨

`/code:review`도 이 관례를 그대로 따라 일관성을 유지합니다. 사용자 확인 결과 리뷰 기준에 프로젝트 고유 규칙(CLAUDE.md에 정의된 레이어드 아키텍처 경계, shadcn CLI 직접수정 금지, Next.js 16 비동기 API 등)을 포함하기로 했습니다.

### 사용자 원안 대비 조정한 지점
- **입력 방식**: 원안은 "입력된 코드"로 모호했으나, 인자(`$ARGUMENTS`)로 특정 파일/경로를 받을 수 있게 하고, 인자가 없으면 `git diff`(staged 있으면 staged, 없으면 unstaged)를 자동으로 리뷰 대상으로 삼도록 명확화 — `/git:commit`이 "스테이지된 파일이 있으면 해당 파일만" 판단하는 방식과 동일한 패턴을 재사용
- **리뷰 기준 4번째 항목 추가**: 원안 3개 기준(가독성/성능/안정성)에 "프로젝트 컨벤션 준수" 기준을 추가 — 이 프로젝트는 `components/ui`(shadcn 관리) 직접 수정 금지, 4계층 폴더 경계(`ui`/`patterns`/`layout`/`providers`), Next.js 16 비동기 `params`/`cookies`/`headers` 같은 이 프로젝트만의 명확한 규칙이 있어 범용 리뷰 기준만으로는 놓치기 쉬움
- **출력 형식 3번째 항목 조건부화**: 원안은 "리팩토링된 최적화 코드 전체"를 항상 출력하도록 되어 있으나, 코드 리뷰 커맨드는 본래 읽기 전용으로 개선점을 짚어주는 것이 목적이라 코드 전체를 매번 재작성해 출력하면 (a) 파일이 클 때 출력이 불필요하게 길어지고 (b) 사용자가 실제로 수정을 원하는지 매번 다르므로, "적용 가능한 실제 코드 diff 또는 스니펫" 형태로 조정하고 실제 파일 수정은 사용자가 원할 때만 진행하도록 명시
- **allowed-tools 제한**: 리뷰는 읽기 전용 작업이므로 `Read`, `Grep`, `Glob`, `Bash(git diff:*)`, `Bash(git status:*)`만 허용 — 커밋/수정 관련 도구는 포함하지 않아 실수로 파일을 바꾸는 일을 방지

## 목표

`D:\claude\claude-nextjs-starterkit\.claude\commands\code\review.md` 파일을 신설합니다.

## 실행 단계

### 1. 디렉토리 생성 및 파일 작성
`.claude/commands/code/review.md`를 다음 구조로 작성합니다.

**Frontmatter:**
```yaml
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
```

**본문 섹션 구성:**
1. `# Claude 명령어: Review` + 한 줄 목적 설명
2. `## 사용법` — `/code:review` (git diff 자동 대상) / `/code:review <파일 경로>` (특정 파일 지정) 두 가지 호출 패턴 예시
3. `## 프로세스`
   1. 인자(`$ARGUMENTS`)가 있으면 해당 파일/경로를 리뷰 대상으로, 없으면 `git status`로 staged 여부 확인 후 `git diff --staged` 또는 `git diff`로 대상 확정
   2. 대상 코드/변경사항 읽기
   3. 아래 4대 기준으로 분석
   4. 지정된 출력 형식으로 결과 작성
4. `## 리뷰 기준` — 4개 항목
   - **가독성 & 유지보수성**: 변수/함수명, 중복 코드, 컴포넌트 분리 필요성
   - **성능 & 효율성**: 불필요한 리렌더링(`useEffect`/`useMemo`/`useCallback` 의존성 배열, key prop), 메모리 누수(cleanup 함수), 비동기 처리(불필요한 waterfall, 에러 미처리 Promise)
   - **예외 처리 & 안정성**: edge case, null/undefined 체크, TypeScript 타입 안정성(`any` 남용, 타입 단언 오남용)
   - **프로젝트 컨벤션 준수** (이 프로젝트 고유): `components/ui/` 직접 수정 여부, 4계층(`ui`→`patterns`→`layout`→`providers`) 경계 위반 여부, 폴더 깊이 2단계 원칙 준수, Next.js 16 비동기 API(`params`/`searchParams`/`cookies`/`headers`) 사용 시 `await` 누락 여부, 검증된 라이브러리(react-hook-form+zod, sonner, next-themes) 대신 직접 구현하지 않았는지
5. `## 출력 형식`
   - `🛠 총평 및 주요 포인트 summary`
   - `🔍 개선 필요 사항` (파일:라인 + 이유 설명, 심각도 없으면 생략 가능하다는 안내)
   - `✨ 개선 제안` — 전체 파일 재작성이 아니라 변경이 필요한 부분의 diff/스니펫 형태로 제시하고, "실제 파일에 적용할지 사용자에게 먼저 확인 후 진행" 문구 포함
6. `## 참고사항`
   - 리뷰는 읽기 전용 — 사용자가 명시적으로 요청하기 전까지 파일을 수정하지 않음
   - 개선점이 없으면 "특이사항 없음"으로 짧게 보고 (억지로 트집 잡지 않음)

### 2. 검증
- 파일 작성 후 `.claude/commands/code/review.md`가 `.claude/commands/git/commit.md`와 동일한 frontmatter/섹션 스타일을 따르는지 육안 대조
- 실제로 `/code:review`를 호출해 (a) 인자 없이 현재 diff 대상, (b) 특정 파일 경로 인자 두 케이스가 의도대로 동작하는지 확인
