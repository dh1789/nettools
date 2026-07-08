import type { ToolEnhancement } from "../tools";

export const DEVELOPER_ENHANCEMENTS: Record<string, ToolEnhancement> = {
  "base64": {
    howTo: {
      steps: [
        {
          ko: "인코딩 또는 디코딩 모드를 선택합니다.",
          en: "Select encode or decode mode.",
        },
        {
          ko: "입력 필드에 텍스트 또는 Base64 문자열을 붙여넣습니다.",
          en: "Paste your text or Base64 string into the input field.",
        },
        {
          ko: "변환 결과가 즉시 표시됩니다. 필요 시 URL-safe 옵션을 활성화합니다.",
          en: "The converted result appears instantly. Enable URL-safe option if needed.",
        },
        {
          ko: "복사 버튼을 클릭하여 결과를 클립보드에 복사합니다.",
          en: "Click the copy button to copy the result to clipboard.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "Base64 인코딩 원리",
          en: "Base64 Encoding Principle",
        },
        description: {
          ko: "3바이트(24비트)를 4개의 6비트 그룹으로 분할하고, 각 그룹을 A-Z, a-z, 0-9, +, / 중 하나의 문자로 매핑합니다. 입력이 3의 배수가 아니면 = 패딩을 추가합니다.",
          en: "Splits 3 bytes (24 bits) into four 6-bit groups, mapping each to one of A-Z, a-z, 0-9, +, /. Adds = padding when input is not a multiple of 3.",
        },
      },
      {
        title: {
          ko: "URL-safe Base64",
          en: "URL-safe Base64",
        },
        description: {
          ko: "표준 Base64의 + 와 / 를 각각 - 와 _ 로 대체하여 URL이나 파일명에서 안전하게 사용할 수 있는 변형입니다. JWT 토큰과 데이터 URI에서 주로 사용됩니다.",
          en: "A variant replacing + and / with - and _ respectively, making it safe for URLs and filenames. Commonly used in JWT tokens and data URIs.",
        },
      },
      {
        title: {
          ko: "MIME과 Base64",
          en: "MIME and Base64",
        },
        description: {
          ko: "이메일 프로토콜(SMTP)은 7비트 ASCII만 지원하므로, 바이너리 첨부파일을 전송하려면 Base64로 인코딩해야 합니다. MIME 표준(RFC 2045)에서 이 방식을 정의합니다.",
          en: "Since SMTP only supports 7-bit ASCII, binary attachments must be Base64-encoded for email transmission. This is defined in the MIME standard (RFC 2045).",
        },
      },
    ],
    relatedTools: ["url-encoder", "jwt-decoder", "image-base64-converter", "hash-generator", "html-entity-encoder", "qr-code-generator", "uuid-generator", "nmea-checksum"],
    extraFaqs: [
      {
        question: {
          ko: "Base64 인코딩 시 데이터 크기가 얼마나 증가하나요?",
          en: "How much does data size increase with Base64 encoding?",
        },
        answer: {
          ko: "Base64는 3바이트를 4문자로 변환하므로 약 33% 크기가 증가합니다. 패딩과 줄바꿈을 포함하면 최대 37%까지 늘어날 수 있습니다.",
          en: "Base64 converts 3 bytes into 4 characters, increasing size by about 33%. Including padding and line breaks, it can grow up to 37%.",
        },
      },
      {
        question: {
          ko: "Base64는 암호화인가요?",
          en: "Is Base64 encryption?",
        },
        answer: {
          ko: "아닙니다. Base64는 인코딩 방식이지 암호화가 아닙니다. 누구나 쉽게 디코딩할 수 있으므로 민감한 데이터를 보호하는 용도로 사용해서는 안 됩니다. 보안이 필요하면 AES 등 적절한 암호화 알고리즘을 사용하세요.",
          en: "No. Base64 is an encoding scheme, not encryption. Anyone can easily decode it, so it should never be used to protect sensitive data. Use proper encryption algorithms like AES for security.",
        },
      },
      {
        question: {
          ko: "한글이 포함된 텍스트도 Base64로 인코딩할 수 있나요?",
          en: "Can I encode text containing Korean (or other multibyte) characters?",
        },
        answer: {
          ko: "네, 가능합니다. 이 도구는 먼저 텍스트를 UTF-8 바이트로 변환한 후 Base64로 인코딩합니다. 디코딩 시에도 UTF-8로 올바르게 복원됩니다.",
          en: "Yes. This tool first converts text to UTF-8 bytes before Base64 encoding. Decoding correctly restores the original UTF-8 text.",
        },
      },
      {
        question: {
          ko: "브라우저의 atob/btoa 함수와 이 도구의 차이점은 무엇인가요?",
          en: "What is the difference between browser atob/btoa functions and this tool?",
        },
        answer: {
          ko: "브라우저의 btoa 함수는 Latin-1 문자만 지원하여 한글 같은 멀티바이트 문자에서 오류가 발생합니다. 이 도구는 TextEncoder/TextDecoder를 활용하여 UTF-8을 포함한 모든 유니코드 문자를 정확하게 처리합니다.",
          en: "The browser's btoa function only supports Latin-1, causing errors with multibyte characters like Korean. This tool uses TextEncoder/TextDecoder to correctly handle all Unicode characters including UTF-8.",
        },
      },
    ],
    usageExamples: [
      {
        title: { ko: "이미지 인코딩 후 HTML 삽입", en: "Encode Image for HTML Embedding" },
        scenario: {
          ko: "작은 아이콘 이미지를 Base64로 인코딩하여 HTML에 직접 삽입해야 합니다.",
          en: "You need to Base64-encode a small icon image for direct HTML embedding.",
        },
        steps: [
          { ko: "인코딩할 데이터를 입력란에 붙여넣습니다.", en: "Paste the data to encode into the input field." },
          { ko: "인코딩 버튼을 클릭합니다.", en: "Click the encode button." },
          { ko: "결과를 data:image/png;base64,... 형식으로 img 태그에 삽입합니다.", en: "Insert the result as data:image/png;base64,... in an img tag." },
        ],
        result: {
          ko: "별도 HTTP 요청 없이 이미지가 HTML에 인라인으로 포함됨.",
          en: "Image embedded inline in HTML without additional HTTP requests.",
        },
      },
      {
        title: { ko: "API 토큰 디코딩 확인", en: "Decode API Token for Inspection" },
        scenario: {
          ko: "외부 API에서 받은 Base64 인코딩된 토큰의 내용을 확인해야 합니다.",
          en: "You need to inspect the contents of a Base64-encoded token from an external API.",
        },
        steps: [
          { ko: "인코딩된 토큰 문자열을 입력란에 붙여넣습니다.", en: "Paste the encoded token string into the input field." },
          { ko: "디코딩 버튼을 클릭하여 원본 내용을 확인합니다.", en: "Click decode to view the original content." },
        ],
        result: {
          ko: "토큰에 포함된 사용자 정보, 권한 등을 평문으로 확인 가능.",
          en: "User info, permissions, etc. in the token visible in plaintext.",
        },
      },
    ],
  },

  "json-formatter": {
    howTo: {
      steps: [
        {
          ko: "입력 영역에 JSON 데이터를 붙여넣거나 직접 입력합니다.",
          en: "Paste or type JSON data into the input area.",
        },
        {
          ko: "포맷(정리) 또는 미니파이(압축) 모드를 선택합니다.",
          en: "Choose format (prettify) or minify (compress) mode.",
        },
        {
          ko: "들여쓰기 크기를 조절합니다 (2칸, 4칸, 탭).",
          en: "Adjust the indentation size (2 spaces, 4 spaces, tab).",
        },
        {
          ko: "결과를 확인하고 복사 버튼으로 클립보드에 복사합니다.",
          en: "Review the result and copy it to clipboard with the copy button.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "JSON 데이터 타입",
          en: "JSON Data Types",
        },
        description: {
          ko: "JSON은 문자열, 숫자, 불리언, null, 배열, 객체의 6가지 데이터 타입을 지원합니다. undefined, 함수, Symbol 등 JavaScript 전용 타입은 포함되지 않습니다.",
          en: "JSON supports six data types: string, number, boolean, null, array, and object. JavaScript-specific types like undefined, functions, and Symbols are not included.",
        },
      },
      {
        title: {
          ko: "JSON vs YAML",
          en: "JSON vs YAML",
        },
        description: {
          ko: "JSON은 엄격한 구문과 범용 호환성이 장점이며, YAML은 들여쓰기 기반의 가독성과 주석 지원이 장점입니다. 설정 파일에는 YAML이, API 통신에는 JSON이 주로 사용됩니다.",
          en: "JSON excels in strict syntax and universal compatibility, while YAML offers indentation-based readability and comment support. YAML is preferred for config files, JSON for API communication.",
        },
      },
      {
        title: {
          ko: "JSON5와 JSONC",
          en: "JSON5 and JSONC",
        },
        description: {
          ko: "JSON5는 주석, 후행 콤마, 작은따옴표 등을 허용하는 확장 형식이며, JSONC는 VS Code 등에서 사용하는 주석 허용 JSON입니다. 표준 JSON 파서에서는 사용할 수 없습니다.",
          en: "JSON5 allows comments, trailing commas, and single quotes as an extended format. JSONC is a comment-enabled JSON used in VS Code. Neither is compatible with standard JSON parsers.",
        },
      },
    ],
    relatedTools: ["yaml-json-converter", "json-schema-validator", "json-csv-converter", "code-minifier", "html-entity-encoder", "http-status-dictionary", "sql-formatter", "text-diff", "unix-timestamp", "url-encoder"],
    extraFaqs: [
      {
        question: {
          ko: "JSON에서 후행 콤마(trailing comma)를 사용할 수 있나요?",
          en: "Can I use trailing commas in JSON?",
        },
        answer: {
          ko: "표준 JSON(RFC 8259)에서는 후행 콤마를 허용하지 않습니다. 마지막 요소 뒤에 콤마가 있으면 파싱 오류가 발생합니다. 후행 콤마가 필요하면 JSON5 또는 JSONC 형식을 고려하세요.",
          en: "Standard JSON (RFC 8259) does not allow trailing commas. A comma after the last element will cause a parse error. Consider JSON5 or JSONC formats if trailing commas are needed.",
        },
      },
      {
        question: {
          ko: "JSON 포매터가 구문 오류를 어떻게 표시하나요?",
          en: "How does the JSON formatter display syntax errors?",
        },
        answer: {
          ko: "잘못된 JSON을 입력하면 오류가 발생한 줄 번호와 위치, 예상 토큰과 실제 토큰 정보를 표시합니다. 이를 통해 빠르게 오류를 찾아 수정할 수 있습니다.",
          en: "When invalid JSON is entered, it shows the line number and position of the error, along with expected vs. actual token information, helping you quickly locate and fix the issue.",
        },
      },
      {
        question: {
          ko: "대용량 JSON 데이터도 처리할 수 있나요?",
          en: "Can it handle large JSON data?",
        },
        answer: {
          ko: "브라우저에서 처리하므로 수 MB 이하의 JSON은 원활하게 포맷합니다. 매우 큰 파일(10MB 이상)은 브라우저 메모리 제약으로 느려질 수 있으니, CLI 도구(jq 등)를 권장합니다.",
          en: "Since processing happens in the browser, JSON under a few MB formats smoothly. Very large files (10MB+) may slow down due to browser memory limits — CLI tools like jq are recommended instead.",
        },
      },
      {
        question: {
          ko: "JSON 키 정렬(sort keys) 기능이 있나요?",
          en: "Is there a sort keys feature?",
        },
        answer: {
          ko: "현재는 입력된 순서 그대로 포맷합니다. JSON 표준에서는 키 순서가 보장되지 않으므로, API 응답 비교 시에는 별도의 키 정렬 도구를 활용하거나 jq의 --sort-keys 옵션을 사용할 수 있습니다.",
          en: "Currently, keys are formatted in their original order. Since JSON standard does not guarantee key order, for API response comparison you can use a separate key sorting tool or jq's --sort-keys option.",
        },
      },
    ],
    usageExamples: [
      {
        title: { ko: "API 응답 디버깅", en: "Debugging API Response" },
        scenario: {
          ko: "백엔드 API가 반환하는 압축된 JSON 응답을 가독성 있게 확인해야 합니다.",
          en: "You need to read a minified JSON response from a backend API.",
        },
        steps: [
          { ko: "API 응답 JSON을 입력란에 붙여넣습니다.", en: "Paste the API response JSON into the input field." },
          { ko: "포맷 버튼을 클릭하여 들여쓰기가 적용된 결과를 확인합니다.", en: "Click format to view the indented result." },
          { ko: "중첩된 객체 구조와 데이터 값을 쉽게 파악합니다.", en: "Easily identify nested object structures and data values." },
        ],
        result: {
          ko: "압축된 JSON이 깔끔하게 정리되어 API 응답 구조 파악 완료.",
          en: "Minified JSON neatly formatted for easy API response structure analysis.",
        },
      },
      {
        title: { ko: "설정 파일 문법 검증", en: "Config File Syntax Validation" },
        scenario: {
          ko: "배포 전 JSON 설정 파일에 문법 오류가 없는지 확인해야 합니다.",
          en: "You need to check a JSON config file for syntax errors before deployment.",
        },
        steps: [
          { ko: "설정 파일 내용을 입력란에 붙여넣습니다.", en: "Paste the config file content into the input field." },
          { ko: "포맷 버튼 클릭 시 오류가 있으면 줄 번호와 함께 표시됩니다.", en: "Click format — errors are shown with line numbers if any." },
        ],
        result: {
          ko: "후행 콤마 오류를 발견하여 배포 전 수정 완료.",
          en: "Found trailing comma error and fixed it before deployment.",
        },
      },
    ],
  },

  "url-encoder": {
    howTo: {
      steps: [
        {
          ko: "인코딩 또는 디코딩 모드를 선택합니다.",
          en: "Select encode or decode mode.",
        },
        {
          ko: "URL 또는 퍼센트 인코딩된 문자열을 입력합니다.",
          en: "Enter a URL or percent-encoded string.",
        },
        {
          ko: "encodeURIComponent(개별 값) 또는 encodeURI(전체 URL) 방식을 선택합니다.",
          en: "Choose encodeURIComponent (individual values) or encodeURI (full URL) mode.",
        },
        {
          ko: "변환 결과를 확인하고 복사합니다.",
          en: "Review and copy the converted result.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "퍼센트 인코딩 (Percent-Encoding)",
          en: "Percent-Encoding",
        },
        description: {
          ko: "RFC 3986에 정의된 방식으로, URL에서 사용할 수 없는 문자를 %XX 형식의 16진수로 변환합니다. 예: 공백→%20, 한글 '가'→%EA%B0%80 (UTF-8 바이트).",
          en: "Defined in RFC 3986, converts characters unsafe for URLs into %XX hexadecimal format. Example: space→%20, Korean '가'→%EA%B0%80 (UTF-8 bytes).",
        },
      },
      {
        title: {
          ko: "encodeURI vs encodeURIComponent",
          en: "encodeURI vs encodeURIComponent",
        },
        description: {
          ko: "encodeURI는 전체 URL 구조를 유지하며 :, /, ?, # 등을 인코딩하지 않습니다. encodeURIComponent는 쿼리 파라미터 값처럼 개별 요소를 인코딩할 때 사용하며, 거의 모든 특수문자를 변환합니다.",
          en: "encodeURI preserves URL structure by not encoding :, /, ?, #. encodeURIComponent is for individual components like query parameter values, encoding nearly all special characters.",
        },
      },
      {
        title: {
          ko: "국제화 도메인 이름 (IDN)",
          en: "Internationalized Domain Names (IDN)",
        },
        description: {
          ko: "도메인에 비ASCII 문자(한글 등)를 사용하는 기술입니다. 실제로는 Punycode(xn--로 시작)로 변환되어 DNS에 등록됩니다. URL 인코딩과는 다른 계층의 변환입니다.",
          en: "Technology allowing non-ASCII characters (like Korean) in domain names. Internally converted to Punycode (starting with xn--) for DNS registration. A different layer of conversion from URL encoding.",
        },
      },
    ],
    relatedTools: ["base64", "html-entity-encoder", "json-formatter", "ascii-unicode-table", "http-status-dictionary", "image-base64-converter", "qr-code-generator", "regex-tester"],
    extraFaqs: [
      {
        question: {
          ko: "공백은 %20과 + 중 어떤 것으로 인코딩해야 하나요?",
          en: "Should spaces be encoded as %20 or +?",
        },
        answer: {
          ko: "%20이 URL 표준(RFC 3986)에 따른 방식입니다. +는 HTML 폼의 application/x-www-form-urlencoded에서만 사용되는 레거시 방식이며, 쿼리 문자열에서 혼동을 일으킬 수 있습니다.",
          en: "%20 is the standard per RFC 3986. The + sign is a legacy convention from HTML form's application/x-www-form-urlencoded and can cause confusion in query strings.",
        },
      },
      {
        question: {
          ko: "이미 인코딩된 URL을 다시 인코딩하면 어떻게 되나요?",
          en: "What happens if I encode an already-encoded URL?",
        },
        answer: {
          ko: "이중 인코딩(double encoding)이 발생합니다. 예를 들어 %20이 %2520으로 변환됩니다. 서버에서 한 번만 디코딩하면 원래 값을 복원할 수 없으므로 주의해야 합니다.",
          en: "Double encoding occurs. For example, %20 becomes %2520. Since the server typically decodes only once, this prevents recovering the original value. Be cautious to avoid encoding twice.",
        },
      },
      {
        question: {
          ko: "한글 URL은 어떻게 처리되나요?",
          en: "How are Korean characters handled in URLs?",
        },
        answer: {
          ko: "한글은 UTF-8로 인코딩된 후 각 바이트가 퍼센트 인코딩됩니다. 예를 들어 '서울'은 %EC%84%9C%EC%9A%B8로 변환됩니다. 최신 브라우저는 주소창에 한글을 보여주지만 내부적으로는 인코딩된 형태를 사용합니다.",
          en: "Korean characters are first encoded as UTF-8, then each byte is percent-encoded. For example, '서울' becomes %EC%84%9C%EC%9A%B8. Modern browsers display Korean in the address bar but internally use the encoded form.",
        },
      },
      {
        question: {
          ko: "URL 인코딩과 HTML 엔티티 인코딩의 차이는 무엇인가요?",
          en: "What is the difference between URL encoding and HTML entity encoding?",
        },
        answer: {
          ko: "URL 인코딩(%XX)은 URL에서 안전하지 않은 문자를 변환하고, HTML 엔티티(&amp;lt; 등)는 HTML 문서에서 특수문자를 안전하게 표시하기 위한 것입니다. 용도와 적용 계층이 다릅니다.",
          en: "URL encoding (%XX) converts characters unsafe in URLs, while HTML entities (&lt; etc.) safely display special characters within HTML documents. They serve different purposes at different layers.",
        },
      },
    ],
  },

  "unix-timestamp": {
    howTo: {
      steps: [
        {
          ko: "현재 Unix 타임스탬프가 자동으로 표시됩니다.",
          en: "The current Unix timestamp is displayed automatically.",
        },
        {
          ko: "타임스탬프를 입력하면 날짜/시간으로 변환됩니다.",
          en: "Enter a timestamp to convert it to a date/time.",
        },
        {
          ko: "날짜/시간을 입력하면 타임스탬프로 변환됩니다.",
          en: "Enter a date/time to convert it to a timestamp.",
        },
        {
          ko: "로컬 시간대, UTC, ISO 8601 형식 중 원하는 출력을 선택합니다.",
          en: "Choose the desired output format: local timezone, UTC, or ISO 8601.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "Unix Epoch",
          en: "Unix Epoch",
        },
        description: {
          ko: "1970년 1월 1일 00:00:00 UTC를 기준점(epoch)으로, 이 시점부터 경과한 초(또는 밀리초)로 시간을 표현하는 방식입니다. 시간대에 독립적이라 시스템 간 시간 교환에 이상적입니다.",
          en: "A time representation counting seconds (or milliseconds) from January 1, 1970 00:00:00 UTC as the epoch. Being timezone-independent makes it ideal for exchanging time between systems.",
        },
      },
      {
        title: {
          ko: "2038년 문제 (Y2K38)",
          en: "Year 2038 Problem (Y2K38)",
        },
        description: {
          ko: "32비트 정수로 Unix 타임스탬프를 저장하는 시스템은 2038년 1월 19일에 오버플로가 발생합니다. 64비트 시스템에서는 이 문제가 없으며, 대부분의 현대 시스템은 이미 64비트로 전환했습니다.",
          en: "Systems storing Unix timestamps as 32-bit integers will overflow on January 19, 2038. 64-bit systems are not affected, and most modern systems have already transitioned to 64-bit.",
        },
      },
      {
        title: {
          ko: "ISO 8601 날짜 형식",
          en: "ISO 8601 Date Format",
        },
        description: {
          ko: "국제 표준 날짜/시간 형식으로 2024-01-15T09:30:00Z와 같이 표기합니다. 'T'는 날짜와 시간 구분자, 'Z'는 UTC를 의미합니다. API 통신과 로그에서 가장 권장되는 형식입니다.",
          en: "International standard date/time format like 2024-01-15T09:30:00Z. 'T' separates date and time, 'Z' indicates UTC. The most recommended format for API communication and logs.",
        },
      },
    ],
    relatedTools: ["cron-parser", "jwt-decoder", "json-formatter"],
    extraFaqs: [
      {
        question: {
          ko: "초 단위 타임스탬프와 밀리초 단위 타임스탬프를 어떻게 구분하나요?",
          en: "How can I distinguish between second and millisecond timestamps?",
        },
        answer: {
          ko: "초 단위 타임스탬프는 10자리(예: 1704067200), 밀리초 단위는 13자리(예: 1704067200000)입니다. JavaScript의 Date.now()는 밀리초를, Python의 time.time()은 초 단위를 반환합니다.",
          en: "Second timestamps have 10 digits (e.g., 1704067200), millisecond timestamps have 13 digits (e.g., 1704067200000). JavaScript's Date.now() returns milliseconds, while Python's time.time() returns seconds.",
        },
      },
      {
        question: {
          ko: "음수 타임스탬프는 어떤 의미인가요?",
          en: "What does a negative timestamp mean?",
        },
        answer: {
          ko: "음수 타임스탬프는 1970년 1월 1일 이전의 시점을 나타냅니다. 예를 들어 -86400은 1969년 12월 31일입니다. 역사적 날짜를 다룰 때 사용되며, 대부분의 시스템에서 지원합니다.",
          en: "A negative timestamp represents a point before January 1, 1970. For example, -86400 is December 31, 1969. Used for historical dates and supported by most systems.",
        },
      },
      {
        question: {
          ko: "타임존 변환은 어떻게 처리되나요?",
          en: "How is timezone conversion handled?",
        },
        answer: {
          ko: "Unix 타임스탬프는 항상 UTC 기준입니다. 이 도구는 브라우저의 로컬 타임존을 자동 감지하여 현지 시간과 UTC를 동시에 표시합니다. 한국(KST)은 UTC+9이므로 9시간 차이가 납니다.",
          en: "Unix timestamps are always UTC-based. This tool auto-detects your browser's local timezone and shows both local and UTC time. Korea (KST) is UTC+9, so there is a 9-hour difference.",
        },
      },
      {
        question: {
          ko: "윤초(leap second)는 타임스탬프에 영향을 미치나요?",
          en: "Do leap seconds affect timestamps?",
        },
        answer: {
          ko: "Unix 타임스탬프는 윤초를 무시합니다. POSIX 표준에서 하루는 항상 86,400초로 정의되며, 윤초가 삽입되어도 타임스탬프에는 반영되지 않습니다. NTP가 이를 부드럽게 보정합니다.",
          en: "Unix timestamps ignore leap seconds. POSIX defines a day as always 86,400 seconds — leap seconds are not reflected in timestamps. NTP handles the adjustment smoothly.",
        },
      },
    ],
  },

  "text-case-converter": {
    howTo: {
      steps: [
        {
          ko: "변환할 텍스트를 입력 필드에 입력합니다.",
          en: "Enter the text to convert in the input field.",
        },
        {
          ko: "원하는 케이스 형식을 선택합니다 (camelCase, snake_case 등).",
          en: "Select the desired case format (camelCase, snake_case, etc.).",
        },
        {
          ko: "변환 결과가 즉시 표시됩니다.",
          en: "The conversion result appears instantly.",
        },
        {
          ko: "복사 버튼으로 원하는 형식의 결과를 클립보드에 복사합니다.",
          en: "Copy the desired format to clipboard using the copy button.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "네이밍 컨벤션",
          en: "Naming Conventions",
        },
        description: {
          ko: "프로그래밍 언어마다 권장하는 네이밍 컨벤션이 다릅니다. JavaScript/Java는 camelCase, Python/Ruby는 snake_case, CSS/HTML은 kebab-case, .NET은 PascalCase를 주로 사용합니다.",
          en: "Each programming language has its own naming convention. JavaScript/Java prefer camelCase, Python/Ruby use snake_case, CSS/HTML use kebab-case, and .NET uses PascalCase.",
        },
      },
      {
        title: {
          ko: "식별자 명명 규칙",
          en: "Identifier Naming Rules",
        },
        description: {
          ko: "좋은 변수명은 의미를 명확히 전달하고, 일관된 규칙을 따르며, 적절한 길이를 유지합니다. 약어 사용을 최소화하고, 불리언은 is/has/can 접두사를 사용하는 것이 관례입니다.",
          en: "Good variable names clearly convey meaning, follow consistent rules, and maintain appropriate length. Minimize abbreviations and use is/has/can prefixes for booleans by convention.",
        },
      },
    ],
    relatedTools: ["text-counter", "text-diff", "code-minifier", "lorem-ipsum-generator", "sql-formatter"],
    extraFaqs: [
      {
        question: {
          ko: "camelCase와 PascalCase의 차이는 무엇인가요?",
          en: "What is the difference between camelCase and PascalCase?",
        },
        answer: {
          ko: "camelCase는 첫 글자가 소문자(myVariable), PascalCase는 첫 글자가 대문자(MyVariable)입니다. JavaScript에서 변수/함수는 camelCase, 클래스/컴포넌트는 PascalCase를 사용합니다.",
          en: "camelCase starts with a lowercase letter (myVariable), PascalCase starts with uppercase (MyVariable). In JavaScript, variables/functions use camelCase while classes/components use PascalCase.",
        },
      },
      {
        question: {
          ko: "SCREAMING_SNAKE_CASE는 언제 사용하나요?",
          en: "When is SCREAMING_SNAKE_CASE used?",
        },
        answer: {
          ko: "상수(constant) 값을 정의할 때 주로 사용합니다. 예: MAX_RETRY_COUNT, API_BASE_URL. JavaScript의 const와 혼동하지 마세요 — 모든 const가 SCREAMING_SNAKE_CASE를 사용하는 것은 아닙니다.",
          en: "Primarily used for defining constant values. Example: MAX_RETRY_COUNT, API_BASE_URL. Don't confuse with JavaScript's const — not all const variables use SCREAMING_SNAKE_CASE.",
        },
      },
      {
        question: {
          ko: "kebab-case는 왜 CSS와 URL에서 많이 쓰이나요?",
          en: "Why is kebab-case commonly used in CSS and URLs?",
        },
        answer: {
          ko: "CSS 속성명(font-size 등)이 하이픈을 사용하므로 자연스럽게 kebab-case가 표준이 되었습니다. URL에서도 검색엔진이 하이픈을 단어 구분자로 인식하여 SEO에 유리합니다.",
          en: "CSS property names (font-size, etc.) use hyphens, making kebab-case a natural standard. In URLs, search engines recognize hyphens as word separators, making it SEO-friendly.",
        },
      },
      {
        question: {
          ko: "여러 단어를 한 번에 변환할 수 있나요?",
          en: "Can I convert multiple words at once?",
        },
        answer: {
          ko: "네, 공백으로 구분된 여러 단어를 입력하면 자동으로 하나의 식별자로 결합하여 변환합니다. 예를 들어 'user first name'은 camelCase에서 'userFirstName'이 됩니다.",
          en: "Yes, enter multiple space-separated words and they will be automatically combined into a single identifier. For example, 'user first name' becomes 'userFirstName' in camelCase.",
        },
      },
      {
        question: {
          ko: "데이터베이스 컬럼명에는 어떤 케이스가 적합한가요?",
          en: "Which case is best for database column names?",
        },
        answer: {
          ko: "대부분의 데이터베이스에서 snake_case가 표준입니다. PostgreSQL은 대소문자를 구분하지 않아 snake_case가 자연스럽고, MySQL/MariaDB에서도 snake_case가 관례입니다.",
          en: "snake_case is the standard in most databases. PostgreSQL is case-insensitive making snake_case natural, and MySQL/MariaDB also follow the snake_case convention.",
        },
      },
    ],
  },

  "number-base-converter": {
    howTo: {
      steps: [
        {
          ko: "입력 진수(2, 8, 10, 16)를 선택합니다.",
          en: "Select the input base (binary, octal, decimal, hexadecimal).",
        },
        {
          ko: "변환할 숫자를 입력합니다.",
          en: "Enter the number to convert.",
        },
        {
          ko: "모든 진수의 변환 결과가 동시에 표시됩니다.",
          en: "Conversion results for all bases are displayed simultaneously.",
        },
        {
          ko: "비트 시각화를 통해 이진 표현을 확인합니다.",
          en: "Check the binary representation through the bit visualization.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "위치적 기수법",
          en: "Positional Numeral System",
        },
        description: {
          ko: "각 자릿수의 값이 위치에 따라 결정되는 표기법입니다. 10진수 255는 2×10²+5×10¹+5×10⁰, 16진수 FF는 15×16¹+15×16⁰으로 같은 값을 나타냅니다.",
          en: "A notation where each digit's value is determined by its position. Decimal 255 is 2×10²+5×10¹+5×10⁰, hexadecimal FF is 15×16¹+15×16⁰ — representing the same value.",
        },
      },
      {
        title: {
          ko: "비트 연산",
          en: "Bitwise Operations",
        },
        description: {
          ko: "AND(&), OR(|), XOR(^), NOT(~), 시프트(<<, >>) 등의 비트 단위 연산입니다. 서브넷 마스크 계산, 권한 플래그 관리, 최적화된 곱셈/나눗셈 등에 활용됩니다.",
          en: "Bit-level operations including AND(&), OR(|), XOR(^), NOT(~), and shifts (<<, >>). Used in subnet mask calculation, permission flag management, and optimized multiplication/division.",
        },
      },
      {
        title: {
          ko: "2의 보수 (Two's Complement)",
          en: "Two's Complement",
        },
        description: {
          ko: "컴퓨터에서 음수를 표현하는 가장 일반적인 방식입니다. 비트를 반전한 뒤 1을 더합니다. 8비트 기준 -1은 11111111(0xFF)로 표현되며, 덧셈 회로만으로 뺄셈이 가능합니다.",
          en: "The most common way computers represent negative numbers. Invert all bits and add 1. In 8-bit, -1 is 11111111 (0xFF). This allows subtraction using only addition circuits.",
        },
      },
    ],
    relatedTools: ["chmod-calculator", "color-converter", "subnet-calculator", "ascii-unicode-table", "byte-unit-converter", "nmea-checksum"],
    extraFaqs: [
      {
        question: {
          ko: "16진수에서 0x 접두사는 무엇을 의미하나요?",
          en: "What does the 0x prefix mean in hexadecimal?",
        },
        answer: {
          ko: "0x는 뒤에 오는 숫자가 16진수임을 나타내는 접두사입니다. C, Java, JavaScript 등 대부분의 프로그래밍 언어에서 사용합니다. 마찬가지로 0b는 2진수, 0o는 8진수를 나타냅니다.",
          en: "0x is a prefix indicating the following number is hexadecimal. Used in most programming languages like C, Java, and JavaScript. Similarly, 0b denotes binary and 0o denotes octal.",
        },
      },
      {
        question: {
          ko: "색상 코드 #FF5733은 어떻게 해석하나요?",
          en: "How do I interpret the color code #FF5733?",
        },
        answer: {
          ko: "FF(빨강 255), 57(초록 87), 33(파랑 51)으로, 각각 2자리 16진수가 RGB 채널의 0~255 값을 나타냅니다. 진수 변환기로 각 채널을 10진수로 변환하면 쉽게 이해할 수 있습니다.",
          en: "FF (red 255), 57 (green 87), 33 (blue 51) — each pair of hex digits represents an RGB channel value from 0 to 255. Use this converter to convert each channel to decimal for easy understanding.",
        },
      },
      {
        question: {
          ko: "JavaScript에서 진수 리터럴을 어떻게 사용하나요?",
          en: "How do I use number base literals in JavaScript?",
        },
        answer: {
          ko: "JavaScript에서 0b1010(2진수 10), 0o12(8진수 10), 0xA(16진수 10)처럼 접두사로 진수를 지정합니다. parseInt('1010', 2) 함수로도 문자열을 특정 진수로 파싱할 수 있습니다.",
          en: "In JavaScript, use prefixes like 0b1010 (binary 10), 0o12 (octal 10), 0xA (hex 10). The parseInt('1010', 2) function also parses strings in a specific base.",
        },
      },
      {
        question: {
          ko: "네트워크에서 진수 변환이 왜 중요한가요?",
          en: "Why is base conversion important in networking?",
        },
        answer: {
          ko: "IP 주소(192.168.1.1)는 내부적으로 32비트 이진수이며, 서브넷 마스크 연산은 비트 단위로 수행됩니다. MAC 주소는 16진수로 표기되고, 포트 번호는 10진수를 사용합니다. 네트워크를 이해하려면 진수 변환이 필수입니다.",
          en: "IP addresses (192.168.1.1) are internally 32-bit binary numbers, and subnet mask operations are performed bitwise. MAC addresses are in hexadecimal, port numbers in decimal. Base conversion is essential for understanding networking.",
        },
      },
    ],
  },

  "jwt-decoder": {
    howTo: {
      steps: [
        {
          ko: "JWT 토큰 문자열을 입력 필드에 붙여넣습니다.",
          en: "Paste the JWT token string into the input field.",
        },
        {
          ko: "Header, Payload, Signature가 자동으로 분리되어 표시됩니다.",
          en: "Header, Payload, and Signature are automatically separated and displayed.",
        },
        {
          ko: "exp, iat 등 시간 관련 클레임이 읽기 쉬운 형식으로 변환됩니다.",
          en: "Time-related claims like exp and iat are converted to human-readable format.",
        },
        {
          ko: "토큰 만료 상태를 실시간으로 확인합니다.",
          en: "Check the token expiration status in real time.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "JWT 구조 (Header.Payload.Signature)",
          en: "JWT Structure (Header.Payload.Signature)",
        },
        description: {
          ko: "JWT는 점(.)으로 구분된 세 부분으로 구성됩니다. Header는 알고리즘과 토큰 유형, Payload는 클레임(사용자 정보), Signature는 변조 방지를 위한 서명입니다.",
          en: "JWT consists of three dot-separated parts. Header specifies algorithm and token type, Payload contains claims (user info), and Signature prevents tampering.",
        },
      },
      {
        title: {
          ko: "JWT 클레임 (Claims)",
          en: "JWT Claims",
        },
        description: {
          ko: "등록된 클레임(iss, sub, aud, exp, iat), 공개 클레임(IANA에 등록된 표준 이름), 비공개 클레임(서비스 간 합의된 사용자 정의 데이터)으로 분류됩니다.",
          en: "Categorized as registered claims (iss, sub, aud, exp, iat), public claims (standard names registered with IANA), and private claims (custom data agreed between parties).",
        },
      },
      {
        title: {
          ko: "JWT vs 세션 기반 인증",
          en: "JWT vs Session-Based Authentication",
        },
        description: {
          ko: "세션은 서버에 상태를 저장하고, JWT는 클라이언트에 토큰으로 저장합니다. JWT는 서버 확장이 쉽지만 토큰 무효화가 어렵고, 세션은 즉시 무효화가 가능하지만 서버 메모리가 필요합니다.",
          en: "Sessions store state on the server; JWT stores tokens on the client. JWT scales easily but is hard to invalidate, while sessions allow instant invalidation but require server memory.",
        },
      },
    ],
    relatedTools: ["jwt-generator", "base64", "totp-generator", "unix-timestamp"],
    extraFaqs: [
      {
        question: {
          ko: "JWT 토큰을 이 도구에 입력해도 안전한가요?",
          en: "Is it safe to paste my JWT token into this tool?",
        },
        answer: {
          ko: "네, 모든 처리가 브라우저에서만 수행되며 토큰이 서버로 전송되지 않습니다. 하지만 프로덕션 환경의 유효한 토큰은 가능하면 주의해서 다루세요.",
          en: "Yes, all processing happens only in the browser and the token is never sent to any server. However, handle valid production tokens with care when possible.",
        },
      },
      {
        question: {
          ko: "JWT의 Signature 검증도 가능한가요?",
          en: "Can this tool verify the JWT signature?",
        },
        answer: {
          ko: "이 도구는 디코딩 전용입니다. Signature 검증에는 서명에 사용된 비밀 키(HS256) 또는 공개 키(RS256)가 필요하며, 이는 서버 측에서 수행해야 합니다.",
          en: "This tool is for decoding only. Signature verification requires the secret key (HS256) or public key (RS256) used for signing, which must be done server-side.",
        },
      },
      {
        question: {
          ko: "JWT 토큰의 적정 만료 시간은 얼마인가요?",
          en: "What is the recommended JWT expiration time?",
        },
        answer: {
          ko: "액세스 토큰은 15분~1시간, 리프레시 토큰은 7일~30일이 일반적입니다. 보안이 중요한 서비스(금융 등)는 더 짧게, 사용자 편의가 중요한 서비스는 더 길게 설정합니다.",
          en: "Access tokens typically expire in 15 minutes to 1 hour, refresh tokens in 7 to 30 days. Security-critical services (finance etc.) use shorter times, while user convenience-focused services use longer times.",
        },
      },
    ],
    usageExamples: [
      {
        title: { ko: "인증 토큰 디버깅", en: "Debugging Authentication Token" },
        scenario: {
          ko: "로그인 후 발급된 JWT 토큰의 사용자 정보와 만료 시간을 확인해야 합니다.",
          en: "You need to check user info and expiration time of a JWT issued after login.",
        },
        steps: [
          { ko: "브라우저 개발자 도구에서 JWT 토큰을 복사합니다.", en: "Copy the JWT token from browser developer tools." },
          { ko: "토큰을 입력란에 붙여넣어 Header와 Payload를 확인합니다.", en: "Paste the token to inspect Header and Payload." },
          { ko: "exp 클레임으로 토큰 만료 시간(예: 2026-04-06 15:00 KST)을 확인합니다.", en: "Check token expiry time (e.g., 2026-04-06 15:00 KST) via the exp claim." },
        ],
        result: {
          ko: "토큰에 포함된 사용자 ID, 역할, 만료 시간을 확인하여 인증 문제 원인 파악.",
          en: "Identified auth issue by checking user ID, role, and expiry in the token.",
        },
      },
      {
        title: { ko: "API 권한 클레임 검증", en: "Verify API Permission Claims" },
        scenario: {
          ko: "마이크로서비스 간 API 호출에서 JWT에 필요한 권한이 포함되어 있는지 확인합니다.",
          en: "Verify that the JWT contains required permissions for inter-service API calls.",
        },
        steps: [
          { ko: "API 요청 헤더에서 Bearer 토큰을 복사합니다.", en: "Copy the Bearer token from API request headers." },
          { ko: "Payload에서 scope 또는 permissions 클레임을 확인합니다.", en: "Check scope or permissions claims in the Payload." },
        ],
        result: {
          ko: "누락된 'admin:write' 권한을 발견하여 403 오류 원인 해결.",
          en: "Found missing 'admin:write' permission, resolving the 403 error.",
        },
      },
    ],
  },

  "uuid-generator": {
    howTo: {
      steps: [
        {
          ko: "UUID 버전(v1, v4, v7) 또는 ULID를 선택합니다.",
          en: "Select UUID version (v1, v4, v7) or ULID.",
        },
        {
          ko: "생성 버튼을 클릭하면 고유 식별자가 즉시 생성됩니다.",
          en: "Click generate and a unique identifier is created instantly.",
        },
        {
          ko: "필요 시 벌크 생성 수량(최대 100개)을 설정합니다.",
          en: "Set the bulk generation count (up to 100) if needed.",
        },
        {
          ko: "생성된 ID를 클립보드에 복사합니다.",
          en: "Copy the generated ID to clipboard.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "UUID 버전별 특성",
          en: "UUID Version Characteristics",
        },
        description: {
          ko: "v1은 MAC 주소+타임스탬프 기반, v4는 완전 랜덤, v7은 시간 정렬+랜덤(2024년 표준화)입니다. v7은 데이터베이스 인덱싱 성능이 우수하여 새 프로젝트에 권장됩니다.",
          en: "v1 is MAC address + timestamp based, v4 is fully random, v7 is time-ordered + random (standardized in 2024). v7 is recommended for new projects due to superior database indexing performance.",
        },
      },
      {
        title: {
          ko: "UUID 충돌 확률",
          en: "UUID Collision Probability",
        },
        description: {
          ko: "UUID v4의 충돌 확률은 122비트 랜덤으로 극히 낮습니다. 초당 10억 개를 생성해도 100년간 충돌 확률은 약 50%에 불과합니다. 실용적으로 충돌은 무시할 수 있는 수준입니다.",
          en: "UUID v4 collision probability is extremely low with 122 random bits. Even generating 1 billion per second, the collision probability over 100 years is only about 50%. Practically negligible.",
        },
      },
      {
        title: {
          ko: "ULID (Universally Unique Lexicographically Sortable Identifier)",
          en: "ULID (Universally Unique Lexicographically Sortable Identifier)",
        },
        description: {
          ko: "26자 Crockford Base32 형식으로, 시간순 정렬이 가능합니다. UUID보다 짧고, 문자열 정렬로 시간순 정렬이 되어 데이터베이스 인덱싱에 효율적입니다.",
          en: "A 26-character Crockford Base32 format that is lexicographically sortable by time. Shorter than UUID, string sorting equals time sorting, making it efficient for database indexing.",
        },
      },
    ],
    relatedTools: ["password-generator", "hash-generator", "base64"],
    extraFaqs: [
      {
        question: {
          ko: "UUID v4 대신 v7을 사용해야 하는 이유가 있나요?",
          en: "Is there a reason to use UUID v7 over v4?",
        },
        answer: {
          ko: "v7은 시간 기반 정렬이 가능하여 데이터베이스 B-tree 인덱스 성능이 훨씬 좋습니다. v4는 완전 랜덤이라 인덱스 페이지 분할이 잦아 대량 삽입 시 성능 저하가 발생할 수 있습니다.",
          en: "v7 is time-sortable, offering much better B-tree index performance in databases. v4's randomness causes frequent index page splits, which can degrade performance during bulk inserts.",
        },
      },
      {
        question: {
          ko: "UUID를 프라이머리 키로 사용해도 되나요?",
          en: "Can I use UUID as a primary key?",
        },
        answer: {
          ko: "가능하지만 고려할 점이 있습니다. 자동 증가 정수(4바이트)보다 크고(16바이트), 인덱스 크기가 증가합니다. v7이나 ULID를 사용하면 정렬 성능 문제를 완화할 수 있습니다.",
          en: "Possible but with considerations. UUIDs are larger (16 bytes) than auto-increment integers (4 bytes), increasing index size. Using v7 or ULID mitigates sorting performance issues.",
        },
      },
      {
        question: {
          ko: "UUID와 ULID 중 어떤 것을 선택해야 하나요?",
          en: "Should I choose UUID or ULID?",
        },
        answer: {
          ko: "표준 호환성이 중요하면 UUID(RFC 9562), 짧은 길이와 정렬성이 중요하면 ULID를 선택하세요. UUID v7도 시간 정렬을 지원하므로 표준 준수가 필요한 경우 v7이 좋은 절충안입니다.",
          en: "Choose UUID (RFC 9562) for standard compatibility, ULID for shorter length and sortability. UUID v7 also supports time ordering, making it a good compromise when standards compliance is needed.",
        },
      },
    ],
  },

  "yaml-json-converter": {
    howTo: {
      steps: [
        {
          ko: "YAML→JSON 또는 JSON→YAML 변환 방향을 선택합니다.",
          en: "Select the conversion direction: YAML→JSON or JSON→YAML.",
        },
        {
          ko: "입력 영역에 YAML 또는 JSON 데이터를 붙여넣습니다.",
          en: "Paste YAML or JSON data into the input area.",
        },
        {
          ko: "변환 결과가 자동으로 출력됩니다. 오류 시 위치가 표시됩니다.",
          en: "The conversion result is output automatically. Errors show their location.",
        },
        {
          ko: "결과를 복사하여 설정 파일에 적용합니다.",
          en: "Copy the result and apply it to your configuration file.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "YAML 앵커와 별칭",
          en: "YAML Anchors and Aliases",
        },
        description: {
          ko: "YAML에서 &anchor로 값을 정의하고 *alias로 재사용할 수 있습니다. 중복 설정을 줄이는 데 유용하지만, JSON에는 이 기능이 없으므로 변환 시 값이 인라인됩니다.",
          en: "YAML lets you define values with &anchor and reuse with *alias. Useful for reducing duplicate config, but JSON lacks this feature so values are inlined during conversion.",
        },
      },
      {
        title: {
          ko: "멀티라인 문자열 처리",
          en: "Multiline String Handling",
        },
        description: {
          ko: "YAML의 | (리터럴 블록)은 줄바꿈을 유지하고, > (폴디드 블록)은 줄바꿈을 공백으로 변환합니다. JSON에서는 \\n 이스케이프로 표현됩니다.",
          en: "YAML's | (literal block) preserves newlines, > (folded block) converts them to spaces. In JSON, these are represented with \\n escapes.",
        },
      },
      {
        title: {
          ko: "암시적 타입 변환 함정 (Norway Problem)",
          en: "Implicit Typing Pitfalls (The Norway Problem)",
        },
        description: {
          ko: "YAML 1.1은 no, off, yes 같은 단어를 불리언으로 해석합니다. 국가 코드 NO(노르웨이)가 false로 바뀌는 것이 대표 사례입니다. 버전 문자열 1.20도 숫자 1.2로 잘릴 수 있으므로, 의도한 문자열은 따옴표로 감싸야 안전합니다.",
          en: "YAML 1.1 interprets words like no, off, and yes as booleans. The classic example: the country code NO (Norway) becomes false. A version string like 1.20 can also collapse to the number 1.2 — quote strings explicitly to stay safe.",
        },
      },
    ],
    relatedTools: ["json-formatter", "json-schema-validator", "json-csv-converter"],
    extraFaqs: [
      {
        question: {
          ko: "YAML의 들여쓰기 오류를 어떻게 찾나요?",
          en: "How do I find indentation errors in YAML?",
        },
        answer: {
          ko: "이 도구는 파싱 오류 발생 시 문제가 있는 줄 번호와 위치를 명확하게 표시합니다. YAML은 탭을 허용하지 않으므로, 탭 대신 공백(보통 2칸)을 사용해야 합니다.",
          en: "This tool clearly shows the line number and position of parsing errors. YAML does not allow tabs — use spaces (typically 2) instead of tabs.",
        },
      },
      {
        question: {
          ko: "YAML에서 JSON으로 변환 시 주석은 어떻게 되나요?",
          en: "What happens to YAML comments during JSON conversion?",
        },
        answer: {
          ko: "JSON은 주석을 지원하지 않으므로 YAML의 # 주석은 변환 시 제거됩니다. 주석이 포함된 원본 YAML을 별도로 보관하는 것을 권장합니다.",
          en: "Since JSON does not support comments, YAML's # comments are removed during conversion. It's recommended to keep the original YAML with comments separately.",
        },
      },
      {
        question: {
          ko: "Kubernetes YAML을 JSON으로 변환해야 하는 경우가 있나요?",
          en: "Are there cases where Kubernetes YAML needs to be converted to JSON?",
        },
        answer: {
          ko: "네, kubectl은 JSON도 지원하며 프로그래밍 방식으로 매니페스트를 생성할 때 JSON이 편리합니다. 또한 API 서버는 내부적으로 JSON을 사용하므로 디버깅 시 JSON 형태가 도움될 수 있습니다.",
          en: "Yes, kubectl supports JSON and it's convenient for generating manifests programmatically. Also, the API server uses JSON internally, so JSON form can help during debugging.",
        },
      },
      {
        question: {
          ko: "숫자나 국가 코드가 엉뚱한 값으로 변환되는 이유는 뭔가요?",
          en: "Why do numbers or country codes convert to unexpected values?",
        },
        answer: {
          ko: "YAML의 암시적 타입 변환 때문입니다. 따옴표 없는 no/off/yes는 불리언으로, 3.10 같은 값은 숫자로 해석될 수 있습니다. 문자열로 유지하려면 \"no\", \"3.10\"처럼 따옴표로 감싸세요. 변환 결과에서 따옴표가 사라졌다면 이 규칙에 걸린 것입니다.",
          en: "It's YAML's implicit typing. Unquoted no/off/yes parse as booleans, and values like 3.10 can parse as numbers. Wrap them in quotes (\"no\", \"3.10\") to keep them as strings. If quotes disappeared in the output, this rule is what caught you.",
        },
      },
    ],
  },

  "sql-formatter": {
    howTo: {
      steps: [
        {
          ko: "SQL 쿼리를 입력 영역에 붙여넣습니다.",
          en: "Paste your SQL query into the input area.",
        },
        {
          ko: "SQL 방언(Standard, PostgreSQL, MySQL 등)을 선택합니다.",
          en: "Select the SQL dialect (Standard, PostgreSQL, MySQL, etc.).",
        },
        {
          ko: "들여쓰기 크기와 키워드 대소문자 옵션을 설정합니다.",
          en: "Configure indentation size and keyword case options.",
        },
        {
          ko: "포맷 또는 미니파이 결과를 확인하고 복사합니다.",
          en: "Review the formatted or minified result and copy it.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "SQL 코딩 스타일 가이드",
          en: "SQL Coding Style Guide",
        },
        description: {
          ko: "키워드를 대문자(SELECT, FROM, WHERE)로 작성하고, 테이블/컬럼명은 소문자 snake_case를 사용하는 것이 널리 통용되는 관례입니다. 일관된 들여쓰기와 줄 배치가 가독성을 높입니다.",
          en: "Writing keywords in uppercase (SELECT, FROM, WHERE) and table/column names in lowercase snake_case is widely accepted convention. Consistent indentation and line placement improve readability.",
        },
      },
      {
        title: {
          ko: "SQL 방언의 차이",
          en: "SQL Dialect Differences",
        },
        description: {
          ko: "각 DBMS는 고유한 SQL 확장을 가집니다. PostgreSQL의 ILIKE, MySQL의 LIMIT 문법, SQL Server의 TOP, Oracle의 ROWNUM 등이 대표적입니다. 포맷터의 방언 선택이 중요한 이유입니다.",
          en: "Each DBMS has unique SQL extensions: PostgreSQL's ILIKE, MySQL's LIMIT syntax, SQL Server's TOP, Oracle's ROWNUM. This is why selecting the correct dialect in the formatter matters.",
        },
      },
      {
        title: {
          ko: "쿼리 실행 계획과 최적화",
          en: "Query Execution Plans and Optimization",
        },
        description: {
          ko: "포맷된 SQL은 쿼리 구조를 시각적으로 파악하기 쉬워 EXPLAIN ANALYZE 결과와 대조하며 최적화하기 좋습니다. 서브쿼리, JOIN 순서, 인덱스 사용 여부를 쉽게 식별할 수 있습니다.",
          en: "Formatted SQL makes query structure visually clear, ideal for comparing with EXPLAIN ANALYZE results during optimization. Subqueries, JOIN order, and index usage become easy to identify.",
        },
      },
    ],
    relatedTools: ["json-formatter", "code-minifier", "text-case-converter", "lorem-ipsum-generator"],
    extraFaqs: [
      {
        question: {
          ko: "SQL 포맷팅이 쿼리 성능에 영향을 미치나요?",
          en: "Does SQL formatting affect query performance?",
        },
        answer: {
          ko: "아니요, 포맷팅(공백, 줄바꿈, 대소문자)은 쿼리 성능에 전혀 영향을 미치지 않습니다. 데이터베이스 엔진은 실행 전에 쿼리를 파싱하고 최적화하므로 형식은 무관합니다.",
          en: "No, formatting (whitespace, line breaks, case) has no effect on query performance. Database engines parse and optimize queries before execution, so formatting is irrelevant.",
        },
      },
      {
        question: {
          ko: "ORM이 생성한 쿼리도 포맷할 수 있나요?",
          en: "Can I format queries generated by an ORM?",
        },
        answer: {
          ko: "네, ORM(Sequelize, TypeORM, Prisma 등)이 생성한 SQL을 이 도구에 붙여넣으면 깔끔하게 포맷됩니다. 이를 통해 ORM이 실제로 어떤 쿼리를 생성하는지 분석할 수 있습니다.",
          en: "Yes, paste SQL generated by ORMs (Sequelize, TypeORM, Prisma, etc.) to format it cleanly. This helps analyze what queries the ORM actually generates.",
        },
      },
      {
        question: {
          ko: "SQL 미니파이는 언제 유용한가요?",
          en: "When is SQL minification useful?",
        },
        answer: {
          ko: "SQL을 코드에 인라인으로 포함할 때, 로그에서 한 줄로 쿼리를 확인할 때, 또는 네트워크 전송 크기를 줄일 때 유용합니다. 단, 가독성이 떨어지므로 개발 환경에서는 포맷된 형태를 권장합니다.",
          en: "Useful when embedding SQL inline in code, viewing queries on a single log line, or reducing network transfer size. However, reduced readability means formatted SQL is recommended for development.",
        },
      },
    ],
  },

  "markdown-preview": {
    howTo: {
      steps: [
        {
          ko: "왼쪽 편집기에 Markdown 텍스트를 입력합니다.",
          en: "Enter Markdown text in the left editor.",
        },
        {
          ko: "오른쪽 미리보기에서 렌더링 결과를 실시간으로 확인합니다.",
          en: "See the rendered result in real time on the right preview.",
        },
        {
          ko: "분할, 편집기, 미리보기 모드를 전환하여 작업합니다.",
          en: "Switch between split, editor, and preview modes for your workflow.",
        },
        {
          ko: "GFM(테이블, 체크리스트 등) 문법을 활용합니다.",
          en: "Utilize GFM syntax (tables, checklists, etc.).",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "GitHub Flavored Markdown (GFM)",
          en: "GitHub Flavored Markdown (GFM)",
        },
        description: {
          ko: "표준 Markdown을 확장한 GitHub의 변형으로, 테이블, 작업 목록(체크박스), 취소선(~~), 자동 링크, 코드 블록 구문 강조 등을 추가로 지원합니다.",
          en: "GitHub's extension of standard Markdown, adding support for tables, task lists (checkboxes), strikethrough (~~), autolinks, and code block syntax highlighting.",
        },
      },
      {
        title: {
          ko: "Markdown과 HTML의 관계",
          en: "Relationship Between Markdown and HTML",
        },
        description: {
          ko: "Markdown은 HTML의 간소화된 표기법으로, 최종적으로 HTML로 변환됩니다. Markdown 내에서 직접 HTML 태그를 사용할 수도 있어 복잡한 레이아웃도 표현 가능합니다.",
          en: "Markdown is a simplified notation for HTML, ultimately converted to HTML. You can use HTML tags directly within Markdown for complex layouts.",
        },
      },
      {
        title: {
          ko: "Markdown 방언 (CommonMark vs GFM)",
          en: "Markdown Flavors (CommonMark vs GFM)",
        },
        description: {
          ko: "Markdown은 단일 표준이 아닙니다. CommonMark가 기본 규격이고, GitHub Flavored Markdown(GFM)은 여기에 표·취소선·자동링크·체크박스를 더합니다. 같은 문서도 렌더러에 따라 표가 깨지거나 체크박스가 안 보일 수 있는 이유입니다.",
          en: "Markdown is not a single standard. CommonMark is the base spec; GitHub Flavored Markdown (GFM) adds tables, strikethrough, autolinks, and task checkboxes. That's why the same document can lose its tables or checkboxes depending on the renderer.",
        },
      },
    ],
    relatedTools: ["html-entity-encoder", "text-counter", "text-diff", "lorem-ipsum-generator"],
    extraFaqs: [
      {
        question: {
          ko: "코드 블록에서 구문 강조(syntax highlighting)가 지원되나요?",
          en: "Does the preview support syntax highlighting in code blocks?",
        },
        answer: {
          ko: "네, 코드 블록에 언어를 지정하면(```javascript 등) 구문 강조가 적용됩니다. JavaScript, Python, TypeScript, JSON 등 주요 언어를 지원합니다.",
          en: "Yes, specify the language after the opening backticks (e.g., ```javascript) for syntax highlighting. Major languages like JavaScript, Python, TypeScript, and JSON are supported.",
        },
      },
      {
        question: {
          ko: "Markdown으로 표(table)를 만드는 방법은?",
          en: "How do I create tables in Markdown?",
        },
        answer: {
          ko: "파이프(|)와 하이픈(-)으로 테이블을 만듭니다. 예: | 헤더1 | 헤더2 | 다음 줄에 |---|---| 구분선, 그 아래에 데이터 행을 작성합니다. 콜론(:)으로 정렬을 지정할 수 있습니다.",
          en: "Use pipes (|) and hyphens (-) to create tables. Example: | Header1 | Header2 | followed by |---|---| separator line, then data rows. Use colons (:) to specify alignment.",
        },
      },
      {
        question: {
          ko: "이미지와 링크의 문법 차이는 무엇인가요?",
          en: "What is the syntax difference between images and links?",
        },
        answer: {
          ko: "링크는 [텍스트](URL), 이미지는 ![대체텍스트](URL)입니다. 이미지는 느낌표(!)가 추가됩니다. 대체 텍스트는 이미지 로드 실패 시 또는 스크린 리더에서 표시됩니다.",
          en: "Links: [text](URL), Images: ![alt text](URL). Images have an exclamation mark (!) prefix. Alt text displays when the image fails to load or for screen readers.",
        },
      },
      {
        question: {
          ko: "GitHub에서는 잘 보이던 표가 다른 곳에서 깨지는 이유는?",
          en: "Why do tables that render on GitHub break elsewhere?",
        },
        answer: {
          ko: "표는 CommonMark 기본 문법이 아니라 GFM 확장이기 때문입니다. GFM을 지원하지 않는 렌더러(일부 CMS·이메일·문서 도구)는 표를 일반 텍스트로 출력합니다. 이 미리보기는 GFM 표를 지원하므로, 붙여넣어 렌더 여부를 먼저 확인해 보세요.",
          en: "Because tables are a GFM extension, not core CommonMark. Renderers without GFM support (some CMSs, email clients, doc tools) output tables as plain text. This preview supports GFM tables, so paste your document here first to check how it renders.",
        },
      },
    ],
  },

  "html-entity-encoder": {
    howTo: {
      steps: [
        {
          ko: "인코딩(HTML→엔티티) 또는 디코딩(엔티티→HTML) 모드를 선택합니다.",
          en: "Select encode (HTML→entity) or decode (entity→HTML) mode.",
        },
        {
          ko: "변환할 텍스트를 입력 필드에 붙여넣습니다.",
          en: "Paste the text to convert into the input field.",
        },
        {
          ko: "변환 결과가 즉시 표시됩니다.",
          en: "The conversion result appears instantly.",
        },
        {
          ko: "결과를 복사하여 HTML 문서에 안전하게 삽입합니다.",
          en: "Copy the result and safely insert it into your HTML document.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "XSS(Cross-Site Scripting) 방지",
          en: "XSS (Cross-Site Scripting) Prevention",
        },
        description: {
          ko: "사용자 입력을 HTML에 직접 삽입하면 <script> 태그가 실행될 수 있습니다. HTML 엔티티로 인코딩하면 &lt;script&gt;로 표시만 되고 실행되지 않아 XSS 공격을 방지합니다.",
          en: "Inserting user input directly into HTML can execute <script> tags. Encoding to HTML entities displays &lt;script&gt; as text only, not executed, preventing XSS attacks.",
        },
      },
      {
        title: {
          ko: "이름 엔티티 vs 숫자 엔티티",
          en: "Named Entities vs Numeric Entities",
        },
        description: {
          ko: "이름 엔티티(&amp;copy;→©)는 가독성이 좋고, 숫자 엔티티(&#169;, &#x00A9;)는 모든 유니코드 문자를 표현할 수 있습니다. 10진수(&#169;)와 16진수(&#x00A9;) 두 형식이 있습니다.",
          en: "Named entities (&copy;→©) are readable; numeric entities (&#169;, &#x00A9;) can represent any Unicode character. Available in decimal (&#169;) and hexadecimal (&#x00A9;) forms.",
        },
      },
      {
        title: {
          ko: "문자 인코딩과 HTML 엔티티",
          en: "Character Encoding and HTML Entities",
        },
        description: {
          ko: "UTF-8 인코딩이 표준인 현대 웹에서는 대부분의 특수문자를 직접 사용할 수 있지만, <, >, &, \" 등 HTML 구문에 사용되는 문자는 반드시 엔티티로 인코딩해야 합니다.",
          en: "With UTF-8 as the modern web standard, most special characters can be used directly. However, characters used in HTML syntax (<, >, &, \") must always be entity-encoded.",
        },
      },
    ],
    relatedTools: ["url-encoder", "base64", "json-formatter", "ascii-unicode-table", "markdown-preview"],
    extraFaqs: [
      {
        question: {
          ko: "React/Vue에서도 HTML 엔티티 인코딩이 필요한가요?",
          en: "Is HTML entity encoding needed in React/Vue?",
        },
        answer: {
          ko: "React의 JSX와 Vue의 템플릿은 기본적으로 출력을 자동 이스케이프합니다. 하지만 dangerouslySetInnerHTML(React)이나 v-html(Vue)을 사용할 때는 수동 인코딩이 필요합니다.",
          en: "React's JSX and Vue templates auto-escape output by default. However, manual encoding is required when using dangerouslySetInnerHTML (React) or v-html (Vue).",
        },
      },
      {
        question: {
          ko: "모든 특수문자를 인코딩해야 하나요?",
          en: "Do I need to encode all special characters?",
        },
        answer: {
          ko: "UTF-8 환경에서는 <, >, &, \", ' 다섯 문자만 반드시 인코딩하면 됩니다. ©, ™ 같은 문자는 UTF-8에서 직접 사용 가능하며, 인코딩은 선택사항입니다.",
          en: "In a UTF-8 environment, only five characters must be encoded: <, >, &, \", '. Characters like © and ™ can be used directly in UTF-8 — encoding them is optional.",
        },
      },
      {
        question: {
          ko: "JSON 안의 HTML 문자열은 어떻게 처리하나요?",
          en: "How should HTML strings inside JSON be handled?",
        },
        answer: {
          ko: "JSON 내부의 HTML 문자열은 이중 이스케이프에 주의해야 합니다. JSON의 \" 이스케이프와 HTML 엔티티가 모두 필요할 수 있습니다. 서버에서 JSON 응답을 생성할 때 자동 이스케이프 라이브러리를 사용하세요.",
          en: "Be cautious of double-escaping with HTML strings in JSON. Both JSON's \" escape and HTML entities may be needed. Use auto-escape libraries when generating JSON responses server-side.",
        },
      },
    ],
  },

  "image-base64-converter": {
    howTo: {
      steps: [
        {
          ko: "이미지→Base64 또는 Base64→이미지 변환 방향을 선택합니다.",
          en: "Select conversion direction: Image→Base64 or Base64→Image.",
        },
        {
          ko: "이미지 파일을 드래그 앤 드롭하거나 파일 선택으로 업로드합니다.",
          en: "Upload an image via drag-and-drop or file selection.",
        },
        {
          ko: "Data URL 형식의 Base64 문자열이 생성됩니다.",
          en: "A Base64 string in Data URL format is generated.",
        },
        {
          ko: "결과를 복사하여 CSS, HTML, JSON 등에 활용합니다.",
          en: "Copy the result for use in CSS, HTML, JSON, etc.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "Data URL 스킴",
          en: "Data URL Scheme",
        },
        description: {
          ko: "data:[MIME타입];base64,[데이터] 형식으로, 외부 파일 요청 없이 리소스를 인라인으로 포함합니다. 작은 아이콘이나 배경 이미지를 HTTP 요청 없이 로드할 수 있습니다.",
          en: "Uses the data:[MIME type];base64,[data] format to embed resources inline without external file requests. Load small icons or background images without additional HTTP requests.",
        },
      },
      {
        title: {
          ko: "이미지 최적화 전략",
          en: "Image Optimization Strategies",
        },
        description: {
          ko: "1KB 이하의 작은 이미지는 Base64 인라인이 HTTP 요청을 줄여 효율적입니다. 그 이상은 별도 파일로 제공하는 것이 캐싱과 대역폭 면에서 유리합니다.",
          en: "Small images under 1KB are efficient as inline Base64 by reducing HTTP requests. Larger images are better served as separate files for caching and bandwidth benefits.",
        },
      },
      {
        title: {
          ko: "MIME 타입과 이미지 형식",
          en: "MIME Types and Image Formats",
        },
        description: {
          ko: "image/png(무손실), image/jpeg(손실 압축), image/webp(차세대), image/svg+xml(벡터) 등이 있습니다. Base64 인코딩 시 올바른 MIME 타입이 Data URL에 포함되어야 합니다.",
          en: "Includes image/png (lossless), image/jpeg (lossy), image/webp (next-gen), image/svg+xml (vector). The correct MIME type must be included in the Data URL during encoding.",
        },
      },
    ],
    relatedTools: ["base64", "url-encoder", "qr-code-generator", "color-converter"],
    extraFaqs: [
      {
        question: {
          ko: "Base64 인코딩된 이미지의 크기 제한이 있나요?",
          en: "Is there a size limit for Base64-encoded images?",
        },
        answer: {
          ko: "이 도구는 5MB까지 지원합니다. Base64는 원본 대비 약 33% 크기가 증가하므로, 큰 이미지는 CSS/HTML 파일 크기를 크게 늘립니다. 1KB 이하의 작은 아이콘에 주로 사용하는 것을 권장합니다.",
          en: "This tool supports up to 5MB. Since Base64 increases size by about 33%, large images significantly bloat CSS/HTML files. Recommended mainly for small icons under 1KB.",
        },
      },
      {
        question: {
          ko: "CSS에서 Base64 이미지를 사용하는 방법은?",
          en: "How do I use Base64 images in CSS?",
        },
        answer: {
          ko: "background-image: url('data:image/png;base64,...'); 형식으로 사용합니다. 스프라이트 시트 대신 작은 아이콘을 인라인으로 포함할 때 HTTP 요청을 줄일 수 있습니다.",
          en: "Use background-image: url('data:image/png;base64,...'); format. Reduces HTTP requests by including small icons inline instead of using sprite sheets.",
        },
      },
      {
        question: {
          ko: "SVG 이미지도 Base64로 변환해야 하나요?",
          en: "Should SVG images also be converted to Base64?",
        },
        answer: {
          ko: "SVG는 텍스트 기반이므로 Base64 대신 URL 인코딩으로 직접 Data URL에 사용할 수 있습니다. data:image/svg+xml,<svg>...</svg> 형태가 Base64보다 크기가 작고 편집도 가능합니다.",
          en: "Since SVG is text-based, you can use URL encoding instead of Base64 in Data URLs. The data:image/svg+xml,<svg>...</svg> form is smaller than Base64 and remains editable.",
        },
      },
    ],
  },

  "json-schema-validator": {
    howTo: {
      steps: [
        {
          ko: "JSON Schema를 왼쪽 입력 영역에 작성하거나 붙여넣습니다.",
          en: "Write or paste a JSON Schema in the left input area.",
        },
        {
          ko: "검증할 JSON 데이터를 오른쪽 입력 영역에 입력합니다.",
          en: "Enter the JSON data to validate in the right input area.",
        },
        {
          ko: "검증 결과가 즉시 표시됩니다 (유효/무효 및 오류 상세).",
          en: "Validation results appear instantly (valid/invalid with error details).",
        },
        {
          ko: "오류 메시지를 확인하여 데이터 구조를 수정합니다.",
          en: "Review error messages to fix the data structure.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "JSON Schema Draft 버전",
          en: "JSON Schema Draft Versions",
        },
        description: {
          ko: "Draft 4, 6, 7, 2019-09, 2020-12 등의 버전이 있습니다. 이 도구는 Draft 7을 지원하며, 가장 널리 사용되는 버전입니다. 각 버전마다 지원하는 키워드가 다릅니다.",
          en: "Versions include Draft 4, 6, 7, 2019-09, and 2020-12. This tool supports Draft 7, the most widely used version. Each version supports different keywords.",
        },
      },
      {
        title: {
          ko: "스키마 조합 키워드",
          en: "Schema Composition Keywords",
        },
        description: {
          ko: "allOf(모두 만족), anyOf(하나 이상 만족), oneOf(정확히 하나 만족), not(불만족)으로 복잡한 검증 규칙을 구성합니다. 조건부 검증에는 if/then/else도 사용됩니다.",
          en: "Build complex validation rules with allOf (all match), anyOf (at least one), oneOf (exactly one), and not (must not match). Conditional validation uses if/then/else.",
        },
      },
      {
        title: {
          ko: "OpenAPI와 JSON Schema",
          en: "OpenAPI and JSON Schema",
        },
        description: {
          ko: "OpenAPI(Swagger) 명세는 JSON Schema를 기반으로 API 요청/응답 본문의 구조를 정의합니다. API 문서화와 자동 유효성 검사에 핵심 역할을 합니다.",
          en: "OpenAPI (Swagger) specs use JSON Schema as the basis for defining API request/response body structures. Essential for API documentation and automatic validation.",
        },
      },
    ],
    relatedTools: ["json-formatter", "yaml-json-converter", "json-csv-converter"],
    extraFaqs: [
      {
        question: {
          ko: "JSON Schema로 중첩된 객체도 검증할 수 있나요?",
          en: "Can JSON Schema validate nested objects?",
        },
        answer: {
          ko: "네, properties 내부에 다시 type: object와 properties를 정의하여 원하는 깊이만큼 중첩 검증이 가능합니다. $ref를 사용하면 재사용 가능한 스키마 정의도 가능합니다.",
          en: "Yes, define type: object with properties inside other properties for any nesting depth. Use $ref for reusable schema definitions.",
        },
      },
      {
        question: {
          ko: "additionalProperties: false는 어떤 효과가 있나요?",
          en: "What does additionalProperties: false do?",
        },
        answer: {
          ko: "스키마에 정의되지 않은 추가 속성이 있으면 검증이 실패합니다. API 입력 검증에서 예상치 못한 필드를 거부하여 보안과 데이터 정합성을 높이는 데 유용합니다.",
          en: "Validation fails if there are properties not defined in the schema. Useful for API input validation to reject unexpected fields, improving security and data integrity.",
        },
      },
      {
        question: {
          ko: "JSON Schema를 코드에서 자동 생성할 수 있나요?",
          en: "Can JSON Schema be auto-generated from code?",
        },
        answer: {
          ko: "TypeScript의 ts-json-schema-generator, Python의 pydantic, Java의 Jackson 등으로 타입/클래스에서 JSON Schema를 자동 생성할 수 있습니다. 코드와 스키마의 동기화를 보장하는 좋은 방법입니다.",
          en: "Use ts-json-schema-generator (TypeScript), pydantic (Python), or Jackson (Java) to auto-generate JSON Schema from types/classes. A great way to keep code and schema in sync.",
        },
      },
    ],
  },

  "code-minifier": {
    howTo: {
      steps: [
        {
          ko: "CSS 또는 JavaScript 탭을 선택합니다.",
          en: "Select the CSS or JavaScript tab.",
        },
        {
          ko: "압축할 코드를 입력 영역에 붙여넣습니다.",
          en: "Paste the code to minify into the input area.",
        },
        {
          ko: "압축 결과와 파일 크기 감소율이 즉시 표시됩니다.",
          en: "The minified result and file size reduction are shown instantly.",
        },
        {
          ko: "결과를 복사하여 프로덕션 빌드에 활용합니다.",
          en: "Copy the result for use in production builds.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "코드 압축 vs 난독화",
          en: "Minification vs Obfuscation",
        },
        description: {
          ko: "압축(minification)은 공백과 주석을 제거하여 크기를 줄이는 것이고, 난독화(obfuscation)는 변수명 변경 등으로 코드를 읽기 어렵게 만드는 것입니다. 이 도구는 압축만 수행합니다.",
          en: "Minification removes whitespace and comments to reduce size. Obfuscation renames variables to make code unreadable. This tool performs minification only.",
        },
      },
      {
        title: {
          ko: "소스맵 (Source Map)",
          en: "Source Maps",
        },
        description: {
          ko: "압축된 코드와 원본 소스를 매핑하는 .map 파일입니다. 브라우저 개발자 도구에서 압축된 코드를 디버깅할 때 원본 코드 위치를 표시해줍니다. 프로덕션 디버깅에 필수적입니다.",
          en: "A .map file mapping minified code to original source. Browser DevTools use it to show original code locations when debugging minified code. Essential for production debugging.",
        },
      },
      {
        title: {
          ko: "트리 셰이킹 (Tree Shaking)",
          en: "Tree Shaking",
        },
        description: {
          ko: "사용하지 않는 코드를 번들에서 제거하는 최적화 기법입니다. ES 모듈의 정적 import/export 분석을 통해 동작하며, Webpack, Rollup 등의 번들러가 이를 수행합니다.",
          en: "An optimization technique that removes unused code from bundles. Works through static import/export analysis of ES modules, performed by bundlers like Webpack and Rollup.",
        },
      },
    ],
    relatedTools: ["json-formatter", "sql-formatter", "text-counter", "text-case-converter"],
    extraFaqs: [
      {
        question: {
          ko: "CSS와 JS 압축률에 차이가 있나요?",
          en: "Is there a difference in compression ratio between CSS and JS?",
        },
        answer: {
          ko: "일반적으로 CSS는 30~50%, JavaScript는 20~40% 크기 감소를 기대할 수 있습니다. CSS는 반복적인 속성 선언이 많아 압축 효과가 더 큰 편입니다. 코드 스타일(주석, 공백량)에 따라 차이가 큽니다.",
          en: "Generally, CSS sees 30-50% and JavaScript 20-40% size reduction. CSS often has more repetitive property declarations, yielding greater compression. Results vary significantly by coding style (comments, whitespace).",
        },
      },
      {
        question: {
          ko: "빌드 도구(Webpack 등)가 있는데 이 도구가 필요한가요?",
          en: "Do I need this tool if I have build tools like Webpack?",
        },
        answer: {
          ko: "빌드 파이프라인이 있다면 자동 압축이 더 적합합니다. 이 도구는 빠른 실험, 단일 파일 압축, 빌드 도구 없는 프로젝트, 압축 전후 비교 확인에 유용합니다.",
          en: "Auto-minification in a build pipeline is better for projects with one. This tool is useful for quick experiments, single file compression, projects without build tools, and comparing before/after results.",
        },
      },
      {
        question: {
          ko: "압축 후 코드가 제대로 동작하지 않으면 어떻게 하나요?",
          en: "What if the code doesn't work properly after minification?",
        },
        answer: {
          ko: "JavaScript에서 세미콜론 자동 삽입(ASI) 규칙에 의존하는 코드는 압축 후 오류가 발생할 수 있습니다. 항상 세미콜론을 명시적으로 사용하고, 압축 후 반드시 테스트하는 것을 권장합니다.",
          en: "JavaScript code relying on Automatic Semicolon Insertion (ASI) may break after minification. Always use explicit semicolons and test after minification.",
        },
      },
    ],
  },

  "json-csv-converter": {
    howTo: {
      steps: [
        {
          ko: "JSON 배열 데이터를 입력 영역에 붙여넣습니다.",
          en: "Paste JSON array data into the input area.",
        },
        {
          ko: "구분자(쉼표, 탭, 세미콜론)를 선택합니다.",
          en: "Select the delimiter (comma, tab, semicolon).",
        },
        {
          ko: "변환 버튼을 클릭하면 CSV 형식으로 변환됩니다.",
          en: "Click convert to transform the data into CSV format.",
        },
        {
          ko: "결과를 복사하거나 CSV 파일로 다운로드합니다.",
          en: "Copy the result or download as a CSV file.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "CSV 표준 (RFC 4180)",
          en: "CSV Standard (RFC 4180)",
        },
        description: {
          ko: "CSV의 공식 표준으로, 필드에 쉼표/줄바꿈/따옴표가 포함되면 큰따옴표로 감싸고, 따옴표 안의 따옴표는 두 번 반복하여 이스케이프합니다.",
          en: "The official CSV standard: fields containing commas, newlines, or quotes are enclosed in double quotes, and quotes within quoted fields are escaped by doubling them.",
        },
      },
      {
        title: {
          ko: "중첩 JSON 평탄화",
          en: "Nested JSON Flattening",
        },
        description: {
          ko: "CSV는 2차원 테이블 구조이므로 중첩된 JSON 객체를 점 표기법(예: address.city)으로 평탄화하여 표현합니다. 배열은 쉼표로 연결하거나 별도 행으로 분리할 수 있습니다.",
          en: "Since CSV is a 2D table structure, nested JSON objects are flattened using dot notation (e.g., address.city). Arrays can be joined with commas or split into separate rows.",
        },
      },
      {
        title: {
          ko: "데이터 직렬화 형식 비교",
          en: "Data Serialization Format Comparison",
        },
        description: {
          ko: "JSON(계층적, API 친화적), CSV(표 형태, 스프레드시트 친화적), XML(자기 기술적, 엔터프라이즈), YAML(가독성, 설정 파일). 용도에 따라 적절한 형식을 선택해야 합니다.",
          en: "JSON (hierarchical, API-friendly), CSV (tabular, spreadsheet-friendly), XML (self-describing, enterprise), YAML (readable, config files). Choose the right format for your use case.",
        },
      },
    ],
    relatedTools: ["json-formatter", "json-schema-validator", "yaml-json-converter", "nmea-checksum"],
    extraFaqs: [
      {
        question: {
          ko: "중첩된 JSON 객체는 어떻게 CSV로 변환되나요?",
          en: "How are nested JSON objects converted to CSV?",
        },
        answer: {
          ko: "중첩된 객체는 점 표기법으로 평탄화됩니다. 예를 들어 {address: {city: '서울'}}은 'address.city' 컬럼으로 변환됩니다. 이 방식으로 깊은 중첩도 처리할 수 있습니다.",
          en: "Nested objects are flattened using dot notation. For example, {address: {city: 'Seoul'}} becomes an 'address.city' column. This approach handles deep nesting.",
        },
      },
      {
        question: {
          ko: "CSV에서 한글이 깨지는 경우 어떻게 해결하나요?",
          en: "How to fix Korean character encoding issues in CSV?",
        },
        answer: {
          ko: "Excel에서 CSV를 열 때 UTF-8 인코딩을 인식하지 못하는 경우가 있습니다. BOM(Byte Order Mark)이 포함된 UTF-8로 저장하거나, Excel의 데이터 가져오기 기능에서 인코딩을 UTF-8로 지정하세요.",
          en: "Excel sometimes doesn't recognize UTF-8 encoding when opening CSV. Save as UTF-8 with BOM (Byte Order Mark), or specify UTF-8 encoding when using Excel's data import feature.",
        },
      },
      {
        question: {
          ko: "탭(TSV)과 세미콜론 구분자는 언제 사용하나요?",
          en: "When should I use tab (TSV) or semicolon delimiters?",
        },
        answer: {
          ko: "데이터에 쉼표가 많이 포함된 경우 탭(TSV) 구분자가 적합합니다. 유럽 지역에서는 숫자의 소수점으로 쉼표를 사용하므로 세미콜론을 구분자로 선호합니다.",
          en: "Use tab (TSV) when data contains many commas. European regions use commas as decimal separators, so semicolons are preferred as delimiters there.",
        },
      },
    ],
  },
  "nmea-checksum": {
    howTo: {
      steps: [
        {
          ko: "GPS·AIS 장비 로그에서 NMEA 문장을 복사해 입력 영역에 붙여넣습니다. 여러 줄을 한 번에 넣어도 됩니다.",
          en: "Copy NMEA sentences from your GPS or AIS device log and paste them into the input area. Multiple lines at once are fine.",
        },
        {
          ko: "검증 / 계산 버튼을 클릭하면 줄마다 본문을 XOR하여 체크섬을 계산합니다.",
          en: "Click Validate / Calculate to XOR each sentence body and compute its checksum.",
        },
        {
          ko: "*XX 체크섬이 있는 줄은 ✅(일치) 또는 ❌(불일치)로 표시되고, 없는 줄은 🔵 계산 모드로 완성 문장을 만들어 줍니다.",
          en: "Lines with a *XX checksum show ✅ (match) or ❌ (mismatch); lines without one run in 🔵 calculation mode and produce the completed sentence.",
        },
        {
          ko: "필요하면 XOR 과정 표시를 켜서 누적 단계를 확인하고, 완성 문장을 복사합니다.",
          en: "Optionally enable Show XOR steps to inspect the accumulation, then copy the completed sentence.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "NMEA 0183 프로토콜",
          en: "NMEA 0183 Protocol",
        },
        description: {
          ko: "선박·GPS 장비가 위치·속도·시각 등을 주고받는 ASCII 직렬 통신 표준입니다. 각 문장은 $ 또는 ! 로 시작하고 쉼표로 필드를 구분하며 *XX 체크섬으로 끝납니다.",
          en: "An ASCII serial communication standard used by marine and GPS equipment to exchange position, speed, and time. Each sentence starts with $ or !, separates fields with commas, and ends with a *XX checksum.",
        },
      },
      {
        title: {
          ko: "XOR 체크섬",
          en: "XOR Checksum",
        },
        description: {
          ko: "본문의 모든 바이트를 순차적으로 배타적 논리합(XOR)하여 얻는 1바이트 값입니다. 계산이 빠르고 단순해 전송 중 비트 오류를 가볍게 검출하는 데 쓰입니다.",
          en: "A one-byte value obtained by XOR-ing every byte of the body in sequence. It is fast and simple, used to lightly detect bit errors during transmission.",
        },
      },
      {
        title: {
          ko: "AIS (AIVDM/AIVDO)",
          en: "AIS (AIVDM/AIVDO)",
        },
        description: {
          ko: "선박 자동 식별 장치가 사용하는 메시지로, ! 로 시작하는 캡슐화 문장입니다. 페이로드는 6비트 ASCII로 인코딩되지만 체크섬 규칙은 표준 NMEA와 동일합니다.",
          en: "Messages used by the Automatic Identification System, encapsulated in sentences that start with !. The payload is 6-bit ASCII encoded, but the checksum rule is identical to standard NMEA.",
        },
      },
    ],
    relatedTools: ["number-base-converter", "base64", "json-csv-converter"],
    extraFaqs: [
      {
        question: {
          ko: "체크섬은 일치하는데 데이터가 이상할 수 있나요?",
          en: "Can the checksum match but the data still be wrong?",
        },
        answer: {
          ko: "네. XOR 체크섬은 1바이트(8비트)뿐이라 충돌 가능성이 있고, 짝수 번 바뀐 비트 오류는 잡지 못할 수 있습니다. 체크섬 일치는 전송 무결성의 가벼운 확인일 뿐 의미적 정확성을 보장하지 않습니다.",
          en: "Yes. An XOR checksum is only one byte (8 bits), so collisions are possible and it can miss errors where an even number of bits flip. A matching checksum is a lightweight integrity check, not a guarantee of semantic correctness.",
        },
      },
      {
        question: {
          ko: "* 뒤의 체크섬이 소문자(예: *4a)여도 되나요?",
          en: "Does the checksum after * have to be uppercase (e.g. *4a)?",
        },
        answer: {
          ko: "표준은 대문자 16진수를 권장하지만, 이 도구는 검증 시 대소문자를 구분하지 않으므로 *4a 와 *4A 를 동일하게 처리합니다. 계산 결과는 항상 대문자 2자리로 출력합니다.",
          en: "The standard recommends uppercase hexadecimal, but this tool compares case-insensitively, so *4a and *4A are treated the same. The computed result is always printed as two uppercase digits.",
        },
      },
      {
        question: {
          ko: "여러 줄을 한 번에 검증할 수 있나요?",
          en: "Can I validate many lines at once?",
        },
        answer: {
          ko: "네. 줄 단위로 일괄 처리하며 빈 줄과 공백 줄, CRLF(\\r\\n) 줄바꿈은 자동으로 정리합니다. 각 줄의 결과를 표로 보여 주어 로그 전체를 빠르게 점검할 수 있습니다.",
          en: "Yes. It processes line by line in batch, automatically trimming blank lines, whitespace-only lines, and CRLF (\\r\\n) line endings. Results are shown per line so you can scan an entire log quickly.",
        },
      },
    ],
  },
};
