import type { Metadata } from "next";
import { LegalDoc, type DocSection } from "@/components/layout/LegalDoc";

export const metadata: Metadata = {
  title: "이용약관 | NetTools",
  description:
    "NetTools 이용약관. 서비스 이용 조건, 금지 행위, 면책 조항 등을 안내합니다.",
  openGraph: {
    title: "이용약관 | NetTools",
    description: "NetTools 서비스 이용약관을 확인하세요.",
    type: "website",
  },
  alternates: {
    canonical: "/terms",
  },
};

const ulStyle = { marginTop: "0.75rem", paddingLeft: "1.5rem" } as const;
const liStyle = { marginBottom: "0.5rem" } as const;

const sections: DocSection[] = [
  {
    title: { ko: "1. 약관의 적용", en: "1. Acceptance of Terms" },
    body: {
      ko: (
        <p>
          본 이용약관(이하 &quot;약관&quot;)은 NetTools(이하 &quot;서비스&quot;)에서 제공하는 모든 온라인
          도구 및 콘텐츠에 적용됩니다. 서비스를 이용함으로써 본 약관에 동의하는 것으로
          간주됩니다.
        </p>
      ),
      en: (
        <p>
          These Terms of Service (the &quot;Terms&quot;) apply to all online tools and
          content provided by NetTools (the &quot;Service&quot;). By using the Service, you
          are deemed to have agreed to these Terms.
        </p>
      ),
    },
  },
  {
    title: { ko: "2. 서비스 제공", en: "2. Services Provided" },
    body: {
      ko: (
        <>
          <p>NetTools는 다음 서비스를 무료로 제공합니다:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>서브넷 계산기, CIDR 변환기 등 네트워크 계산 도구</li>
            <li style={liStyle}>IP 주소 조회, MAC OUI 조회 등 네트워크 정보 도구</li>
            <li style={liStyle}>SSL 인증서 확인, DNS 조회 등 보안 도구</li>
            <li style={liStyle}>Base64, 해시 생성기 등 인코딩/변환 도구</li>
            <li style={liStyle}>기타 네트워크 및 보안 관련 유틸리티</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>
            서비스는 사전 예고 없이 기능이 추가되거나 변경될 수 있으며, 서비스의 일부
            또는 전체가 중단될 수 있습니다.
          </p>
        </>
      ),
      en: (
        <>
          <p>NetTools provides the following services free of charge:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Network calculation tools such as the subnet calculator and CIDR converter</li>
            <li style={liStyle}>Network information tools such as IP address lookup and MAC OUI lookup</li>
            <li style={liStyle}>Security tools such as SSL certificate checking and DNS lookup</li>
            <li style={liStyle}>Encoding/conversion tools such as Base64 and hash generators</li>
            <li style={liStyle}>Other network- and security-related utilities</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>
            Features may be added or changed without prior notice, and the Service may
            be partially or entirely discontinued.
          </p>
        </>
      ),
    },
  },
  {
    title: { ko: "3. 이용자의 의무", en: "3. User Obligations" },
    body: {
      ko: (
        <>
          <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>서비스를 불법적인 목적으로 사용하는 행위</li>
            <li style={liStyle}>타인의 개인정보를 무단으로 조회하거나 활용하는 행위</li>
            <li style={liStyle}>서비스 운영을 방해하는 행위 (DDoS, 크롤링 등)</li>
            <li style={liStyle}>서비스의 소스코드를 무단으로 복제하거나 배포하는 행위</li>
            <li style={liStyle}>광고를 차단하거나 우회하는 행위</li>
          </ul>
        </>
      ),
      en: (
        <>
          <p>Users must not engage in any of the following:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Using the Service for any unlawful purpose</li>
            <li style={liStyle}>Looking up or using another person&apos;s personal data without authorization</li>
            <li style={liStyle}>Interfering with the operation of the Service (DDoS, scraping, etc.)</li>
            <li style={liStyle}>Reproducing or distributing the Service&apos;s source code without authorization</li>
            <li style={liStyle}>Blocking or circumventing advertisements</li>
          </ul>
        </>
      ),
    },
  },
  {
    title: { ko: "4. 서비스 이용 제한", en: "4. Usage Restrictions" },
    body: {
      ko: (
        <p>
          자동화된 스크립트, 봇, 크롤러 등을 이용한 대량 요청은 금지됩니다. 서비스의
          안정적인 운영을 위해 과도한 요청을 차단할 수 있습니다.
        </p>
      ),
      en: (
        <p>
          Bulk requests using automated scripts, bots, or crawlers are prohibited. To
          keep the Service stable, excessive requests may be blocked.
        </p>
      ),
    },
  },
  {
    title: { ko: "5. 지적 재산권", en: "5. Intellectual Property" },
    body: {
      ko: (
        <p>
          서비스의 모든 콘텐츠, 디자인, 코드, 상표 등은 NetTools 또는 해당 권리자의
          지적 재산권에 의해 보호됩니다. 이용자는 서비스 이용 목적 외의 콘텐츠 복제,
          배포, 수정, 상업적 이용을 할 수 없습니다.
        </p>
      ),
      en: (
        <p>
          All content, design, code, and trademarks of the Service are protected by the
          intellectual property rights of NetTools or the respective rights holders.
          Users may not reproduce, distribute, modify, or commercially exploit the
          content beyond the purpose of using the Service.
        </p>
      ),
    },
  },
  {
    title: { ko: "6. 면책 조항", en: "6. Disclaimer" },
    body: {
      ko: (
        <>
          <p>NetTools는 다음 사항에 대해 책임을 지지 않습니다:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              서비스 이용 결과의 정확성 및 완전성 (도구 결과값은 참고 목적으로만 사용하세요)
            </li>
            <li style={liStyle}>서비스 중단 또는 오류로 인한 손해</li>
            <li style={liStyle}>제3자 서비스(Google AdSense 등) 이용으로 인한 문제</li>
            <li style={liStyle}>이용자의 서비스 남용으로 인한 결과</li>
          </ul>
        </>
      ),
      en: (
        <>
          <p>NetTools is not responsible for any of the following:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              The accuracy or completeness of results (tool outputs are for reference only)
            </li>
            <li style={liStyle}>Damages caused by service interruptions or errors</li>
            <li style={liStyle}>Issues arising from third-party services (such as Google AdSense)</li>
            <li style={liStyle}>Consequences of a user&apos;s misuse of the Service</li>
          </ul>
        </>
      ),
    },
  },
  {
    title: { ko: "7. 외부 링크", en: "7. External Links" },
    body: {
      ko: (
        <p>
          서비스 내 외부 링크는 정보 제공 목적으로만 제공되며, 외부 사이트의 내용이나
          정책에 대해 책임을 지지 않습니다.
        </p>
      ),
      en: (
        <p>
          External links within the Service are provided for informational purposes
          only. We are not responsible for the content or policies of external sites.
        </p>
      ),
    },
  },
  {
    title: { ko: "8. 광고", en: "8. Advertising" },
    body: {
      ko: (
        <p>
          서비스는 Google AdSense를 통한 광고를 포함합니다. 광고 내용은 Google의 정책에
          따라 게재되며, NetTools는 광고 콘텐츠의 정확성에 대한 책임을 지지 않습니다.
        </p>
      ),
      en: (
        <p>
          The Service includes advertising served through Google AdSense. Ad content is
          delivered in accordance with Google&apos;s policies, and NetTools is not
          responsible for the accuracy of advertising content.
        </p>
      ),
    },
  },
  {
    title: { ko: "9. 준거법 및 분쟁 해결", en: "9. Governing Law and Disputes" },
    body: {
      ko: (
        <p>
          본 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 관할 법원은 대한민국
          법원으로 합니다.
        </p>
      ),
      en: (
        <p>
          These Terms are governed by and construed in accordance with the laws of the
          Republic of Korea, and any disputes shall be subject to the jurisdiction of
          the courts of the Republic of Korea.
        </p>
      ),
    },
  },
  {
    title: { ko: "10. 약관 변경", en: "10. Changes to Terms" },
    body: {
      ko: (
        <p>
          NetTools는 필요한 경우 본 약관을 변경할 수 있습니다. 변경된 약관은 서비스
          내 공지 후 효력이 발생합니다. 변경 후 계속 서비스를 이용하면 변경된 약관에
          동의한 것으로 간주됩니다.
        </p>
      ),
      en: (
        <p>
          NetTools may revise these Terms when necessary. Revised Terms take effect
          after being announced within the Service. Continuing to use the Service after
          a change constitutes acceptance of the revised Terms.
        </p>
      ),
    },
  },
  {
    title: { ko: "11. 문의", en: "11. Contact" },
    body: {
      ko: (
        <>
          <p>약관에 관한 문의는 아래로 연락주세요.</p>
          <p style={{ marginTop: "0.75rem" }}>
            이메일:{" "}
            <a href="mailto:legal@beomanro.com" style={{ color: "#3b82f6" }}>
              legal@beomanro.com
            </a>
          </p>
        </>
      ),
      en: (
        <>
          <p>For questions about these Terms, please contact us.</p>
          <p style={{ marginTop: "0.75rem" }}>
            Email:{" "}
            <a href="mailto:legal@beomanro.com" style={{ color: "#3b82f6" }}>
              legal@beomanro.com
            </a>
          </p>
        </>
      ),
    },
  },
];

export default function TermsPage() {
  return (
    <LegalDoc
      title={{ ko: "이용약관", en: "Terms of Service" }}
      updated={{ ko: "최종 업데이트: 2026년 6월 30일", en: "Last updated: June 30, 2026" }}
      sections={sections}
    />
  );
}
