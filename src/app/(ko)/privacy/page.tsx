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
            <li style={liStyle}>
              <strong>호스팅 플랫폼의 측정 정보:</strong> 페이지 주소, 유입 경로, 브라우저
              종류, 렌더링 성능 지표. 쿠키·브라우저 지문을 쓰지 않습니다 (자세한 내용은
              아래 4항)
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
            <li style={liStyle}>
              <strong>Hosting platform measurements:</strong> page address, referrer,
              browser type, and rendering performance metrics. No cookies and no browser
              fingerprint are used (see section 4 below)
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
            따라서 맞춤 광고 옵트아웃 절차도 필요하지 않습니다.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            <strong>분석·추적 스크립트를 직접 넣지 않습니다.</strong> Google Analytics,
            태그 매니저, 광고 네트워크의 픽셀·비콘을 이 사이트에 추가하지 않았습니다.
            방문자를 식별하거나 프로필을 만들지 않으며, 다른 사이트에서의 활동과 연결하지
            않습니다.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            <strong>다만 호스팅 플랫폼이 자체 측정 스크립트를 덧붙입니다.</strong> 이
            사이트는 Cloudflare 에서 제공되며, Cloudflare 는 페이지 응답에 자사 측정
            스크립트(Web Analytics)를 자동으로 붙입니다. 이 스크립트는 페이지 주소, 유입
            경로(referrer), 브라우저 종류, 화면 렌더링 성능 지표를 Cloudflare 로 보냅니다.
            쿠키나 로컬 스토리지를 쓰지 않고, 브라우저 지문(fingerprint)을 만들지 않으며,
            사이트 간 추적을 하지 않습니다. Cloudflare 는 이 사이트의 호스팅·CDN 사업자라
            이 정보의 대부분은 페이지를 전달하는 과정에서 이미 처리됩니다. 운영자는 이
            데이터를 어떤 글이 얼마나 읽히는지 집계로만 봅니다.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            <strong>도구에 입력한 값은 여기에 포함되지 않습니다.</strong> 위 스크립트가
            기록하는 것은 페이지 방문뿐입니다. 도구에 넣은 파일·텍스트와 계산 결과는
            브라우저 밖으로 나가지 않습니다.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            이는 비용 절감을 위한 선택이 아니라 서비스 성격에서 나온 원칙입니다. SBOM 처럼
            내부 구성이 드러나는 파일을 브라우저에서 다루는 도구를 제공하면서, 같은 페이지에
            광고망 추적 스크립트를 싣는 것은 앞뒤가 맞지 않습니다.
          </p>
        </>
      ),
      en: (
        <>
          <p>
            <strong>NetTools does not serve advertising.</strong> No banner ads, no
            third-party ad networks including AdSense, and no behavioral or personalized
            advertising of any kind. As a result, there is no personalized-ad opt-out to
            perform.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            <strong>We do not add analytics or tracking scripts ourselves.</strong> We have
            not added Google Analytics, a tag manager, or ad-network pixels and beacons to
            this site. We do not identify visitors, build profiles, or link your activity
            here to your activity elsewhere.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            <strong>The hosting platform does add its own measurement script.</strong> This
            site is served by Cloudflare, which automatically attaches its measurement
            script (Web Analytics) to page responses. It reports the page address, the
            referrer, the browser type, and rendering performance metrics to Cloudflare. It
            uses no cookies or local storage, builds no browser fingerprint, and does no
            cross-site tracking. Cloudflare is this site&apos;s host and CDN, so most of
            this information is already processed in the course of delivering the page. We
            look at the result only as aggregate counts of how often each page is read.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            <strong>What you type into a tool is not part of this.</strong> The script
            above records page visits only. Files and text you put into a tool, and the
            results it computes, never leave your browser.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            This is a consequence of what the Service is, not a cost decision. Offering
            tools that handle files revealing internal composition — an SBOM, for example —
            in your browser, while loading ad-network trackers on the same page, would be
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
            이것이 전부입니다. 4항의 호스팅 플랫폼 측정 스크립트도 쿠키나 로컬 스토리지를
            쓰지 않으므로, 추적 목적으로 저장되는 값은 없습니다.
          </p>
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
            That is the whole list. The hosting platform&apos;s measurement script
            described in section 4 uses no cookies or local storage either, so nothing is
            stored for tracking purposes.
          </p>
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
