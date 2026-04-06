import type { ToolEnhancement } from "../tools";

export const NETWORK_ENHANCEMENTS: Record<string, ToolEnhancement> = {
  "subnet-calculator": {
    howTo: {
      steps: [
        {
          ko: "IP 주소와 CIDR 프리픽스(예: 192.168.1.0/24)를 입력합니다.",
          en: "Enter an IP address with CIDR prefix (e.g., 192.168.1.0/24).",
        },
        {
          ko: "계산 결과에서 네트워크 주소, 브로드캐스트 주소, 호스트 범위를 확인합니다.",
          en: "Review the calculated network address, broadcast address, and host range.",
        },
        {
          ko: "서브넷 마스크와 와일드카드 마스크를 확인합니다.",
          en: "Check the subnet mask and wildcard mask values.",
        },
        {
          ko: "사용 가능한 호스트 수를 확인하여 네트워크 설계에 반영합니다.",
          en: "Verify the usable host count and apply it to your network design.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: { ko: "와일드카드 마스크", en: "Wildcard Mask" },
        description: {
          ko: "서브넷 마스크의 역수로, ACL(Access Control List)이나 OSPF 라우팅 설정에서 사용됩니다. 예를 들어 서브넷 마스크 255.255.255.0의 와일드카드 마스크는 0.0.0.255입니다.",
          en: "The inverse of a subnet mask, used in ACLs (Access Control Lists) and OSPF routing configuration. For example, the wildcard mask for subnet mask 255.255.255.0 is 0.0.0.255.",
        },
      },
      {
        title: { ko: "네트워크 클래스(A/B/C)", en: "Network Classes (A/B/C)" },
        description: {
          ko: "전통적인 IP 주소 분류 체계입니다. Class A(1.0.0.0~126.0.0.0, /8), Class B(128.0.0.0~191.255.0.0, /16), Class C(192.0.0.0~223.255.255.0, /24)로 나뉘며, CIDR 도입 이후에는 유연한 프리픽스 할당이 가능합니다.",
          en: "The traditional IP address classification system. Class A (1.0.0.0-126.0.0.0, /8), Class B (128.0.0.0-191.255.0.0, /16), Class C (192.0.0.0-223.255.255.0, /24). Since CIDR adoption, flexible prefix allocation has replaced rigid class-based assignments.",
        },
      },
      {
        title: { ko: "슈퍼넷팅(Supernetting)", en: "Supernetting" },
        description: {
          ko: "여러 개의 작은 네트워크를 하나의 큰 네트워크로 합치는 기법으로, 라우팅 테이블을 축소하는 데 사용됩니다. 서브넷팅의 반대 개념이며, CIDR과 함께 사용됩니다.",
          en: "A technique that combines multiple smaller networks into a single larger network to reduce routing table size. It is the opposite of subnetting and is used alongside CIDR.",
        },
      },
    ],
    relatedTools: ["cidr-to-range", "vlsm-calculator", "ip-lookup", "number-base-converter", "ufw-rules-builder"],
    extraFaqs: [
      {
        question: {
          ko: "서브넷 계산 시 네트워크 주소와 브로드캐스트 주소는 왜 호스트로 사용할 수 없나요?",
          en: "Why can't the network address and broadcast address be used as host addresses?",
        },
        answer: {
          ko: "네트워크 주소(첫 번째 IP)는 해당 서브넷 자체를 식별하는 데 사용되며, 브로드캐스트 주소(마지막 IP)는 서브넷 내 모든 장비에 동시에 패킷을 전송하는 데 사용됩니다. 따라서 이 두 주소는 개별 호스트에 할당할 수 없습니다.",
          en: "The network address (first IP) identifies the subnet itself, while the broadcast address (last IP) is used to send packets to all devices within the subnet simultaneously. Therefore, neither can be assigned to individual hosts.",
        },
      },
      {
        question: {
          ko: "/31과 /32 서브넷은 어떤 용도로 사용되나요?",
          en: "What are /31 and /32 subnets used for?",
        },
        answer: {
          ko: "/31 서브넷(2개 IP)은 RFC 3021에 따라 점대점(Point-to-Point) 링크에서 사용됩니다. 라우터 간 직접 연결 시 네트워크/브로드캐스트 주소 없이 2개의 IP만 사용합니다. /32 서브넷(1개 IP)은 루프백 인터페이스나 호스트 라우팅 설정에 사용됩니다.",
          en: "A /31 subnet (2 IPs) is used for point-to-point links per RFC 3021, where only two IPs are needed without a network or broadcast address (e.g., between routers). A /32 subnet (1 IP) is used for loopback interfaces and host routes.",
        },
      },
    ],
    usageExamples: [
      {
        title: { ko: "회사 네트워크 서브넷 분할", en: "Corporate Network Subnet Division" },
        scenario: {
          ko: "100명 규모의 회사에서 부서별로 네트워크를 분리해야 하는 상황입니다.",
          en: "A 100-person company needs to separate networks by department.",
        },
        steps: [
          { ko: "10.0.0.0/8 대역에서 /24 프리픽스로 계산합니다.", en: "Calculate with /24 prefix from the 10.0.0.0/8 range." },
          { ko: "각 부서에 필요한 호스트 수(약 30대)를 확인합니다.", en: "Verify the number of hosts needed per department (about 30)." },
          { ko: "서브넷 마스크 255.255.255.0으로 254개 호스트 확보를 확인합니다.", en: "Confirm 254 usable hosts with subnet mask 255.255.255.0." },
        ],
        result: {
          ko: "개발팀 10.0.1.0/24, 영업팀 10.0.2.0/24, 관리팀 10.0.3.0/24로 분할 완료.",
          en: "Dev team 10.0.1.0/24, Sales 10.0.2.0/24, Admin 10.0.3.0/24 allocated.",
        },
      },
      {
        title: { ko: "AWS VPC 서브넷 설계", en: "AWS VPC Subnet Design" },
        scenario: {
          ko: "AWS VPC에서 퍼블릭/프라이빗 서브넷을 설계해야 합니다.",
          en: "You need to design public/private subnets in an AWS VPC.",
        },
        steps: [
          { ko: "VPC CIDR 172.31.0.0/16을 입력합니다.", en: "Enter VPC CIDR 172.31.0.0/16." },
          { ko: "/20 단위로 서브넷을 분할하여 각 서브넷당 4094개 IP를 확보합니다.", en: "Split into /20 subnets for 4094 IPs each." },
          { ko: "가용 영역별 퍼블릭/프라이빗 쌍을 구성합니다.", en: "Set up public/private pairs per availability zone." },
        ],
        result: {
          ko: "AZ-a 퍼블릭 172.31.0.0/20, AZ-a 프라이빗 172.31.16.0/20 등 체계적 할당 완료.",
          en: "AZ-a public 172.31.0.0/20, AZ-a private 172.31.16.0/20 systematically allocated.",
        },
      },
    ],
  },

  "mac-oui-lookup": {
    howTo: {
      steps: [
        {
          ko: "MAC 주소를 입력란에 입력합니다 (예: AA:BB:CC:DD:EE:FF).",
          en: "Enter a MAC address in the input field (e.g., AA:BB:CC:DD:EE:FF).",
        },
        {
          ko: "자동으로 OUI(앞 3바이트)를 추출하여 제조사 데이터베이스를 조회합니다.",
          en: "The tool automatically extracts the OUI (first 3 bytes) and queries the manufacturer database.",
        },
        {
          ko: "제조사명, 등록 주소 등 조회 결과를 확인합니다.",
          en: "Review the results including manufacturer name and registration details.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: { ko: "MAC 주소 랜덤화", en: "MAC Address Randomization" },
        description: {
          ko: "iOS, Android, Windows 등 최신 운영체제에서 프라이버시 보호를 위해 Wi-Fi 연결 시 랜덤 MAC 주소를 사용하는 기능입니다. 랜덤 MAC은 OUI 조회 시 제조사가 나타나지 않을 수 있습니다.",
          en: "A privacy feature in modern operating systems (iOS, Android, Windows) that uses randomized MAC addresses for Wi-Fi connections. Randomized MACs may not return manufacturer info in OUI lookups.",
        },
      },
      {
        title: { ko: "IEEE 등록 체계", en: "IEEE Registration System" },
        description: {
          ko: "IEEE(전기전자공학자협회)가 MAC 주소 블록을 관리합니다. MA-L(OUI, 24비트), MA-M(28비트), MA-S(36비트)의 세 가지 할당 크기가 있으며, 각 제조사에 고유 블록이 배정됩니다.",
          en: "IEEE (Institute of Electrical and Electronics Engineers) manages MAC address blocks. There are three allocation sizes: MA-L (OUI, 24-bit), MA-M (28-bit), and MA-S (36-bit), each uniquely assigned to manufacturers.",
        },
      },
      {
        title: { ko: "유니캐스트 vs 멀티캐스트 MAC", en: "Unicast vs. Multicast MAC" },
        description: {
          ko: "MAC 주소의 첫 번째 옥텟 최하위 비트(LSB)가 0이면 유니캐스트(단일 장치), 1이면 멀티캐스트(다중 장치)를 나타냅니다. 예: 01:00:5E로 시작하면 IPv4 멀티캐스트 주소입니다.",
          en: "If the least significant bit (LSB) of the first octet is 0, it indicates unicast (single device); if 1, multicast (multiple devices). For example, addresses starting with 01:00:5E are IPv4 multicast addresses.",
        },
      },
    ],
    relatedTools: ["ip-lookup", "whois-lookup", "dns-lookup"],
    extraFaqs: [
      {
        question: {
          ko: "MAC 주소와 IP 주소의 차이는 무엇인가요?",
          en: "What is the difference between a MAC address and an IP address?",
        },
        answer: {
          ko: "MAC 주소는 네트워크 인터페이스 카드(NIC)에 물리적으로 할당된 48비트 고유 식별자로, 로컬 네트워크(Layer 2)에서 사용됩니다. IP 주소는 네트워크 계층(Layer 3)에서 논리적으로 할당되어 인터넷 라우팅에 사용됩니다.",
          en: "A MAC address is a 48-bit unique identifier physically assigned to a NIC (Network Interface Card), used at the local network level (Layer 2). An IP address is logically assigned at the network layer (Layer 3) and used for internet routing.",
        },
      },
      {
        question: {
          ko: "MAC 주소를 변경(스푸핑)할 수 있나요?",
          en: "Can a MAC address be changed (spoofed)?",
        },
        answer: {
          ko: "네, 소프트웨어 레벨에서 MAC 주소를 임의로 변경할 수 있으며, 이를 MAC 스푸핑이라 합니다. Linux에서는 macchanger, Windows에서는 장치 관리자나 레지스트리를 통해 변경할 수 있습니다. 네트워크 테스트 목적으로 사용되지만, 보안 우회 목적의 사용은 위험합니다.",
          en: "Yes, MAC addresses can be changed at the software level, known as MAC spoofing. On Linux, use macchanger; on Windows, use Device Manager or the registry. While useful for network testing, spoofing for security bypass is risky and may be illegal.",
        },
      },
      {
        question: {
          ko: "하나의 제조사가 여러 OUI를 가질 수 있나요?",
          en: "Can one manufacturer have multiple OUIs?",
        },
        answer: {
          ko: "네, 대형 제조사는 수십~수백 개의 OUI를 보유할 수 있습니다. Apple, Samsung, Cisco 등은 다양한 제품 라인별로 여러 OUI를 등록하고 있습니다. 기존 OUI 블록의 주소가 소진되면 새로운 블록을 IEEE에서 추가 구매합니다.",
          en: "Yes, large manufacturers can hold dozens or even hundreds of OUIs. Companies like Apple, Samsung, and Cisco register multiple OUIs for different product lines. When addresses in an existing OUI block are exhausted, they purchase new blocks from IEEE.",
        },
      },
    ],
  },

  "cidr-to-range": {
    howTo: {
      steps: [
        {
          ko: "CIDR 표기법(예: 10.0.0.0/8)을 입력란에 입력합니다.",
          en: "Enter a CIDR notation (e.g., 10.0.0.0/8) in the input field.",
        },
        {
          ko: "여러 CIDR 블록을 한 번에 변환하려면 줄바꿈으로 구분하여 입력합니다.",
          en: "To convert multiple CIDR blocks at once, enter them separated by newlines.",
        },
        {
          ko: "변환 결과에서 시작 IP, 종료 IP, 총 IP 수를 확인합니다.",
          en: "Review the conversion results: start IP, end IP, and total IP count.",
        },
        {
          ko: "방화벽이나 ACL 규칙에 필요한 IP 범위를 복사하여 사용합니다.",
          en: "Copy the IP range values for use in firewall or ACL rules.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: { ko: "방화벽 규칙과 IP 범위", en: "Firewall Rules and IP Ranges" },
        description: {
          ko: "방화벽은 CIDR 블록 또는 IP 범위를 기반으로 트래픽을 허용/차단합니다. AWS Security Group, iptables, UFW 등에서 CIDR을 사용하여 접근 제어를 설정합니다.",
          en: "Firewalls allow or block traffic based on CIDR blocks or IP ranges. AWS Security Groups, iptables, UFW, and other tools use CIDR notation for access control configuration.",
        },
      },
      {
        title: { ko: "IP 주소 집약(Aggregation)", en: "IP Address Aggregation" },
        description: {
          ko: "여러 개의 연속된 IP 범위를 하나의 CIDR 블록으로 합치는 기법입니다. 라우팅 테이블을 축소하고 네트워크 효율을 높이는 데 사용됩니다. 예: 10.0.0.0/24와 10.0.1.0/24를 10.0.0.0/23으로 집약할 수 있습니다.",
          en: "A technique that combines multiple contiguous IP ranges into a single CIDR block. Used to reduce routing table size and improve network efficiency. Example: 10.0.0.0/24 and 10.0.1.0/24 can be aggregated to 10.0.0.0/23.",
        },
      },
    ],
    relatedTools: ["subnet-calculator", "vlsm-calculator", "ufw-rules-builder"],
    extraFaqs: [
      {
        question: {
          ko: "CIDR에서 프리픽스 길이가 작을수록 범위가 넓은 이유는?",
          en: "Why does a smaller CIDR prefix mean a larger range?",
        },
        answer: {
          ko: "프리픽스 길이는 네트워크 부분의 비트 수를 나타냅니다. 프리픽스가 짧을수록 호스트 부분에 할당되는 비트가 많아져 더 많은 IP 주소를 포함합니다. 예: /8은 약 1,677만 개, /24는 256개, /32는 1개의 IP를 나타냅니다.",
          en: "The prefix length indicates the number of bits for the network portion. A shorter prefix leaves more bits for the host portion, resulting in more IP addresses. For example, /8 covers ~16.77 million IPs, /24 covers 256 IPs, and /32 covers 1 IP.",
        },
      },
      {
        question: {
          ko: "CIDR 블록이 겹치는지 어떻게 확인하나요?",
          en: "How can I check if CIDR blocks overlap?",
        },
        answer: {
          ko: "각 CIDR 블록을 IP 범위로 변환한 뒤, 시작/종료 IP가 다른 블록의 범위에 포함되는지 확인합니다. 예를 들어 10.0.0.0/24(10.0.0.0~10.0.0.255)와 10.0.0.128/25(10.0.0.128~10.0.0.255)는 겹칩니다. 이 도구로 범위를 확인하면 쉽게 판단할 수 있습니다.",
          en: "Convert each CIDR block to an IP range, then check if the start/end IPs fall within another block's range. For example, 10.0.0.0/24 (10.0.0.0-10.0.0.255) overlaps with 10.0.0.128/25 (10.0.0.128-10.0.0.255). This tool makes it easy to verify.",
        },
      },
      {
        question: {
          ko: "IPv6에서도 CIDR 표기법을 사용하나요?",
          en: "Is CIDR notation used for IPv6 as well?",
        },
        answer: {
          ko: "네, IPv6에서도 동일한 CIDR 표기법이 사용됩니다. 예를 들어 2001:db8::/32는 IPv6 주소 블록을 나타냅니다. IPv6 프리픽스 길이는 0에서 128까지이며, 일반적으로 /48(사이트), /64(서브넷), /128(호스트)이 많이 사용됩니다.",
          en: "Yes, IPv6 uses the same CIDR notation. For example, 2001:db8::/32 represents an IPv6 address block. IPv6 prefix lengths range from 0 to 128, with /48 (site), /64 (subnet), and /128 (host) being the most common.",
        },
      },
      {
        question: {
          ko: "클라우드 서비스에서 CIDR은 어떻게 사용되나요?",
          en: "How is CIDR used in cloud services?",
        },
        answer: {
          ko: "AWS VPC, Azure VNet, GCP VPC 등 클라우드 가상 네트워크에서 CIDR 블록을 사용하여 네트워크 범위를 정의합니다. VPC 생성 시 10.0.0.0/16과 같은 CIDR을 지정하고, 서브넷은 그 안에서 /24 등으로 분할합니다.",
          en: "Cloud virtual networks like AWS VPC, Azure VNet, and GCP VPC use CIDR blocks to define network ranges. When creating a VPC, you specify a CIDR like 10.0.0.0/16, then divide it into subnets such as /24 within that range.",
        },
      },
    ],
    usageExamples: [
      {
        title: { ko: "방화벽 규칙용 IP 범위 확인", en: "Check IP Range for Firewall Rules" },
        scenario: {
          ko: "AWS Security Group에 특정 CIDR 블록의 IP 범위를 허용해야 합니다.",
          en: "You need to allow a specific CIDR block's IP range in AWS Security Group.",
        },
        steps: [
          { ko: "허용할 CIDR 블록(예: 203.0.113.0/28)을 입력합니다.", en: "Enter the CIDR block to allow (e.g., 203.0.113.0/28)." },
          { ko: "시작 IP(203.0.113.0)와 종료 IP(203.0.113.15)를 확인합니다.", en: "Verify start IP (203.0.113.0) and end IP (203.0.113.15)." },
          { ko: "총 16개 IP가 포함됨을 확인하고 방화벽에 적용합니다.", en: "Confirm 16 total IPs and apply to the firewall." },
        ],
        result: {
          ko: "정확한 IP 범위를 확인하여 최소 권한 원칙에 맞는 방화벽 규칙 설정 완료.",
          en: "Verified exact IP range for a least-privilege firewall rule.",
        },
      },
      {
        title: { ko: "ISP 할당 대역 분석", en: "Analyze ISP Allocated Block" },
        scenario: {
          ko: "ISP로부터 할당받은 공인 IP 대역의 실제 사용 가능 범위를 확인합니다.",
          en: "Check the usable range of a public IP block allocated by your ISP.",
        },
        steps: [
          { ko: "할당받은 CIDR(예: 211.234.100.0/22)을 입력합니다.", en: "Enter the allocated CIDR (e.g., 211.234.100.0/22)." },
          { ko: "시작-종료 IP와 총 1024개 주소를 확인합니다.", en: "Check start-end IPs and the total of 1024 addresses." },
        ],
        result: {
          ko: "211.234.100.0~211.234.103.255 범위에서 실제 사용 가능한 IP 1022개 확인.",
          en: "Confirmed 1022 usable IPs in the range 211.234.100.0-211.234.103.255.",
        },
      },
    ],
  },

  "ip-lookup": {
    howTo: {
      steps: [
        {
          ko: "조회할 IP 주소를 입력하거나 '내 IP 조회' 버튼을 클릭합니다.",
          en: "Enter an IP address to look up, or click the 'My IP' button.",
        },
        {
          ko: "공인/사설 IP 여부와 함께 국가, ISP, 조직 정보를 확인합니다.",
          en: "Check whether the IP is public or private, along with country, ISP, and organization info.",
        },
        {
          ko: "AS 번호, 시간대 등 추가 정보를 확인합니다.",
          en: "Review additional details such as AS number and timezone.",
        },
        {
          ko: "네트워크 문제 해결이나 보안 분석에 조회 결과를 활용합니다.",
          en: "Use the lookup results for network troubleshooting or security analysis.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: { ko: "NAT(Network Address Translation)", en: "NAT (Network Address Translation)" },
        description: {
          ko: "사설 IP 주소를 공인 IP 주소로 변환하는 기술입니다. 가정이나 사무실의 여러 장치가 하나의 공인 IP를 공유하여 인터넷에 접속할 수 있게 합니다. NAT 뒤의 장치는 외부에서 직접 접근이 불가능합니다.",
          en: "A technology that translates private IP addresses to public IP addresses. It allows multiple devices in a home or office to share a single public IP for internet access. Devices behind NAT are not directly accessible from outside.",
        },
      },
      {
        title: { ko: "AS 번호(Autonomous System)", en: "AS Number (Autonomous System)" },
        description: {
          ko: "인터넷에서 하나의 라우팅 정책으로 운영되는 네트워크 그룹을 식별하는 고유 번호입니다. ISP, 대학, 대기업 등이 AS를 운영하며, BGP 라우팅 프로토콜에서 사용됩니다.",
          en: "A unique number identifying a group of networks operated under a single routing policy on the internet. ISPs, universities, and large enterprises operate AS numbers, which are used in BGP routing protocol.",
        },
      },
      {
        title: { ko: "IP 지오로케이션", en: "IP Geolocation" },
        description: {
          ko: "IP 주소를 기반으로 물리적 위치(국가, 도시, 좌표)를 추정하는 기술입니다. 정확도는 국가 수준에서 95% 이상이지만, 도시 수준에서는 50~80% 정도입니다. CDN, 콘텐츠 지역 제한, 사기 탐지 등에 활용됩니다.",
          en: "A technology that estimates physical location (country, city, coordinates) based on an IP address. Accuracy is over 95% at country level but 50-80% at city level. Used for CDN routing, content geo-restriction, and fraud detection.",
        },
      },
    ],
    relatedTools: ["dns-lookup", "whois-lookup", "subnet-calculator", "mac-oui-lookup", "vlsm-calculator"],
    extraFaqs: [
      {
        question: {
          ko: "IPv4와 IPv6의 차이는 무엇인가요?",
          en: "What is the difference between IPv4 and IPv6?",
        },
        answer: {
          ko: "IPv4는 32비트 주소 체계(약 43억 개)로 주소가 고갈되고 있습니다. IPv6는 128비트 주소 체계(약 3.4x10^38개)로 사실상 무한한 주소를 제공합니다. IPv6는 NAT 없이 직접 통신이 가능하며, IPsec 기본 지원, 자동 주소 구성(SLAAC) 등의 장점이 있습니다.",
          en: "IPv4 uses a 32-bit address scheme (~4.3 billion addresses), which is being exhausted. IPv6 uses a 128-bit scheme (~3.4x10^38 addresses), providing virtually unlimited addresses. IPv6 enables direct communication without NAT, built-in IPsec, and auto-address configuration (SLAAC).",
        },
      },
      {
        question: {
          ko: "VPN 사용 시 IP 조회 결과가 달라지나요?",
          en: "Does using a VPN change IP lookup results?",
        },
        answer: {
          ko: "네, VPN을 사용하면 VPN 서버의 IP 주소가 조회됩니다. 따라서 실제 위치가 아닌 VPN 서버가 위치한 국가/도시가 표시됩니다. 이는 VPN이 트래픽을 암호화하고 서버를 통해 라우팅하기 때문입니다.",
          en: "Yes, when using a VPN, the VPN server's IP address is looked up instead. This means the displayed country/city reflects the VPN server location, not your actual location, because VPN encrypts and routes traffic through its server.",
        },
      },
      {
        question: {
          ko: "예약된(특수) IP 주소 범위에는 어떤 것이 있나요?",
          en: "What are the reserved (special) IP address ranges?",
        },
        answer: {
          ko: "주요 예약 범위로는 0.0.0.0/8(현재 네트워크), 10.0.0.0/8(사설), 127.0.0.0/8(루프백), 169.254.0.0/16(링크-로컬), 172.16.0.0/12(사설), 192.168.0.0/16(사설), 224.0.0.0/4(멀티캐스트), 255.255.255.255(브로드캐스트) 등이 있습니다.",
          en: "Key reserved ranges include 0.0.0.0/8 (current network), 10.0.0.0/8 (private), 127.0.0.0/8 (loopback), 169.254.0.0/16 (link-local), 172.16.0.0/12 (private), 192.168.0.0/16 (private), 224.0.0.0/4 (multicast), and 255.255.255.255 (broadcast).",
        },
      },
    ],
  },

  "dns-lookup": {
    howTo: {
      steps: [
        {
          ko: "조회할 도메인 이름(예: example.com)을 입력합니다.",
          en: "Enter the domain name to look up (e.g., example.com).",
        },
        {
          ko: "조회할 레코드 타입(A, AAAA, MX, NS, TXT, CNAME, SOA)을 선택합니다.",
          en: "Select the record type to query (A, AAAA, MX, NS, TXT, CNAME, SOA).",
        },
        {
          ko: "조회 버튼을 클릭하여 Cloudflare DoH를 통해 DNS 레코드를 확인합니다.",
          en: "Click the lookup button to retrieve DNS records via Cloudflare DoH.",
        },
        {
          ko: "레코드 값, TTL 등 결과를 확인하고 도메인 설정에 반영합니다.",
          en: "Review record values, TTL, and other results, then apply them to your domain configuration.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: { ko: "DNS over HTTPS (DoH)", en: "DNS over HTTPS (DoH)" },
        description: {
          ko: "DNS 질의를 HTTPS 프로토콜로 암호화하여 전송하는 방식입니다. 전통적인 UDP 기반 DNS 질의는 평문으로 전송되어 도청에 취약하지만, DoH는 암호화를 통해 프라이버시를 보호합니다. Cloudflare, Google 등이 DoH 서비스를 제공합니다.",
          en: "A method that encrypts DNS queries using the HTTPS protocol. Traditional UDP-based DNS queries are sent in plaintext and vulnerable to eavesdropping, while DoH protects privacy through encryption. Cloudflare, Google, and others offer DoH services.",
        },
      },
      {
        title: { ko: "TTL(Time To Live)", en: "TTL (Time To Live)" },
        description: {
          ko: "DNS 레코드가 캐시에 저장되는 시간(초)입니다. TTL이 낮으면(예: 300초) 변경 사항이 빠르게 전파되지만 DNS 서버 부하가 증가합니다. TTL이 높으면(예: 86400초) 캐시 효율이 좋지만 변경 반영이 느립니다.",
          en: "The duration (in seconds) a DNS record is stored in cache. A low TTL (e.g., 300 seconds) propagates changes quickly but increases DNS server load. A high TTL (e.g., 86400 seconds) improves cache efficiency but slows down change propagation.",
        },
      },
      {
        title: { ko: "DNS 레코드 우선순위", en: "DNS Record Priority" },
        description: {
          ko: "MX 레코드는 우선순위(Priority) 값을 가지며, 숫자가 낮을수록 높은 우선순위입니다. 예를 들어 우선순위 10의 메일 서버가 20보다 먼저 시도됩니다. 주 메일 서버 장애 시 백업 서버로 자동 전환됩니다.",
          en: "MX records have a priority value where lower numbers indicate higher priority. For example, a mail server with priority 10 is attempted before priority 20. This provides automatic failover to backup servers when the primary fails.",
        },
      },
    ],
    relatedTools: ["whois-lookup", "ip-lookup", "ssl-checker", "mac-oui-lookup"],
    extraFaqs: [
      {
        question: {
          ko: "CNAME 레코드와 A 레코드의 차이는?",
          en: "What is the difference between CNAME and A records?",
        },
        answer: {
          ko: "A 레코드는 도메인을 직접 IP 주소에 매핑합니다. CNAME(Canonical Name) 레코드는 도메인을 다른 도메인의 별칭으로 설정합니다. 예를 들어 www.example.com을 CNAME으로 example.com에 연결하면, A 레코드는 example.com에만 설정하면 됩니다. 단, 루트 도메인(@)에는 CNAME을 사용할 수 없습니다.",
          en: "An A record maps a domain directly to an IP address. A CNAME (Canonical Name) record sets a domain as an alias for another domain. For example, setting www.example.com as a CNAME for example.com means only example.com needs an A record. Note: CNAME cannot be used for the root domain (@).",
        },
      },
      {
        question: {
          ko: "DNS 캐시를 강제로 비울 수 있나요?",
          en: "Can I force a DNS cache flush?",
        },
        answer: {
          ko: "로컬 DNS 캐시는 운영체제 명령으로 비울 수 있습니다. Windows: ipconfig /flushdns, macOS: sudo dscacheutil -flushcache, Linux: sudo systemd-resolve --flush-caches. 하지만 ISP나 중간 DNS 서버의 캐시는 TTL 만료까지 기다려야 합니다.",
          en: "Local DNS cache can be flushed using OS commands. Windows: ipconfig /flushdns, macOS: sudo dscacheutil -flushcache, Linux: sudo systemd-resolve --flush-caches. However, ISP and intermediate DNS server caches must wait for TTL expiration.",
        },
      },
      {
        question: {
          ko: "DNSSEC란 무엇인가요?",
          en: "What is DNSSEC?",
        },
        answer: {
          ko: "DNSSEC(DNS Security Extensions)는 DNS 응답에 디지털 서명을 추가하여 DNS 스푸핑이나 캐시 포이즈닝 공격을 방지하는 보안 확장입니다. RRSIG, DNSKEY, DS, NSEC 등의 레코드 타입을 사용하여 DNS 데이터의 무결성과 출처를 검증합니다.",
          en: "DNSSEC (DNS Security Extensions) adds digital signatures to DNS responses to prevent DNS spoofing and cache poisoning attacks. It uses record types like RRSIG, DNSKEY, DS, and NSEC to verify the integrity and origin of DNS data.",
        },
      },
    ],
  },

  "port-dictionary": {
    howTo: {
      steps: [
        {
          ko: "포트 번호(예: 443) 또는 서비스 이름(예: HTTPS)을 검색란에 입력합니다.",
          en: "Enter a port number (e.g., 443) or service name (e.g., HTTPS) in the search field.",
        },
        {
          ko: "검색 결과에서 서비스 이름, 프로토콜(TCP/UDP), 용도를 확인합니다.",
          en: "Review the search results showing service name, protocol (TCP/UDP), and description.",
        },
        {
          ko: "방화벽 규칙이나 네트워크 보안 설정에 필요한 정보를 참고합니다.",
          en: "Use the information for firewall rules or network security configuration.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: { ko: "소켓과 포트", en: "Sockets and Ports" },
        description: {
          ko: "소켓은 IP 주소와 포트 번호의 조합(예: 192.168.1.1:80)으로, 네트워크 통신의 끝점(endpoint)입니다. 포트는 하나의 IP 주소에서 여러 서비스를 동시에 운영할 수 있게 해주는 논리적 구분자 역할을 합니다.",
          en: "A socket is a combination of IP address and port number (e.g., 192.168.1.1:80), serving as a network communication endpoint. Ports act as logical identifiers that allow multiple services to run simultaneously on a single IP address.",
        },
      },
      {
        title: { ko: "포트 포워딩", en: "Port Forwarding" },
        description: {
          ko: "라우터에서 특정 포트로 들어오는 트래픽을 내부 네트워크의 특정 장치로 전달하는 기술입니다. 외부에서 홈 서버, 게임 서버, 원격 데스크톱 등에 접속할 때 필요합니다.",
          en: "A technique where a router forwards incoming traffic on a specific port to a particular device on the internal network. Required for external access to home servers, game servers, remote desktops, etc.",
        },
      },
      {
        title: { ko: "포트 스캐닝", en: "Port Scanning" },
        description: {
          ko: "네트워크 호스트의 열린 포트를 탐지하는 보안 기법입니다. Nmap 등의 도구를 사용하며, 관리자가 불필요한 서비스를 식별하고 보안 취약점을 발견하는 데 활용됩니다. 허가 없는 포트 스캔은 불법일 수 있습니다.",
          en: "A security technique for detecting open ports on network hosts. Tools like Nmap are used by administrators to identify unnecessary services and discover security vulnerabilities. Unauthorized port scanning may be illegal.",
        },
      },
    ],
    relatedTools: ["ufw-rules-builder", "http-status-dictionary", "ssl-checker", "ssh-config-generator"],
    extraFaqs: [
      {
        question: {
          ko: "같은 포트에서 TCP와 UDP가 동시에 작동할 수 있나요?",
          en: "Can TCP and UDP run on the same port simultaneously?",
        },
        answer: {
          ko: "네, TCP와 UDP는 독립적인 프로토콜이므로 같은 포트 번호를 동시에 사용할 수 있습니다. 예를 들어 DNS는 53번 포트에서 TCP와 UDP 모두 사용합니다. UDP는 일반적인 질의에, TCP는 영역 전송(zone transfer)이나 큰 응답에 사용됩니다.",
          en: "Yes, TCP and UDP are independent protocols and can use the same port number simultaneously. For example, DNS uses port 53 for both TCP and UDP. UDP handles regular queries while TCP is used for zone transfers and large responses.",
        },
      },
      {
        question: {
          ko: "1024 미만의 포트를 사용하려면 특별한 권한이 필요한가요?",
          en: "Do ports below 1024 require special privileges?",
        },
        answer: {
          ko: "네, Unix/Linux 시스템에서 1024 미만의 포트(Well-known 포트)는 root(관리자) 권한이 있어야 바인딩할 수 있습니다. 이는 보안상의 이유로, 신뢰할 수 있는 프로세스만 중요한 서비스 포트를 점유하도록 보장합니다.",
          en: "Yes, on Unix/Linux systems, binding to ports below 1024 (well-known ports) requires root (administrator) privileges. This security measure ensures that only trusted processes can occupy important service ports.",
        },
      },
      {
        question: {
          ko: "임시 포트(Ephemeral Port)란 무엇인가요?",
          en: "What is an ephemeral port?",
        },
        answer: {
          ko: "임시 포트는 클라이언트가 서버에 연결할 때 운영체제가 자동으로 할당하는 임시 출발지 포트입니다. 일반적으로 49152~65535 범위에서 할당되며, 연결이 종료되면 반환됩니다. Linux에서는 /proc/sys/net/ipv4/ip_local_port_range에서 범위를 확인할 수 있습니다.",
          en: "An ephemeral port is a temporary source port automatically assigned by the OS when a client connects to a server. Typically allocated from the 49152-65535 range and returned after the connection closes. On Linux, check /proc/sys/net/ipv4/ip_local_port_range for the configured range.",
        },
      },
    ],
  },

  "http-status-dictionary": {
    howTo: {
      steps: [
        {
          ko: "HTTP 상태 코드 번호(예: 404) 또는 키워드(예: Not Found)를 검색합니다.",
          en: "Search by HTTP status code number (e.g., 404) or keyword (e.g., Not Found).",
        },
        {
          ko: "카테고리(1xx~5xx)별로 필터링하여 관련 코드를 브라우징합니다.",
          en: "Filter by category (1xx-5xx) to browse related status codes.",
        },
        {
          ko: "각 코드의 의미, 발생 원인, 사용 사례를 확인합니다.",
          en: "Review each code's meaning, common causes, and use cases.",
        },
        {
          ko: "API 개발이나 웹 서버 디버깅 시 참고 자료로 활용합니다.",
          en: "Use as a reference during API development or web server debugging.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: { ko: "REST API 응답 설계", en: "REST API Response Design" },
        description: {
          ko: "REST API는 적절한 HTTP 상태 코드로 요청 결과를 표현해야 합니다. 성공(200, 201, 204), 클라이언트 오류(400, 401, 403, 404, 422), 서버 오류(500, 502, 503) 등을 올바르게 사용해야 API 소비자가 오류를 정확히 처리할 수 있습니다.",
          en: "REST APIs should use appropriate HTTP status codes to represent request outcomes. Correct use of success (200, 201, 204), client error (400, 401, 403, 404, 422), and server error (500, 502, 503) codes enables API consumers to handle errors accurately.",
        },
      },
      {
        title: { ko: "리다이렉트 체인", en: "Redirect Chains" },
        description: {
          ko: "하나의 URL이 다른 URL로, 그 URL이 또 다른 URL로 리다이렉트되는 연쇄 구조입니다. 리다이렉트 체인이 길면 페이지 로드 시간이 증가하고 SEO에 부정적 영향을 미칩니다. 최종 목적지로 직접 리다이렉트하는 것이 권장됩니다.",
          en: "A chain where one URL redirects to another, which redirects to yet another. Long redirect chains increase page load time and negatively impact SEO. Redirecting directly to the final destination is recommended.",
        },
      },
      {
        title: { ko: "커스텀 에러 페이지", en: "Custom Error Pages" },
        description: {
          ko: "404, 500 등의 오류 발생 시 기본 서버 에러 페이지 대신 사용자 친화적인 커스텀 페이지를 보여주는 설정입니다. 사용자 경험을 개선하고, 브랜드 일관성을 유지하며, 서버 정보 노출을 방지합니다.",
          en: "Configuration to display user-friendly custom pages instead of default server error pages for errors like 404 and 500. Improves user experience, maintains brand consistency, and prevents server information disclosure.",
        },
      },
    ],
    relatedTools: ["http-headers-checker", "url-encoder", "json-formatter", "port-dictionary"],
    extraFaqs: [
      {
        question: {
          ko: "200 OK와 204 No Content의 차이는?",
          en: "What is the difference between 200 OK and 204 No Content?",
        },
        answer: {
          ko: "200 OK는 요청이 성공하고 응답 본문에 데이터가 포함됩니다. 204 No Content는 요청은 성공했지만 반환할 데이터가 없을 때 사용합니다. DELETE 요청 성공 시 204를 반환하는 것이 일반적이며, PUT으로 업데이트 후 별도의 응답 본문이 불필요할 때도 사용됩니다.",
          en: "200 OK means the request succeeded and the response body contains data. 204 No Content means the request succeeded but there is no data to return. Commonly returned after a successful DELETE request, or after a PUT update when no response body is needed.",
        },
      },
      {
        question: {
          ko: "429 Too Many Requests는 어떤 상황에서 발생하나요?",
          en: "When does a 429 Too Many Requests status occur?",
        },
        answer: {
          ko: "429 상태 코드는 API 요율 제한(Rate Limiting)에 도달했을 때 반환됩니다. Retry-After 헤더를 확인하여 재요청 가능 시점을 파악할 수 있습니다. API 호출 빈도를 줄이거나, 지수 백오프(Exponential Backoff) 전략으로 재시도하는 것이 권장됩니다.",
          en: "The 429 status code is returned when an API rate limit is reached. Check the Retry-After header to determine when you can retry. Reducing API call frequency or using an exponential backoff strategy for retries is recommended.",
        },
      },
      {
        question: {
          ko: "상태 코드 418 'I'm a teapot'은 실제로 사용되나요?",
          en: "Is status code 418 'I'm a teapot' actually used?",
        },
        answer: {
          ko: "418 I'm a Teapot은 1998년 만우절 RFC 2324(Hyper Text Coffee Pot Control Protocol)에서 장난으로 정의된 코드입니다. 공식 HTTP 표준은 아니지만, Google을 비롯한 일부 서비스에서 이스터 에그로 구현되어 있습니다. 실제 프로덕션 API에서는 사용하지 않는 것이 좋습니다.",
          en: "418 I'm a Teapot was defined as a joke in the 1998 April Fools' RFC 2324 (Hyper Text Coffee Pot Control Protocol). While not an official HTTP standard, some services including Google implement it as an Easter egg. It should not be used in production APIs.",
        },
      },
    ],
  },

  "vlsm-calculator": {
    howTo: {
      steps: [
        {
          ko: "기본 네트워크 주소와 CIDR 프리픽스(예: 192.168.1.0/24)를 입력합니다.",
          en: "Enter the base network address and CIDR prefix (e.g., 192.168.1.0/24).",
        },
        {
          ko: "각 서브넷에 필요한 호스트 수를 입력합니다 (예: 100, 50, 25, 10).",
          en: "Enter the required host count for each subnet (e.g., 100, 50, 25, 10).",
        },
        {
          ko: "계산 결과에서 각 서브넷의 네트워크 주소, 프리픽스, 호스트 범위를 확인합니다.",
          en: "Review the calculated network address, prefix, and host range for each subnet.",
        },
        {
          ko: "할당 결과를 네트워크 구성도에 반영하고, 낭비되는 IP 수를 확인합니다.",
          en: "Apply the allocation results to your network diagram and check wasted IP counts.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: { ko: "FLSM vs VLSM", en: "FLSM vs. VLSM" },
        description: {
          ko: "FLSM(Fixed Length Subnet Masking)은 모든 서브넷에 동일한 프리픽스 길이를 사용하여 IP 낭비가 큽니다. VLSM은 각 서브넷에 필요한 만큼만 할당하여 IP 주소 활용 효율을 극대화합니다.",
          en: "FLSM (Fixed Length Subnet Masking) uses the same prefix length for all subnets, leading to significant IP waste. VLSM allocates only what each subnet needs, maximizing IP address utilization efficiency.",
        },
      },
      {
        title: { ko: "라우팅과 서브넷 설계", en: "Routing and Subnet Design" },
        description: {
          ko: "VLSM을 사용하면 라우팅 프로토콜(OSPF, EIGRP 등)이 클래스리스 라우팅을 지원해야 합니다. RIPv1은 VLSM을 지원하지 않으므로 RIPv2 이상을 사용해야 합니다.",
          en: "Using VLSM requires routing protocols (OSPF, EIGRP, etc.) that support classless routing. RIPv1 does not support VLSM, so RIPv2 or higher must be used.",
        },
      },
    ],
    relatedTools: ["subnet-calculator", "cidr-to-range", "ip-lookup"],
    extraFaqs: [
      {
        question: {
          ko: "VLSM 계산 시 호스트 수에 네트워크/브로드캐스트 주소가 포함되나요?",
          en: "Does the host count in VLSM include network/broadcast addresses?",
        },
        answer: {
          ko: "아니요, 입력하는 호스트 수는 실제 사용 가능한 호스트만 의미합니다. 계산기는 네트워크 주소와 브로드캐스트 주소를 자동으로 추가하여 필요한 프리픽스 길이를 결정합니다. 예를 들어 100개의 호스트가 필요하면 /25(126개 호스트)가 할당됩니다.",
          en: "No, the input host count refers only to usable hosts. The calculator automatically accounts for network and broadcast addresses to determine the required prefix length. For example, if 100 hosts are needed, a /25 (126 usable hosts) is allocated.",
        },
      },
      {
        question: {
          ko: "VLSM 설계에서 Point-to-Point 링크는 어떻게 처리하나요?",
          en: "How are point-to-point links handled in VLSM design?",
        },
        answer: {
          ko: "라우터 간 직접 연결(Point-to-Point 링크)은 일반적으로 /30 서브넷(2개 사용 가능 호스트)을 할당합니다. RFC 3021에 따라 /31도 사용 가능하지만, 장비 호환성을 확인해야 합니다. VLSM 계산 시 이러한 링크를 별도 서브넷으로 포함시켜야 합니다.",
          en: "Router-to-router point-to-point links typically use a /30 subnet (2 usable hosts). Per RFC 3021, /31 can also be used but equipment compatibility must be verified. These links should be included as separate subnets in VLSM calculations.",
        },
      },
      {
        question: {
          ko: "VLSM으로 할당한 뒤 주소가 부족하면 어떻게 하나요?",
          en: "What if I run out of addresses after VLSM allocation?",
        },
        answer: {
          ko: "초기 네트워크 블록이 부족할 경우 더 큰 CIDR 블록으로 교체하거나, 추가 블록을 확보해야 합니다. 설계 시 향후 성장을 감안하여 20~30% 여유 공간을 두는 것이 권장됩니다. 또한 각 서브넷 사이에 빈 공간을 확보해두면 추후 확장이 용이합니다.",
          en: "If the initial network block is insufficient, switch to a larger CIDR block or acquire additional blocks. It's recommended to reserve 20-30% extra space for future growth during design. Leaving gaps between subnets also makes future expansion easier.",
        },
      },
    ],
  },

  "whois-lookup": {
    howTo: {
      steps: [
        {
          ko: "조회할 도메인 이름(예: example.com)을 입력합니다.",
          en: "Enter the domain name to look up (e.g., example.com).",
        },
        {
          ko: "RDAP를 통해 도메인 등록 정보를 실시간으로 조회합니다.",
          en: "The tool queries domain registration info in real time via RDAP.",
        },
        {
          ko: "등록자, 등록 기관, 등록/만료일, 네임서버 정보를 확인합니다.",
          en: "Review registrant, registrar, registration/expiry dates, and nameserver details.",
        },
        {
          ko: "도메인 상태 코드를 확인하여 현재 도메인의 잠금/해제 상태를 파악합니다.",
          en: "Check domain status codes to understand the current lock/unlock state.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: { ko: "도메인 상태 코드(EPP Status)", en: "Domain Status Codes (EPP Status)" },
        description: {
          ko: "도메인의 현재 상태를 나타내는 코드입니다. clientTransferProhibited(이전 잠금), serverHold(서버에 의한 보류), ok(정상) 등이 있습니다. 여러 상태가 동시에 적용될 수 있으며, 도메인 보안과 관리 상태를 파악하는 데 중요합니다.",
          en: "Codes indicating the current state of a domain. Examples include clientTransferProhibited (transfer lock), serverHold (held by server), and ok (normal). Multiple statuses can apply simultaneously and are essential for understanding domain security and management state.",
        },
      },
      {
        title: { ko: "도메인 수명 주기", en: "Domain Lifecycle" },
        description: {
          ko: "도메인은 등록(Active) → 만료(Expired) → 유예 기간(Grace Period) → 상환 기간(Redemption Period) → 삭제 대기(Pending Delete) → 삭제(Available) 순서의 수명 주기를 거칩니다. 만료 전 갱신이 중요합니다.",
          en: "Domains go through a lifecycle: Active → Expired → Grace Period → Redemption Period → Pending Delete → Available. Renewing before expiration is crucial to avoid losing the domain.",
        },
      },
      {
        title: { ko: "레지스트리와 레지스트라", en: "Registry vs. Registrar" },
        description: {
          ko: "레지스트리(Registry)는 TLD(.com, .net 등)를 관리하는 기관(예: Verisign)입니다. 레지스트라(Registrar)는 사용자에게 도메인을 판매하는 업체(예: GoDaddy, Namecheap)입니다. 레지스트라는 레지스트리에 등록을 대행합니다.",
          en: "A registry manages a TLD (.com, .net, etc.), such as Verisign. A registrar sells domains to users, such as GoDaddy or Namecheap. Registrars act as intermediaries, registering domains with the registry on behalf of users.",
        },
      },
    ],
    relatedTools: ["dns-lookup", "ssl-checker", "http-headers-checker", "ip-lookup", "mac-oui-lookup"],
    extraFaqs: [
      {
        question: {
          ko: "도메인 만료일이 지나면 바로 삭제되나요?",
          en: "Is a domain deleted immediately after expiration?",
        },
        answer: {
          ko: "아니요, 대부분의 TLD에서 만료 후 약 30~45일의 갱신 유예 기간(Renewal Grace Period)이 있고, 이후 약 30일의 상환 기간(Redemption Period)이 있습니다. 상환 기간에는 추가 비용으로 복구할 수 있습니다. 이 기간이 지나면 약 5일간 삭제 대기(Pending Delete) 후 누구나 등록 가능합니다.",
          en: "No, most TLDs provide a ~30-45 day Renewal Grace Period after expiration, followed by a ~30-day Redemption Period where recovery is possible at an additional cost. After that, there is a ~5-day Pending Delete phase, after which the domain becomes available for anyone to register.",
        },
      },
      {
        question: {
          ko: "WHOIS 정보 보호(Privacy Protection)란 무엇인가요?",
          en: "What is WHOIS privacy protection?",
        },
        answer: {
          ko: "WHOIS 정보 보호(또는 도메인 프라이버시)는 도메인 등록자의 개인 정보(이름, 주소, 이메일, 전화번호)를 대리 정보로 대체하여 공개 WHOIS 데이터베이스에서 숨기는 서비스입니다. 스팸, 사회공학 공격, 개인정보 유출을 방지합니다.",
          en: "WHOIS privacy protection (or domain privacy) replaces the registrant's personal information (name, address, email, phone) with proxy details in the public WHOIS database. It prevents spam, social engineering attacks, and personal data exposure.",
        },
      },
      {
        question: {
          ko: "국가 코드 도메인(ccTLD)과 일반 도메인(gTLD)의 차이는?",
          en: "What is the difference between ccTLD and gTLD?",
        },
        answer: {
          ko: "ccTLD(Country Code TLD)는 .kr(한국), .jp(일본), .uk(영국) 등 국가별 할당된 도메인입니다. gTLD(Generic TLD)는 .com, .net, .org 등 범용 도메인입니다. ccTLD는 해당 국가의 기관이 관리하며, 등록 조건이 다를 수 있습니다.",
          en: "A ccTLD (Country Code TLD) is assigned to specific countries like .kr (Korea), .jp (Japan), .uk (UK). A gTLD (Generic TLD) includes general domains like .com, .net, .org. ccTLDs are managed by national organizations and may have different registration requirements.",
        },
      },
    ],
  },

  "http-headers-checker": {
    howTo: {
      steps: [
        {
          ko: "검사할 웹사이트 URL(예: https://example.com)을 입력합니다.",
          en: "Enter the website URL to inspect (e.g., https://example.com).",
        },
        {
          ko: "HEAD 요청을 통해 응답 헤더와 상태 코드를 조회합니다.",
          en: "A HEAD request retrieves response headers and the status code.",
        },
        {
          ko: "보안 헤더(HSTS, CSP, X-Frame-Options 등) 존재 여부를 확인합니다.",
          en: "Check the presence of security headers (HSTS, CSP, X-Frame-Options, etc.).",
        },
        {
          ko: "누락된 보안 헤더를 웹 서버 설정에 추가하여 보안을 강화합니다.",
          en: "Add missing security headers to your web server configuration to improve security.",
        },
      ],
    },
    relatedConcepts: [
      {
        title: { ko: "콘텐츠 보안 정책(CSP)", en: "Content Security Policy (CSP)" },
        description: {
          ko: "CSP는 브라우저에서 허용하는 리소스 출처를 제한하는 HTTP 헤더입니다. script-src, style-src, img-src 등 지시어를 통해 XSS 공격을 효과적으로 방어합니다. 엄격한 CSP 설정은 가장 강력한 클라이언트 사이드 보안 대책 중 하나입니다.",
          en: "CSP is an HTTP header that restricts which resource origins the browser allows. Directives like script-src, style-src, and img-src effectively defend against XSS attacks. A strict CSP configuration is one of the most powerful client-side security measures.",
        },
      },
      {
        title: { ko: "CORS(Cross-Origin Resource Sharing)", en: "CORS (Cross-Origin Resource Sharing)" },
        description: {
          ko: "CORS는 브라우저가 다른 출처(도메인)의 리소스 접근을 제어하는 메커니즘입니다. Access-Control-Allow-Origin 등의 헤더로 허용된 출처를 지정합니다. API 서버와 프론트엔드 도메인이 다를 때 반드시 설정해야 합니다.",
          en: "CORS is a browser mechanism controlling access to resources from different origins (domains). Headers like Access-Control-Allow-Origin specify allowed origins. Required when the API server and frontend are on different domains.",
        },
      },
      {
        title: { ko: "캐시 제어(Cache-Control)", en: "Cache Control" },
        description: {
          ko: "Cache-Control 헤더는 브라우저와 CDN의 캐시 동작을 제어합니다. max-age로 캐시 유효 시간을, no-cache로 매 요청마다 재검증을, no-store로 캐시 저장 금지를 설정합니다. 적절한 캐시 전략은 성능과 데이터 일관성 모두에 중요합니다.",
          en: "The Cache-Control header governs caching behavior in browsers and CDNs. max-age sets cache duration, no-cache requires revalidation on every request, and no-store prevents caching entirely. Proper cache strategy is critical for both performance and data consistency.",
        },
      },
    ],
    relatedTools: ["ssl-checker", "csp-generator", "http-status-dictionary", "whois-lookup"],
    extraFaqs: [
      {
        question: {
          ko: "X-Frame-Options와 CSP frame-ancestors의 차이는?",
          en: "What is the difference between X-Frame-Options and CSP frame-ancestors?",
        },
        answer: {
          ko: "X-Frame-Options는 DENY(모든 프레임 차단)와 SAMEORIGIN(같은 출처만 허용) 두 가지 옵션만 제공합니다. CSP의 frame-ancestors는 더 세밀한 제어가 가능하여 특정 도메인을 지정할 수 있습니다. frame-ancestors가 더 현대적인 표준이며, 두 헤더가 동시에 있으면 frame-ancestors가 우선합니다.",
          en: "X-Frame-Options offers only DENY (block all framing) and SAMEORIGIN (allow same-origin only). CSP's frame-ancestors provides finer control, allowing specific domains. frame-ancestors is the modern standard, and when both headers are present, frame-ancestors takes precedence.",
        },
      },
      {
        question: {
          ko: "Server 헤더를 숨기는 것이 왜 권장되나요?",
          en: "Why is it recommended to hide the Server header?",
        },
        answer: {
          ko: "Server 헤더는 웹 서버 소프트웨어와 버전 정보를 노출합니다(예: Apache/2.4.41, nginx/1.18.0). 공격자가 이 정보로 알려진 취약점을 대상으로 공격할 수 있으므로, 프로덕션 환경에서는 Server 헤더를 제거하거나 최소화하는 것이 보안 모범 사례입니다.",
          en: "The Server header reveals web server software and version info (e.g., Apache/2.4.41, nginx/1.18.0). Attackers can use this to target known vulnerabilities. Removing or minimizing the Server header in production is a security best practice.",
        },
      },
      {
        question: {
          ko: "Referrer-Policy 헤더의 역할은 무엇인가요?",
          en: "What does the Referrer-Policy header do?",
        },
        answer: {
          ko: "Referrer-Policy는 브라우저가 다른 페이지로 이동할 때 Referer 헤더에 얼마나 많은 정보를 포함할지 제어합니다. strict-origin-when-cross-origin(권장)은 같은 출처에서는 전체 URL을, 다른 출처에서는 출처만 전송합니다. no-referrer는 Referer 정보를 완전히 제거합니다.",
          en: "Referrer-Policy controls how much information the browser includes in the Referer header when navigating. strict-origin-when-cross-origin (recommended) sends the full URL for same-origin and only the origin for cross-origin. no-referrer removes Referer information entirely.",
        },
      },
    ],
  },
};
