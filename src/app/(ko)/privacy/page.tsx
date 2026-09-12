import type { Metadata } from "next";
import { LegalDoc, type DocSection } from "@/components/layout/LegalDoc";
import { generateLegalMetadata } from "@/lib/seo";

export const metadata: Metadata = generateLegalMetadata("privacy", "ko");

const ulStyle = { marginTop: "0.75rem", paddingLeft: "1.5rem" } as const;
const liStyle = { marginBottom: "0.5rem" } as const;
const linkStyle = { color: "#3b82f6" } as const;

const sections: DocSection[] = [
  {
    title: { ko: "1. 개요", en: "1. Overview" },
    body: {
      ko: (
        <p>
          NetTools(이하 &quot;서비스&quot;)는 네트워크 엔지니어 및 보안 전문가를 위한
          무료 온라인 도구를 제공합니다. 본 개인정보처리방침은 서비스 이용 중 수집되는
          정보와 그 활용 방법에 대해 설명합니다.
        </p>
      ),
      en: (
        <p>
          NetTools (the &quot;Service&quot;) provides free online tools for network
          engineers and security professionals. This Privacy Policy explains what
          information is collected while using the Service and how it is used.
        </p>
      ),
    },
  },
  {
    title: { ko: "2. 수집하는 정보", en: "2. Information We Collect" },
    body: {
      ko: (
        <>
          <p>NetTools는 다음과 같은 정보를 수집할 수 있습니다:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              <strong>자동 수집 정보:</strong> 접속 IP 주소, 브라우저 유형, 운영체제,
              방문 페이지, 방문 일시 등 서버 로그 정보
            </li>
            <li style={liStyle}>
              <strong>쿠키 및 유사 기술:</strong> 언어 설정 저장 등 서비스 개선을 위한
              로컬 스토리지 사용
            </li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>
            <strong>도구 입력값은 수집하지 않습니다.</strong> 서브넷 계산, IP 조회 등
            모든 도구는 브라우저 내에서 처리되며 서버로 전송되지 않습니다.
          </p>
        </>
      ),
      en: (
        <>
          <p>NetTools may collect the following information:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              <strong>Automatically collected:</strong> server log data such as your IP
              address, browser type, operating system, pages visited, and visit time
            </li>
            <li style={liStyle}>
              <strong>Cookies and similar technologies:</strong> local storage used to
              improve the Service, such as saving your language preference
            </li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>
            <strong>We do not collect tool inputs.</strong> All tools — subnet
            calculation, IP lookup, and so on — run entirely in your browser and are not
            sent to any server.
          </p>
        </>
      ),
    },
  },
  {
    title: { ko: "3. 정보 이용 목적", en: "3. How We Use Information" },
    body: {
      ko: (
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li style={liStyle}>서비스 운영 및 품질 개선</li>
          <li style={liStyle}>이용 통계 분석</li>
          <li style={liStyle}>법적 의무 이행</li>
        </ul>
      ),
      en: (
        <ul style={{ paddingLeft: "1.5rem" }}>
          <li style={liStyle}>Operating and improving the Service</li>
          <li style={liStyle}>Analyzing usage statistics</li>
          <li style={liStyle}>Meeting legal obligations</li>
        </ul>
      ),
    },
  },
  {
    title: {
      ko: "4. 광고 및 제3자 추적",
      en: "4. Advertising and Third-Party Tracking",
    },
    body: {
      ko: (
        <>
          <p>
            <strong>NetTools는 광고를 게재하지 않습니다.</strong> 배너 광고, 애드센스를
            포함한 제3자 광고 네트워크, 행동 기반 맞춤 광고를 일체 사용하지 않습니다.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            <strong>분석·추적 스크립트도 넣지 않습니다.</strong> Google Analytics 를 비롯한
            방문자 추적 도구, 광고 네트워크의 쿠키·웹 비콘·픽셀을 사용하지 않으므로, 이
            사이트를 방문했다는 사실이 제3자에게 전달되지 않습니다. 따라서 맞춤 광고
            옵트아웃 절차도 필요하지 않습니다.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            이는 비용 절감을 위한 선택이 아니라 서비스 성격에서 나온 원칙입니다. SBOM 처럼
            내부 구성이 드러나는 파일을 브라우저에서 다루는 도구를 제공하면서, 같은 페이지에
            제3자 추적 스크립트를 싣는 것은 앞뒤가 맞지 않습니다.
          </p>
        </>
      ),
      en: (
        <>
          <p>
            <strong>NetTools does not serve advertising.</strong> No banner ads, no
            third-party ad networks including AdSense, and no behavioral or personalized
            advertising of any kind.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            <strong>We also do not load analytics or tracking scripts.</strong> There is no
            Google Analytics or comparable visitor tracking, and no ad-network cookies, web
            beacons, or pixels — so the fact that you visited this site is not shared with
            any third party. As a result, there is no personalized-ad opt-out to perform.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            This is a consequence of what the Service is, not a cost decision. Offering
            tools that handle files revealing internal composition — an SBOM, for example —
            in your browser, while loading third-party trackers on the same page, would be
            self-contradictory.
          </p>
        </>
      ),
    },
  },
  {
    title: { ko: "5. 쿠키 사용", en: "5. Cookies" },
    body: {
      ko: (
        <>
          <p>서비스는 다음 목적으로 쿠키 및 로컬 스토리지를 사용합니다:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>언어 설정 저장 (한국어/영어)</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>
            브라우저 설정을 통해 쿠키를 비활성화할 수 있으나, 일부 서비스 기능에
            영향을 줄 수 있습니다.
          </p>
        </>
      ),
      en: (
        <>
          <p>The Service uses cookies and local storage for the following purposes:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Saving your language preference (Korean/English)</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>
            You can disable cookies through your browser settings, but this may affect
            some features of the Service.
          </p>
        </>
      ),
    },
  },
  {
    title: { ko: "6. 개인정보 보유 및 파기", en: "6. Data Retention and Disposal" },
    body: {
      ko: (
        <p>
          서버 로그는 서비스 운영에 필요한 최소한의 기간 동안만 보유되며, 목적 달성
          후 안전하게 파기됩니다. 로컬 스토리지에 저장된 설정값은 사용자가 직접
          브라우저에서 삭제할 수 있습니다.
        </p>
      ),
      en: (
        <p>
          Server logs are retained only for the minimum period necessary to operate the
          Service and are securely disposed of once their purpose is fulfilled. Settings
          stored in local storage can be deleted by the user directly in the browser.
        </p>
      ),
    },
  },
  {
    title: { ko: "7. 이용자 권리", en: "7. Your Rights" },
    body: {
      ko: (
        <>
          <p>이용자는 다음 권리를 가집니다:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>개인정보 열람 요청</li>
            <li style={liStyle}>개인정보 수정 요청</li>
            <li style={liStyle}>개인정보 삭제 요청</li>
            <li style={liStyle}>처리 정지 요청</li>
          </ul>
        </>
      ),
      en: (
        <>
          <p>You have the following rights:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>Request access to your personal data</li>
            <li style={liStyle}>Request correction of your personal data</li>
            <li style={liStyle}>Request deletion of your personal data</li>
            <li style={liStyle}>Request that processing be stopped</li>
          </ul>
        </>
      ),
    },
  },
  {
    title: { ko: "8. 개인정보 보호책임자", en: "8. Privacy Officer" },
    body: {
      ko: (
        <>
          <p>개인정보 처리에 관한 문의사항은 아래로 연락주시기 바랍니다.</p>
          <p style={{ marginTop: "0.75rem" }}>
            이메일:{" "}
            <a href="mailto:privacy@beomanro.com" style={linkStyle}>privacy@beomanro.com</a>
          </p>
        </>
      ),
      en: (
        <>
          <p>For questions about how we handle personal data, please contact us.</p>
          <p style={{ marginTop: "0.75rem" }}>
            Email:{" "}
            <a href="mailto:privacy@beomanro.com" style={linkStyle}>privacy@beomanro.com</a>
          </p>
        </>
      ),
    },
  },
  {
    title: { ko: "9. 방침 변경", en: "9. Changes to This Policy" },
    body: {
      ko: (
        <p>
          본 방침은 법률 또는 서비스 변경에 따라 업데이트될 수 있습니다. 중요한 변경
          사항은 서비스 공지를 통해 안내드립니다.
        </p>
      ),
      en: (
        <p>
          This policy may be updated to reflect changes in law or in the Service.
          Significant changes will be announced within the Service.
        </p>
      ),
    },
  },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      title={{ ko: "개인정보처리방침", en: "Privacy Policy" }}
      updated={{ ko: "최종 업데이트: 2026년 6월 24일", en: "Last updated: June 24, 2026" }}
      sections={sections}
    />
  );
}
