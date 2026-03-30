import type { Metadata } from "next";

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

export default function TermsPage() {
  return (
    <article
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "2rem 1rem 4rem",
      }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          이용약관
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--text-tertiary)" }}>
          최종 업데이트: 2025년 1월 1일
        </p>
      </header>

      <div
        style={{
          lineHeight: 1.8,
          color: "var(--text-secondary)",
          fontSize: "0.9375rem",
        }}
      >
        <Section title="1. 약관의 적용">
          <p>
            본 이용약관(이하 &quot;약관&quot;)은 NetTools(이하 &quot;서비스&quot;)에서 제공하는 모든 온라인
            도구 및 콘텐츠에 적용됩니다. 서비스를 이용함으로써 본 약관에 동의하는 것으로
            간주됩니다.
          </p>
        </Section>

        <Section title="2. 서비스 제공">
          <p>NetTools는 다음 서비스를 무료로 제공합니다:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>서브넷 계산기, CIDR 변환기 등 네트워크 계산 도구</li>
            <li style={{ marginBottom: "0.5rem" }}>IP 주소 조회, MAC OUI 조회 등 네트워크 정보 도구</li>
            <li style={{ marginBottom: "0.5rem" }}>SSL 인증서 확인, DNS 조회 등 보안 도구</li>
            <li style={{ marginBottom: "0.5rem" }}>Base64, 해시 생성기 등 인코딩/변환 도구</li>
            <li style={{ marginBottom: "0.5rem" }}>기타 네트워크 및 보안 관련 유틸리티</li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>
            서비스는 사전 예고 없이 기능이 추가되거나 변경될 수 있으며, 서비스의 일부
            또는 전체가 중단될 수 있습니다.
          </p>
        </Section>

        <Section title="3. 이용자의 의무">
          <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>서비스를 불법적인 목적으로 사용하는 행위</li>
            <li style={{ marginBottom: "0.5rem" }}>타인의 개인정보를 무단으로 조회하거나 활용하는 행위</li>
            <li style={{ marginBottom: "0.5rem" }}>서비스 운영을 방해하는 행위 (DDoS, 크롤링 등)</li>
            <li style={{ marginBottom: "0.5rem" }}>서비스의 소스코드를 무단으로 복제하거나 배포하는 행위</li>
            <li style={{ marginBottom: "0.5rem" }}>광고를 차단하거나 우회하는 행위</li>
          </ul>
        </Section>

        <Section title="4. 서비스 이용 제한">
          <p>
            자동화된 스크립트, 봇, 크롤러 등을 이용한 대량 요청은 금지됩니다. 서비스의
            안정적인 운영을 위해 과도한 요청을 차단할 수 있습니다.
          </p>
        </Section>

        <Section title="5. 지적 재산권">
          <p>
            서비스의 모든 콘텐츠, 디자인, 코드, 상표 등은 NetTools 또는 해당 권리자의
            지적 재산권에 의해 보호됩니다. 이용자는 서비스 이용 목적 외의 콘텐츠 복제,
            배포, 수정, 상업적 이용을 할 수 없습니다.
          </p>
        </Section>

        <Section title="6. 면책 조항">
          <p>
            NetTools는 다음 사항에 대해 책임을 지지 않습니다:
          </p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              서비스 이용 결과의 정확성 및 완전성 (도구 결과값은 참고 목적으로만 사용하세요)
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              서비스 중단 또는 오류로 인한 손해
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              제3자 서비스(Google AdSense 등) 이용으로 인한 문제
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              이용자의 서비스 남용으로 인한 결과
            </li>
          </ul>
        </Section>

        <Section title="7. 외부 링크">
          <p>
            서비스 내 외부 링크는 정보 제공 목적으로만 제공되며, 외부 사이트의 내용이나
            정책에 대해 책임을 지지 않습니다.
          </p>
        </Section>

        <Section title="8. 광고">
          <p>
            서비스는 Google AdSense를 통한 광고를 포함합니다. 광고 내용은 Google의 정책에
            따라 게재되며, NetTools는 광고 콘텐츠의 정확성에 대한 책임을 지지 않습니다.
          </p>
        </Section>

        <Section title="9. 준거법 및 분쟁 해결">
          <p>
            본 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 관할 법원은 대한민국
            법원으로 합니다.
          </p>
        </Section>

        <Section title="10. 약관 변경">
          <p>
            NetTools는 필요한 경우 본 약관을 변경할 수 있습니다. 변경된 약관은 서비스
            내 공지 후 효력이 발생합니다. 변경 후 계속 서비스를 이용하면 변경된 약관에
            동의한 것으로 간주됩니다.
          </p>
        </Section>

        <Section title="11. 문의">
          <p>약관에 관한 문의는 아래로 연락주세요.</p>
          <p style={{ marginTop: "0.75rem" }}>
            이메일:{" "}
            <a
              href="mailto:legal@beomanro.com"
              style={{ color: "#3b82f6" }}
            >
              legal@beomanro.com
            </a>
          </p>
        </Section>
      </div>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: "0.75rem",
          paddingBottom: "0.5rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
