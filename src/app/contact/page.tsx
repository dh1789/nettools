import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의 | NetTools",
  description:
    "NetTools 문의 안내. 버그 신고, 도구 제안, 개인정보 문의, 제휴·광고 문의 연락처를 안내합니다.",
  openGraph: {
    title: "문의 | NetTools",
    description: "NetTools에 버그 신고, 도구 제안, 제휴 문의를 보내실 수 있습니다.",
    type: "website",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
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
          문의
        </h1>
        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
          }}
        >
          질문, 버그 신고, 도구 제안, 제휴 문의 모두 환영합니다.
          <br />
          이메일로 연락주시면 확인 후 답변드립니다.
        </p>
      </header>

      <div
        style={{
          lineHeight: 1.8,
          color: "var(--text-secondary)",
          fontSize: "0.9375rem",
        }}
      >
        <Section title="연락처">
          <ul style={{ paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>일반 문의 · 버그 · 도구 제안:</strong>{" "}
              <a href="mailto:hello@beomanro.com" style={{ color: "#3b82f6" }}>
                hello@beomanro.com
              </a>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>개인정보 관련 문의:</strong>{" "}
              <a href="mailto:privacy@beomanro.com" style={{ color: "#3b82f6" }}>
                privacy@beomanro.com
              </a>
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              <strong>제휴 · 광고 문의:</strong>{" "}
              <a href="mailto:hello@beomanro.com" style={{ color: "#3b82f6" }}>
                hello@beomanro.com
              </a>
            </li>
          </ul>
        </Section>

        <Section title="무엇을 도와드릴까요">
          <ul style={{ paddingLeft: "1.5rem" }}>
            <li style={{ marginBottom: "0.5rem" }}>
              도구 결과가 이상하거나 오류가 발생한 경우 — 어떤 도구에서 어떤 입력값으로
              문제가 생겼는지 알려주시면 빠르게 수정합니다.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              필요한 도구가 없거나 기능 개선 아이디어가 있는 경우 — 제안해 주세요.
            </li>
            <li style={{ marginBottom: "0.5rem" }}>
              가이드/블로그 내용 오류나 보강 요청도 환영합니다.
            </li>
          </ul>
        </Section>

        <Section title="운영자">
          <p>
            NetTools는 19년 경력의 네트워크 보안 개발자가 만들고 운영합니다. 방화벽,
            침입 탐지, 네트워크 모니터링 등 보안 인프라를 설계·운영해온 경험을 바탕으로
            현장에서 실제로 필요한 도구를 직접 개발합니다. 자세한 내용은{" "}
            <a href="/about" style={{ color: "#3b82f6" }}>
              소개
            </a>{" "}
            페이지를 참고하세요.
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
            <a href="/about" style={{ color: "#3b82f6" }}>소개</a>
            {" · "}
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
