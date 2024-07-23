module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^\[(#\d+|no\-issue)\]\s(\w+):\s(.+)$/,
      headerCorrespondence: ['issue', 'type', 'subject'],
    },
  },
  plugins: [
    {
      rules: {
        'header-match-pattern': (parsed) => {
          const { issue, type, subject } = parsed

          if (!issue || !type || !subject) {
            return [
              false,
              'header must be in format "[#IssueNo|no-issue] type: subject" => e.g. [#123] feat: layout 컴포넌트 추가, [no-issue] style: 스타일 변경',
            ]
          }

          return [true, '']
        },
      },
    },
  ],
  // 0: 규칙 비활성화
  // 1: 규칙 활성화. 규칙 위반 시 경고
  // 2: 규칙 활성화. 규칙 위반 시 에러
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'chore', // 빌드 테스트 업데이트, 패키지 매니저 설정, 설정 파일 변경
        'ci', // CI 설정 파일 수정
        'design', // UI 변경
        'docs', // 문서 내용 추가 및 변경
        'typo', // 문서 등 오타 수정
        'feat', // 새로운 기능 추가
        'fix', // 버그 수정
        'perf', // 성능 개선
        'refactor', // 코드 리팩토링, 파일&폴더명 수정하거나 옮기는 경우
        'remove', // 파일 삭제
        'revert', // 커밋한 내용 되돌리는 경우
        'style', // 코드 포맷 변경, 세미 콜론 수정
        'test', // 테스트 추가, 테스트 리팩토링
      ],
    ],
    'header-match-pattern': [2, 'always'],
    'body-max-line-length': [0, 'always'],
    // body 에서 "#" 뒤에 숫자가 포함되었을 때(특히 링크에서) footer 구분이 잘 안될 때가 있어 disable 처리
    'footer-leading-blank': [0, 'always'],
    'footer-max-line-length': [0, 'always'],
  },
}
