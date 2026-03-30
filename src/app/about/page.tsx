import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소개 | NetTools",
  description:
    "NetTools는 19년 경력의 네트워크 보안 전문가가 만든 무료 온라인 네트워크 도구 모음입니다. 가입 없이, 추적 없이 사용할 수 있습니다.",
  openGraph: {
    title: "NetTools 소개",
    description:
      "19년 경력의 네트워크 보안 전문가가 만든 무료 도구 모음. 가입 없이, 추적 없이.",
    type: "website",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <article
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "2rem 1rem 4rem",
      }}
    >
      <header style={{ marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.75rem",
          }}
        >
          NetTools 소개
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
          }}
        >
          네트워크 엔지니어와 보안 전문가를 위한 무료 온라인 도구 모음.
          <br />
          가입 없이. 추적 없이. 오직 도구만.
        </p>
      </header>

      <div
        style={{
          lineHeight: 1.8,
          color: "var(--text-secondary)",
          fontSize: "0.9375rem",
        }}
      >
        <Section title="NetTools를 만든 이유">
          <p>
            현장에서 일하는 네트워크 엔지니어와 보안 전문가는 매일 수많은 계산과 조회 작업을
            반복합니다. 서브넷 계산, IP 조회, SSL 인증서 확인, MAC 주소 조회...
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            기존 온라인 도구 대부분은 광고가 과도하거나, 회원가입을 요구하거나, 입력값을 서버에
            저장하거나, 느리고 불편합니다. NetTools는 그 불편함을 해소하기 위해 만들었습니다.
          </p>
        </Section>

        <Section title="만든 사람">
          <p>
            NetTools는 19년 경력의 네트워크 보안 개발자가 만들었습니다. 방화벽, 침입 탐지 시스템,
            네트워크 모니터링 등 다양한 보안 인프라를 설계하고 운영해온 경험을 바탕으로,
            실제 현장에서 필요한 도구를 직접 개발했습니다.
          </p>
        </Section>

        <Section title="우리의 원칙">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginTop: "0.75rem",
            }}
          >
            <PrincipleCard
              icon="🔒"
              title="프라이버시 우선"
              desc="모든 도구는 브라우저에서 실행됩니다. 입력값은 서버로 전송되지 않습니다."
            />
            <PrincipleCard
              icon="⚡"
              title="빠르고 간결"
              desc="불필요한 기능 없이 핵심만. 로딩 빠르고 인터페이스 깔끔."
            />
            <PrincipleCard
              icon="🆓"
              title="완전 무료"
              desc="회원가입 없이 모든 도구를 무료로 사용할 수 있습니다."
            />
            <PrincipleCard
              icon="🛠️"
              title="실용적"
              desc="현장 엔지니어 관점에서 실제로 필요한 도구만 제공합니다."
            />
          </div>
        </Section>

        <Section title="제공 도구">
          <p>현재 다음 카테고리의 도구를 제공합니다:</p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>네트워크:</strong> 서브넷 계산기, CIDR 변환기, IP 조회, MAC OUI 조회, 포트 참조
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>보안/암호화:</strong> SSL 인증서 확인, 해시 생성기, Base64 인코더/디코더,
              비밀번호 강도 측정기
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>DNS/HTTP:</strong> DNS 조회, HTTP 헤더 분석, URL 인코더/디코더
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>개발자 도구:</strong> JSON Formatter, 정규표현식 테스터, UNIX 타임스탬프 변환기 등
            </li>
          </ul>
          <p style={{ marginTop: "0.75rem" }}>
            새로운 도구는 지속적으로 추가되고 있습니다.
          </p>
        </Section>

        <Section title="기술 스택">
          <p>
            NetTools는 Next.js와 TypeScript로 개발되었으며, Cloudflare Workers를 통해
            전 세계에 빠르게 배포됩니다. 대부분의 도구는 순수 클라이언트 사이드에서 동작하여
            사용자 데이터를 보호합니다.
          </p>
        </Section>

        <Section title="피드백 및 문의">
          <p>
            도구 사용 중 버그를 발견하거나 새로운 도구 제안이 있으시면 아래로 연락해 주세요.
          </p>
          <p style={{ marginTop: "0.75rem" }}>
            이메일:{" "}
            <a
              href="mailto:hello@beomanro.com"
              style={{ color: "#3b82f6" }}
            >
              hello@beomanro.com
            </a>
          </p>
        </Section>

        <div
          style={{
            marginTop: "3rem",
            padding: "1.5rem",
            background: "var(--info-bg)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
          }}
        >
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            <strong>관련 페이지:</strong>{" "}
            <a href="/privacy" style={{ color: "#3b82f6" }}>개인정보처리방침</a>
            {" · "}
            <a href="/terms" style={{ color: "#3b82f6" }}>이용약관</a>
          </p>
        </div>
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

function PrincipleCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        padding: "1rem 1.25rem",
      }}
    >
      <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
      <h3
        style={{
          fontSize: "0.9375rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: "0.375rem",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
        {desc}
      </p>
    </div>
  );
}
