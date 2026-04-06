import type { ToolEnhancement } from "../tools";

export const LINUX_ENHANCEMENTS: Record<string, ToolEnhancement> = {
  "cron-parser": {
    howTo: {
      steps: [
        {
          ko: "Cron 표현식 입력란에 '*/5 * * * *' 같은 표현식을 입력합니다.",
          en: "Enter a cron expression like '*/5 * * * *' in the input field.",
        },
        {
          ko: "실시간으로 변환된 사람이 읽을 수 있는 설명을 확인합니다.",
          en: "Review the real-time human-readable description of the expression.",
        },
        {
          ko: "다음 실행 예정 시간 목록으로 스케줄이 의도한 대로인지 검증합니다.",
          en: "Verify the schedule is correct by checking the upcoming execution times.",
        },
        {
          ko: "필요에 따라 5필드(표준) 또는 6필드(초 포함) 모드를 선택합니다.",
          en: "Choose between 5-field (standard) or 6-field (with seconds) mode as needed.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "리눅스 작업 스케줄링",
          en: "Linux Job Scheduling",
        },
        description: {
          ko: "crontab은 리눅스/유닉스에서 반복 작업을 자동화하는 핵심 도구입니다. 백업, 로그 정리, 시스템 모니터링 등 정기 작업을 시간 기반으로 예약할 수 있습니다.",
          en: "crontab is a core tool for automating recurring tasks on Linux/Unix systems. It enables time-based scheduling for backups, log rotation, system monitoring, and other periodic operations.",
        },
      },
      {
        title: {
          ko: "CI/CD 스케줄 트리거",
          en: "CI/CD Schedule Triggers",
        },
        description: {
          ko: "GitHub Actions, GitLab CI, Jenkins 등 CI/CD 도구는 cron 표현식을 사용하여 파이프라인을 주기적으로 실행합니다. 야간 빌드, 정기 테스트, 배포 자동화에 활용됩니다.",
          en: "CI/CD tools such as GitHub Actions, GitLab CI, and Jenkins use cron expressions to trigger pipelines on a schedule. Commonly used for nightly builds, periodic tests, and deployment automation.",
        },
      },
      {
        title: {
          ko: "Cron 보안 고려사항",
          en: "Cron Security Considerations",
        },
        description: {
          ko: "/etc/cron.allow와 /etc/cron.deny 파일로 cron 사용 권한을 제어할 수 있습니다. cron 작업은 실행 사용자의 권한으로 동작하므로, 최소 권한 원칙을 적용해야 합니다.",
          en: "Access to cron can be controlled via /etc/cron.allow and /etc/cron.deny files. Cron jobs run with the invoking user's permissions, so the principle of least privilege should be applied.",
        },
      },
    ],
    relatedTools: [
      "unix-timestamp",
      "ssh-config-generator",
      "chmod-calculator",
    ],
    extraFaqs: [
      {
        question: {
          ko: "6필드 cron 표현식은 어디서 사용되나요?",
          en: "Where are 6-field cron expressions used?",
        },
        answer: {
          ko: "6필드 cron은 초(second) 필드를 포함하며, Spring Framework(@Scheduled), Quartz Scheduler, AWS EventBridge 등에서 사용됩니다. 형식은 '초 분 시간 일 월 요일'이며, 표준 리눅스 crontab은 5필드만 지원합니다.",
          en: "6-field cron includes a seconds field and is used in Spring Framework (@Scheduled), Quartz Scheduler, AWS EventBridge, and similar tools. The format is 'second minute hour day month weekday'. Standard Linux crontab only supports 5 fields.",
        },
      },
      {
        question: {
          ko: "crontab -e와 /etc/crontab의 차이는 무엇인가요?",
          en: "What is the difference between crontab -e and /etc/crontab?",
        },
        answer: {
          ko: "crontab -e는 현재 사용자의 개인 cron 테이블을 편집합니다. /etc/crontab은 시스템 전체 cron 파일로, 실행할 사용자를 추가 필드로 지정합니다. 시스템 작업은 /etc/crontab이나 /etc/cron.d/에, 사용자 작업은 crontab -e에 등록합니다.",
          en: "crontab -e edits the current user's personal cron table. /etc/crontab is a system-wide cron file that includes an additional field to specify which user runs each job. System tasks go in /etc/crontab or /etc/cron.d/, while user tasks go in crontab -e.",
        },
      },
      {
        question: {
          ko: "Cron 작업이 실행되지 않을 때 어떻게 디버깅하나요?",
          en: "How do I debug a cron job that is not running?",
        },
        answer: {
          ko: "먼저 /var/log/syslog 또는 /var/log/cron에서 cron 로그를 확인합니다. 환경 변수가 다를 수 있으므로 PATH를 명시적으로 설정하세요. 스크립트에 절대 경로를 사용하고, 출력을 리다이렉트(>> /tmp/cron.log 2>&1)하여 오류를 확인합니다.",
          en: "First check cron logs in /var/log/syslog or /var/log/cron. Set PATH explicitly since the cron environment differs from your shell. Use absolute paths in scripts and redirect output (>> /tmp/cron.log 2>&1) to capture errors.",
        },
      },
      {
        question: {
          ko: "특수 문자열 @reboot, @daily 등은 무엇인가요?",
          en: "What are special strings like @reboot and @daily?",
        },
        answer: {
          ko: "@reboot: 시스템 부팅 시 1회 실행 / @yearly(@annually): 매년 1월 1일 0시 / @monthly: 매월 1일 0시 / @weekly: 매주 일요일 0시 / @daily(@midnight): 매일 0시 / @hourly: 매시 0분. 5필드 표현식 대신 사용할 수 있는 편의 문법입니다.",
          en: "@reboot: runs once at system startup / @yearly(@annually): Jan 1 at midnight / @monthly: 1st of every month at midnight / @weekly: every Sunday at midnight / @daily(@midnight): every day at midnight / @hourly: every hour at :00. These are shorthand aliases for common 5-field expressions.",
        },
      },
    ],
    usageExamples: [
      {
        title: { ko: "매일 새벽 3시 백업 크론 설정", en: "Set Up Daily 3 AM Backup Cron" },
        scenario: {
          ko: "데이터베이스 백업 스크립트를 매일 새벽 3시에 자동 실행해야 합니다.",
          en: "You need to run a database backup script automatically every day at 3 AM.",
        },
        steps: [
          { ko: "'0 3 * * *' 크론 표현식을 입력합니다.", en: "Enter the cron expression '0 3 * * *'." },
          { ko: "다음 실행 시간 목록에서 매일 03:00에 실행됨을 확인합니다.", en: "Verify in the next execution list that it runs at 03:00 daily." },
          { ko: "한글 설명 '매일 새벽 3시 0분에 실행'을 확인합니다.", en: "Confirm the description: 'Runs at 3:00 AM every day.'" },
        ],
        result: {
          ko: "crontab에 '0 3 * * * /usr/local/bin/backup.sh' 등록 준비 완료.",
          en: "Ready to add '0 3 * * * /usr/local/bin/backup.sh' to crontab.",
        },
      },
      {
        title: { ko: "매주 월요일 로그 정리 크론", en: "Weekly Monday Log Cleanup Cron" },
        scenario: {
          ko: "서버 로그 파일을 매주 월요일 새벽에 자동 정리하려 합니다.",
          en: "You want to automatically clean up server log files every Monday morning.",
        },
        steps: [
          { ko: "'0 1 * * 1' 크론 표현식을 입력합니다.", en: "Enter the cron expression '0 1 * * 1'." },
          { ko: "다음 실행 시간이 매주 월요일 01:00임을 확인합니다.", en: "Verify next execution is every Monday at 01:00." },
        ],
        result: {
          ko: "매주 월요일 새벽 1시에 로그 정리 스크립트가 실행됨을 확인.",
          en: "Confirmed log cleanup script runs every Monday at 1 AM.",
        },
      },
    ],
  },

  "chmod-calculator": {
    howTo: {
      steps: [
        {
          ko: "소유자(Owner), 그룹(Group), 기타(Others)에 대해 읽기/쓰기/실행 체크박스를 클릭합니다.",
          en: "Click the read/write/execute checkboxes for Owner, Group, and Others.",
        },
        {
          ko: "하단에 자동 계산된 숫자(예: 755)와 기호(예: rwxr-xr-x) 표기를 확인합니다.",
          en: "Review the automatically calculated numeric (e.g., 755) and symbolic (e.g., rwxr-xr-x) notation below.",
        },
        {
          ko: "필요한 경우 setuid, setgid, sticky bit 등 특수 권한을 추가로 설정합니다.",
          en: "Optionally configure special permissions such as setuid, setgid, or sticky bit.",
        },
        {
          ko: "생성된 chmod 명령어를 복사하여 터미널에서 실행합니다.",
          en: "Copy the generated chmod command and execute it in your terminal.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "리눅스 파일 소유권",
          en: "Linux File Ownership",
        },
        description: {
          ko: "리눅스에서 모든 파일은 소유자(user)와 그룹(group)이 있습니다. chown 명령으로 소유권을 변경하며, 권한(chmod)과 소유권(chown)을 함께 관리해야 보안이 유지됩니다.",
          en: "Every file in Linux has an owner (user) and a group. Ownership is changed with chown, and both permissions (chmod) and ownership (chown) must be managed together to maintain security.",
        },
      },
      {
        title: {
          ko: "특수 권한 비트",
          en: "Special Permission Bits",
        },
        description: {
          ko: "setuid(4000)는 파일을 소유자 권한으로 실행하고, setgid(2000)는 그룹 권한으로 실행합니다. sticky bit(1000)는 디렉토리에서 파일 소유자만 삭제할 수 있게 합니다. /tmp 디렉토리가 대표적인 sticky bit 사용 예입니다.",
          en: "setuid (4000) runs a file with the owner's permissions, setgid (2000) runs it with the group's permissions. Sticky bit (1000) restricts file deletion in a directory to the file owner only. The /tmp directory is a classic example of sticky bit usage.",
        },
      },
      {
        title: {
          ko: "ACL (Access Control List)",
          en: "ACL (Access Control List)",
        },
        description: {
          ko: "기본 chmod 권한 외에 ACL을 사용하면 특정 사용자나 그룹에게 세밀한 권한을 부여할 수 있습니다. setfacl과 getfacl 명령으로 관리하며, 기본 rwx 권한보다 유연한 접근 제어가 가능합니다.",
          en: "Beyond basic chmod permissions, ACL allows granting fine-grained permissions to specific users or groups. Managed with setfacl and getfacl commands, ACL provides more flexible access control than standard rwx permissions.",
        },
      },
    ],
    relatedTools: [
      "ssh-config-generator",
      "cron-parser",
      "ufw-rules-builder",
      "number-base-converter",
    ],
    extraFaqs: [
      {
        question: {
          ko: "chmod를 재귀적으로 적용하는 방법은?",
          en: "How do I apply chmod recursively?",
        },
        answer: {
          ko: "chmod -R 755 /path/to/dir 명령으로 디렉토리와 하위 모든 파일에 권한을 재귀적으로 적용합니다. 단, 파일과 디렉토리에 같은 권한을 적용하면 문제가 될 수 있으므로, find와 조합하여 'find /path -type d -exec chmod 755 {} \\;'(디렉토리)와 'find /path -type f -exec chmod 644 {} \\;'(파일)로 분리 적용하는 것이 안전합니다.",
          en: "Use chmod -R 755 /path/to/dir to apply permissions recursively to a directory and all its contents. However, applying the same permissions to both files and directories can cause issues. It's safer to use find: 'find /path -type d -exec chmod 755 {} \\;' for directories and 'find /path -type f -exec chmod 644 {} \\;' for files.",
        },
      },
      {
        question: {
          ko: "umask란 무엇이고 chmod와의 관계는?",
          en: "What is umask and how does it relate to chmod?",
        },
        answer: {
          ko: "umask는 새로 생성되는 파일과 디렉토리의 기본 권한을 결정하는 값입니다. 파일 기본값 666에서, 디렉토리 기본값 777에서 umask 값을 빼서 실제 권한이 정해집니다. 예를 들어 umask 022이면 파일은 644, 디렉토리는 755로 생성됩니다.",
          en: "umask determines the default permissions for newly created files and directories. Actual permissions are calculated by subtracting the umask value from 666 (files) or 777 (directories). For example, with umask 022, files are created with 644 and directories with 755.",
        },
      },
      {
        question: {
          ko: "setuid가 설정된 파일을 찾는 방법은?",
          en: "How do I find files with setuid set?",
        },
        answer: {
          ko: "'find / -perm -4000 -type f 2>/dev/null' 명령으로 시스템에서 setuid가 설정된 모든 파일을 검색할 수 있습니다. setuid 파일은 보안 위험이 될 수 있으므로 정기적으로 점검해야 합니다. 대표적인 setuid 파일로는 /usr/bin/passwd, /usr/bin/sudo가 있습니다.",
          en: "Use 'find / -perm -4000 -type f 2>/dev/null' to search for all setuid files on the system. Setuid files can be security risks and should be audited regularly. Common setuid files include /usr/bin/passwd and /usr/bin/sudo.",
        },
      },
      {
        question: {
          ko: "웹 서버 파일에 권장되는 chmod 설정은?",
          en: "What are the recommended chmod settings for web server files?",
        },
        answer: {
          ko: "일반적으로 디렉토리는 755, 정적 파일(HTML/CSS/JS/이미지)은 644, PHP 등 스크립트 파일은 644 또는 600을 사용합니다. 업로드 디렉토리는 775를 사용하되 실행 권한을 제거합니다. 설정 파일(config.php 등)은 600으로 소유자만 접근 가능하게 합니다.",
          en: "Typically, directories use 755, static files (HTML/CSS/JS/images) use 644, and script files (PHP, etc.) use 644 or 600. Upload directories use 775 with execute permissions removed. Configuration files (e.g., config.php) should use 600 so only the owner can access them.",
        },
      },
    ],
    usageExamples: [
      {
        title: { ko: "웹 서버 파일 권한 설정", en: "Web Server File Permission Setup" },
        scenario: {
          ko: "Nginx 웹 서버의 정적 파일과 디렉토리에 적절한 권한을 설정해야 합니다.",
          en: "You need to set proper permissions for Nginx web server static files and directories.",
        },
        steps: [
          { ko: "Owner: Read+Write, Group: Read, Others: Read 체크박스를 선택합니다.", en: "Select Owner: Read+Write, Group: Read, Others: Read checkboxes." },
          { ko: "숫자 표기 644, 심볼릭 표기 -rw-r--r--를 확인합니다.", en: "Verify numeric notation 644, symbolic notation -rw-r--r--." },
          { ko: "chmod 644 명령어를 복사하여 터미널에서 실행합니다.", en: "Copy the chmod 644 command and run it in the terminal." },
        ],
        result: {
          ko: "웹 서버 파일이 소유자만 수정 가능하고 모든 사용자가 읽을 수 있도록 설정 완료.",
          en: "Web server files set to owner-writable and world-readable.",
        },
      },
      {
        title: { ko: "배포 스크립트 실행 권한 설정", en: "Deployment Script Execute Permission" },
        scenario: {
          ko: "CI/CD 배포 스크립트에 실행 권한을 부여해야 합니다.",
          en: "You need to grant execute permission to a CI/CD deployment script.",
        },
        steps: [
          { ko: "Owner: Read+Write+Execute, Group: Read+Execute, Others: 없음을 선택합니다.", en: "Select Owner: Read+Write+Execute, Group: Read+Execute, Others: None." },
          { ko: "숫자 표기 750을 확인합니다.", en: "Verify numeric notation 750." },
        ],
        result: {
          ko: "배포 스크립트가 소유자와 그룹만 실행 가능하도록 보안 설정 완료.",
          en: "Deployment script secured to be executable only by owner and group.",
        },
      },
    ],
  },

  "regex-tester": {
    howTo: {
      steps: [
        {
          ko: "상단 입력란에 정규표현식 패턴을 입력합니다 (예: \\d{3}-\\d{4}).",
          en: "Enter a regex pattern in the top input field (e.g., \\d{3}-\\d{4}).",
        },
        {
          ko: "테스트 텍스트 영역에 매칭할 대상 문자열을 붙여넣습니다.",
          en: "Paste the target string to match against in the test text area.",
        },
        {
          ko: "필요한 플래그(g, i, m, s, u)를 활성화하여 매칭 동작을 조정합니다.",
          en: "Enable the desired flags (g, i, m, s, u) to adjust matching behavior.",
        },
        {
          ko: "하이라이트된 매칭 결과와 캡처 그룹 상세 정보를 확인합니다.",
          en: "Review the highlighted matches and capture group details.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "캡처 그룹과 역참조",
          en: "Capture Groups and Backreferences",
        },
        description: {
          ko: "괄호 ()로 감싼 패턴은 캡처 그룹이 됩니다. \\1, \\2로 역참조하거나, (?<name>...)으로 이름을 붙일 수 있습니다. 텍스트 치환, 로그 파싱, 데이터 추출에서 핵심적인 기능입니다.",
          en: "Patterns enclosed in parentheses () become capture groups. They can be backreferenced with \\1, \\2 or named with (?<name>...). This is a core feature for text substitution, log parsing, and data extraction.",
        },
      },
      {
        title: {
          ko: "정규표현식 성능 최적화",
          en: "Regex Performance Optimization",
        },
        description: {
          ko: "탐욕적(greedy) 수량자 대신 게으른(lazy) 수량자(.*?)를 사용하면 역추적을 줄일 수 있습니다. 중첩된 수량자((a+)+)는 치명적인 역추적(catastrophic backtracking)을 유발하므로 피해야 합니다.",
          en: "Using lazy quantifiers (.*?) instead of greedy ones reduces backtracking. Nested quantifiers like (a+)+ can cause catastrophic backtracking and should be avoided.",
        },
      },
      {
        title: {
          ko: "전방탐색과 후방탐색",
          en: "Lookahead and Lookbehind",
        },
        description: {
          ko: "전방탐색((?=...))은 뒤에 특정 패턴이 오는지 확인하고, 후방탐색((?<=...))은 앞에 특정 패턴이 있는지 확인합니다. 매칭 결과에 포함되지 않아 패턴 검증에 유용합니다.",
          en: "Lookahead ((?=...)) checks if a pattern follows, and lookbehind ((?<=...)) checks if a pattern precedes. Since they are not included in the match result, they are useful for pattern validation.",
        },
      },
    ],
    relatedTools: [
      "text-diff",
      "text-counter",
      "url-encoder",
    ],
    extraFaqs: [
      {
        question: {
          ko: "정규표현식에서 특수문자를 리터럴로 매칭하는 방법은?",
          en: "How do I match special characters literally in regex?",
        },
        answer: {
          ko: "백슬래시(\\)로 이스케이프합니다. 예: \\. (마침표), \\* (별표), \\( (여는 괄호), \\[ (여는 대괄호), \\$ (달러), \\^ (캐럿). 문자 클래스 [] 안에서는 대부분의 특수문자가 리터럴로 처리되지만, ], \\, ^, - 는 이스케이프가 필요합니다.",
          en: "Escape them with a backslash (\\). Examples: \\. (period), \\* (asterisk), \\( (open parenthesis), \\[ (open bracket), \\$ (dollar), \\^ (caret). Inside character classes [], most special characters are treated literally, but ], \\, ^, and - need escaping.",
        },
      },
      {
        question: {
          ko: "캡처하지 않는 그룹 (?:...)은 언제 사용하나요?",
          en: "When should I use non-capturing groups (?:...)?",
        },
        answer: {
          ko: "그룹핑은 필요하지만 캡처 결과가 불필요할 때 사용합니다. 예를 들어 (?:http|https)://는 프로토콜을 그룹핑하되 캡처하지 않습니다. 캡처 그룹보다 성능이 좋고, 역참조 번호가 꼬이지 않는 장점이 있습니다.",
          en: "Use them when you need grouping but don't need the captured result. For example, (?:http|https):// groups the protocol without capturing it. They perform better than capture groups and prevent backreference numbering issues.",
        },
      },
      {
        question: {
          ko: "정규표현식 엔진 간의 차이점은 무엇인가요?",
          en: "What are the differences between regex engines?",
        },
        answer: {
          ko: "JavaScript는 후방탐색(lookbehind)을 ES2018부터 지원하며, 소유적 수량자(possessive quantifier)와 원자적 그룹은 미지원합니다. Python의 re 모듈은 조건적 패턴을 지원하고, PCRE(PHP, Perl)는 재귀 패턴과 원자적 그룹을 지원합니다. 이 도구는 JavaScript 엔진을 사용합니다.",
          en: "JavaScript supports lookbehind since ES2018 but lacks possessive quantifiers and atomic groups. Python's re module supports conditional patterns, and PCRE (PHP, Perl) supports recursive patterns and atomic groups. This tool uses the JavaScript regex engine.",
        },
      },
      {
        question: {
          ko: "정규표현식으로 이메일 주소를 완벽하게 검증할 수 있나요?",
          en: "Can regex perfectly validate email addresses?",
        },
        answer: {
          ko: "RFC 5322 완전 준수 정규표현식은 매우 복잡합니다. 실무에서는 /^[\\w.+-]+@[\\w-]+\\.[a-z]{2,}$/i 같은 간단한 패턴으로 기본 형식을 검증한 후, 실제 이메일 발송으로 유효성을 확인하는 것이 권장됩니다.",
          en: "A fully RFC 5322-compliant regex is extremely complex. In practice, it's recommended to validate the basic format with a simple pattern like /^[\\w.+-]+@[\\w-]+\\.[a-z]{2,}$/i, then confirm validity by actually sending an email.",
        },
      },
    ],
    usageExamples: [
      {
        title: { ko: "이메일 주소 추출 정규식", en: "Email Address Extraction Regex" },
        scenario: {
          ko: "텍스트 문서에서 모든 이메일 주소를 추출해야 합니다.",
          en: "You need to extract all email addresses from a text document.",
        },
        steps: [
          { ko: "패턴에 [\\w.+-]+@[\\w-]+\\.[a-z]{2,}를 입력합니다.", en: "Enter [\\w.+-]+@[\\w-]+\\.[a-z]{2,} as the pattern." },
          { ko: "글로벌(g) 및 대소문자 무시(i) 플래그를 설정합니다.", en: "Set global (g) and case-insensitive (i) flags." },
          { ko: "테스트 문자열에 이메일이 포함된 텍스트를 붙여넣습니다.", en: "Paste text containing emails into the test string." },
        ],
        result: {
          ko: "문서 내 모든 이메일 주소가 하이라이트되어 추출됨.",
          en: "All email addresses in the document are highlighted and extracted.",
        },
      },
      {
        title: { ko: "로그 파일에서 IP 주소 필터링", en: "Filter IP Addresses from Log Files" },
        scenario: {
          ko: "서버 로그에서 모든 IPv4 주소를 찾아야 합니다.",
          en: "You need to find all IPv4 addresses in server logs.",
        },
        steps: [
          { ko: "패턴에 \\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b를 입력합니다.", en: "Enter \\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b as the pattern." },
          { ko: "로그 파일 내용을 테스트 문자열에 붙여넣습니다.", en: "Paste log file content into the test string." },
        ],
        result: {
          ko: "로그에 포함된 모든 IP 주소가 매칭되어 표시됨.",
          en: "All IP addresses in the log are matched and displayed.",
        },
      },
      {
        title: { ko: "전화번호 형식 검증", en: "Phone Number Format Validation" },
        scenario: {
          ko: "한국 휴대전화 번호(010-XXXX-XXXX) 형식을 검증해야 합니다.",
          en: "You need to validate Korean mobile phone number format (010-XXXX-XXXX).",
        },
        steps: [
          { ko: "패턴에 ^010-\\d{4}-\\d{4}$를 입력합니다.", en: "Enter ^010-\\d{4}-\\d{4}$ as the pattern." },
          { ko: "테스트 문자열에 다양한 전화번호를 입력하여 검증합니다.", en: "Enter various phone numbers in the test string to validate." },
        ],
        result: {
          ko: "올바른 형식의 번호만 매칭되어 입력 검증 패턴 확인 완료.",
          en: "Only properly formatted numbers are matched, confirming the validation pattern.",
        },
      },
    ],
  },

  "ssh-config-generator": {
    howTo: {
      steps: [
        {
          ko: "호스트 별칭(Host)과 실제 서버 주소(HostName)를 입력합니다.",
          en: "Enter a Host alias and the actual server address (HostName).",
        },
        {
          ko: "접속 사용자(User), 포트, IdentityFile 등 기본 옵션을 설정합니다.",
          en: "Configure basic options such as User, Port, and IdentityFile.",
        },
        {
          ko: "필요한 경우 ProxyJump, 포트 포워딩, ServerAliveInterval 등 고급 옵션을 추가합니다.",
          en: "Add advanced options like ProxyJump, port forwarding, and ServerAliveInterval if needed.",
        },
        {
          ko: "생성된 config 블록을 복사하여 ~/.ssh/config 파일에 붙여넣습니다.",
          en: "Copy the generated config block and paste it into your ~/.ssh/config file.",
        },
        {
          ko: "터미널에서 'ssh 별칭'으로 간편하게 접속을 테스트합니다.",
          en: "Test the connection by running 'ssh alias' in your terminal.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "SSH 키 인증",
          en: "SSH Key Authentication",
        },
        description: {
          ko: "비밀번호 대신 공개키/개인키 쌍으로 인증하는 방식입니다. ssh-keygen으로 키를 생성하고, 공개키를 서버의 ~/.ssh/authorized_keys에 등록합니다. 보안성이 높고 자동화에 적합합니다.",
          en: "Authentication using a public/private key pair instead of passwords. Generate keys with ssh-keygen and register the public key in the server's ~/.ssh/authorized_keys. More secure and suitable for automation.",
        },
      },
      {
        title: {
          ko: "SSH 터널링과 포트 포워딩",
          en: "SSH Tunneling and Port Forwarding",
        },
        description: {
          ko: "로컬 포워딩(-L)은 로컬 포트를 원격 서비스에 연결하고, 원격 포워딩(-R)은 원격 포트를 로컬에 연결합니다. 동적 포워딩(-D)은 SOCKS 프록시를 만들어 여러 대상에 접근할 수 있게 합니다.",
          en: "Local forwarding (-L) connects a local port to a remote service, remote forwarding (-R) connects a remote port to a local service. Dynamic forwarding (-D) creates a SOCKS proxy for accessing multiple destinations.",
        },
      },
      {
        title: {
          ko: "SSH 보안 강화",
          en: "SSH Security Hardening",
        },
        description: {
          ko: "비밀번호 인증 비활성화(PasswordAuthentication no), 루트 로그인 금지(PermitRootLogin no), 비표준 포트 사용, Fail2ban 연동 등으로 SSH 보안을 강화할 수 있습니다.",
          en: "Strengthen SSH security by disabling password authentication (PasswordAuthentication no), prohibiting root login (PermitRootLogin no), using non-standard ports, and integrating with Fail2ban.",
        },
      },
    ],
    relatedTools: [
      "ufw-rules-builder",
      "cron-parser",
      "port-dictionary",
      "chmod-calculator",
    ],
    extraFaqs: [
      {
        question: {
          ko: "여러 SSH 키를 호스트별로 다르게 사용하는 방법은?",
          en: "How do I use different SSH keys for different hosts?",
        },
        answer: {
          ko: "~/.ssh/config에서 각 Host 블록에 IdentityFile을 지정합니다. 예를 들어 GitHub용은 'IdentityFile ~/.ssh/id_github', 회사 서버용은 'IdentityFile ~/.ssh/id_company'로 설정합니다. IdentitiesOnly yes를 추가하면 지정된 키만 사용합니다.",
          en: "Specify IdentityFile in each Host block of ~/.ssh/config. For example, use 'IdentityFile ~/.ssh/id_github' for GitHub and 'IdentityFile ~/.ssh/id_company' for your company server. Add 'IdentitiesOnly yes' to ensure only the specified key is used.",
        },
      },
      {
        question: {
          ko: "SSH config에서 와일드카드(*)를 사용하는 방법은?",
          en: "How do I use wildcards (*) in SSH config?",
        },
        answer: {
          ko: "'Host *'는 모든 호스트에 적용되는 기본 설정을 정의합니다. 'Host *.example.com'은 특정 도메인의 모든 호스트에 적용됩니다. 와일드카드 블록은 파일 하단에 위치하며, 구체적인 Host 블록의 설정이 우선합니다.",
          en: "'Host *' defines default settings applied to all hosts. 'Host *.example.com' applies to all hosts under a specific domain. Wildcard blocks are placed at the bottom of the file, and specific Host block settings take precedence.",
        },
      },
      {
        question: {
          ko: "ForwardAgent를 사용할 때 보안 위험은 무엇인가요?",
          en: "What are the security risks of using ForwardAgent?",
        },
        answer: {
          ko: "ForwardAgent yes를 설정하면 원격 서버에서 로컬 SSH 에이전트의 키에 접근할 수 있어, 점프 호스트를 거칠 때 편리합니다. 하지만 원격 서버의 root 사용자가 에이전트 소켓을 악용할 수 있으므로, 신뢰할 수 있는 서버에만 사용해야 합니다.",
          en: "Setting ForwardAgent yes allows the remote server to access your local SSH agent's keys, which is convenient when jumping through hosts. However, the root user on the remote server could potentially misuse the agent socket, so only enable it for trusted servers.",
        },
      },
    ],
  },

  "ufw-rules-builder": {
    howTo: {
      steps: [
        {
          ko: "동작(허용/거부/거절/속도제한)과 방향(인바운드/아웃바운드)을 선택합니다.",
          en: "Select the action (allow/deny/reject/limit) and direction (in/out).",
        },
        {
          ko: "프로토콜(TCP/UDP)과 포트 번호를 입력하거나, SSH/HTTP 등 단축 버튼을 사용합니다.",
          en: "Enter the protocol (TCP/UDP) and port number, or use shortcut buttons like SSH/HTTP.",
        },
        {
          ko: "필요한 경우 출발지/목적지 IP 주소를 지정하여 접근을 제한합니다.",
          en: "Optionally specify source/destination IP addresses to restrict access.",
        },
        {
          ko: "생성된 ufw 명령어를 복사하고, 서버 터미널에서 sudo로 실행합니다.",
          en: "Copy the generated ufw command and execute it with sudo on your server terminal.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "리눅스 방화벽 아키텍처",
          en: "Linux Firewall Architecture",
        },
        description: {
          ko: "리눅스 방화벽은 커널의 Netfilter 프레임워크를 기반으로 합니다. iptables는 Netfilter의 사용자 공간 도구이며, UFW는 iptables를 간편하게 관리하는 래퍼입니다. nftables는 iptables의 차세대 후속 도구입니다.",
          en: "Linux firewalls are based on the kernel's Netfilter framework. iptables is the userspace tool for Netfilter, and UFW is a wrapper that simplifies iptables management. nftables is the next-generation successor to iptables.",
        },
      },
      {
        title: {
          ko: "네트워크 보안 모범 사례",
          en: "Network Security Best Practices",
        },
        description: {
          ko: "기본 정책은 모든 인바운드를 거부(deny incoming)하고 필요한 포트만 허용하는 화이트리스트 방식이 안전합니다. SSH는 기본 22번 포트 대신 비표준 포트를 사용하고, rate limiting을 적용하는 것이 권장됩니다.",
          en: "The safest default policy is to deny all incoming traffic and allow only necessary ports (whitelist approach). For SSH, using a non-standard port instead of the default 22 and applying rate limiting is recommended.",
        },
      },
      {
        title: {
          ko: "포트와 서비스 매핑",
          en: "Port and Service Mapping",
        },
        description: {
          ko: "/etc/services 파일에 포트 번호와 서비스명의 매핑이 정의되어 있습니다. 잘 알려진 포트(0-1023)는 root 권한이 필요하며, 등록된 포트(1024-49151)와 동적 포트(49152-65535)로 구분됩니다.",
          en: "The /etc/services file defines the mapping between port numbers and service names. Well-known ports (0-1023) require root privileges, and ports are categorized into registered (1024-49151) and dynamic (49152-65535) ranges.",
        },
      },
    ],
    relatedTools: [
      "ssh-config-generator",
      "port-dictionary",
      "subnet-calculator",
      "chmod-calculator",
      "cidr-to-range",
    ],
    extraFaqs: [
      {
        question: {
          ko: "UFW 기본 정책을 설정하는 방법은?",
          en: "How do I set the default UFW policy?",
        },
        answer: {
          ko: "'sudo ufw default deny incoming'으로 인바운드를 기본 차단하고, 'sudo ufw default allow outgoing'으로 아웃바운드를 기본 허용합니다. 이 설정 후 필요한 포트만 개별적으로 허용하는 것이 가장 안전한 방식입니다.",
          en: "Use 'sudo ufw default deny incoming' to block all inbound traffic by default and 'sudo ufw default allow outgoing' to allow all outbound. Then individually allow only the ports you need. This is the safest approach.",
        },
      },
      {
        question: {
          ko: "특정 IP 대역에서만 SSH 접속을 허용하는 방법은?",
          en: "How do I allow SSH only from a specific IP range?",
        },
        answer: {
          ko: "'sudo ufw allow from 192.168.1.0/24 to any port 22 proto tcp' 명령으로 특정 서브넷에서만 SSH 접속을 허용할 수 있습니다. 먼저 'sudo ufw deny 22/tcp'로 전체 차단 후, 허용 규칙을 추가하면 됩니다. 규칙 순서가 중요하므로 insert 명령으로 우선순위를 조정할 수 있습니다.",
          en: "Use 'sudo ufw allow from 192.168.1.0/24 to any port 22 proto tcp' to allow SSH only from a specific subnet. First block all SSH with 'sudo ufw deny 22/tcp', then add the allow rule. Rule order matters, so use the insert command to adjust priority.",
        },
      },
      {
        question: {
          ko: "UFW에서 규칙을 삭제하거나 초기화하는 방법은?",
          en: "How do I delete rules or reset UFW?",
        },
        answer: {
          ko: "'sudo ufw status numbered'로 규칙 번호를 확인한 후 'sudo ufw delete [번호]'로 개별 삭제합니다. 또는 'sudo ufw delete allow 80/tcp'처럼 규칙을 직접 지정할 수 있습니다. 'sudo ufw reset'은 모든 규칙을 삭제하고 비활성화 상태로 되돌립니다.",
          en: "Check rule numbers with 'sudo ufw status numbered', then delete individually with 'sudo ufw delete [number]'. Alternatively, specify the rule directly like 'sudo ufw delete allow 80/tcp'. Use 'sudo ufw reset' to remove all rules and return to the disabled state.",
        },
      },
    ],
  },
};
