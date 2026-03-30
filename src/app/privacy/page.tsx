import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | NetTools",
  description:
    "NetTools 개인정보처리방침. 사용자 데이터 처리 방식, 쿠키 사용, 광고 서비스에 대한 정보를 안내합니다.",
  openGraph: {
    title: "개인정보처리방침 | NetTools",
    description: "NetTools의 개인정보 처리 방침을 확인하세요.",
    type: "website",
  },
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
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
          개인정보처리방침
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
        <Section title="1. 개요">
          <p>
            NetTools(이하 &quot;서비스&quot;)는 네트워크 엔지니어 및 보안 전문가를 위한
            무료 온라인 도구를 제공합니다. 본 개인정보처리방침은 서비스 이용 중 수집되는
            정보와 그 활용 방법에 대해 설명합니다.
          </p>
        </Section>

        <Section title="2. 수집하는 정보">
          <p>NetTools는 다음과 같은 정보를 수집할 수 있습니다:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>자동 수집 정보:</strong> 접속 IP 주소, 브라우저 유형, 운영체제,
              방문 페이지, 방문 일시 등 서버 로그 정보
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>쿠키 및 유사 기술:</strong> 언어 설정 저장 등 서비스 개선을 위한
              로컬 스토리지 사용
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>광고 관련 정보:</strong> Google AdSense를 통해 광고 게재 목적의
              쿠키가 사용될 수 있습니다
            </li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>
            <strong>도구 입력값은 수집하지 않습니다.</strong> 서브넷 계산, IP 조회 등
            모든 도구는 브라우저 내에서 처리되며 서버로 전송되지 않습니다.
          </p>
        </Section>

        <Section title="3. 정보 이용 목적">
          <ul style={{ paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>서비스 운영 및 품질 개선</li>
            <li style={{ marginBottom: "0.5rem" }}>이용 통계 분석</li>
            <li style={{ marginBottom: "0.5rem" }}>맞춤형 광고 제공 (Google AdSense)</li>
            <li style={{ marginBottom: "0.5rem" }}>법적 의무 이행</li>
          </ul>
        </Section>

        <Section title="4. Google AdSense 및 제3자 광고">
          <p>
            NetTools는 Google AdSense를 통해 광고를 게재합니다. Google은 쿠키를 사용하여
            사용자의 이전 방문 기록을 기반으로 맞춤 광고를 표시할 수 있습니다.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            Google의 광고 쿠키 사용은{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#3b82f6" }}
            >
              Google 개인정보처리방침
            </a>
            에 따라 처리됩니다. 맞춤 광고 설정은{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#3b82f6" }}
            >
              Google 광고 설정
            </a>
            에서 변경할 수 있습니다.
          </p>
        </Section>

        <Section title="5. 쿠키 사용">
          <p>
            서비스는 다음 목적으로 쿠키 및 로컬 스토리지를 사용합니다:
          </p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              언어 설정 저장 (한국어/영어)
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              광고 게재를 위한 Google AdSense 쿠키
            </li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>
            브라우저 설정을 통해 쿠키를 비활성화할 수 있으나, 일부 서비스 기능에
            영향을 줄 수 있습니다.
          </p>
        </Section>

        <Section title="6. 개인정보 보유 및 파기">
          <p>
            서버 로그는 서비스 운영에 필요한 최소한의 기간 동안만 보유되며, 목적 달성
            후 안전하게 파기됩니다. 로컬 스토리지에 저장된 설정값은 사용자가 직접
            브라우저에서 삭제할 수 있습니다.
          </p>
        </Section>

        <Section title="7. 이용자 권리">
          <p>이용자는 다음 권리를 가집니다:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>개인정보 열람 요청</li>
            <li style={{ marginBottom: "0.5rem" }}>개인정보 수정 요청</li>
            <li style={{ marginBottom: "0.5rem" }}>개인정보 삭제 요청</li>
            <li style={{ marginBottom: "0.5rem" }}>처리 정지 요청</li>
          </ul>
        </Section>

        <Section title="8. 개인정보 보호책임자">
          <p>
            개인정보 처리에 관한 문의사항은 아래로 연락주시기 바랍니다.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            이메일:{" "}
            <a
              href="mailto:privacy@beomanro.com"
              style={{ color: "#3b82f6" }}
            >
              privacy@beomanro.com
            </a>
          </p>
        </Section>

        <Section title="9. 방침 변경">
          <p>
            본 방침은 법률 또는 서비스 변경에 따라 업데이트될 수 있습니다. 중요한 변경
            사항은 서비스 공지를 통해 안내드립니다.
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
