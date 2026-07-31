# 현재 변경사항을 의미 단위로 분리하여 커밋

## Context (배경)

이전 세션에서 Playwright MCP를 활용해 웹앱 오류를 진단했고(오류 없음으로 결론), 그 과정에서 프로젝트 루트에 새로운 untracked 파일들이 생겼습니다. 사용자가 이 변경사항을 커밋하되, 의미 있는 단위로 나눠서 커밋해달라고 요청했습니다.

`git status` 확인 결과, 기존에 추적 중인 파일에는 변경사항이 없고(`git diff --stat` 결과 없음), 다음 4개 항목만 untracked 상태입니다:

1. **`.mcp.json`** — Playwright MCP 서버(stdio, `@playwright/mcp@latest`) 등록 설정. 프로젝트 전체에 적용되는 MCP 서버 구성이므로 커밋 가치가 있음.
2. **`.claude/settings.json`** — Claude Code 권한 설정(Bash, PowerShell, WebSearch, WebFetch, `mcp__playwright` 허용 + playwright MCP 서버 활성화). 팀이 공유해야 할 프로젝트 공용 설정.
3. **`.claude/settings.local.json`** — `settings.json`과 **완전히 동일한 내용**(diff 결과 없음). Claude Code 관례상 개인별 로컬 오버라이드 용도이며, 보통 `.gitignore`에 등록해 각자 로컬에서 자유롭게 바꾸도록 둠.
4. **`.claude/plans/*.md`** (2개) — `frolicking-petting-kettle.md`(shadcn/ui 계층 아키텍처 설계 계획, 이전 세션 산출물)와 `playwright-mcp-misty-riddle.md`(이번 오류 진단 계획, 지금 이 파일). 프로젝트 설계 의도를 기록한 문서로서 향후 참고 가치가 있음.
5. **`.playwright-mcp/*`** (로그 4개 + yml 스냅샷 4개) — 방금 진행한 오류 진단 세션 중 Playwright MCP가 자동 생성한 콘솔 로그/페이지 스냅샷. 코드가 아니라 일회성 디버깅 산출물.
6. **`devserver.log`** — 진단 과정에서 `npm run dev`를 백그라운드 실행하며 리다이렉트한 로그 파일. 마찬가지로 일회성 산출물.

사용자에게 확인한 결과:
- `.playwright-mcp/`, `devserver.log` → **`.gitignore`에 추가하고 커밋 제외**
- `.claude/plans/*.md` → **커밋 포함**
- `.claude/settings.local.json` → **`.gitignore`에 추가하고 커밋 제외**
- `.claude/settings.json`, `.mcp.json` → **커밋 포함** (명시적으로 확인되진 않았으나 위 결정들의 논리적 귀결)

## 목표

의미 단위로 분리된 커밋 2~3개를 생성합니다. 코드 변경이 없는 순수 설정/문서 추가 작업이므로, "기능 단위"가 아니라 "관심사 단위"로 분리합니다.

## 실행 단계

### 1. `.gitignore` 갱신 (선행 작업)
`.gitignore`의 `# editor` 섹션 근처에 Claude Code 관련 로컬/임시 산출물 규칙을 추가합니다:
```
# claude code
.claude/settings.local.json
.playwright-mcp/
devserver.log
```
이 변경 자체를 별도로 커밋하지 않고, 아래 커밋 중 하나(도구 설정 커밋)에 함께 포함시킵니다 — `.gitignore` 규칙과 그로 인해 무시되는 대상이 무엇인지 한 커밋 안에서 바로 확인 가능하도록 하기 위함입니다.

### 2. 커밋 분리 계획

**커밋 1 — MCP 및 Claude Code 권한 설정 추가**
- 대상: `.mcp.json`, `.claude/settings.json`, `.gitignore`(수정)
- 메시지(예): `Claude Code에 Playwright MCP 서버 설정 추가`
- 근거: 툴체인/개발 환경 설정이라는 동일한 관심사. `.gitignore` 수정을 여기 포함시켜 `.claude/settings.local.json`과 `.playwright-mcp/`, `devserver.log`가 왜 제외됐는지 하나의 커밋에서 알 수 있게 함.

**커밋 2 — 프로젝트 설계/진단 계획 문서 추가**
- 대상: `.claude/plans/frolicking-petting-kettle.md`, `.claude/plans/playwright-mcp-misty-riddle.md`
- 메시지(예): `프로젝트 설계 및 오류 진단 계획 문서 기록`
- 근거: 코드가 아닌 프로젝트 산출 문서(설계 의도, 진단 이력)라는 동일한 성격. 설정 파일과는 목적이 다르므로 분리.

### 3. 커밋 후 검증
- 각 커밋 후 `git status`로 untracked 항목이 의도대로 줄어드는지 확인
- 최종적으로 `git status`가 clean한지(무시 대상만 남고 untracked 없음) 확인
- `git log --oneline -5`로 커밋 순서와 메시지 확인

## 참고
- 커밋 메시지는 사용자 전역 규칙(CLAUDE.md)에 따라 한글로 작성
- `git add`는 파일을 명시적으로 지정(`git add <path>`)하여 의도치 않은 파일이 섞이지 않도록 함 (`git add -A`/`git add .` 금지)
- 각 커밋 메시지 끝에 `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` 트레일러 포함
