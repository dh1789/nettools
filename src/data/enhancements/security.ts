import type { ToolEnhancement } from "../tools";

export const SECURITY_ENHANCEMENTS: Record<string, ToolEnhancement> = {
  "password-generator": {
    howTo: {
      steps: [
        {
          ko: "비밀번호 길이를 8~64자 사이에서 슬라이더로 설정합니다.",
          en: "Set the password length between 8 and 64 characters using the slider.",
        },
        {
          ko: "대문자, 소문자, 숫자, 특수문자 포함 여부를 체크박스로 선택합니다.",
          en: "Select character types to include (uppercase, lowercase, numbers, special characters) via checkboxes.",
        },
        {
          ko: "'생성' 버튼을 클릭하면 암호학적으로 안전한 비밀번호가 즉시 생성됩니다.",
          en: "Click the 'Generate' button to instantly create a cryptographically secure password.",
        },
        {
          ko: "비밀번호 강도 표시기로 생성된 비밀번호의 보안 수준을 확인합니다.",
          en: "Check the strength indicator to verify the security level of the generated password.",
        },
        {
          ko: "복사 버튼을 눌러 클립보드에 복사한 뒤 원하는 곳에 붙여넣기 합니다.",
          en: "Click the copy button to copy to clipboard, then paste it wherever needed.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "엔트로피(Entropy)",
          en: "Entropy",
        },
        description: {
          ko: "비밀번호의 무작위성을 비트 단위로 측정한 값입니다. 엔트로피가 높을수록 brute-force 공격에 대한 저항력이 강합니다. 12자 이상의 혼합 문자 비밀번호는 약 72비트 이상의 엔트로피를 가집니다.",
          en: "A measure of password randomness in bits. Higher entropy means greater resistance to brute-force attacks. A mixed-character password of 12+ characters has roughly 72+ bits of entropy.",
        },
      },
      {
        title: {
          ko: "비밀번호 관리자(Password Manager)",
          en: "Password Manager",
        },
        description: {
          ko: "각 서비스마다 고유한 강력한 비밀번호를 생성하고 안전하게 저장해주는 소프트웨어입니다. 1Password, Bitwarden, KeePass 등이 대표적이며, 마스터 비밀번호 하나만 기억하면 됩니다.",
          en: "Software that generates unique strong passwords for each service and stores them securely. Popular options include 1Password, Bitwarden, and KeePass. You only need to remember one master password.",
        },
      },
      {
        title: {
          ko: "Brute-Force 공격",
          en: "Brute-Force Attack",
        },
        description: {
          ko: "가능한 모든 비밀번호 조합을 순차적으로 시도하는 공격 방식입니다. 비밀번호 길이와 복잡성이 증가하면 필요한 시도 횟수가 기하급수적으로 늘어나 실질적으로 해독이 불가능해집니다.",
          en: "An attack method that systematically tries every possible password combination. As password length and complexity increase, the number of required attempts grows exponentially, making decryption practically impossible.",
        },
      },
    ],
    relatedTools: ["hash-generator", "bcrypt-generator", "totp-generator", "uuid-generator"],
    extraFaqs: [
      {
        question: {
          ko: "비밀번호는 얼마나 자주 변경해야 하나요?",
          en: "How often should I change my password?",
        },
        answer: {
          ko: "NIST(미국 국립표준기술연구소)의 최신 가이드라인에 따르면, 유출이 의심되지 않는 한 주기적 변경은 권장하지 않습니다. 대신 각 계정마다 고유한 강력한 비밀번호를 사용하고, 2단계 인증(2FA)을 활성화하는 것이 더 효과적입니다.",
          en: "According to the latest NIST guidelines, periodic password changes are no longer recommended unless a breach is suspected. Instead, use a unique strong password for each account and enable two-factor authentication (2FA) for better security.",
        },
      },
      {
        question: {
          ko: "특수문자를 포함하면 정말 더 안전한가요?",
          en: "Does including special characters really make passwords more secure?",
        },
        answer: {
          ko: "네. 특수문자를 포함하면 사용 가능한 문자 집합이 확대되어 엔트로피가 증가합니다. 예를 들어 소문자만 사용하면 26개 문자 집합이지만, 특수문자까지 포함하면 90개 이상으로 늘어납니다. 같은 길이라도 경우의 수가 크게 증가하여 brute-force 공격이 훨씬 어려워집니다.",
          en: "Yes. Including special characters expands the available character set, increasing entropy. For example, lowercase only gives 26 characters, but adding special characters expands it to 90+. Even at the same length, the number of possible combinations increases dramatically, making brute-force attacks much harder.",
        },
      },
      {
        question: {
          ko: "Web Crypto API란 무엇인가요?",
          en: "What is the Web Crypto API?",
        },
        answer: {
          ko: "Web Crypto API는 브라우저에 내장된 암호화 기능을 제공하는 표준 API입니다. Math.random()과 달리 암호학적으로 안전한 난수(CSPRNG)를 생성하며, 해시, 암호화, 서명 등의 기능을 지원합니다. 이 도구는 Web Crypto API의 getRandomValues()를 사용하여 예측 불가능한 비밀번호를 생성합니다.",
          en: "The Web Crypto API is a standard browser API that provides cryptographic functionality. Unlike Math.random(), it generates cryptographically secure random numbers (CSPRNG) and supports hashing, encryption, and signing. This tool uses Web Crypto API's getRandomValues() to generate unpredictable passwords.",
        },
      },
    ],
    usageExamples: [
      {
        title: { ko: "보안 정책 충족 비밀번호 생성", en: "Generate Policy-Compliant Password" },
        scenario: {
          ko: "회사 보안 정책에서 대문자, 소문자, 숫자, 특수문자 포함 16자 이상을 요구합니다.",
          en: "Company policy requires uppercase, lowercase, numbers, and special characters, minimum 16 characters.",
        },
        steps: [
          { ko: "비밀번호 길이를 16으로 설정합니다.", en: "Set password length to 16." },
          { ko: "대문자, 소문자, 숫자, 특수문자 옵션을 모두 활성화합니다.", en: "Enable uppercase, lowercase, numbers, and special characters." },
          { ko: "생성 버튼을 클릭하고 비밀번호를 복사합니다.", en: "Click generate and copy the password." },
        ],
        result: {
          ko: "보안 정책을 충족하는 약 105비트 엔트로피의 강력한 비밀번호 생성 완료.",
          en: "Generated a strong password with ~105 bits of entropy meeting security policy.",
        },
      },
      {
        title: { ko: "데이터베이스 접속 비밀번호 생성", en: "Generate Database Connection Password" },
        scenario: {
          ko: "신규 데이터베이스 서버의 접속 비밀번호를 안전하게 생성해야 합니다.",
          en: "You need to securely generate a password for a new database server.",
        },
        steps: [
          { ko: "길이를 32자로 설정합니다.", en: "Set length to 32 characters." },
          { ko: "특수문자 중 DB 연결 문자열에 문제가 될 수 있는 문자를 제외합니다.", en: "Exclude special characters that may cause issues in DB connection strings." },
        ],
        result: {
          ko: "DB 연결 문자열 호환 가능한 32자 고엔트로피 비밀번호 생성.",
          en: "Generated a 32-character high-entropy password compatible with DB connection strings.",
        },
      },
    ],
  },

  "ssl-checker": {
    howTo: {
      steps: [
        {
          ko: "확인하려는 도메인 주소(예: example.com)를 입력합니다.",
          en: "Enter the domain address you want to check (e.g., example.com).",
        },
        {
          ko: "'확인' 버튼을 클릭하여 SSL 인증서 조회를 시작합니다.",
          en: "Click the 'Check' button to start the SSL certificate lookup.",
        },
        {
          ko: "인증서 만료일, 발급 기관(CA), 인증서 유형(DV/OV/EV)을 확인합니다.",
          en: "Review the certificate expiration date, issuing CA, and certificate type (DV/OV/EV).",
        },
        {
          ko: "SANs(Subject Alternative Names)에서 인증서가 커버하는 도메인 목록을 확인합니다.",
          en: "Check the SANs (Subject Alternative Names) to see which domains the certificate covers.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "TLS 핸드셰이크(TLS Handshake)",
          en: "TLS Handshake",
        },
        description: {
          ko: "클라이언트와 서버가 암호화된 연결을 수립하는 과정입니다. 인증서 교환, 암호화 알고리즘 협상, 세션 키 생성이 포함됩니다. TLS 1.3에서는 1-RTT로 핸드셰이크가 완료되어 성능이 개선되었습니다.",
          en: "The process by which a client and server establish an encrypted connection. It includes certificate exchange, cipher suite negotiation, and session key generation. TLS 1.3 completes the handshake in 1-RTT, improving performance.",
        },
      },
      {
        title: {
          ko: "인증서 체인(Certificate Chain)",
          en: "Certificate Chain",
        },
        description: {
          ko: "서버 인증서에서 루트 CA까지 이어지는 신뢰 체인입니다. 서버 인증서 → 중간 CA 인증서 → 루트 CA 인증서로 구성되며, 브라우저는 이 체인을 검증하여 인증서의 유효성을 판단합니다.",
          en: "The chain of trust from the server certificate to the root CA. It consists of server certificate, intermediate CA certificate, and root CA certificate. Browsers verify this chain to determine certificate validity.",
        },
      },
      {
        title: {
          ko: "HSTS(HTTP Strict Transport Security)",
          en: "HSTS (HTTP Strict Transport Security)",
        },
        description: {
          ko: "브라우저에게 해당 도메인에 항상 HTTPS로만 접속하도록 지시하는 보안 헤더입니다. SSL 스트리핑 공격을 방지하며, max-age 값을 설정하여 HSTS 정책의 유효 기간을 지정합니다.",
          en: "A security header that instructs browsers to always connect to the domain via HTTPS only. It prevents SSL stripping attacks and uses max-age to specify how long the HSTS policy remains valid.",
        },
      },
    ],
    relatedTools: ["csp-generator", "http-headers-checker", "dns-lookup", "port-dictionary", "whois-lookup"],
    extraFaqs: [
      {
        question: {
          ko: "SSL과 TLS의 차이는 무엇인가요?",
          en: "What is the difference between SSL and TLS?",
        },
        answer: {
          ko: "SSL(Secure Sockets Layer)은 TLS(Transport Layer Security)의 이전 버전입니다. SSL 3.0 이후 TLS 1.0으로 이름이 변경되었으며, 현재는 TLS 1.2와 TLS 1.3이 사용됩니다. SSL 2.0/3.0은 보안 취약점으로 인해 사용이 중단되었지만, 관례적으로 'SSL 인증서'라는 용어가 여전히 사용됩니다.",
          en: "SSL (Secure Sockets Layer) is the predecessor of TLS (Transport Layer Security). After SSL 3.0, it was renamed to TLS 1.0. Currently TLS 1.2 and TLS 1.3 are in use. SSL 2.0/3.0 have been deprecated due to security vulnerabilities, but the term 'SSL certificate' is still used by convention.",
        },
      },
      {
        question: {
          ko: "와일드카드 SSL 인증서란 무엇인가요?",
          en: "What is a wildcard SSL certificate?",
        },
        answer: {
          ko: "와일드카드 인증서는 *.example.com과 같이 하위 도메인 전체를 하나의 인증서로 보호합니다. blog.example.com, api.example.com 등 모든 1단계 하위 도메인에 적용되지만, sub.blog.example.com과 같은 2단계 이상 하위 도메인에는 적용되지 않습니다.",
          en: "A wildcard certificate protects all subdomains under a single certificate, such as *.example.com. It covers all first-level subdomains like blog.example.com and api.example.com, but does not cover multi-level subdomains like sub.blog.example.com.",
        },
      },
      {
        question: {
          ko: "인증서 갱신을 자동화하는 방법은?",
          en: "How can I automate certificate renewal?",
        },
        answer: {
          ko: "Let's Encrypt의 Certbot을 사용하면 cron 작업이나 systemd 타이머로 인증서 갱신을 자동화할 수 있습니다. 'certbot renew' 명령이 매일 실행되도록 설정하면 만료 30일 전에 자동 갱신됩니다. 대부분의 클라우드 서비스(AWS ACM, Cloudflare)도 자동 갱신을 기본 제공합니다.",
          en: "Use Let's Encrypt's Certbot with a cron job or systemd timer to automate certificate renewal. Set 'certbot renew' to run daily, and it will auto-renew 30 days before expiration. Most cloud services (AWS ACM, Cloudflare) also provide automatic renewal by default.",
        },
      },
    ],
  },

  "hash-generator": {
    howTo: {
      steps: [
        {
          ko: "해시를 생성할 텍스트를 입력 필드에 입력합니다.",
          en: "Enter the text you want to hash in the input field.",
        },
        {
          ko: "SHA-1, SHA-256, SHA-384, SHA-512 중 원하는 해시 알고리즘을 선택합니다.",
          en: "Select the desired hash algorithm from SHA-1, SHA-256, SHA-384, or SHA-512.",
        },
        {
          ko: "입력 즉시 해시값이 실시간으로 생성됩니다.",
          en: "The hash value is generated in real time as you type.",
        },
        {
          ko: "생성된 해시값을 복사 버튼으로 클립보드에 복사합니다.",
          en: "Copy the generated hash value to clipboard using the copy button.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "충돌 저항성(Collision Resistance)",
          en: "Collision Resistance",
        },
        description: {
          ko: "서로 다른 두 입력이 동일한 해시값을 생성하는 것을 '충돌'이라 합니다. 안전한 해시 함수는 충돌을 계산적으로 찾기 어렵도록 설계됩니다. SHA-1은 충돌이 발견되어 권장되지 않으며, SHA-256 이상을 사용해야 합니다.",
          en: "A 'collision' occurs when two different inputs produce the same hash value. Secure hash functions are designed to make finding collisions computationally infeasible. SHA-1 is deprecated due to discovered collisions; SHA-256 or higher should be used.",
        },
      },
      {
        title: {
          ko: "솔트(Salt)",
          en: "Salt",
        },
        description: {
          ko: "해시 전에 입력 데이터에 추가하는 랜덤 문자열입니다. 같은 비밀번호라도 서로 다른 해시값을 생성하여 rainbow table 공격을 방지합니다. 비밀번호 저장 시 반드시 솔트를 사용해야 합니다.",
          en: "A random string added to input data before hashing. It ensures the same password produces different hash values, preventing rainbow table attacks. Salt should always be used when storing passwords.",
        },
      },
      {
        title: {
          ko: "데이터 무결성(Data Integrity)",
          en: "Data Integrity",
        },
        description: {
          ko: "데이터가 전송이나 저장 과정에서 변조되지 않았음을 보장하는 개념입니다. 파일의 해시값을 비교하면 원본과 동일한지 확인할 수 있으며, 소프트웨어 배포 시 체크섬 검증에 널리 사용됩니다.",
          en: "The concept of ensuring data has not been altered during transmission or storage. Comparing hash values of files verifies they are identical to the original. Widely used for checksum verification in software distribution.",
        },
      },
    ],
    relatedTools: ["bcrypt-generator", "password-generator", "base64", "csp-generator", "totp-generator", "uuid-generator"],
    extraFaqs: [
      {
        question: {
          ko: "SHA-1은 왜 안전하지 않나요?",
          en: "Why is SHA-1 not secure?",
        },
        answer: {
          ko: "2017년 구글과 CWI 연구소가 SHA-1 충돌을 실증(SHAttered 공격)했습니다. 이론적이었던 취약점이 현실화되면서 디지털 서명, 인증서 등 보안 목적으로는 사용이 금지되었습니다. 파일 무결성 확인 등 비보안 목적으로는 여전히 사용되지만, SHA-256 이상을 사용하는 것이 권장됩니다.",
          en: "In 2017, Google and CWI demonstrated a real SHA-1 collision (SHAttered attack). This turned a theoretical weakness into a practical threat, and SHA-1 is now prohibited for security purposes like digital signatures and certificates. While still used for non-security purposes like file integrity checks, SHA-256 or higher is recommended.",
        },
      },
      {
        question: {
          ko: "해시와 암호화의 차이점은 무엇인가요?",
          en: "What is the difference between hashing and encryption?",
        },
        answer: {
          ko: "해시는 단방향 함수로 원본 데이터를 복원할 수 없지만, 암호화는 양방향으로 키를 사용해 원본을 복원할 수 있습니다. 해시는 데이터 무결성 검증과 비밀번호 저장에, 암호화는 데이터 기밀성 보호에 사용됩니다. 비밀번호는 반드시 해시로 저장하고, 절대 암호화로 저장해서는 안 됩니다.",
          en: "Hashing is a one-way function that cannot recover original data, while encryption is two-way and can restore the original using a key. Hashing is used for data integrity verification and password storage; encryption is used for data confidentiality. Passwords must always be stored as hashes, never encrypted.",
        },
      },
      {
        question: {
          ko: "HMAC은 무엇인가요?",
          en: "What is HMAC?",
        },
        answer: {
          ko: "HMAC(Hash-based Message Authentication Code)은 비밀 키와 해시 함수를 결합한 메시지 인증 코드입니다. 데이터 무결성과 인증을 동시에 보장합니다. API 서명(AWS Signature V4), JWT 토큰 서명, 웹훅 검증 등에 널리 사용됩니다. HMAC-SHA256이 가장 일반적입니다.",
          en: "HMAC (Hash-based Message Authentication Code) combines a secret key with a hash function to create a message authentication code. It ensures both data integrity and authentication. Widely used in API signatures (AWS Signature V4), JWT token signing, and webhook verification. HMAC-SHA256 is the most common variant.",
        },
      },
      {
        question: {
          ko: "비밀번호 저장에 SHA-256을 사용해도 되나요?",
          en: "Can I use SHA-256 for password storage?",
        },
        answer: {
          ko: "권장하지 않습니다. SHA-256은 속도가 빨라 GPU를 이용한 대규모 brute-force 공격에 취약합니다. 비밀번호 저장에는 의도적으로 느리게 설계된 bcrypt, scrypt, Argon2를 사용해야 합니다. 이들은 cost factor를 통해 계산 비용을 조절할 수 있어 하드웨어 발전에 대응할 수 있습니다.",
          en: "Not recommended. SHA-256 is fast, making it vulnerable to large-scale GPU brute-force attacks. For password storage, use intentionally slow algorithms like bcrypt, scrypt, or Argon2. These allow adjustable cost factors to keep pace with hardware improvements.",
        },
      },
    ],
    usageExamples: [
      {
        title: { ko: "파일 무결성 검증", en: "File Integrity Verification" },
        scenario: {
          ko: "다운로드한 소프트웨어의 SHA-256 체크섬을 공식 값과 비교해야 합니다.",
          en: "You need to compare the SHA-256 checksum of downloaded software with the official value.",
        },
        steps: [
          { ko: "다운로드 파일의 내용을 텍스트로 입력하거나 해시값을 생성합니다.", en: "Enter file content as text or generate the hash value." },
          { ko: "SHA-256 알고리즘을 선택합니다.", en: "Select the SHA-256 algorithm." },
          { ko: "생성된 해시를 공식 체크섬과 비교합니다.", en: "Compare the generated hash with the official checksum." },
        ],
        result: {
          ko: "해시값 일치를 확인하여 파일이 변조되지 않았음을 검증.",
          en: "Verified file integrity by confirming hash value match.",
        },
      },
      {
        title: { ko: "API 웹훅 서명 검증", en: "API Webhook Signature Verification" },
        scenario: {
          ko: "외부 서비스의 웹훅 payload 서명을 검증하기 위해 해시를 계산합니다.",
          en: "Calculate hash to verify webhook payload signature from an external service.",
        },
        steps: [
          { ko: "웹훅 payload 문자열을 입력합니다.", en: "Enter the webhook payload string." },
          { ko: "서비스에서 지정한 해시 알고리즘(SHA-256)을 선택합니다.", en: "Select the hash algorithm specified by the service (SHA-256)." },
        ],
        result: {
          ko: "생성된 해시로 웹훅 요청의 진위를 확인할 수 있습니다.",
          en: "Use the generated hash to verify webhook request authenticity.",
        },
      },
    ],
  },

  "totp-generator": {
    howTo: {
      steps: [
        {
          ko: "2FA 설정 페이지에서 제공받은 Base32 시크릿 키를 입력합니다.",
          en: "Enter the Base32 secret key provided from the 2FA setup page.",
        },
        {
          ko: "시크릿 키가 유효하면 6자리 TOTP 코드가 자동으로 생성됩니다.",
          en: "If the secret key is valid, a 6-digit TOTP code is automatically generated.",
        },
        {
          ko: "타이머가 30초 주기로 남은 시간을 표시하며, 만료 시 새 코드가 생성됩니다.",
          en: "A timer shows the remaining time in the 30-second cycle, and a new code is generated when it expires.",
        },
        {
          ko: "생성된 코드를 로그인 페이지의 2FA 입력란에 입력합니다.",
          en: "Enter the generated code in the 2FA input field on the login page.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "2단계 인증(2FA/MFA)",
          en: "Two-Factor Authentication (2FA/MFA)",
        },
        description: {
          ko: "로그인 시 비밀번호 외에 추가 인증 요소를 요구하는 보안 방식입니다. 지식(비밀번호) + 소유(인증앱/SMS) + 생체(지문/얼굴)의 조합으로, 한 가지 요소가 유출되어도 계정을 보호합니다.",
          en: "A security method requiring an additional authentication factor beyond a password during login. Combines knowledge (password), possession (authenticator app/SMS), and biometrics (fingerprint/face). Protects accounts even if one factor is compromised.",
        },
      },
      {
        title: {
          ko: "HOTP vs TOTP",
          en: "HOTP vs TOTP",
        },
        description: {
          ko: "HOTP(HMAC-based OTP)는 카운터 기반으로 매번 사용 시 카운터가 증가합니다. TOTP는 시간 기반으로 30초마다 자동 갱신됩니다. TOTP가 더 안전한데, 사용하지 않은 코드도 자동 만료되기 때문입니다.",
          en: "HOTP (HMAC-based OTP) is counter-based, incrementing with each use. TOTP is time-based, auto-refreshing every 30 seconds. TOTP is more secure because unused codes automatically expire.",
        },
      },
      {
        title: {
          ko: "백업 코드(Recovery Codes)",
          en: "Recovery Codes",
        },
        description: {
          ko: "인증 기기를 분실했을 때 계정에 접근하기 위한 일회용 비상 코드입니다. 2FA 설정 시 발급되며, 안전한 장소에 오프라인으로 보관해야 합니다. 각 코드는 한 번만 사용할 수 있습니다.",
          en: "One-time emergency codes for accessing your account when you lose your authentication device. Issued during 2FA setup and should be stored offline in a secure location. Each code can only be used once.",
        },
      },
    ],
    relatedTools: ["password-generator", "hash-generator", "qr-code-generator", "bcrypt-generator", "jwt-decoder"],
    extraFaqs: [
      {
        question: {
          ko: "인증앱을 분실하면 어떻게 하나요?",
          en: "What should I do if I lose my authenticator app?",
        },
        answer: {
          ko: "2FA 설정 시 발급받은 백업 코드(Recovery Codes)를 사용하여 로그인한 뒤 2FA를 재설정합니다. 백업 코드가 없으면 서비스 고객지원에 본인 확인 후 2FA 해제를 요청해야 합니다. 시크릿 키를 미리 백업해 두면 새 기기에서 바로 복구할 수 있습니다.",
          en: "Use the backup (recovery) codes issued during 2FA setup to log in and reset 2FA. If you don't have backup codes, contact the service's customer support to verify your identity and request 2FA removal. If you backed up the secret key beforehand, you can restore it immediately on a new device.",
        },
      },
      {
        question: {
          ko: "SMS 인증과 TOTP 중 어느 것이 더 안전한가요?",
          en: "Which is more secure, SMS verification or TOTP?",
        },
        answer: {
          ko: "TOTP가 SMS보다 훨씬 안전합니다. SMS는 SIM 스와핑 공격, SS7 프로토콜 취약점, 문자 가로채기 등에 취약합니다. TOTP는 시크릿 키가 기기에만 저장되므로 네트워크 공격에 영향을 받지 않습니다. 가능하면 SMS 대신 TOTP 기반 인증앱을 사용하세요.",
          en: "TOTP is significantly more secure than SMS. SMS is vulnerable to SIM swapping attacks, SS7 protocol vulnerabilities, and message interception. TOTP secret keys are stored only on your device, making them immune to network attacks. Use a TOTP-based authenticator app instead of SMS whenever possible.",
        },
      },
      {
        question: {
          ko: "TOTP 시크릿 키를 안전하게 백업하는 방법은?",
          en: "How can I safely back up my TOTP secret key?",
        },
        answer: {
          ko: "시크릿 키를 암호화된 비밀번호 관리자(1Password, Bitwarden 등)에 저장하거나, 종이에 적어 금고 등 안전한 물리적 장소에 보관합니다. 스크린샷이나 클라우드 메모에 저장하는 것은 유출 위험이 있어 권장하지 않습니다. 여러 기기에 동시 등록하는 방법도 있습니다.",
          en: "Store the secret key in an encrypted password manager (1Password, Bitwarden, etc.) or write it on paper and keep it in a secure physical location like a safe. Saving screenshots or storing in cloud notes is not recommended due to leak risks. You can also register the key on multiple devices simultaneously.",
        },
      },
    ],
  },

  "csp-generator": {
    howTo: {
      steps: [
        {
          ko: "프리셋(Strict, CDN 허용 등)을 선택하거나 처음부터 직접 설정합니다.",
          en: "Select a preset (Strict, CDN-friendly, etc.) or configure from scratch.",
        },
        {
          ko: "default-src, script-src, style-src 등 필요한 지시어를 활성화합니다.",
          en: "Enable the required directives such as default-src, script-src, style-src.",
        },
        {
          ko: "각 지시어에 허용할 출처('self', CDN 도메인 등)를 입력합니다.",
          en: "Enter the allowed sources for each directive ('self', CDN domains, etc.).",
        },
        {
          ko: "생성된 CSP 헤더를 HTTP 응답 헤더나 HTML meta 태그로 복사하여 적용합니다.",
          en: "Copy the generated CSP header and apply it as an HTTP response header or HTML meta tag.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "XSS(크로스 사이트 스크립팅)",
          en: "XSS (Cross-Site Scripting)",
        },
        description: {
          ko: "공격자가 웹 페이지에 악성 스크립트를 삽입하여 사용자의 세션 쿠키, 개인 정보를 탈취하는 공격입니다. 저장형(Stored), 반사형(Reflected), DOM 기반 세 가지 유형이 있으며, CSP는 가장 효과적인 방어 수단 중 하나입니다.",
          en: "An attack where malicious scripts are injected into web pages to steal user session cookies and personal data. There are three types: Stored, Reflected, and DOM-based. CSP is one of the most effective defense mechanisms.",
        },
      },
      {
        title: {
          ko: "Nonce 기반 CSP",
          en: "Nonce-based CSP",
        },
        description: {
          ko: "각 요청마다 고유한 랜덤 토큰(nonce)을 생성하여 허용된 스크립트에만 부여하는 방식입니다. 'unsafe-inline' 없이도 인라인 스크립트를 안전하게 사용할 수 있어 strict-dynamic과 함께 가장 권장되는 CSP 전략입니다.",
          en: "A method that generates a unique random token (nonce) for each request, assigned only to approved scripts. It allows safe use of inline scripts without 'unsafe-inline', and is the most recommended CSP strategy alongside strict-dynamic.",
        },
      },
      {
        title: {
          ko: "보안 헤더(Security Headers)",
          en: "Security Headers",
        },
        description: {
          ko: "CSP 외에도 X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, Referrer-Policy 등 다양한 보안 헤더가 있습니다. 이들을 함께 설정하면 클릭재킹, MIME 스니핑, 프로토콜 다운그레이드 등 다양한 공격을 방어할 수 있습니다.",
          en: "Beyond CSP, there are various security headers like X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, and Referrer-Policy. Configuring them together defends against clickjacking, MIME sniffing, protocol downgrade, and other attacks.",
        },
      },
    ],
    relatedTools: ["ssl-checker", "http-headers-checker", "hash-generator"],
    extraFaqs: [
      {
        question: {
          ko: "report-uri와 report-to의 차이는 무엇인가요?",
          en: "What is the difference between report-uri and report-to?",
        },
        answer: {
          ko: "report-uri는 CSP 위반 보고서를 특정 URL로 전송하는 레거시 지시어이며, report-to는 Reporting API를 사용하는 최신 표준입니다. report-to가 권장되지만 브라우저 호환성을 위해 둘 다 설정하는 것이 좋습니다. 보고서에는 위반 지시어, 차단된 URI, 소스 파일 등이 포함됩니다.",
          en: "report-uri is a legacy directive that sends CSP violation reports to a specific URL, while report-to uses the modern Reporting API standard. report-to is recommended, but setting both ensures browser compatibility. Reports include the violated directive, blocked URI, source file, and more.",
        },
      },
      {
        question: {
          ko: "CSP를 테스트하려면 어떻게 하나요?",
          en: "How can I test my CSP?",
        },
        answer: {
          ko: "Content-Security-Policy-Report-Only 헤더를 사용하면 실제로 리소스를 차단하지 않고 위반 사항만 보고합니다. 이 모드로 먼저 배포하여 정상 작동을 확인한 뒤, Content-Security-Policy 헤더로 전환하면 안전합니다. 브라우저 개발자 도구의 Console 탭에서도 위반 사항을 확인할 수 있습니다.",
          en: "Use the Content-Security-Policy-Report-Only header to report violations without actually blocking resources. Deploy in this mode first to verify normal operation, then switch to Content-Security-Policy. You can also check violations in the browser developer tools Console tab.",
        },
      },
      {
        question: {
          ko: "'unsafe-inline'과 'unsafe-eval'은 왜 위험한가요?",
          en: "Why are 'unsafe-inline' and 'unsafe-eval' dangerous?",
        },
        answer: {
          ko: "'unsafe-inline'은 모든 인라인 스크립트/스타일을 허용하여 XSS 공격자가 삽입한 스크립트도 실행됩니다. 'unsafe-eval'은 eval(), Function(), setTimeout(string) 등 동적 코드 실행을 허용하여 코드 인젝션에 취약해집니다. 대신 nonce나 hash 기반 CSP를 사용하세요.",
          en: "'unsafe-inline' allows all inline scripts/styles, which means scripts injected by XSS attackers will also execute. 'unsafe-eval' permits dynamic code execution via eval(), Function(), and setTimeout(string), making code injection possible. Use nonce or hash-based CSP instead.",
        },
      },
    ],
  },

  "bcrypt-generator": {
    howTo: {
      steps: [
        {
          ko: "해시할 비밀번호를 입력 필드에 입력합니다.",
          en: "Enter the password to hash in the input field.",
        },
        {
          ko: "Cost factor(라운드 수)를 4~14 사이에서 선택합니다. 일반적으로 10~12를 권장합니다.",
          en: "Select the cost factor (rounds) between 4 and 14. Generally 10-12 is recommended.",
        },
        {
          ko: "'해시 생성' 버튼을 클릭하면 bcrypt 해시가 생성됩니다.",
          en: "Click the 'Generate Hash' button to create the bcrypt hash.",
        },
        {
          ko: "검증 탭에서 비밀번호와 기존 해시를 입력하여 일치 여부를 확인할 수 있습니다.",
          en: "In the verify tab, enter a password and an existing hash to check if they match.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: {
          ko: "적응형 해시 함수(Adaptive Hash Function)",
          en: "Adaptive Hash Function",
        },
        description: {
          ko: "하드웨어 성능 향상에 대응하여 계산 비용을 조절할 수 있는 해시 함수입니다. bcrypt, scrypt, Argon2가 대표적이며, cost factor를 높여 해시 생성 시간을 늘릴 수 있습니다. 이는 brute-force 공격의 비용을 증가시킵니다.",
          en: "Hash functions that can adjust computation cost to counter hardware improvements. bcrypt, scrypt, and Argon2 are representative examples. Increasing the cost factor makes hash generation slower, which raises the cost of brute-force attacks.",
        },
      },
      {
        title: {
          ko: "Rainbow Table 공격",
          en: "Rainbow Table Attack",
        },
        description: {
          ko: "미리 계산된 해시값 테이블을 사용하여 비밀번호를 역추적하는 공격입니다. bcrypt는 매번 랜덤 salt를 사용하므로 같은 비밀번호도 다른 해시를 생성하여 rainbow table 공격을 무력화합니다.",
          en: "An attack using precomputed hash tables to reverse-engineer passwords. bcrypt uses a random salt each time, so the same password produces different hashes, effectively defeating rainbow table attacks.",
        },
      },
      {
        title: {
          ko: "Argon2",
          en: "Argon2",
        },
        description: {
          ko: "2015년 Password Hashing Competition 우승 알고리즘으로, bcrypt의 후계자로 평가됩니다. 메모리 사용량을 조절하여 GPU 기반 공격에 더 강한 저항성을 가집니다. Argon2id가 가장 권장되는 변형입니다.",
          en: "Winner of the 2015 Password Hashing Competition, considered bcrypt's successor. Its adjustable memory usage provides stronger resistance against GPU-based attacks. Argon2id is the most recommended variant.",
        },
      },
    ],
    relatedTools: ["hash-generator", "password-generator", "totp-generator"],
    extraFaqs: [
      {
        question: {
          ko: "bcrypt와 scrypt, Argon2 중 무엇을 사용해야 하나요?",
          en: "Should I use bcrypt, scrypt, or Argon2?",
        },
        answer: {
          ko: "신규 프로젝트에서는 Argon2id가 가장 권장됩니다. 메모리 하드니스로 GPU 공격에 강합니다. bcrypt는 가장 널리 사용되며 검증된 알고리즘으로, 대부분의 프레임워크에서 기본 지원합니다. scrypt는 메모리 집약적이나 설정이 복잡합니다. 기존 시스템이 bcrypt를 사용 중이라면 굳이 마이그레이션할 필요는 없습니다.",
          en: "For new projects, Argon2id is most recommended due to its memory hardness against GPU attacks. bcrypt is the most widely used and well-proven algorithm, supported by default in most frameworks. scrypt is memory-intensive but complex to configure. If your existing system uses bcrypt, there is no urgent need to migrate.",
        },
      },
      {
        question: {
          ko: "bcrypt 해시 문자열의 구조는 어떻게 되나요?",
          en: "What is the structure of a bcrypt hash string?",
        },
        answer: {
          ko: "bcrypt 해시는 '$2b$12$LJ3m4ys3Lg...' 형태로, $2b$는 bcrypt 버전, 12는 cost factor(라운드 수), 이후 22자는 Base64로 인코딩된 salt, 나머지 31자는 해시값입니다. 총 60자로 구성되며, salt가 해시에 포함되어 있어 별도로 저장할 필요가 없습니다.",
          en: "A bcrypt hash looks like '$2b$12$LJ3m4ys3Lg...'. $2b$ is the bcrypt version, 12 is the cost factor (rounds), the next 22 characters are the Base64-encoded salt, and the remaining 31 characters are the hash. The total is 60 characters, and since the salt is embedded in the hash, it does not need to be stored separately.",
        },
      },
      {
        question: {
          ko: "bcrypt에 비밀번호 길이 제한이 있나요?",
          en: "Is there a password length limit for bcrypt?",
        },
        answer: {
          ko: "네. bcrypt는 입력을 최대 72바이트로 자릅니다. UTF-8에서 한글은 문자당 3바이트이므로 한글 24자 또는 영문 72자가 한계입니다. 이 제한을 우회하려면 비밀번호를 먼저 SHA-256으로 해시한 뒤 bcrypt를 적용하는 방법(pre-hashing)이 있지만, 대부분의 실제 비밀번호는 72바이트 이내입니다.",
          en: "Yes. bcrypt truncates input at 72 bytes. In UTF-8, Korean characters are 3 bytes each, so the limit is 24 Korean characters or 72 ASCII characters. To work around this, you can pre-hash the password with SHA-256 before applying bcrypt, but most real-world passwords fall within the 72-byte limit.",
        },
      },
    ],
  },
};
