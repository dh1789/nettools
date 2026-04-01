import type { ToolEnhancement } from "../tools";

export const GENERAL_ENHANCEMENTS: Record<string, ToolEnhancement> = {
  "color-converter": {
    howTo: {
      steps: [
        {
          ko: "변환할 색상 코드를 입력합니다. HEX(#FF5733), RGB(255,87,51), HSL(11,100%,60%) 중 아무 형식이나 사용할 수 있습니다.",
          en: "Enter the color code you want to convert. You can use any format: HEX (#FF5733), RGB (255,87,51), or HSL (11,100%,60%).",
        },
        {
          ko: "입력과 동시에 나머지 두 형식의 값이 자동으로 계산되어 표시됩니다.",
          en: "The other two format values are automatically calculated and displayed as you type.",
        },
        {
          ko: "색상 미리보기 영역에서 변환된 색상을 시각적으로 확인합니다.",
          en: "Verify the converted color visually in the live preview area.",
        },
        {
          ko: "원하는 형식의 값을 클릭하여 클립보드에 복사한 후 CSS, Figma 등에 붙여넣습니다.",
          en: "Click the desired format value to copy it to the clipboard, then paste it into CSS, Figma, or other tools.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "색상 공간 (Color Space)",
          en: "Color Space",
        },
        description: {
          ko: "색상 공간은 색상을 수학적으로 표현하는 체계입니다. sRGB는 웹 표준 색상 공간으로, HEX와 RGB가 이 공간에 속합니다. HSL은 동일한 sRGB 색상을 사람이 직관적으로 이해할 수 있도록 색조·채도·명도로 재표현한 모델입니다.",
          en: "A color space is a mathematical system for representing colors. sRGB is the web-standard color space where HEX and RGB reside. HSL re-expresses the same sRGB colors in terms of hue, saturation, and lightness for more intuitive human understanding.",
        },
      },
      {
        title: {
          ko: "CSS 색상 함수",
          en: "CSS Color Functions",
        },
        description: {
          ko: "CSS는 rgb(), hsl() 외에도 oklch(), color(), color-mix() 등 최신 색상 함수를 지원합니다. 특히 oklch()는 인간의 색상 인지에 기반한 균일한 밝기를 제공하여 접근성 높은 색상 팔레트를 만들 때 유용합니다.",
          en: "Beyond rgb() and hsl(), CSS supports modern color functions like oklch(), color(), and color-mix(). Notably, oklch() provides perceptually uniform lightness based on human color perception, making it ideal for creating accessible color palettes.",
        },
      },
      {
        title: {
          ko: "웹 접근성과 색상 대비",
          en: "Web Accessibility and Color Contrast",
        },
        description: {
          ko: "WCAG 2.1 기준 일반 텍스트는 최소 4.5:1, 큰 텍스트는 3:1의 명도 대비를 요구합니다. 색상 변환기를 활용해 HSL의 L(명도) 값을 조절하면 접근성 기준을 충족하는 색상 쌍을 쉽게 찾을 수 있습니다.",
          en: "WCAG 2.1 requires at least a 4.5:1 luminance contrast ratio for normal text and 3:1 for large text. By adjusting the L (lightness) value in HSL using a color converter, you can easily find color pairs that meet accessibility standards.",
        },
      },
    ],
    relatedTools: ["number-base-converter", "qr-code-generator", "image-base64-converter"],
    extraFaqs: [
      {
        question: {
          ko: "알파(투명도)가 포함된 색상도 변환할 수 있나요?",
          en: "Can I convert colors with alpha (transparency)?",
        },
        answer: {
          ko: "HEX 8자리(#FF573380), rgba(), hsla() 등 알파 채널이 포함된 색상 형식을 지원합니다. 알파 값은 0(완전 투명)부터 1(완전 불투명)까지의 범위이며, HEX에서는 마지막 두 자리(00~FF)로 표현됩니다.",
          en: "Yes, 8-digit HEX (#FF573380), rgba(), and hsla() formats with alpha channels are supported. Alpha ranges from 0 (fully transparent) to 1 (fully opaque), and in HEX it is represented by the last two digits (00-FF).",
        },
      },
      {
        question: {
          ko: "Tailwind CSS에서 색상 코드를 어떻게 사용하나요?",
          en: "How do I use color codes in Tailwind CSS?",
        },
        answer: {
          ko: "Tailwind CSS는 bg-[#FF5733], text-[rgb(255,87,51)] 등 임의 값(Arbitrary Values)을 지원합니다. 색상 변환기에서 HEX 값을 복사한 후 bg-[복사한값] 형태로 사용할 수 있습니다. 또는 tailwind.config.js의 colors에 커스텀 색상을 등록하여 bg-primary처럼 사용합니다.",
          en: "Tailwind CSS supports arbitrary values like bg-[#FF5733] and text-[rgb(255,87,51)]. Copy the HEX value from the converter and use it as bg-[copied-value]. Alternatively, register custom colors in tailwind.config.js to use semantic names like bg-primary.",
        },
      },
      {
        question: {
          ko: "디자인 도구와 브라우저에서 색상이 다르게 보이는 이유는?",
          en: "Why do colors look different between design tools and browsers?",
        },
        answer: {
          ko: "모니터 캘리브레이션, 색상 프로파일(sRGB vs Display P3), 렌더링 엔진 차이 등이 원인입니다. Figma는 sRGB를 기본으로 사용하며, 최신 Apple 디스플레이는 Display P3 광색역을 지원합니다. 일관된 결과를 위해 sRGB 색상 공간을 기준으로 작업하는 것이 좋습니다.",
          en: "Differences arise from monitor calibration, color profiles (sRGB vs Display P3), and rendering engine variations. Figma defaults to sRGB, while modern Apple displays support the wider Display P3 gamut. For consistent results, work within the sRGB color space.",
        },
      },
      {
        question: {
          ko: "HEX 축약 표기(#F00)는 어떻게 해석되나요?",
          en: "How is shorthand HEX notation (#F00) interpreted?",
        },
        answer: {
          ko: "3자리 HEX(#F00)는 각 자릿수를 두 번 반복하여 6자리로 확장합니다. #F00 → #FF0000(빨강), #09C → #0099CC입니다. CSS에서 간결하게 색상을 표현할 때 유용하며, 변환기는 3자리와 6자리 모두 인식합니다.",
          en: "3-digit HEX (#F00) is expanded to 6 digits by repeating each digit: #F00 → #FF0000 (red), #09C → #0099CC. It is useful for concise CSS color declarations. The converter recognizes both 3-digit and 6-digit formats.",
        },
      },
    ],
  },

  "text-diff": {
    howTo: {
      steps: [
        {
          ko: "왼쪽(Original) 텍스트 영역에 원본 텍스트를 입력하거나 붙여넣습니다.",
          en: "Enter or paste the original text into the left (Original) text area.",
        },
        {
          ko: "오른쪽(Modified) 텍스트 영역에 변경된 텍스트를 입력하거나 붙여넣습니다.",
          en: "Enter or paste the modified text into the right (Modified) text area.",
        },
        {
          ko: "비교 결과가 자동으로 표시됩니다. 초록색은 추가된 줄, 빨간색은 삭제된 줄을 나타냅니다.",
          en: "The comparison result is displayed automatically. Green indicates added lines; red indicates removed lines.",
        },
        {
          ko: "결과를 확인하여 코드 리뷰, 문서 개정, 설정 파일 변경 사항을 파악합니다.",
          en: "Review the results to identify changes in code reviews, document revisions, or configuration files.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "Diff 알고리즘",
          en: "Diff Algorithm",
        },
        description: {
          ko: "Diff 알고리즘은 두 텍스트 간의 최소 차이를 찾는 알고리즘입니다. 가장 널리 사용되는 Myers diff 알고리즘은 최장 공통 부분 수열(LCS)을 기반으로 O(ND) 시간 복잡도로 최적의 편집 스크립트를 계산합니다.",
          en: "Diff algorithms find the minimal set of differences between two texts. The widely used Myers diff algorithm calculates the optimal edit script in O(ND) time based on the Longest Common Subsequence (LCS).",
        },
      },
      {
        title: {
          ko: "통합 Diff 형식 (Unified Diff)",
          en: "Unified Diff Format",
        },
        description: {
          ko: "통합 Diff 형식은 git diff와 patch 파일에서 사용하는 표준 형식입니다. + 기호는 추가된 줄, - 기호는 삭제된 줄, @@ 기호는 변경 위치(hunk header)를 표시합니다. 코드 리뷰와 버전 관리에 핵심적인 형식입니다.",
          en: "Unified Diff format is the standard used by git diff and patch files. The + symbol marks added lines, - marks removed lines, and @@ marks change locations (hunk headers). It is essential for code review and version control.",
        },
      },
      {
        title: {
          ko: "버전 관리와 병합 충돌",
          en: "Version Control and Merge Conflicts",
        },
        description: {
          ko: "Git 등 버전 관리 시스템에서 두 브랜치가 같은 부분을 수정하면 병합 충돌이 발생합니다. 텍스트 비교 도구는 충돌 내용을 시각적으로 파악하고 수동 해결을 지원하는 데 유용합니다.",
          en: "In version control systems like Git, merge conflicts occur when two branches modify the same section. Text diff tools help visually identify conflict content and assist in manual resolution.",
        },
      },
    ],
    relatedTools: ["text-counter", "text-case-converter", "json-formatter"],
    extraFaqs: [
      {
        question: {
          ko: "줄 단위 비교와 문자 단위 비교의 차이는 무엇인가요?",
          en: "What is the difference between line-level and character-level diff?",
        },
        answer: {
          ko: "줄 단위 비교(line diff)는 전체 줄의 추가·삭제를 표시합니다. 문자 단위 비교(char diff)는 같은 줄 내에서 변경된 개별 문자를 하이라이트합니다. 코드 리뷰에서는 줄 단위로 큰 변경을 파악한 후, 문자 단위로 세부 변경을 확인하는 것이 효과적입니다.",
          en: "Line diff shows additions and deletions of entire lines. Character diff highlights individual changed characters within the same line. In code review, it is effective to first identify major changes at the line level, then examine details at the character level.",
        },
      },
      {
        question: {
          ko: "공백 변경을 무시하고 비교할 수 있나요?",
          en: "Can I ignore whitespace changes when comparing?",
        },
        answer: {
          ko: "일부 비교 도구에서는 공백, 탭, 줄바꿈 차이를 무시하는 옵션을 제공합니다. 이는 들여쓰기 스타일만 다른 코드를 비교할 때 특히 유용합니다. git diff에서는 -w 또는 --ignore-all-space 옵션으로 공백을 무시할 수 있습니다.",
          en: "Some diff tools provide options to ignore whitespace, tabs, and line ending differences. This is especially useful when comparing code that differs only in indentation style. In git diff, you can use -w or --ignore-all-space to ignore whitespace.",
        },
      },
      {
        question: {
          ko: "매우 큰 파일도 비교할 수 있나요?",
          en: "Can I compare very large files?",
        },
        answer: {
          ko: "브라우저 기반 도구는 메모리 제한이 있어 수십 MB 이상의 파일은 처리가 느려질 수 있습니다. 대용량 파일은 diff, colordiff 같은 CLI 도구나 Meld, Beyond Compare 같은 데스크톱 애플리케이션 사용을 권장합니다.",
          en: "Browser-based tools have memory limitations, so files over tens of megabytes may process slowly. For large files, consider CLI tools like diff or colordiff, or desktop applications like Meld or Beyond Compare.",
        },
      },
      {
        question: {
          ko: "비교 결과를 다른 사람과 공유할 수 있나요?",
          en: "Can I share the diff results with others?",
        },
        answer: {
          ko: "비교 결과를 복사하여 Slack, 이메일, 이슈 트래커에 붙여넣을 수 있습니다. 코드 리뷰 시에는 GitHub Pull Request의 Files Changed 탭을 사용하면 변경 사항을 줄 단위로 확인하고 댓글을 달 수 있어 더 효율적입니다.",
          en: "You can copy the diff results and paste them into Slack, email, or issue trackers. For code reviews, using the Files Changed tab in GitHub Pull Requests is more efficient, as it lets you review changes line by line and leave comments.",
        },
      },
      {
        question: {
          ko: "JSON이나 XML 같은 구조화된 데이터도 비교할 수 있나요?",
          en: "Can I compare structured data like JSON or XML?",
        },
        answer: {
          ko: "텍스트 비교기는 모든 텍스트 형식을 줄 단위로 비교합니다. JSON의 경우 키 순서나 들여쓰기가 다르면 차이로 표시되므로, 먼저 JSON 포맷터로 정리한 후 비교하면 실제 데이터 차이만 확인할 수 있습니다.",
          en: "The text diff tool compares all text formats line by line. For JSON, differences in key order or indentation will show as changes, so format both JSONs with a JSON formatter first to see only actual data differences.",
        },
      },
    ],
  },

  "lorem-ipsum-generator": {
    howTo: {
      steps: [
        {
          ko: "생성 단위를 선택합니다: 단락(Paragraphs), 문장(Sentences), 또는 단어(Words).",
          en: "Select the generation unit: Paragraphs, Sentences, or Words.",
        },
        {
          ko: "원하는 수량을 입력합니다. 예: 단락 3개, 문장 10개, 단어 50개.",
          en: "Enter the desired quantity. Example: 3 paragraphs, 10 sentences, or 50 words.",
        },
        {
          ko: "필요한 경우 HTML 태그(<p>) 포함 여부를 선택합니다.",
          en: "Optionally choose whether to include HTML tags (<p>).",
        },
        {
          ko: "생성된 텍스트를 복사하여 디자인 목업, 웹 페이지 테스트 등에 사용합니다.",
          en: "Copy the generated text and use it in design mockups, web page testing, and more.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "타이포그래피와 레이아웃 테스트",
          en: "Typography and Layout Testing",
        },
        description: {
          ko: "더미 텍스트는 최종 콘텐츠 없이도 글꼴 크기, 줄 간격, 단락 간격 등 타이포그래피 설정을 테스트할 수 있게 합니다. 디자이너가 콘텐츠 내용에 집중하지 않고 순수한 레이아웃 평가를 할 수 있는 장점이 있습니다.",
          en: "Placeholder text allows testing typography settings like font size, line height, and paragraph spacing without final content. It helps designers evaluate pure layout without being distracted by actual content meaning.",
        },
      },
      {
        title: {
          ko: "대체 더미 텍스트 생성기",
          en: "Alternative Placeholder Text Generators",
        },
        description: {
          ko: "Lorem Ipsum 외에도 한글 입숨(Korean Ipsum), Hipster Ipsum, Bacon Ipsum 등 다양한 더미 텍스트 생성기가 있습니다. 한글 프로젝트에서는 한글 더미 텍스트를 사용하면 실제 환경에 더 가까운 레이아웃 테스트가 가능합니다.",
          en: "Beyond Lorem Ipsum, alternatives include Korean Ipsum, Hipster Ipsum, and Bacon Ipsum. For Korean projects, using Korean placeholder text enables layout testing closer to the real environment.",
        },
      },
      {
        title: {
          ko: "콘텐츠 우선 디자인",
          en: "Content-First Design",
        },
        description: {
          ko: "콘텐츠 우선 디자인은 더미 텍스트 대신 실제 또는 유사 콘텐츠로 디자인을 시작하는 방법론입니다. 더미 텍스트는 초기 레이아웃에 유용하지만, 최종 단계에서는 실제 콘텐츠로 테스트하여 텍스트 길이·줄바꿈·오버플로우 문제를 확인해야 합니다.",
          en: "Content-first design starts with real or realistic content instead of placeholders. While dummy text is useful for early layout, final stages should test with real content to catch text length, line break, and overflow issues.",
        },
      },
    ],
    relatedTools: ["text-counter", "text-case-converter", "markdown-preview"],
    extraFaqs: [
      {
        question: {
          ko: "Lorem Ipsum 텍스트가 실제 라틴어인가요?",
          en: "Is Lorem Ipsum text actual Latin?",
        },
        answer: {
          ko: "Lorem Ipsum은 키케로의 라틴어 원문에서 유래했지만, 의도적으로 수정되고 무작위로 재배열되어 올바른 라틴어 문법을 따르지 않습니다. 'Lorem'이라는 단어 자체도 라틴어에 존재하지 않으며, 원문 'dolorem'이 잘린 형태입니다.",
          en: "Lorem Ipsum derives from Cicero's Latin text, but has been intentionally modified and randomly rearranged so it does not follow correct Latin grammar. The word 'Lorem' itself does not exist in Latin — it is a truncated form of 'dolorem'.",
        },
      },
      {
        question: {
          ko: "왜 의미 없는 텍스트를 사용하나요?",
          en: "Why use meaningless text?",
        },
        answer: {
          ko: "의미 있는 텍스트를 사용하면 리뷰어가 콘텐츠 내용에 집중하여 레이아웃과 디자인 평가가 방해받습니다. Lorem Ipsum은 실제 텍스트와 유사한 글자 분포를 가지면서도 내용에 주의를 빼앗기지 않아 디자인 검토에 이상적입니다.",
          en: "When meaningful text is used, reviewers focus on content rather than evaluating layout and design. Lorem Ipsum has a character distribution similar to real text while not distracting attention with its content, making it ideal for design review.",
        },
      },
      {
        question: {
          ko: "웹 개발에서 더미 텍스트는 어디에 사용되나요?",
          en: "Where is placeholder text used in web development?",
        },
        answer: {
          ko: "와이어프레임, UI 프로토타입, 반응형 레이아웃 테스트, 글꼴/타이포그래피 비교, CMS 템플릿 미리보기, 이메일 템플릿 제작 등에 사용됩니다. 특히 콘텐츠가 아직 준비되지 않은 초기 개발 단계에서 레이아웃 구성에 필수적입니다.",
          en: "It is used in wireframes, UI prototypes, responsive layout testing, font/typography comparison, CMS template previews, and email template creation. It is especially essential for layout composition in early development stages when content is not yet ready.",
        },
      },
      {
        question: {
          ko: "HTML 태그를 포함하면 어떤 장점이 있나요?",
          en: "What are the benefits of including HTML tags?",
        },
        answer: {
          ko: "HTML 태그(<p>, <h1> 등)를 포함하면 CMS, 블로그 에디터, 이메일 템플릿에 바로 붙여넣어 실제 렌더링 결과를 확인할 수 있습니다. CSS 스타일이 적용된 상태에서 단락 간격, 여백, 글꼴 크기 등을 정확히 테스트할 수 있습니다.",
          en: "Including HTML tags (<p>, <h1>, etc.) lets you paste directly into CMS, blog editors, or email templates to see actual rendered results. You can accurately test paragraph spacing, margins, and font sizes with CSS styles applied.",
        },
      },
      {
        question: {
          ko: "생성된 텍스트에 저작권 문제가 있나요?",
          en: "Are there copyright issues with generated text?",
        },
        answer: {
          ko: "Lorem Ipsum 텍스트는 기원전 45년 원문에서 유래했으므로 저작권이 없습니다. 상업적 프로젝트, 오픈소스 프로젝트, 개인 프로젝트 어디에서든 자유롭게 사용할 수 있습니다.",
          en: "Lorem Ipsum text is derived from a 45 BC original, so there are no copyright concerns. It can be freely used in commercial projects, open-source projects, and personal projects.",
        },
      },
    ],
  },

  "text-counter": {
    howTo: {
      steps: [
        {
          ko: "텍스트 입력 영역에 분석할 텍스트를 입력하거나 붙여넣습니다.",
          en: "Enter or paste the text you want to analyze into the text input area.",
        },
        {
          ko: "실시간으로 글자 수, 단어 수, 문장 수, 단락 수, 줄 수가 자동 계산됩니다.",
          en: "Character count, word count, sentence count, paragraph count, and line count are calculated in real time.",
        },
        {
          ko: "공백 포함/제외 글자 수를 구분하여 필요한 기준으로 확인합니다.",
          en: "Check character counts with and without spaces according to your needs.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "SNS 및 플랫폼별 글자 수 제한",
          en: "Character Limits by Platform",
        },
        description: {
          ko: "트위터(X)는 280자, 인스타그램 캡션은 2,200자, 네이버 블로그 제목은 100자, 카카오톡 메시지는 10,000자 등 플랫폼마다 글자 수 제한이 다릅니다. 텍스트 카운터를 활용하면 게시 전에 제한 초과 여부를 확인할 수 있습니다.",
          en: "Different platforms have different character limits: Twitter (X) 280, Instagram captions 2,200, Naver Blog titles 100, KakaoTalk messages 10,000, etc. A text counter helps verify limit compliance before posting.",
        },
      },
      {
        title: {
          ko: "바이트 수와 글자 수의 차이",
          en: "Difference Between Byte Count and Character Count",
        },
        description: {
          ko: "영문 1글자는 UTF-8에서 1바이트이지만, 한글 1글자는 3바이트를 차지합니다. 데이터베이스 VARCHAR(n)이 바이트 기준인 경우 한글이 영문보다 빨리 한도에 도달합니다. 글자 수와 바이트 수를 모두 고려해야 합니다.",
          en: "One English character is 1 byte in UTF-8, but one Korean character takes 3 bytes. When database VARCHAR(n) is byte-based, Korean text reaches the limit faster than English. Both character count and byte count must be considered.",
        },
      },
      {
        title: {
          ko: "읽기 시간 추정",
          en: "Reading Time Estimation",
        },
        description: {
          ko: "평균 읽기 속도는 영문 약 200~250 WPM(단어/분), 한글 약 500~600자/분입니다. 단어 수와 글자 수를 기반으로 예상 읽기 시간을 계산하면 블로그 글이나 기사의 적정 분량을 가늠할 수 있습니다.",
          en: "Average reading speed is about 200-250 WPM for English and 500-600 characters per minute for Korean. Calculating estimated reading time from word and character counts helps gauge the appropriate length for blog posts and articles.",
        },
      },
    ],
    relatedTools: ["text-diff", "text-case-converter", "lorem-ipsum-generator"],
    extraFaqs: [
      {
        question: {
          ko: "단어 수는 어떤 기준으로 세나요?",
          en: "How are words counted?",
        },
        answer: {
          ko: "단어는 공백, 탭, 줄바꿈으로 구분됩니다. 영문은 띄어쓰기 단위로 계산되며, 한글도 동일한 기준을 따릅니다. 'Hello World'는 2단어, '안녕하세요 반갑습니다'도 2단어로 계산됩니다. 연속된 공백은 하나로 처리됩니다.",
          en: "Words are separated by spaces, tabs, and line breaks. English words are counted per space-separated token, and Korean follows the same rule. 'Hello World' is 2 words, and '안녕하세요 반갑습니다' is also 2 words. Consecutive spaces are treated as one.",
        },
      },
      {
        question: {
          ko: "이모지는 몇 글자로 계산되나요?",
          en: "How many characters is an emoji counted as?",
        },
        answer: {
          ko: "기본 이모지(😀)는 1글자로 계산됩니다. 그러나 피부색 변형(👋🏻), 결합 이모지(👨‍👩‍👧), 국기(🇰🇷) 등은 여러 유니코드 코드포인트로 구성되어 시각적으로는 1개이지만 내부적으로는 2~7글자로 계산될 수 있습니다.",
          en: "Basic emojis (😀) count as 1 character. However, skin tone variants (👋🏻), combined emojis (👨‍👩‍👧), and flags (🇰🇷) consist of multiple Unicode code points and may internally count as 2-7 characters despite appearing as one visually.",
        },
      },
      {
        question: {
          ko: "SEO에서 권장하는 메타 디스크립션 길이는?",
          en: "What is the recommended meta description length for SEO?",
        },
        answer: {
          ko: "구글은 메타 디스크립션을 약 155~160자(영문 기준)까지 표시합니다. 한글은 약 70~80자 정도가 적절합니다. 페이지 제목(title)은 영문 60자, 한글 30자 이내가 권장됩니다. 텍스트 카운터로 작성 중 실시간 확인이 가능합니다.",
          en: "Google displays meta descriptions up to about 155-160 characters (English). For Korean, about 70-80 characters is appropriate. Page titles are recommended under 60 characters (English) or 30 characters (Korean). The text counter allows real-time verification while writing.",
        },
      },
      {
        question: {
          ko: "줄 수와 단락 수의 차이는 무엇인가요?",
          en: "What is the difference between line count and paragraph count?",
        },
        answer: {
          ko: "줄 수는 줄바꿈(\\n) 기준으로 계산됩니다. 단락 수는 빈 줄로 구분된 텍스트 블록 단위입니다. 예를 들어, 연속된 3줄의 텍스트는 3줄이지만 1단락이며, 빈 줄로 나누면 2단락이 됩니다.",
          en: "Line count is based on line breaks (\\n). Paragraph count is based on text blocks separated by blank lines. For example, 3 consecutive lines of text are 3 lines but 1 paragraph. Adding a blank line between them creates 2 paragraphs.",
        },
      },
      {
        question: {
          ko: "프로그래밍에서 문자열 길이 측정은 다른가요?",
          en: "Is string length measurement different in programming?",
        },
        answer: {
          ko: "JavaScript의 .length는 UTF-16 코드 유닛 수를 반환하므로 이모지 등 보조 평면 문자에서 실제 글자 수와 다를 수 있습니다. Python 3의 len()은 유니코드 코드포인트 수를 반환합니다. 정확한 '보이는 글자 수'를 원하면 Intl.Segmenter(JS) 또는 grapheme 라이브러리를 사용해야 합니다.",
          en: "JavaScript's .length returns UTF-16 code unit count, which may differ from actual character count for supplementary plane characters like emojis. Python 3's len() returns Unicode code point count. For accurate 'visible character count', use Intl.Segmenter (JS) or a grapheme library.",
        },
      },
    ],
  },

  "qr-code-generator": {
    howTo: {
      steps: [
        {
          ko: "인코딩할 데이터를 입력합니다: URL, 텍스트, 연락처 정보 등.",
          en: "Enter the data to encode: URL, text, contact information, etc.",
        },
        {
          ko: "필요에 따라 오류 수정 레벨(L/M/Q/H)과 크기를 조절합니다.",
          en: "Adjust the error correction level (L/M/Q/H) and size as needed.",
        },
        {
          ko: "생성된 QR 코드를 미리보기로 확인합니다.",
          en: "Preview the generated QR code.",
        },
        {
          ko: "PNG로 다운로드하거나 클립보드에 복사하여 사용합니다.",
          en: "Download as PNG or copy to clipboard for use.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "QR 코드 오류 수정 레벨",
          en: "QR Code Error Correction Levels",
        },
        description: {
          ko: "QR 코드는 Reed-Solomon 오류 수정 코드를 사용하여 일부 손상에도 데이터를 복원할 수 있습니다. L(7%), M(15%), Q(25%), H(30%) 네 단계가 있으며, 높은 레벨일수록 로고 삽입이나 인쇄 손상에 강하지만 QR 코드 크기가 커집니다.",
          en: "QR codes use Reed-Solomon error correction to recover data even when partially damaged. Four levels exist: L (7%), M (15%), Q (25%), H (30%). Higher levels are more resistant to logo embedding and print damage, but result in larger QR codes.",
        },
      },
      {
        title: {
          ko: "QR 코드 데이터 유형",
          en: "QR Code Data Types",
        },
        description: {
          ko: "QR 코드는 단순 텍스트 외에도 URL, Wi-Fi 접속 정보(WIFI:S:이름;T:WPA;P:비밀번호;;), 연락처(vCard), 이메일(mailto:), 전화번호(tel:), 위치 좌표(geo:) 등 다양한 데이터 유형을 인코딩할 수 있습니다.",
          en: "Beyond plain text, QR codes can encode URLs, Wi-Fi credentials (WIFI:S:name;T:WPA;P:password;;), contacts (vCard), email (mailto:), phone numbers (tel:), geolocation (geo:), and more.",
        },
      },
    ],
    relatedTools: ["url-encoder", "base64", "image-base64-converter"],
    extraFaqs: [
      {
        question: {
          ko: "QR 코드에 로고를 넣으면 인식이 안 되나요?",
          en: "Will adding a logo to a QR code make it unreadable?",
        },
        answer: {
          ko: "오류 수정 레벨을 H(30%)로 설정하면 중앙에 로고를 넣어도 대부분 인식됩니다. 로고 크기는 QR 코드 면적의 10~15% 이내로 유지하고, 위치 감지 패턴(모서리의 큰 사각형 3개)을 가리지 않아야 합니다. 로고 삽입 후 반드시 여러 기기에서 스캔 테스트를 하세요.",
          en: "Setting error correction to H (30%) allows most QR codes to remain readable with a center logo. Keep the logo within 10-15% of the QR code area and avoid covering the three position detection patterns (large squares in corners). Always test scanning on multiple devices after adding a logo.",
        },
      },
      {
        question: {
          ko: "QR 코드의 유효 기간이 있나요?",
          en: "Do QR codes have an expiration date?",
        },
        answer: {
          ko: "정적 QR 코드(데이터가 직접 인코딩된 것)는 만료되지 않습니다. 이미지 자체에 정보가 포함되어 있어 영구적으로 작동합니다. 다만 인코딩된 URL의 서버가 중단되면 목적지에 접근할 수 없게 됩니다. 동적 QR 코드(리디렉션 서비스 사용)는 서비스 만료 시 작동이 중단될 수 있습니다.",
          en: "Static QR codes (data directly encoded) never expire. The information is embedded in the image itself and works permanently. However, if the server behind an encoded URL goes down, the destination becomes inaccessible. Dynamic QR codes (using redirect services) may stop working when the service expires.",
        },
      },
      {
        question: {
          ko: "QR 코드를 인쇄할 때 최소 크기는?",
          en: "What is the minimum print size for QR codes?",
        },
        answer: {
          ko: "일반적으로 QR 코드 최소 인쇄 크기는 2cm x 2cm(약 0.8인치)입니다. 스캔 거리에 따라 크기를 조절해야 하며, 일반적으로 스캔 거리의 1/10 크기가 권장됩니다. 예: 30cm 거리에서 스캔하려면 최소 3cm x 3cm가 필요합니다. 또한 QR 코드 주변에 최소 4모듈 너비의 여백(quiet zone)이 있어야 합니다.",
          en: "The general minimum print size for QR codes is 2cm x 2cm (about 0.8 inches). Size should be adjusted based on scanning distance — a ratio of 1/10 of the scanning distance is recommended. Example: for scanning at 30cm, you need at least 3cm x 3cm. Also, a quiet zone of at least 4 modules width must surround the QR code.",
        },
      },
      {
        question: {
          ko: "QR 코드와 바코드의 차이는 무엇인가요?",
          en: "What is the difference between QR codes and barcodes?",
        },
        answer: {
          ko: "바코드(1D)는 가로 방향의 선으로 데이터를 인코딩하며 약 20~25자의 숫자/문자만 저장합니다. QR 코드(2D)는 가로와 세로 모두 사용하여 최대 7,089자의 숫자 또는 4,296자의 영숫자를 저장할 수 있습니다. QR 코드는 360° 어떤 방향에서든 스캔할 수 있고 오류 수정 기능도 내장되어 있습니다.",
          en: "Barcodes (1D) encode data in horizontal lines and store only about 20-25 numeric/alphanumeric characters. QR codes (2D) use both horizontal and vertical directions, storing up to 7,089 numeric or 4,296 alphanumeric characters. QR codes can be scanned from any 360-degree angle and include built-in error correction.",
        },
      },
      {
        question: {
          ko: "QR 코드 보안 위험은 없나요?",
          en: "Are there security risks with QR codes?",
        },
        answer: {
          ko: "QR 코드 자체는 안전하지만, 악성 URL로 연결되는 QR 코드(QR피싱 또는 Quishing)가 위험할 수 있습니다. 출처를 알 수 없는 QR 코드 스캔 시 URL을 반드시 확인하세요. 공공장소의 QR 코드가 스티커로 덮어씌워진 것은 아닌지 주의하고, 스마트폰의 QR 스캐너가 URL 미리보기를 제공하는지 확인하세요.",
          en: "QR codes themselves are safe, but QR codes linking to malicious URLs (QR phishing or Quishing) can be dangerous. Always verify the URL when scanning QR codes from unknown sources. Watch for QR codes in public places that may have been covered with sticker overlays, and ensure your phone's QR scanner provides URL previews.",
        },
      },
    ],
  },

  "byte-unit-converter": {
    howTo: {
      steps: [
        {
          ko: "변환할 데이터 크기 값을 입력합니다. 예: 1024, 500, 2.5 등.",
          en: "Enter the data size value to convert. Example: 1024, 500, 2.5, etc.",
        },
        {
          ko: "입력 단위를 선택합니다: B, KB, MB, GB, TB, PB 또는 KiB, MiB, GiB, TiB, PiB.",
          en: "Select the input unit: B, KB, MB, GB, TB, PB or KiB, MiB, GiB, TiB, PiB.",
        },
        {
          ko: "SI(10진수) 단위와 이진 단위의 변환 결과가 동시에 표시됩니다.",
          en: "Conversion results in both SI (decimal) and binary units are displayed simultaneously.",
        },
        {
          ko: "필요한 단위의 값을 복사하여 용량 계획이나 문서에 사용합니다.",
          en: "Copy the value in the desired unit for use in capacity planning or documentation.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "SI 단위와 이진 단위 (IEC 표준)",
          en: "SI Units vs Binary Units (IEC Standard)",
        },
        description: {
          ko: "IEC 60027-2 표준은 혼동을 방지하기 위해 이진 접두어(KiB, MiB, GiB)를 도입했습니다. SI 접두어(KB, MB, GB)는 10의 거듭제곱(1000 기반), 이진 접두어는 2의 거듭제곱(1024 기반)을 사용합니다. 하드웨어 제조사는 SI를, OS는 이진 단위를 사용하여 용량 차이가 발생합니다.",
          en: "IEC 60027-2 introduced binary prefixes (KiB, MiB, GiB) to prevent confusion. SI prefixes (KB, MB, GB) use powers of 10 (base 1000), while binary prefixes use powers of 2 (base 1024). Hardware manufacturers use SI while OSes use binary, causing apparent capacity differences.",
        },
      },
      {
        title: {
          ko: "네트워크 대역폭과 데이터 전송",
          en: "Network Bandwidth and Data Transfer",
        },
        description: {
          ko: "네트워크 속도는 비트(bps) 단위로 표시되고, 파일 크기는 바이트(B) 단위입니다. 1 바이트 = 8 비트이므로, 100 Mbps 회선의 이론적 최대 다운로드 속도는 12.5 MB/s입니다. 실제로는 프로토콜 오버헤드로 약 10~11 MB/s가 일반적입니다.",
          en: "Network speed is measured in bits (bps) while file sizes use bytes (B). Since 1 byte = 8 bits, a 100 Mbps connection has a theoretical maximum download speed of 12.5 MB/s. In practice, protocol overhead typically yields about 10-11 MB/s.",
        },
      },
    ],
    relatedTools: ["number-base-converter", "text-counter", "ascii-unicode-table"],
    extraFaqs: [
      {
        question: {
          ko: "클라우드 스토리지 요금은 어떤 단위를 사용하나요?",
          en: "Which units do cloud storage providers use for billing?",
        },
        answer: {
          ko: "AWS, GCP, Azure 등 주요 클라우드 서비스는 GiB(이진 단위)를 사용합니다. AWS는 명시적으로 1 GB = 2^30 바이트(=1 GiB)로 정의합니다. 클라우드 비용 계산 시 SI 기준 GB와 혼동하지 않도록 주의해야 합니다.",
          en: "Major cloud providers like AWS, GCP, and Azure use GiB (binary units). AWS explicitly defines 1 GB as 2^30 bytes (= 1 GiB). Be careful not to confuse this with SI-based GB when calculating cloud costs.",
        },
      },
      {
        question: {
          ko: "SSD와 HDD 용량이 표시보다 적은 이유는?",
          en: "Why is my SSD/HDD capacity less than advertised?",
        },
        answer: {
          ko: "제조사는 SI 단위(1 TB = 1조 바이트)로 표시하지만, 운영체제는 이진 단위(1 TiB = 1,099,511,627,776 바이트)로 표시합니다. 따라서 1 TB 드라이브는 OS에서 약 931 GiB로 나타납니다. 이 외에 파일 시스템, 파티션 테이블, 예비 영역 등도 일부 공간을 차지합니다.",
          en: "Manufacturers label using SI units (1 TB = 1 trillion bytes), but operating systems display using binary units (1 TiB = 1,099,511,627,776 bytes). Thus a 1 TB drive appears as about 931 GiB in the OS. File system, partition tables, and reserved sectors also consume some space.",
        },
      },
      {
        question: {
          ko: "메모리(RAM)는 왜 항상 2의 거듭제곱 용량인가요?",
          en: "Why is RAM always in powers of 2?",
        },
        answer: {
          ko: "RAM은 2진수 주소 체계로 작동하므로 용량이 항상 2의 거듭제곱(2, 4, 8, 16, 32 GB 등)입니다. 이진 단위가 하드웨어에 자연스럽게 맞기 때문에, RAM 용량은 SI 단위와 이진 단위 간 차이가 발생하지 않습니다. 8 GB RAM은 정확히 8 GiB(8,589,934,592 바이트)입니다.",
          en: "RAM operates on binary addressing, so capacity is always a power of 2 (2, 4, 8, 16, 32 GB, etc.). Since binary units naturally match the hardware, there is no discrepancy between SI and binary units for RAM. 8 GB of RAM is exactly 8 GiB (8,589,934,592 bytes).",
        },
      },
    ],
  },

  "ascii-unicode-table": {
    howTo: {
      steps: [
        {
          ko: "유니코드 범위를 선택하거나 검색창에 문자, 코드 번호, 문자 이름을 입력합니다.",
          en: "Select a Unicode range or enter a character, code number, or character name in the search box.",
        },
        {
          ko: "검색 결과에서 원하는 문자를 찾습니다. 표에서 10진수, 16진수, 8진수, 2진수 값을 확인합니다.",
          en: "Find the desired character in the results. Check decimal, hex, octal, and binary values in the table.",
        },
        {
          ko: "HTML 엔티티, URL 인코딩, 유니코드 코드 포인트 등 필요한 형식을 복사하여 사용합니다.",
          en: "Copy the needed format — HTML entity, URL encoding, Unicode code point — for use in your project.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "문자 인코딩 (UTF-8, UTF-16, UTF-32)",
          en: "Character Encoding (UTF-8, UTF-16, UTF-32)",
        },
        description: {
          ko: "UTF-8은 가변 길이(1~4바이트)로 웹의 98% 이상에서 사용됩니다. ASCII 호환이며 영문은 1바이트, 한글은 3바이트입니다. UTF-16은 자바와 윈도우 내부에서 사용하며, UTF-32는 모든 문자를 4바이트 고정 길이로 처리합니다.",
          en: "UTF-8 is a variable-length encoding (1-4 bytes) used by over 98% of the web. It is ASCII-compatible: English takes 1 byte, Korean takes 3 bytes. UTF-16 is used internally by Java and Windows, while UTF-32 uses a fixed 4-byte length for all characters.",
        },
      },
      {
        title: {
          ko: "제어 문자 (Control Characters)",
          en: "Control Characters",
        },
        description: {
          ko: "ASCII 0~31번과 127번은 제어 문자입니다. NUL(0), LF(10, 줄바꿈), CR(13, 캐리지리턴), TAB(9), ESC(27) 등이 있습니다. Windows는 줄바꿈에 CR+LF(\\r\\n)을, Unix/Mac은 LF(\\n)만 사용하여 텍스트 파일의 줄바꿈 호환 문제가 발생합니다.",
          en: "ASCII codes 0-31 and 127 are control characters. These include NUL (0), LF (10, line feed), CR (13, carriage return), TAB (9), and ESC (27). Windows uses CR+LF (\\r\\n) for line endings while Unix/Mac uses LF (\\n) only, causing text file line ending compatibility issues.",
        },
      },
      {
        title: {
          ko: "유니코드 평면과 코드 포인트",
          en: "Unicode Planes and Code Points",
        },
        description: {
          ko: "유니코드는 17개 평면(0~16)으로 구성되며 총 1,114,112개의 코드 포인트를 가집니다. 기본 다국어 평면(BMP, 0번)에 대부분의 현대 문자가 포함되고, 보조 평면에는 이모지, 고대 문자, 악보 기호 등이 있습니다. U+XXXX 형식으로 표기합니다.",
          en: "Unicode consists of 17 planes (0-16) with a total of 1,114,112 code points. The Basic Multilingual Plane (BMP, plane 0) contains most modern characters, while supplementary planes hold emojis, ancient scripts, and musical symbols. Code points are written in U+XXXX format.",
        },
      },
    ],
    relatedTools: ["html-entity-encoder", "url-encoder", "number-base-converter"],
    extraFaqs: [
      {
        question: {
          ko: "이모지의 유니코드 코드 포인트를 어떻게 찾나요?",
          en: "How do I find the Unicode code point of an emoji?",
        },
        answer: {
          ko: "검색창에 이모지를 직접 붙여넣거나 'smile', 'heart' 등 이모지 이름으로 검색하면 코드 포인트(U+1F600 등)를 확인할 수 있습니다. JavaScript에서는 '😀'.codePointAt(0).toString(16)으로 코드 포인트를 구할 수 있습니다.",
          en: "Paste the emoji directly into the search box or search by name like 'smile' or 'heart' to find the code point (U+1F600, etc.). In JavaScript, use '😀'.codePointAt(0).toString(16) to get the code point.",
        },
      },
      {
        question: {
          ko: "프로그래밍에서 특수 문자를 이스케이프하는 방법은?",
          en: "How do I escape special characters in programming?",
        },
        answer: {
          ko: "언어별로 다릅니다. JavaScript/Java: \\uXXXX(BMP) 또는 \\u{XXXXX}(ES6+). Python: \\uXXXX 또는 \\UXXXXXXXX. HTML: &#xXXXX; 또는 &#NNNN;. CSS: \\XXXX. ASCII 테이블에서 코드 포인트를 확인한 후 해당 형식으로 변환할 수 있습니다.",
          en: "It varies by language. JavaScript/Java: \\uXXXX (BMP) or \\u{XXXXX} (ES6+). Python: \\uXXXX or \\UXXXXXXXX. HTML: &#xXXXX; or &#NNNN;. CSS: \\XXXX. Look up the code point in the ASCII table, then convert to the appropriate format.",
        },
      },
      {
        question: {
          ko: "한글 유니코드 범위는 어떻게 되나요?",
          en: "What is the Unicode range for Korean (Hangul)?",
        },
        answer: {
          ko: "한글은 여러 유니코드 블록에 걸쳐 있습니다. 한글 자모: U+1100~U+11FF, 한글 호환 자모: U+3130~U+318F, 한글 음절: U+AC00~U+D7AF(가~힣, 11,172자). 한글 음절은 초성(19)×중성(21)×종성(28) 조합으로 수학적으로 배열되어 있습니다.",
          en: "Korean spans multiple Unicode blocks. Hangul Jamo: U+1100-U+11FF, Hangul Compatibility Jamo: U+3130-U+318F, Hangul Syllables: U+AC00-U+D7AF (가 to 힣, 11,172 characters). Hangul syllables are mathematically arranged by initial (19) × medial (21) × final (28) combinations.",
        },
      },
    ],
  },
};
