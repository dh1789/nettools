import type { Metadata } from "next";
import { LegalDoc, type DocSection } from "@/components/layout/LegalDoc";

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

const ulStyle = { paddingLeft: "1.5rem" } as const;
const liStyle = { marginBottom: "0.5rem" } as const;
const linkStyle = { color: "#3b82f6" } as const;

const sections: DocSection[] = [
  {
    title: { ko: "연락처", en: "Contact" },
    body: {
      ko: (
        <ul style={ulStyle}>
          <li style={liStyle}>
            <strong>일반 문의 · 버그 · 도구 제안:</strong>{" "}
            <a href="mailto:hello@beomanro.com" style={linkStyle}>hello@beomanro.com</a>
          </li>
          <li style={liStyle}>
            <strong>개인정보 관련 문의:</strong>{" "}
            <a href="mailto:privacy@beomanro.com" style={linkStyle}>privacy@beomanro.com</a>
          </li>
          <li style={liStyle}>
            <strong>제휴 · 광고 문의:</strong>{" "}
            <a href="mailto:hello@beomanro.com" style={linkStyle}>hello@beomanro.com</a>
          </li>
        </ul>
      ),
      en: (
        <ul style={ulStyle}>
          <li style={liStyle}>
            <strong>General · bugs · tool suggestions:</strong>{" "}
            <a href="mailto:hello@beomanro.com" style={linkStyle}>hello@beomanro.com</a>
          </li>
          <li style={liStyle}>
            <strong>Privacy inquiries:</strong>{" "}
            <a href="mailto:privacy@beomanro.com" style={linkStyle}>privacy@beomanro.com</a>
          </li>
          <li style={liStyle}>
            <strong>Partnership · advertising:</strong>{" "}
            <a href="mailto:hello@beomanro.com" style={linkStyle}>hello@beomanro.com</a>
          </li>
        </ul>
      ),
    },
  },
  {
    title: { ko: "무엇을 도와드릴까요", en: "How we can help" },
    body: {
      ko: (
        <ul style={ulStyle}>
          <li style={liStyle}>
            도구 결과가 이상하거나 오류가 발생한 경우 — 어떤 도구에서 어떤 입력값으로
            문제가 생겼는지 알려주시면 빠르게 수정합니다.
          </li>
          <li style={liStyle}>
            필요한 도구가 없거나 기능 개선 아이디어가 있는 경우 — 제안해 주세요.
          </li>
          <li style={liStyle}>가이드/블로그 내용 오류나 보강 요청도 환영합니다.</li>
        </ul>
      ),
      en: (
        <ul style={ulStyle}>
          <li style={liStyle}>
            If a tool gives a wrong result or an error — tell us which tool and what
            input caused it, and we&apos;ll fix it quickly.
          </li>
          <li style={liStyle}>
            If a tool you need is missing or you have an improvement idea — suggest it.
          </li>
          <li style={liStyle}>
            Corrections or additions to guides/blog posts are also welcome.
          </li>
        </ul>
      ),
    },
  },
  {
    title: { ko: "운영자", en: "Operator" },
    body: {
      ko: (
        <p>
          NetTools는 19년 경력의 네트워크 보안 개발자가 만들고 운영합니다. 방화벽,
          침입 탐지, 네트워크 모니터링 등 보안 인프라를 설계·운영해온 경험을 바탕으로
          현장에서 실제로 필요한 도구를 직접 개발합니다. 자세한 내용은{" "}
          <a href="/about" style={linkStyle}>소개</a> 페이지를 참고하세요.
        </p>
      ),
      en: (
        <p>
          NetTools is built and operated by a network security developer with 19 years
          of experience. Drawing on hands-on work designing and operating security
          infrastructure — firewalls, intrusion detection, network monitoring — the
          tools are built for what engineers actually need in the field. See the{" "}
          <a href="/about" style={linkStyle}>About</a> page for more.
        </p>
      ),
    },
  },
];

const footer = {
  ko: (
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
        <a href="/about" style={linkStyle}>소개</a>
        {" · "}
        <a href="/privacy" style={linkStyle}>개인정보처리방침</a>
        {" · "}
        <a href="/terms" style={linkStyle}>이용약관</a>
      </p>
    </div>
  ),
  en: (
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
        <strong>Related pages:</strong>{" "}
        <a href="/about" style={linkStyle}>About</a>
        {" · "}
        <a href="/privacy" style={linkStyle}>Privacy Policy</a>
        {" · "}
        <a href="/terms" style={linkStyle}>Terms of Service</a>
      </p>
    </div>
  ),
};

export default function ContactPage() {
  return (
    <LegalDoc
      title={{ ko: "문의", en: "Contact" }}
      lead={{
        ko: (
          <>
            질문, 버그 신고, 도구 제안, 제휴 문의 모두 환영합니다.
            <br />
            이메일로 연락주시면 확인 후 답변드립니다.
          </>
        ),
        en: (
          <>
            Questions, bug reports, tool suggestions, and partnership inquiries are all welcome.
            <br />
            Email us and we&apos;ll get back to you.
          </>
        ),
      }}
      sections={sections}
      footer={footer}
    />
  );
}
