# Update Plan: v15.0.0-canary.82 -> v16.1.6

## 목표

- 기준 원문(`v15.0.0-canary.82`) 대비 최신 안정 버전(`v16.1.6`)의 변경점을 반영한다.
- 한글 문서 품질과 일관성을 유지하기 위해 규칙/용어집 기반 번역 프로세스를 적용한다.

## 기준 정보

- 기준 A (과거): `v15.0.0-canary.82`
- 기준 B (대상): `v16.1.6` (릴리스 날짜: 2025-10-14)
- 한국어 문서 루트: `pages/docs/**`
- 참고 기준 스냅샷: `origin/canary/docs/**`

## 산출물

1. 원문 변경 목록: `artifacts/docs-diff-v15c82_to_v16.1.6.tsv`
2. 번역 작업 백로그: `artifacts/ko-update-backlog-v16.1.6.csv`
3. 운영 기준 문서: `docs/translation-rules.md`
4. 용어 표준 문서: `docs/translation-glossary.csv`

## 실행 단계

### Phase 1. 원문 diff 수집

- `docs/**` 범위로 파일 단위 변경(`A/M/D/R`)과 라인 수를 추출한다.
- 카테고리별(app/pages/architecture/api-reference/getting-started)로 집계한다.

### Phase 2. KO 매핑/분류

- 원문 경로를 KO 문서(`pages/docs/**`)로 매핑한다.
- 아래 상태로 자동 분류한다.
  - `NEW_TRANSLATION` (영문 신규, KO 없음)
  - `UPDATE_REQUIRED` (영문 수정, KO 기존 존재)
  - `REMOVE_OR_REDIRECT` (영문 삭제/이동 대응 필요)
  - `REVIEW_MANUAL` (자동 매핑 실패)

### Phase 3. 우선순위 큐 구성

- P0: API/설정/라우팅/캐싱/런타임
- P1: 핵심 가이드/아키텍처
- P2: 예시/표현/경미 변경
- 점수 기준: `영향도 + 변경량 + 사용자 노출도`

### Phase 4. 번역 수행 기준 적용

- 모든 작업은 `docs/translation-rules.md`를 준수한다.
- 용어 번역은 `docs/translation-glossary.csv`를 기준으로 통일한다.
- 신규 용어 등장 시 본문 번역 전에 용어집을 먼저 업데이트한다.

### Phase 5. 검증/배포

- 링크, 경로, 헤딩, 코드 블록 정확성 검증
- 문서 빌드 확인
- 반영 범위 및 미반영 항목을 릴리스 노트 형태로 공유

## PR 운영 템플릿 (요약)

- 원문 기준: `v15.0.0-canary.82...v16.1.6`
- 대상 섹션: (예: `app/api-reference`)
- 체크:
  - [ ] translation-rules 준수
  - [ ] glossary 준수/갱신
  - [ ] 링크/빌드 확인
  - [ ] 리뷰 코멘트 반영

## 주간 운영 권장

- 주 1~2회 배치 PR
- PR당 10~20 문서 내외로 제한
- 매주 `REVIEW_MANUAL` 큐를 정리해 매핑 누락을 줄인다.
