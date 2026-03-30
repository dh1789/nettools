/**
 * Tool Registry
 * ─────────────
 * 새 도구 추가 방법:
 * 1. src/components/tools/ 에 React 컴포넌트 생성
 * 2. 아래 TOOLS 배열에 항목 추가
 * 3. src/components/tools/index.ts 에 export 추가
 * 4. git push → 자동 빌드/배포
 *
 * 또는: npm run new-tool 스크립트 사용 (자동 생성)
 */

export interface FAQ {
  question: { ko: string; en: string };
  answer: { ko: string; en: string };
}

export interface Tool {
  slug: string;
  title: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  longDescription?: {
    ko: string;
    en: string;
  };
  category: ToolCategory;
  keywords: string[];
  faqs?: FAQ[];
  /** Component name in src/components/tools/index.ts */
  component: string;
  /** For structured data (schema.org) */
  datePublished?: string;
  dateModified?: string;
}

export type ToolCategory =
  | "network"
  | "security"
  | "linux"
  | "developer"
  | "general";

export interface Category {
  id: ToolCategory;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
  icon: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "network",
    title: { ko: "네트워크", en: "Network" },
    description: {
      ko: "IP, 서브넷, MAC 주소 등 네트워크 관련 도구",
      en: "IP, subnet, MAC address and other network tools",
    },
    icon: "🌐",
  },
  {
    id: "security",
    title: { ko: "보안", en: "Security" },
    description: {
      ko: "SSL, 암호화, 비밀번호 등 보안 관련 도구",
      en: "SSL, encryption, password and other security tools",
    },
    icon: "🔒",
  },
  {
    id: "linux",
    title: { ko: "리눅스", en: "Linux" },
    description: {
      ko: "Cron, chmod, systemd 등 리눅스 관련 도구",
      en: "Cron, chmod, systemd and other Linux tools",
    },
    icon: "🐧",
  },
  {
    id: "developer",
    title: { ko: "개발자", en: "Developer" },
    description: {
      ko: "JSON, Base64, 정규식 등 개발자 유틸리티",
      en: "JSON, Base64, regex and other developer utilities",
    },
    icon: "💻",
  },
  {
    id: "general",
    title: { ko: "일반", en: "General" },
    description: {
      ko: "QR코드, 비밀번호 생성기 등 범용 도구",
      en: "QR code, password generator and other general tools",
    },
    icon: "🔧",
  },
];

export const TOOLS: Tool[] = [
  {
    slug: "subnet-calculator",
    title: {
      ko: "서브넷 계산기",
      en: "Subnet Calculator",
    },
    description: {
      ko: "IP 주소와 서브넷 마스크로 네트워크 주소, 브로드캐스트, 호스트 범위를 계산합니다.",
      en: "Calculate network address, broadcast, and host range from IP address and subnet mask.",
    },
    longDescription: {
      ko: "서브넷 계산기는 IPv4 네트워크 설계와 관리에 필수적인 도구입니다. CIDR 표기법(예: 192.168.1.0/24)을 입력하면 네트워크 주소, 브로드캐스트 주소, 첫 번째/마지막 사용 가능한 호스트 IP, 서브넷 마스크, 와일드카드 마스크 및 전체 호스트 수를 즉시 계산합니다. 네트워크 엔지니어, 시스템 관리자, CCNA/CCNP 시험 준비생에게 유용합니다.",
      en: "The Subnet Calculator is an essential tool for IPv4 network design and management. Enter a CIDR notation (e.g., 192.168.1.0/24) to instantly calculate the network address, broadcast address, first/last usable host IPs, subnet mask, wildcard mask, and total host count. Useful for network engineers, system administrators, and CCNA/CCNP exam candidates.",
    },
    category: "network",
    keywords: [
      "subnet calculator",
      "cidr",
      "ip address",
      "network address",
      "subnet mask",
      "broadcast address",
      "wildcard mask",
      "host range",
      "ipv4",
      "서브넷 계산기",
      "서브넷",
      "아이피",
      "네트워크 주소",
      "브로드캐스트",
      "호스트 범위",
    ],
    component: "SubnetCalculator",
    datePublished: "2026-03-22",
    faqs: [
      {
        question: {
          ko: "서브넷이란 무엇인가요?",
          en: "What is a subnet?",
        },
        answer: {
          ko: "서브넷(Subnet)은 더 큰 네트워크를 논리적으로 분할한 작은 네트워크입니다. 서브넷을 사용하면 네트워크 트래픽을 효율적으로 관리하고, 보안을 강화하며, IP 주소를 효율적으로 할당할 수 있습니다.",
          en: "A subnet is a logical subdivision of a larger network. Subnetting helps manage network traffic efficiently, improve security, and allocate IP addresses more effectively.",
        },
      },
      {
        question: {
          ko: "CIDR 표기법이란 무엇인가요?",
          en: "What is CIDR notation?",
        },
        answer: {
          ko: "CIDR(Classless Inter-Domain Routing)은 IP 주소와 서브넷 마스크를 '/프리픽스 길이' 형식으로 표현합니다. 예를 들어 192.168.1.0/24에서 /24는 서브넷 마스크의 상위 24비트가 1임을 의미하며, 이는 255.255.255.0과 동일합니다.",
          en: "CIDR (Classless Inter-Domain Routing) represents an IP address with its subnet mask as '/prefix-length'. For example, in 192.168.1.0/24, the /24 means the top 24 bits of the subnet mask are 1s, equivalent to 255.255.255.0.",
        },
      },
      {
        question: {
          ko: "/24 네트워크에서 사용 가능한 호스트 수는?",
          en: "How many usable hosts are in a /24 network?",
        },
        answer: {
          ko: "/24 네트워크는 256개의 IP 주소를 포함합니다. 네트워크 주소(첫 번째)와 브로드캐스트 주소(마지막)를 제외하면 254개의 호스트 IP를 사용할 수 있습니다.",
          en: "A /24 network contains 256 IP addresses. Excluding the network address (first) and broadcast address (last), you get 254 usable host IPs.",
        },
      },
      {
        question: {
          ko: "서브넷 마스크와 CIDR 프리픽스는 어떤 관계인가요?",
          en: "What is the relationship between subnet mask and CIDR prefix?",
        },
        answer: {
          ko: "서브넷 마스크는 연속된 1비트로 네트워크 부분을 표시합니다. /24는 255.255.255.0, /16은 255.255.0.0, /8은 255.0.0.0에 해당합니다. 프리픽스 길이는 서브넷 마스크에서 1비트의 개수입니다.",
          en: "A subnet mask uses consecutive 1-bits to mark the network portion. /24 equals 255.255.255.0, /16 equals 255.255.0.0, /8 equals 255.0.0.0. The prefix length is simply the count of 1-bits in the subnet mask.",
        },
      },
    ],
  },
  {
    slug: "mac-oui-lookup",
    title: {
      ko: "MAC 주소 OUI 조회기",
      en: "MAC Address OUI Lookup",
    },
    description: {
      ko: "MAC 주소의 OUI(Organizationally Unique Identifier)를 조회하여 제조사 정보를 확인합니다.",
      en: "Look up the manufacturer from a MAC address using OUI database.",
    },
    longDescription: {
      ko: "MAC 주소 OUI 조회기는 네트워크 장비의 제조사를 빠르게 파악할 수 있는 도구입니다. MAC 주소의 앞 3바이트(OUI)를 기반으로 IEEE에 등록된 제조사 정보를 조회합니다. 네트워크 포렌식, 침입 탐지, 장비 인벤토리 관리 등에 활용됩니다. 다양한 구분자(콜론, 하이픈, 점)로 입력된 MAC 주소를 지원합니다.",
      en: "The MAC Address OUI Lookup tool helps quickly identify the manufacturer of network devices. It queries IEEE-registered vendor information based on the first 3 bytes (OUI) of a MAC address. Useful for network forensics, intrusion detection, and device inventory management. Supports MAC addresses with various separators (colon, hyphen, dot).",
    },
    category: "network",
    keywords: [
      "mac address lookup",
      "oui lookup",
      "vendor lookup",
      "manufacturer",
      "ieee oui",
      "network device",
      "mac address vendor",
      "ethernet address",
      "hardware address",
      "맥주소 조회",
      "맥주소",
      "제조사",
      "벤더",
    ],
    component: "MacOuiLookup",
    datePublished: "2026-03-22",
    faqs: [
      {
        question: {
          ko: "OUI란 무엇인가요?",
          en: "What is an OUI?",
        },
        answer: {
          ko: "OUI(Organizationally Unique Identifier)는 MAC 주소의 첫 3바이트(24비트)로, 네트워크 장비 제조사를 식별합니다. IEEE에서 각 제조사에 고유하게 할당하며, 예를 들어 'A4:C3:F0'은 Apple Inc.에 할당된 OUI입니다.",
          en: "An OUI (Organizationally Unique Identifier) is the first 3 bytes (24 bits) of a MAC address that identifies the network device manufacturer. IEEE uniquely assigns these to each manufacturer. For example, 'A4:C3:F0' is an OUI assigned to Apple Inc.",
        },
      },
      {
        question: {
          ko: "MAC 주소 형식은 어떻게 입력하나요?",
          en: "What MAC address formats are supported?",
        },
        answer: {
          ko: "AA:BB:CC:DD:EE:FF (콜론 구분), AA-BB-CC-DD-EE-FF (하이픈 구분), AABB.CCDD.EEFF (점 구분), AABBCCDDEEFF (구분자 없음) 등 다양한 형식을 지원합니다.",
          en: "Supported formats include: AA:BB:CC:DD:EE:FF (colon-separated), AA-BB-CC-DD-EE-FF (hyphen-separated), AABB.CCDD.EEFF (dot-separated), and AABBCCDDEEFF (no separator).",
        },
      },
      {
        question: {
          ko: "OUI 조회가 실패하는 이유는?",
          en: "Why might an OUI lookup fail?",
        },
        answer: {
          ko: "가상 머신, 가상 네트워크 어댑터, 또는 MAC 주소가 랜덤하게 생성된 경우 OUI가 등록되지 않을 수 있습니다. 또한 최신 장비 제조사는 데이터베이스 업데이트가 필요할 수 있습니다.",
          en: "Virtual machines, virtual network adapters, or randomly generated MAC addresses may not be in the OUI database. Also, recently registered manufacturers may require a database update.",
        },
      },
    ],
  },
  {
    slug: "cidr-to-range",
    title: {
      ko: "CIDR → IP 범위 변환기",
      en: "CIDR to IP Range Converter",
    },
    description: {
      ko: "CIDR 표기법을 시작/끝 IP 주소 범위로 변환합니다.",
      en: "Convert CIDR notation to start/end IP address range.",
    },
    longDescription: {
      ko: "CIDR to IP Range 변환기는 네트워크 블록을 시작 IP와 종료 IP로 변환합니다. 방화벽 규칙 설정, ACL 구성, IP 접근 제어 목록 작성 시 유용합니다. 단일 CIDR 또는 여러 CIDR을 동시에 변환할 수 있으며, 각 블록의 총 IP 수도 함께 표시합니다.",
      en: "The CIDR to IP Range Converter transforms network blocks into start/end IP addresses. Useful for setting firewall rules, configuring ACLs, and creating IP access control lists. Convert single or multiple CIDRs simultaneously and see the total IP count for each block.",
    },
    category: "network",
    keywords: [
      "cidr to ip range",
      "ip range converter",
      "cidr notation",
      "network block",
      "start ip",
      "end ip",
      "ip address range",
      "firewall rule",
      "acl",
      "cidr 변환",
      "ip 범위",
      "네트워크 블록",
    ],
    component: "CidrToRange",
    datePublished: "2026-03-22",
    faqs: [
      {
        question: {
          ko: "CIDR 표기법이란 무엇인가요?",
          en: "What is CIDR notation?",
        },
        answer: {
          ko: "CIDR(Classless Inter-Domain Routing)은 IP 주소와 네트워크 크기를 슬래시(/) 뒤에 프리픽스 길이로 표현합니다. 예: 10.0.0.0/8은 10.0.0.0부터 10.255.255.255까지의 범위를 나타냅니다.",
          en: "CIDR (Classless Inter-Domain Routing) represents an IP address with its network size as a prefix length after a slash (/). Example: 10.0.0.0/8 represents the range from 10.0.0.0 to 10.255.255.255.",
        },
      },
      {
        question: {
          ko: "이 도구는 어디에 사용하나요?",
          en: "Where is this tool useful?",
        },
        answer: {
          ko: "방화벽 규칙 작성 시 IP 범위 확인, 보안 그룹 설정(AWS, Azure, GCP), VPN 접속 허용 범위 구성, IP 기반 접근 제어 목록(ACL) 작성 등에 활용됩니다.",
          en: "Useful for verifying IP ranges when creating firewall rules, configuring security groups (AWS, Azure, GCP), setting up VPN access ranges, and creating IP-based access control lists (ACLs).",
        },
      },
    ],
  },
  {
    slug: "ip-lookup",
    title: {
      ko: "IP 주소 조회기",
      en: "IP Address Lookup",
    },
    description: {
      ko: "IP 주소의 공인/사설 여부를 확인하고, 공인 IP의 등록 정보(국가, ISP, 조직 등)를 조회합니다.",
      en: "Check if an IP is public or private, and look up registration info (country, ISP, org) for public IPs.",
    },
    longDescription: {
      ko: "IP 주소 조회기는 IPv4/IPv6 주소의 상세 정보를 즉시 확인할 수 있는 도구입니다. 공인/사설 IP 여부 판단, 국가, ISP(인터넷 서비스 제공자), 조직명, AS 번호, 시간대 등을 조회합니다. 내 IP 주소 자동 감지 기능도 제공하며, 네트워크 문제 해결, 보안 분석, 지역 기반 서비스 설정에 유용합니다.",
      en: "The IP Address Lookup tool instantly retrieves detailed information about IPv4/IPv6 addresses. Check if an IP is public or private, and look up country, ISP (Internet Service Provider), organization, AS number, timezone, and more. Includes auto-detection of your own IP. Useful for network troubleshooting, security analysis, and geo-based service configuration.",
    },
    category: "network",
    keywords: [
      "ip address lookup",
      "ip geolocation",
      "ip whois",
      "my ip address",
      "public ip",
      "private ip",
      "isp lookup",
      "country lookup",
      "as number",
      "autonomous system",
      "ip 주소 조회",
      "아이피 조회",
      "내 아이피",
      "공인 ip",
      "사설 ip",
      "국가 조회",
    ],
    component: "IpLookup",
    datePublished: "2026-03-29",
    faqs: [
      {
        question: {
          ko: "공인 IP와 사설 IP의 차이는?",
          en: "What is the difference between public and private IP?",
        },
        answer: {
          ko: "공인 IP(Public IP)는 인터넷에서 고유하게 식별되는 주소로, ISP가 할당합니다. 사설 IP(Private IP)는 내부 네트워크에서만 사용되며 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 대역이 해당됩니다.",
          en: "A public IP is a globally unique address on the internet, assigned by your ISP. Private IPs are used only within internal networks and belong to 10.0.0.0/8, 172.16.0.0/12, or 192.168.0.0/16 ranges.",
        },
      },
      {
        question: {
          ko: "내 IP 주소를 어떻게 확인하나요?",
          en: "How do I find my IP address?",
        },
        answer: {
          ko: "이 도구에서 '내 IP 조회' 버튼을 클릭하면 현재 인터넷 연결에 사용되는 공인 IP 주소를 자동으로 감지합니다. 이는 라우터/NAT를 통해 인터넷에 나가는 IP이므로 개인 기기의 내부 IP와 다를 수 있습니다.",
          en: "Click the 'My IP' button in this tool to automatically detect your current public IP address. This is the IP used by your router/NAT to connect to the internet, which may differ from your device's internal IP.",
        },
      },
      {
        question: {
          ko: "IP 조회 결과가 부정확할 수 있나요?",
          en: "Can IP lookup results be inaccurate?",
        },
        answer: {
          ko: "IP 지리 정보는 100% 정확하지 않을 수 있습니다. ISP의 등록 주소가 실제 사용자 위치와 다를 수 있으며, VPN이나 프록시 사용 시 다른 국가/지역으로 표시됩니다.",
          en: "IP geolocation results may not be 100% accurate. The ISP's registered address may differ from the actual user location, and VPN or proxy usage will show a different country/region.",
        },
      },
    ],
  },
  {
    slug: "dns-lookup",
    title: {
      ko: "DNS 조회기",
      en: "DNS Lookup",
    },
    description: {
      ko: "도메인의 A, AAAA, MX, NS, TXT, CNAME, SOA 등 DNS 레코드를 조회합니다. (Cloudflare DoH API 활용)",
      en: "Look up DNS records (A, AAAA, MX, NS, TXT, CNAME, SOA) for any domain using Cloudflare DoH API.",
    },
    longDescription: {
      ko: "DNS 조회기는 Cloudflare의 DNS over HTTPS(DoH) API를 사용하여 도메인의 모든 DNS 레코드를 조회합니다. A 레코드(IPv4), AAAA 레코드(IPv6), MX 레코드(메일 서버), NS 레코드(네임서버), TXT 레코드(SPF, DKIM, 도메인 인증), CNAME 레코드(별칭), SOA 레코드 등을 지원합니다. 도메인 설정 확인, 이메일 서버 구성 검증, DNS 전파 확인 등에 활용됩니다.",
      en: "The DNS Lookup tool uses Cloudflare's DNS over HTTPS (DoH) API to query all DNS records for a domain. Supports A records (IPv4), AAAA records (IPv6), MX records (mail servers), NS records (nameservers), TXT records (SPF, DKIM, domain verification), CNAME records (aliases), SOA records, and more. Useful for verifying domain configurations, validating email server setup, and checking DNS propagation.",
    },
    category: "network",
    keywords: [
      "dns lookup",
      "dns records",
      "a record",
      "aaaa record",
      "mx record",
      "ns record",
      "txt record",
      "cname record",
      "soa record",
      "domain lookup",
      "dns checker",
      "cloudflare doh",
      "dns over https",
      "spf record",
      "dkim",
      "dns 조회",
      "도메인 조회",
      "네임서버",
      "메일 서버",
    ],
    component: "DnsLookup",
    datePublished: "2026-03-30",
    faqs: [
      {
        question: {
          ko: "DNS 레코드 종류별 용도는?",
          en: "What are the different types of DNS records?",
        },
        answer: {
          ko: "A: 도메인→IPv4 주소 매핑 / AAAA: 도메인→IPv6 주소 매핑 / MX: 이메일 수신 서버 지정 / NS: 도메인의 권한 있는 네임서버 / TXT: 임의 텍스트(SPF, DKIM, 도메인 인증) / CNAME: 도메인 별칭(다른 도메인으로 리다이렉트) / SOA: 도메인 권한 정보의 시작점",
          en: "A: Maps domain to IPv4 / AAAA: Maps domain to IPv6 / MX: Specifies email receiving servers / NS: Authoritative nameservers for the domain / TXT: Arbitrary text (SPF, DKIM, domain verification) / CNAME: Domain alias (redirect to another domain) / SOA: Start of Authority, the primary source for domain info",
        },
      },
      {
        question: {
          ko: "DNS 전파 시간은 얼마나 걸리나요?",
          en: "How long does DNS propagation take?",
        },
        answer: {
          ko: "DNS 변경 사항은 TTL(Time To Live) 값에 따라 전파 시간이 다릅니다. 일반적으로 최소 몇 분에서 최대 48시간이 걸릴 수 있습니다. TTL 값을 낮게 설정하면 더 빠르게 전파됩니다.",
          en: "DNS propagation time depends on the TTL (Time To Live) value. It typically takes from a few minutes to up to 48 hours. Setting a lower TTL value speeds up propagation.",
        },
      },
      {
        question: {
          ko: "SPF, DKIM 레코드를 어디서 확인하나요?",
          en: "Where can I check SPF and DKIM records?",
        },
        answer: {
          ko: "SPF 레코드는 TXT 레코드에서 'v=spf1'로 시작하는 항목을 찾으세요. DKIM 레코드는 '_domainkey' 서브도메인의 TXT 레코드에 있습니다(예: selector._domainkey.yourdomain.com).",
          en: "SPF records are TXT records starting with 'v=spf1'. DKIM records are TXT records on the '_domainkey' subdomain (e.g., selector._domainkey.yourdomain.com).",
        },
      },
    ],
  },
  {
    slug: "port-dictionary",
    title: {
      ko: "포트 번호 사전",
      en: "Port Number Dictionary",
    },
    description: {
      ko: "잘 알려진 포트 번호(0~65535)를 검색합니다. 서비스명, 프로토콜, 용도를 확인할 수 있습니다.",
      en: "Search well-known port numbers (0-65535). Find service names, protocols, and descriptions.",
    },
    longDescription: {
      ko: "포트 번호 사전은 TCP/UDP 포트 번호와 서비스 이름을 빠르게 검색할 수 있는 참고 도구입니다. IANA에 등록된 Well-known 포트(0-1023), 등록 포트(1024-49151), 동적 포트(49152-65535) 정보를 포함합니다. 포트 번호로 서비스를 찾거나, 서비스 이름으로 포트를 검색할 수 있습니다. 방화벽 설정, 네트워크 트러블슈팅, 보안 감사에 필수적인 도구입니다.",
      en: "The Port Number Dictionary is a quick reference tool for TCP/UDP port numbers and service names. Includes IANA-registered well-known ports (0-1023), registered ports (1024-49151), and dynamic ports (49152-65535). Search by port number to find services, or by service name to find port numbers. Essential for firewall configuration, network troubleshooting, and security audits.",
    },
    category: "network",
    keywords: [
      "port number",
      "port lookup",
      "well-known ports",
      "tcp port",
      "udp port",
      "service port",
      "iana ports",
      "firewall port",
      "port scanner",
      "network port",
      "포트 번호",
      "포트 조회",
      "잘 알려진 포트",
      "서비스 포트",
      "방화벽 포트",
    ],
    component: "PortDictionary",
    datePublished: "2026-03-30",
    faqs: [
      {
        question: {
          ko: "잘 알려진 포트(Well-known ports)란?",
          en: "What are well-known ports?",
        },
        answer: {
          ko: "Well-known 포트는 IANA가 특정 서비스에 예약한 0-1023 번 포트입니다. 예: HTTP(80), HTTPS(443), SSH(22), FTP(21), SMTP(25), DNS(53) 등이 있으며, 일반적으로 서버 프로세스가 사용합니다.",
          en: "Well-known ports are 0-1023 ports reserved by IANA for specific services. Examples: HTTP(80), HTTPS(443), SSH(22), FTP(21), SMTP(25), DNS(53). Typically used by server processes.",
        },
      },
      {
        question: {
          ko: "TCP와 UDP의 차이는 무엇인가요?",
          en: "What is the difference between TCP and UDP?",
        },
        answer: {
          ko: "TCP(Transmission Control Protocol)는 연결 지향적이며 신뢰성 있는 데이터 전송을 보장합니다. UDP(User Datagram Protocol)는 비연결형으로 빠르지만 신뢰성을 보장하지 않습니다. HTTP/HTTPS는 TCP, DNS/DHCP는 UDP를 주로 사용합니다.",
          en: "TCP (Transmission Control Protocol) is connection-oriented and guarantees reliable data delivery. UDP (User Datagram Protocol) is connectionless, faster but doesn't guarantee reliability. HTTP/HTTPS use TCP, while DNS/DHCP primarily use UDP.",
        },
      },
      {
        question: {
          ko: "포트 번호 범위를 알고 싶어요.",
          en: "What are the port number ranges?",
        },
        answer: {
          ko: "0-1023: Well-known 포트 (시스템 포트, root 권한 필요) / 1024-49151: 등록 포트 (IANA 등록 서비스) / 49152-65535: 동적/사설 포트 (임시 연결, 클라이언트 사용)",
          en: "0-1023: Well-known ports (system ports, require root) / 1024-49151: Registered ports (IANA-registered services) / 49152-65535: Dynamic/private ports (ephemeral, used by clients)",
        },
      },
    ],
  },
  {
    slug: "password-generator",
    title: {
      ko: "비밀번호 생성기",
      en: "Password Generator",
    },
    description: {
      ko: "안전한 비밀번호를 생성합니다. 길이, 문자 종류를 설정하고 강도를 확인할 수 있습니다.",
      en: "Generate secure passwords with customizable length, character types, and strength indicator.",
    },
    longDescription: {
      ko: "안전한 비밀번호 생성기는 암호학적으로 안전한 난수를 사용하여 강력한 비밀번호를 생성합니다. 비밀번호 길이(8~64자), 대문자/소문자/숫자/특수문자 포함 여부를 설정할 수 있으며, 비밀번호 강도를 실시간으로 평가합니다. 모든 생성은 브라우저에서 수행되며 서버로 전송되지 않아 보안이 보장됩니다.",
      en: "The Secure Password Generator uses cryptographically secure random numbers to create strong passwords. Configure password length (8-64 chars), uppercase/lowercase/numbers/special characters inclusion, and get real-time strength evaluation. All generation happens in your browser — nothing is sent to any server.",
    },
    category: "security",
    keywords: [
      "password generator",
      "secure password",
      "random password",
      "strong password",
      "password strength",
      "password creator",
      "complex password",
      "비밀번호 생성기",
      "안전한 비밀번호",
      "랜덤 비밀번호",
      "강력한 비밀번호",
      "비밀번호 강도",
    ],
    component: "PasswordGenerator",
    datePublished: "2026-03-30",
    faqs: [
      {
        question: {
          ko: "안전한 비밀번호란 어떤 것인가요?",
          en: "What makes a password secure?",
        },
        answer: {
          ko: "안전한 비밀번호는 최소 12자 이상이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다. 사전에 있는 단어, 개인 정보(생일, 이름 등), 연속된 문자(123, abc)를 피해야 합니다. 각 계정마다 다른 비밀번호를 사용하는 것이 좋습니다.",
          en: "A secure password is at least 12 characters long and includes uppercase, lowercase, numbers, and special characters. Avoid dictionary words, personal info (birthdays, names), and sequential characters (123, abc). Use a different password for each account.",
        },
      },
      {
        question: {
          ko: "생성된 비밀번호는 서버에 저장되나요?",
          en: "Are generated passwords stored on a server?",
        },
        answer: {
          ko: "아니요. 모든 비밀번호 생성은 브라우저 내에서만 이루어지며, 어떤 서버로도 전송되지 않습니다. Web Crypto API를 사용하여 암호학적으로 안전한 난수를 생성합니다.",
          en: "No. All password generation happens entirely within your browser and is never sent to any server. We use the Web Crypto API to generate cryptographically secure random numbers.",
        },
      },
      {
        question: {
          ko: "비밀번호 강도는 어떻게 평가하나요?",
          en: "How is password strength evaluated?",
        },
        answer: {
          ko: "비밀번호 길이, 문자 종류(대/소문자, 숫자, 특수문자) 다양성, 엔트로피(무작위성)를 기준으로 약함/보통/강함/매우 강함으로 평가합니다.",
          en: "Password strength is rated as Weak/Fair/Strong/Very Strong based on length, character variety (upper/lowercase, numbers, special chars), and entropy (randomness).",
        },
      },
    ],
  },
  {
    slug: "base64",
    title: {
      ko: "Base64 인코더/디코더",
      en: "Base64 Encoder/Decoder",
    },
    description: {
      ko: "텍스트를 Base64로 인코딩하거나 Base64를 텍스트로 디코딩합니다. UTF-8을 지원합니다.",
      en: "Encode text to Base64 or decode Base64 to text. Supports UTF-8 characters.",
    },
    longDescription: {
      ko: "Base64 인코더/디코더는 바이너리 데이터를 ASCII 문자로 변환하는 도구입니다. 이메일 첨부파일, JWT 토큰, HTTP Basic 인증, 데이터 URI(이미지 인라인) 등에서 널리 사용됩니다. UTF-8 한글 등 멀티바이트 문자도 정확하게 처리하며, URL-safe Base64 인코딩도 지원합니다.",
      en: "The Base64 Encoder/Decoder converts binary data to and from ASCII characters. Widely used in email attachments, JWT tokens, HTTP Basic authentication, and data URIs (inline images). Accurately handles multibyte characters like Korean UTF-8, and supports URL-safe Base64 encoding.",
    },
    category: "developer",
    keywords: [
      "base64 encoder",
      "base64 decoder",
      "base64 encode",
      "base64 decode",
      "text to base64",
      "base64 to text",
      "jwt base64",
      "url safe base64",
      "utf-8 base64",
      "base64 인코더",
      "base64 디코더",
      "인코딩",
      "디코딩",
      "변환",
    ],
    component: "Base64Tool",
    datePublished: "2026-03-30",
    faqs: [
      {
        question: {
          ko: "Base64란 무엇인가요?",
          en: "What is Base64?",
        },
        answer: {
          ko: "Base64는 바이너리 데이터를 64개의 ASCII 문자(A-Z, a-z, 0-9, +, /)로 인코딩하는 방식입니다. 바이너리를 텍스트로 안전하게 전송할 때 사용하며, 3바이트의 데이터를 4개의 문자로 변환합니다(약 33% 크기 증가).",
          en: "Base64 encodes binary data using 64 ASCII characters (A-Z, a-z, 0-9, +, /). It's used to safely transmit binary data as text, converting every 3 bytes into 4 characters (about 33% size increase).",
        },
      },
      {
        question: {
          ko: "URL-safe Base64란 무엇인가요?",
          en: "What is URL-safe Base64?",
        },
        answer: {
          ko: "표준 Base64는 '+', '/', '=' 문자를 사용하는데, 이는 URL에서 특수 의미를 가집니다. URL-safe Base64는 '+'를 '-'로, '/'를 '_'로 대체하여 URL에서 안전하게 사용할 수 있습니다. JWT 토큰에서 주로 사용됩니다.",
          en: "Standard Base64 uses '+', '/', '=' which have special meanings in URLs. URL-safe Base64 replaces '+' with '-' and '/' with '_' for safe use in URLs. Commonly used in JWT tokens.",
        },
      },
    ],
  },
  {
    slug: "json-formatter",
    title: {
      ko: "JSON 포매터",
      en: "JSON Formatter",
    },
    description: {
      ko: "JSON을 정리(Pretty Print), 축소(Minify), 검증(Validate)합니다.",
      en: "Format (pretty print), minify, and validate JSON data.",
    },
    longDescription: {
      ko: "JSON 포매터는 JSON 데이터를 보기 좋게 정리하거나 최소화하는 개발자 도구입니다. API 응답, 설정 파일, 데이터 파일의 JSON을 즉시 포맷하고 유효성을 검사합니다. 들여쓰기 크기를 조절할 수 있으며, JSON 문법 오류의 위치를 정확하게 알려줍니다. 복잡한 중첩 구조도 가독성 있게 표시합니다.",
      en: "The JSON Formatter is a developer tool to prettify or minify JSON data. Instantly format and validate JSON from API responses, config files, and data files. Adjust indentation size, and get precise error location for JSON syntax errors. Displays complex nested structures in a readable way.",
    },
    category: "developer",
    keywords: [
      "json formatter",
      "json beautifier",
      "json prettify",
      "json minify",
      "json validator",
      "pretty print json",
      "format json",
      "json lint",
      "json parser",
      "json 포매터",
      "json 정리",
      "json 검증",
      "json 축소",
      "json 유효성",
    ],
    component: "JsonFormatter",
    datePublished: "2026-03-30",
    faqs: [
      {
        question: {
          ko: "JSON 포맷팅이란 무엇인가요?",
          en: "What is JSON formatting?",
        },
        answer: {
          ko: "JSON 포맷팅(Pretty Print)은 JSON 데이터를 들여쓰기와 줄바꿈을 추가하여 사람이 읽기 쉬운 형식으로 변환합니다. 반대로 Minify는 공백을 제거하여 파일 크기를 줄입니다.",
          en: "JSON formatting (pretty print) transforms JSON data by adding indentation and line breaks for human readability. Minifying does the opposite, removing whitespace to reduce file size.",
        },
      },
      {
        question: {
          ko: "JSON 유효성 검사를 왜 해야 하나요?",
          en: "Why should I validate JSON?",
        },
        answer: {
          ko: "잘못된 JSON은 API 오류, 파싱 실패, 애플리케이션 크래시를 유발합니다. 유효성 검사를 통해 누락된 콤마, 잘못된 따옴표, 중괄호 불일치 등의 문법 오류를 사전에 발견할 수 있습니다.",
          en: "Invalid JSON causes API errors, parsing failures, and application crashes. Validation helps catch syntax errors like missing commas, incorrect quotes, or mismatched braces before they cause problems.",
        },
      },
    ],
  },
  {
    slug: "cron-parser",
    title: {
      ko: "Cron 표현식 해석기",
      en: "Cron Expression Parser",
    },
    description: {
      ko: "Cron 표현식을 사람이 읽을 수 있는 설명으로 변환합니다.",
      en: "Convert cron expressions to human-readable descriptions.",
    },
    longDescription: {
      ko: "Cron 표현식 해석기는 복잡한 cron 문법을 이해하기 쉬운 한국어/영어 설명으로 변환합니다. 분, 시간, 일, 월, 요일의 5개 필드 또는 초를 포함한 6개 필드 cron을 지원합니다. 다음 실행 시간을 미리 보여주며, 리눅스 crontab, AWS EventBridge, GitHub Actions 스케줄 등 다양한 환경에서 활용됩니다.",
      en: "The Cron Expression Parser converts complex cron syntax into easy-to-understand descriptions in Korean/English. Supports 5-field cron (minute, hour, day, month, weekday) or 6-field with seconds. Shows upcoming execution times, useful for Linux crontab, AWS EventBridge, GitHub Actions schedules, and more.",
    },
    category: "linux",
    keywords: [
      "cron parser",
      "cron expression",
      "crontab",
      "cron schedule",
      "cron syntax",
      "cron job",
      "cron generator",
      "linux cron",
      "scheduled task",
      "크론 표현식",
      "크론 파서",
      "크론탭",
      "크론 스케줄",
      "스케줄 작업",
    ],
    component: "CronParser",
    datePublished: "2026-03-30",
    faqs: [
      {
        question: {
          ko: "Cron 표현식 형식은?",
          en: "What is the cron expression format?",
        },
        answer: {
          ko: "기본 형식: '분 시간 일 월 요일' (5개 필드). 예: '0 9 * * 1-5'는 '평일 오전 9시'를 의미합니다. 특수 문자: *(모든), ,(목록), -(범위), /(간격)을 사용할 수 있습니다.",
          en: "Basic format: 'minute hour day month weekday' (5 fields). Example: '0 9 * * 1-5' means 'weekdays at 9am'. Special chars: *(all), ,(list), -(range), /(step).",
        },
      },
      {
        question: {
          ko: "자주 쓰는 Cron 표현식 예시는?",
          en: "What are common cron expression examples?",
        },
        answer: {
          ko: "'* * * * *': 매 분 / '0 * * * *': 매 시간 / '0 0 * * *': 매일 자정 / '0 0 * * 0': 매주 일요일 자정 / '0 0 1 * *': 매월 1일 자정 / '*/15 * * * *': 15분마다",
          en: "'* * * * *': every minute / '0 * * * *': every hour / '0 0 * * *': daily at midnight / '0 0 * * 0': weekly Sunday midnight / '0 0 1 * *': monthly 1st midnight / '*/15 * * * *': every 15 minutes",
        },
      },
    ],
  },
  {
    slug: "chmod-calculator",
    title: {
      ko: "chmod 계산기",
      en: "chmod Calculator",
    },
    description: {
      ko: "Unix 파일 권한을 숫자(8진수)와 기호(rwx) 형식으로 상호 변환합니다.",
      en: "Convert between numeric (octal) and symbolic (rwx) Unix file permissions.",
    },
    longDescription: {
      ko: "chmod 계산기는 리눅스/Unix 파일 권한을 숫자 표기법(예: 755)과 기호 표기법(예: rwxr-xr-x) 사이에서 변환합니다. 소유자(owner), 그룹(group), 기타(others)의 읽기(r), 쓰기(w), 실행(x) 권한을 시각적으로 설정하고 계산합니다. setuid, setgid, sticky bit도 지원합니다.",
      en: "The chmod Calculator converts Linux/Unix file permissions between numeric notation (e.g., 755) and symbolic notation (e.g., rwxr-xr-x). Visually configure read (r), write (w), execute (x) permissions for owner, group, and others. Also supports setuid, setgid, and sticky bit.",
    },
    category: "linux",
    keywords: [
      "chmod calculator",
      "unix permissions",
      "linux permissions",
      "file permissions",
      "rwx permissions",
      "octal permissions",
      "chmod 755",
      "chmod 644",
      "setuid",
      "setgid",
      "sticky bit",
      "chmod 계산기",
      "파일 권한",
      "리눅스 권한",
      "유닉스 권한",
    ],
    component: "ChmodCalculator",
    datePublished: "2026-03-30",
    faqs: [
      {
        question: {
          ko: "chmod 755와 644의 차이는?",
          en: "What is the difference between chmod 755 and 644?",
        },
        answer: {
          ko: "755 (rwxr-xr-x): 소유자는 읽기/쓰기/실행, 그룹과 기타는 읽기/실행만 가능. 디렉토리나 실행 파일에 적합합니다. 644 (rw-r--r--): 소유자는 읽기/쓰기, 그룹과 기타는 읽기만 가능. 일반 파일에 적합합니다.",
          en: "755 (rwxr-xr-x): Owner can read/write/execute, group and others can read/execute only. Suitable for directories and executables. 644 (rw-r--r--): Owner can read/write, group and others can read only. Suitable for regular files.",
        },
      },
      {
        question: {
          ko: "실행 권한(x)이 필요한 경우는?",
          en: "When is execute permission (x) needed?",
        },
        answer: {
          ko: "실행 권한은 스크립트나 프로그램 파일을 실행할 때, 그리고 디렉토리에 접근(cd)하거나 내부 파일을 나열할 때 필요합니다. 디렉토리에 실행 권한이 없으면 ls나 cd가 불가합니다.",
          en: "Execute permission is needed to run scripts or program files, and to access (cd into) directories or list their contents. Without execute permission on a directory, ls and cd commands will fail.",
        },
      },
    ],
  },
  {
    slug: "ssl-checker",
    title: {
      ko: "SSL 인증서 확인",
      en: "SSL Certificate Checker",
    },
    description: {
      ko: "도메인의 SSL 인증서 만료일과 발급자 정보를 확인합니다.",
      en: "Check SSL certificate expiration date and issuer information for any domain.",
    },
    longDescription: {
      ko: "SSL 인증서 확인 도구는 도메인의 SSL/TLS 인증서 상태를 즉시 점검합니다. 인증서 만료일, 발급 기관(CA), 인증서 체인, SANs(Subject Alternative Names), 인증서 유형(DV/OV/EV)을 확인할 수 있습니다. 만료 임박 알림으로 갑작스러운 인증서 만료로 인한 서비스 중단을 예방하세요. Cloudflare Worker를 통해 서버 사이드에서 안전하게 조회합니다.",
      en: "The SSL Certificate Checker instantly inspects the SSL/TLS certificate status of any domain. Check certificate expiration date, issuing CA, certificate chain, SANs (Subject Alternative Names), and certificate type (DV/OV/EV). Expiry alerts help prevent service outages from unexpected certificate expiration. Queries securely via Cloudflare Worker on the server side.",
    },
    category: "security",
    keywords: [
      "ssl checker",
      "ssl certificate",
      "tls certificate",
      "https checker",
      "certificate expiry",
      "ssl expiration",
      "ssl validator",
      "certificate authority",
      "ssl monitor",
      "ssl 인증서",
      "인증서 만료",
      "https 확인",
      "ssl 점검",
      "tls 인증서",
    ],
    component: "SslChecker",
    datePublished: "2026-03-30",
    faqs: [
      {
        question: {
          ko: "SSL 인증서 만료 시 어떤 문제가 발생하나요?",
          en: "What happens when an SSL certificate expires?",
        },
        answer: {
          ko: "SSL 인증서가 만료되면 브라우저에서 '연결이 안전하지 않습니다' 또는 'NET::ERR_CERT_DATE_INVALID' 오류가 표시됩니다. 방문자들이 사이트에 접근하지 못하게 되고, 검색 엔진 순위도 하락할 수 있습니다.",
          en: "When an SSL certificate expires, browsers show 'Connection is not secure' or 'NET::ERR_CERT_DATE_INVALID' errors. Visitors cannot access the site, and search engine rankings may drop.",
        },
      },
      {
        question: {
          ko: "DV, OV, EV 인증서의 차이는?",
          en: "What is the difference between DV, OV, and EV certificates?",
        },
        answer: {
          ko: "DV(Domain Validation): 도메인 소유권만 확인, 빠르고 무료(Let's Encrypt 등). OV(Organization Validation): 도메인 + 조직 실체 확인, 기업용. EV(Extended Validation): 가장 엄격한 검증, 주소창에 회사명 표시, 금융기관/대기업용.",
          en: "DV (Domain Validation): Only verifies domain ownership, fast and free (e.g., Let's Encrypt). OV (Organization Validation): Verifies domain + organization identity, for businesses. EV (Extended Validation): Most rigorous, shows company name in address bar, for financial institutions/large enterprises.",
        },
      },
      {
        question: {
          ko: "SSL 인증서를 무료로 발급받는 방법은?",
          en: "How can I get a free SSL certificate?",
        },
        answer: {
          ko: "Let's Encrypt를 사용하면 무료로 DV SSL 인증서를 발급받고 자동 갱신할 수 있습니다. Certbot 도구를 사용하거나, 대부분의 웹 호스팅 서비스가 Let's Encrypt를 통한 무료 SSL을 기본 제공합니다.",
          en: "Let's Encrypt provides free DV SSL certificates with automatic renewal. Use the Certbot tool, or most web hosting services provide free SSL through Let's Encrypt by default.",
        },
      },
    ],
  },
  {
    slug: "url-encoder",
    title: {
      ko: "URL 인코더/디코더",
      en: "URL Encoder / Decoder",
    },
    description: {
      ko: "텍스트를 URL 인코딩(퍼센트 인코딩)하거나 URL 인코딩된 문자열을 디코딩합니다.",
      en: "Encode text to URL encoding (percent encoding) or decode URL-encoded strings.",
    },
    longDescription: {
      ko: "URL 인코더/디코더는 URL에서 안전하게 사용할 수 없는 문자(한글, 공백, 특수문자 등)를 %XX 형식으로 인코딩하거나 디코딩합니다. encodeURIComponent와 encodeURI의 차이, 쿼리 파라미터 인코딩, 경로 인코딩 등을 지원합니다. API 개발, 웹 스크래핑, URL 디버깅에 필수적인 도구입니다.",
      en: "The URL Encoder/Decoder encodes characters unsafe for URLs (Korean, spaces, special chars) into %XX format, or decodes them back. Supports encodeURIComponent vs encodeURI differences, query parameter encoding, and path encoding. Essential for API development, web scraping, and URL debugging.",
    },
    category: "developer",
    keywords: [
      "url encoder",
      "url decoder",
      "percent encoding",
      "url encode",
      "url decode",
      "uri encoding",
      "query string encoder",
      "url escape",
      "url 인코더",
      "url 디코더",
      "퍼센트 인코딩",
      "url 인코딩",
      "한글 url 인코딩",
    ],
    component: "UrlEncoder",
    datePublished: "2026-03-30",
    faqs: [
      {
        question: {
          ko: "URL 인코딩이 필요한 이유는?",
          en: "Why is URL encoding necessary?",
        },
        answer: {
          ko: "URL은 ASCII 문자만 사용할 수 있습니다. 한글, 일본어, 공백, &, =, ? 등의 특수문자는 URL에서 특별한 의미를 갖거나 허용되지 않으므로 %XX 형식으로 인코딩해야 합니다.",
          en: "URLs can only use ASCII characters. Korean, Japanese, spaces, and special characters like &, =, ? have special meanings in URLs or are not allowed, so they must be encoded as %XX format.",
        },
      },
      {
        question: {
          ko: "encodeURIComponent와 encodeURI의 차이는?",
          en: "What is the difference between encodeURIComponent and encodeURI?",
        },
        answer: {
          ko: "encodeURIComponent는 URL 컴포넌트(쿼리 파라미터 값 등)를 인코딩하며 !, ', (, ), * 를 제외한 모든 특수문자를 인코딩합니다. encodeURI는 완전한 URL을 인코딩하며 :, /, ?, #, [ 등 URL 구조 문자는 인코딩하지 않습니다.",
          en: "encodeURIComponent encodes URL components (like query parameter values) and encodes all special chars except !, ', (, ), *. encodeURI encodes full URLs and does not encode URL structural characters like :, /, ?, #, [.",
        },
      },
    ],
  },
  {
    slug: "unix-timestamp",
    title: {
      ko: "Unix Timestamp 변환기",
      en: "Unix Timestamp Converter",
    },
    description: {
      ko: "Unix 타임스탬프와 날짜/시간을 상호 변환합니다. 로컬, UTC, ISO 8601 형식을 지원합니다.",
      en: "Convert between Unix timestamps and human-readable date/time. Supports local, UTC, and ISO 8601 formats.",
    },
    longDescription: {
      ko: "Unix Timestamp 변환기는 Unix epoch 타임스탬프(1970년 1월 1일 UTC 기준 초)와 사람이 읽을 수 있는 날짜/시간을 상호 변환합니다. 현재 시각 자동 감지, 로컬 타임존/UTC/ISO 8601 형식 지원, 밀리초 타임스탬프(JavaScript) 처리, 다양한 날짜 형식 파싱을 제공합니다. API 개발, 로그 분석, 데이터베이스 시간 처리에 필수입니다.",
      en: "The Unix Timestamp Converter converts Unix epoch timestamps (seconds since January 1, 1970 UTC) to/from human-readable date/time. Features include auto-detection of current time, local timezone/UTC/ISO 8601 support, millisecond timestamp handling (JavaScript), and parsing of various date formats. Essential for API development, log analysis, and database time handling.",
    },
    category: "developer",
    keywords: [
      "unix timestamp",
      "epoch converter",
      "timestamp converter",
      "unix time",
      "epoch time",
      "timestamp to date",
      "date to timestamp",
      "iso 8601",
      "utc converter",
      "javascript timestamp",
      "unix 타임스탬프",
      "에포크 변환",
      "날짜 변환",
      "시간 변환",
      "타임스탬프",
    ],
    component: "UnixTimestamp",
    datePublished: "2026-03-30",
    faqs: [
      {
        question: {
          ko: "Unix 타임스탬프란 무엇인가요?",
          en: "What is a Unix timestamp?",
        },
        answer: {
          ko: "Unix 타임스탬프는 1970년 1월 1일 00:00:00 UTC(Unix Epoch)부터 경과한 초의 수입니다. 예: 1711756800은 2024년 3월 30일 00:00:00 UTC를 나타냅니다. 프로그래밍에서 시간을 저장하고 계산하는 데 널리 사용됩니다.",
          en: "A Unix timestamp is the number of seconds elapsed since January 1, 1970 00:00:00 UTC (Unix Epoch). Example: 1711756800 represents March 30, 2024 00:00:00 UTC. Widely used in programming to store and calculate time.",
        },
      },
      {
        question: {
          ko: "밀리초 타임스탬프와 초 타임스탬프의 차이는?",
          en: "What is the difference between millisecond and second timestamps?",
        },
        answer: {
          ko: "JavaScript의 Date.now()는 밀리초(ms) 타임스탬프를 반환합니다(1000 곱하면 초 타임스탬프). Python의 time.time()이나 Unix는 초(s) 단위를 기본으로 사용합니다. 13자리면 밀리초, 10자리면 초 타임스탬프입니다.",
          en: "JavaScript's Date.now() returns millisecond (ms) timestamps (divide by 1000 for seconds). Python's time.time() and Unix systems use seconds (s) by default. 13-digit timestamps are milliseconds, 10-digit are seconds.",
        },
      },
    ],
  },
  {
    slug: "regex-tester",
    title: {
      ko: "정규표현식 테스터",
      en: "Regex Tester",
    },
    description: {
      ko: "정규표현식을 실시간으로 테스트합니다. 매칭 결과 하이라이트, 캡처 그룹, 플래그 지원.",
      en: "Test regular expressions in real time. Highlights matches, shows capture groups, supports flags.",
    },
    longDescription: {
      ko: "정규표현식 테스터는 JavaScript regex를 실시간으로 테스트하고 디버깅하는 도구입니다. 패턴 매치를 컬러로 하이라이트하고, 캡처 그룹과 named 그룹 결과를 표시합니다. g(전역), i(대소문자 무시), m(멀티라인), s(dotAll), u(유니코드) 플래그를 지원합니다. 이메일, 전화번호, URL 검증 패턴 테스트, 로그 파싱, 텍스트 추출 등에 활용됩니다.",
      en: "The Regex Tester lets you test and debug JavaScript regular expressions in real time. Color-highlights pattern matches and displays capture groups and named groups. Supports flags: g (global), i (case-insensitive), m (multiline), s (dotAll), u (unicode). Useful for testing email/phone/URL validation patterns, log parsing, and text extraction.",
    },
    category: "linux",
    keywords: [
      "regex tester",
      "regular expression",
      "regexp tester",
      "regex debugger",
      "regex validator",
      "javascript regex",
      "regex pattern",
      "regex flags",
      "capture group",
      "regex online",
      "정규표현식 테스터",
      "정규식",
      "정규표현식",
      "패턴 매칭",
      "캡처 그룹",
    ],
    component: "RegexTester",
    datePublished: "2026-03-30",
    faqs: [
      {
        question: {
          ko: "자주 쓰는 정규표현식 패턴은?",
          en: "What are common regex patterns?",
        },
        answer: {
          ko: "이메일: /^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$/i / URL: /https?:\\/\\/[\\w.-]+\\.[a-z]{2,}/i / 전화번호: /\\d{3}[-.]?\\d{3,4}[-.]?\\d{4}/ / 숫자만: /^\\d+$/ / 한글: /[가-힣]/ / IP 주소: /\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b/",
          en: "Email: /^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$/i / URL: /https?:\\/\\/[\\w.-]+\\.[a-z]{2,}/i / Phone: /\\d{3}[-.]?\\d{3,4}[-.]?\\d{4}/ / Numbers only: /^\\d+$/ / Korean: /[가-힣]/ / IP: /\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b/",
        },
      },
      {
        question: {
          ko: "정규표현식 플래그의 의미는?",
          en: "What do regex flags mean?",
        },
        answer: {
          ko: "g (global): 전체 텍스트에서 모든 매치 찾기 / i (ignoreCase): 대소문자 무시 / m (multiline): ^와 $를 각 줄의 시작/끝으로 처리 / s (dotAll): .이 줄바꿈 문자도 매치 / u (unicode): 유니코드 모드 활성화",
          en: "g (global): Find all matches in entire text / i (ignoreCase): Case-insensitive matching / m (multiline): Treat ^ and $ as line start/end / s (dotAll): Make . match newlines too / u (unicode): Enable unicode mode",
        },
      },
    ],
  },
  {
    slug: "hash-generator",
    title: {
      ko: "해시 생성기",
      en: "Hash Generator",
    },
    description: {
      ko: "텍스트의 SHA-1, SHA-256, SHA-384, SHA-512 해시를 생성합니다. 브라우저 Web Crypto API 사용.",
      en: "Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes for any text using the browser Web Crypto API.",
    },
    longDescription: {
      ko: "해시 생성기는 브라우저의 Web Crypto API를 사용하여 SHA-1, SHA-256, SHA-384, SHA-512 해시를 생성합니다. 파일 무결성 검증, 비밀번호 해싱(솔트 추가 권장), API 서명 생성, 데이터 지문(fingerprint) 등에 사용됩니다. 모든 처리는 브라우저 내에서 수행되어 데이터가 외부로 전송되지 않습니다.",
      en: "The Hash Generator uses the browser's Web Crypto API to generate SHA-1, SHA-256, SHA-384, SHA-512 hashes. Used for file integrity verification, password hashing (adding salt recommended), API signature generation, and data fingerprinting. All processing is done in-browser — no data is sent externally.",
    },
    category: "security",
    keywords: [
      "hash generator",
      "sha256 generator",
      "sha512 hash",
      "sha1 hash",
      "sha384",
      "crypto hash",
      "checksum",
      "message digest",
      "file hash",
      "data integrity",
      "해시 생성기",
      "sha256",
      "해시",
      "체크섬",
      "암호화 해시",
    ],
    component: "HashGenerator",
    datePublished: "2026-03-30",
    faqs: [
      {
        question: {
          ko: "SHA-256과 SHA-512 중 어느 것을 사용해야 하나요?",
          en: "Which should I use, SHA-256 or SHA-512?",
        },
        answer: {
          ko: "일반 용도에는 SHA-256이 충분하며 더 빠릅니다. SHA-512는 더 긴 해시값(512비트 vs 256비트)으로 이론적으로 더 강력하지만, 32비트 시스템에서는 더 느릴 수 있습니다. 비밀번호 해싱은 SHA가 아닌 bcrypt, scrypt, Argon2를 사용하세요.",
          en: "SHA-256 is sufficient for general use and is faster. SHA-512 produces a longer hash (512 vs 256 bits) and is theoretically stronger, but can be slower on 32-bit systems. For password hashing, use bcrypt, scrypt, or Argon2 instead of SHA.",
        },
      },
      {
        question: {
          ko: "해시 함수는 왜 단방향인가요?",
          en: "Why are hash functions one-way?",
        },
        answer: {
          ko: "해시 함수는 임의 크기의 데이터를 고정 크기의 출력으로 변환하는 수학적 함수입니다. 역방향 계산이 계산적으로 불가능하도록 설계되었습니다. 같은 입력은 항상 같은 해시를 생성하지만, 해시로부터 원본 데이터를 복원하는 것은 현실적으로 불가능합니다.",
          en: "Hash functions are mathematical functions that transform arbitrary-size data into a fixed-size output. They're designed to be computationally infeasible to reverse. The same input always produces the same hash, but it's practically impossible to recover the original data from a hash.",
        },
      },
    ],
  },
  {
    slug: "text-case-converter",
    title: {
      ko: "텍스트 케이스 변환기",
      en: "Text Case Converter",
    },
    description: {
      ko: "텍스트를 대문자, 소문자, 카멜케이스, 스네이크케이스, 케밥케이스 등 다양한 형식으로 변환합니다.",
      en: "Convert text between UPPER CASE, lower case, camelCase, snake_case, kebab-case, and more.",
    },
    longDescription: {
      ko: "텍스트 케이스 변환기는 코드 작성 시 변수명, 함수명, 상수명 등의 케이스를 빠르게 변환합니다. camelCase(자바스크립트), PascalCase(클래스명), snake_case(파이썬), kebab-case(CSS, URL), SCREAMING_SNAKE_CASE(상수), Title Case(제목) 등을 지원합니다. 여러 단어를 한 번에 변환하고 클립보드에 복사할 수 있습니다.",
      en: "The Text Case Converter quickly transforms variable names, function names, and constants for coding. Supports camelCase (JavaScript), PascalCase (class names), snake_case (Python), kebab-case (CSS, URLs), SCREAMING_SNAKE_CASE (constants), Title Case, and more. Convert multiple words at once and copy to clipboard.",
    },
    category: "developer",
    keywords: [
      "case converter",
      "camelcase converter",
      "snake_case",
      "kebab-case",
      "pascalcase",
      "text transform",
      "naming convention",
      "uppercase",
      "lowercase",
      "title case",
      "케이스 변환기",
      "카멜케이스",
      "스네이크케이스",
      "케밥케이스",
      "파스칼케이스",
    ],
    component: "TextCaseConverter",
    datePublished: "2026-03-30",
    faqs: [
      {
        question: {
          ko: "프로그래밍 언어별 권장 케이스는?",
          en: "What are recommended naming conventions by programming language?",
        },
        answer: {
          ko: "JavaScript/TypeScript: camelCase(변수/함수), PascalCase(클래스/컴포넌트) / Python: snake_case(변수/함수), PascalCase(클래스) / Java/C#: camelCase(변수/메서드), PascalCase(클래스) / CSS: kebab-case(클래스/ID) / 상수: SCREAMING_SNAKE_CASE",
          en: "JavaScript/TypeScript: camelCase(vars/functions), PascalCase(classes/components) / Python: snake_case(vars/functions), PascalCase(classes) / Java/C#: camelCase(vars/methods), PascalCase(classes) / CSS: kebab-case(class/ID) / Constants: SCREAMING_SNAKE_CASE",
        },
      },
    ],
  },
  {
    slug: "number-base-converter",
    title: {
      ko: "진수 변환기",
      en: "Number Base Converter",
    },
    description: {
      ko: "2진수, 8진수, 10진수, 16진수를 상호 변환합니다. 비트 시각화 기능을 제공합니다.",
      en: "Convert between binary, octal, decimal, and hexadecimal. Includes bit visualization.",
    },
    longDescription: {
      ko: "진수 변환기는 2진수(Binary), 8진수(Octal), 10진수(Decimal), 16진수(Hexadecimal) 사이를 즉시 변환합니다. 컴퓨터 과학, 네트워크 프로그래밍, 임베디드 시스템 개발에서 필수적인 도구입니다. 비트 단위 시각화를 통해 이진 표현을 직관적으로 이해할 수 있습니다. IP 주소의 이진 표현, 색상 코드 변환, 비트 마스크 연산 등에 활용됩니다.",
      en: "The Number Base Converter instantly converts between Binary, Octal, Decimal, and Hexadecimal. Essential for computer science, network programming, and embedded systems development. Bit-level visualization helps intuitively understand binary representations. Useful for IP address binary representation, color code conversion, and bit mask operations.",
    },
    category: "developer",
    keywords: [
      "number base converter",
      "binary converter",
      "hexadecimal converter",
      "decimal to binary",
      "binary to decimal",
      "octal converter",
      "hex converter",
      "base conversion",
      "bit visualization",
      "진수 변환기",
      "2진수",
      "16진수",
      "8진수",
      "진수 변환",
      "바이너리",
      "헥사",
    ],
    component: "NumberBaseConverter",
    datePublished: "2026-03-30",
    faqs: [
      {
        question: {
          ko: "16진수(Hex)는 어디에 사용하나요?",
          en: "Where is hexadecimal (hex) used?",
        },
        answer: {
          ko: "16진수는 메모리 주소(0x7fff5fbff8a0), 색상 코드(#FF5733), MAC 주소(AA:BB:CC:DD:EE:FF), UUID, ASCII/유니코드 코드포인트, 비트 마스크 표현 등에 사용됩니다. 2진수보다 짧고 10진수보다 컴퓨터 친화적입니다.",
          en: "Hexadecimal is used for memory addresses (0x7fff5fbff8a0), color codes (#FF5733), MAC addresses (AA:BB:CC:DD:EE:FF), UUIDs, ASCII/Unicode code points, and bitmask representations. Shorter than binary and more computer-friendly than decimal.",
        },
      },
      {
        question: {
          ko: "2진수 표현에서 비트란 무엇인가요?",
          en: "What is a bit in binary representation?",
        },
        answer: {
          ko: "비트(bit)는 0 또는 1의 값을 가지는 가장 작은 데이터 단위입니다. 8비트 = 1바이트, 16비트 = 2바이트(word), 32비트 = 4바이트(dword), 64비트 = 8바이트(qword)입니다. 예: 8비트 255는 11111111(2진수), FF(16진수)입니다.",
          en: "A bit is the smallest data unit with a value of 0 or 1. 8 bits = 1 byte, 16 bits = 2 bytes (word), 32 bits = 4 bytes (dword), 64 bits = 8 bytes (qword). Example: 8-bit 255 is 11111111 (binary), FF (hex).",
        },
      },
    ],
  },
];

// Helper functions
export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getCategoryById(id: ToolCategory): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getAllSlugs(): string[] {
  return TOOLS.map((t) => t.slug);
}
