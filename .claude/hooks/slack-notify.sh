#!/bin/bash

# Claude Code → Slack 알림 훅 스크립트
# stdin으로 들어온 JSON 이벤트를 파싱하여 Slack Webhook으로 메시지 전송
# 실패해도 Always exit 0 으로 Claude Code 동작을 막지 않음

# .env 파일이 있으면 환경변수로 로드 (SLACK_WEBHOOK_URL 등)
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
env_file="$script_dir/../../.env"
if [ -f "$env_file" ]; then
  set -a
  source "$env_file"
  set +a
fi

# Webhook URL이 비어있으면 조용히 종료
if [ -z "$SLACK_WEBHOOK_URL" ]; then
  exit 0
fi

# stdin에서 JSON 전체 읽기
json_input=$(cat)

# jq 존재 여부를 미리 확인 (효율성)
has_jq=0
command -v jq &> /dev/null && has_jq=1

# jq가 있으면 jq 사용, 없으면 grep/sed로 fallback
parse_json() {
  local key="$1"
  if [ "$has_jq" -eq 1 ]; then
    echo "$json_input" | jq -r ".${key} // empty" 2>/dev/null
  else
    # grep + sed로 "key": "value" 패턴 추출
    echo "$json_input" | grep -o "\"${key}\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | cut -d'"' -f4
  fi
}

# JSON 문자열 값 이스케이프 (jq 미사용 fallback용)
json_escape() {
  local s="$1"
  s="${s//\\/\\\\}"
  s="${s//\"/\\\"}"
  printf '%s' "$s"
}

# 필드 추출
hook_event_name=$(parse_json "hook_event_name")
notification_type=$(parse_json "notification_type")
cwd=$(parse_json "cwd")

# cwd에서 basename만 추출 (경로 간단히)
project_name=$(basename "$cwd" 2>/dev/null || echo "unknown")

# 메시지 구성
slack_message=""
case "$hook_event_name" in
  Notification)
    case "$notification_type" in
      permission_prompt)
        slack_message="🔐 권한 요청 대기 중 ($project_name)"
        ;;
      idle_prompt)
        slack_message="💤 유휴 상태 ($project_name)"
        ;;
      *)
        slack_message="📢 알림 ($project_name)"
        ;;
    esac
    ;;
  Stop)
    slack_message="✅ 작업 완료 ($project_name)"
    ;;
  *)
    # 알 수 없는 이벤트도 조용히 무시
    exit 0
    ;;
esac

# 메시지가 구성되지 않으면 종료
if [ -z "$slack_message" ]; then
  exit 0
fi

# Slack Block Kit payload 구성
# jq가 있으면 jq로 안전하게 JSON 생성 (이스케이프까지 jq가 전담)
if [ "$has_jq" -eq 1 ]; then
  payload=$(jq -n --arg text "$slack_message" \
    '{blocks: [{type: "section", text: {type: "mrkdwn", text: $text}}]}')
else
  escaped_message=$(json_escape "$slack_message")
  payload="{
    \"blocks\": [
      {
        \"type\": \"section\",
        \"text\": {
          \"type\": \"mrkdwn\",
          \"text\": \"$escaped_message\"
        }
      }
    ]
  }"
fi

# payload를 임시 파일에 UTF-8(BOM 없이)로 기록 후 curl --data-binary @file 로 전송
# 이유: Git Bash에서 네이티브 Windows curl.exe(mingw64 빌드)로 커맨드라인 인자를
#      직접 넘기면, Win32 프로세스 생성 경로에서 시스템 ANSI 코드페이지(CP949 등)를
#      거치며 UTF-8 바이트가 깨짐(mojibake). 파일로 넘기면 이 경로를 우회할 수 있음.
tmpfile=$(mktemp) || exit 0
trap 'rm -f "$tmpfile"' EXIT
printf '%s' "$payload" > "$tmpfile" || exit 0

# Slack으로 전송
# 실패해도 exit 0으로 유지 (알림 실패가 Claude Code를 막지 않도록)
curl --max-time 5 -X POST "$SLACK_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  --data-binary @"$tmpfile" 2>/dev/null

exit 0
