import type { MDXComponents } from "mdx/types";
import { generateHeadingId } from "./blog";
import { type Locale, localePath } from "./i18n";
import { ComparisonTable } from "@/components/blog/ComparisonTable";

/**
 * MDX 렌더링용 커스텀 컴포넌트.
 * 헤딩에 ID를 부여하여 TOC 링크와 연결한다.
 * 본문의 내부 링크(`/tools/net/...`)는 로케일 프리픽스를 붙여 en 가이드가 en 도구로 연결되게 한다.
 */
export function getMdxComponents(locale: Locale): MDXComponents {
  return {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ComparisonTable: ComparisonTable as any,
  h2: ({ children, ...props }) => {
    const id = generateHeadingId(String(children));
    return (
      <h2
        id={id}
        style={{
          fontSize: "1.375rem",
          fontWeight: 700,
          color: "var(--text-primary, #111)",
          marginTop: "2rem",
          marginBottom: "0.75rem",
          lineHeight: 1.3,
        }}
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    const id = generateHeadingId(String(children));
    return (
      <h3
        id={id}
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "var(--text-primary, #111)",
          marginTop: "1.5rem",
          marginBottom: "0.5rem",
          lineHeight: 1.4,
        }}
        {...props}
      >
        {children}
      </h3>
    );
  },
  p: ({ children, ...props }) => (
    <p
      style={{
        fontSize: "1rem",
        lineHeight: 1.8,
        color: "var(--text-primary, #111)",
        marginBottom: "1rem",
      }}
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      style={{
        paddingLeft: "1.5rem",
        marginBottom: "1rem",
        lineHeight: 1.8,
      }}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      style={{
        paddingLeft: "1.5rem",
        marginBottom: "1rem",
        lineHeight: 1.8,
      }}
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li
      style={{
        fontSize: "1rem",
        color: "var(--text-primary, #111)",
        marginBottom: "0.25rem",
      }}
      {...props}
    >
      {children}
    </li>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={typeof href === "string" && href.startsWith("/") ? localePath(href, locale) : href}
      style={{
        color: "var(--info-text, #1d4ed8)",
        textDecoration: "underline",
        textDecorationColor: "var(--border, #e5e7eb)",
        textUnderlineOffset: "2px",
      }}
      {...props}
    >
      {children}
    </a>
  ),
  code: ({ children, ...props }) => (
    <code
      style={{
        fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace",
        fontSize: "0.875em",
        background: "var(--input-bg, #f9fafb)",
        padding: "0.125rem 0.375rem",
        borderRadius: "4px",
        border: "1px solid var(--border, #e5e7eb)",
      }}
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre
      style={{
        fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace",
        fontSize: "0.875rem",
        lineHeight: 1.6,
        background: "var(--input-bg, #f9fafb)",
        border: "1px solid var(--border, #e5e7eb)",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
        overflowX: "auto",
      }}
      {...props}
    >
      {children}
    </pre>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      style={{
        borderLeft: "3px solid var(--info-text, #1d4ed8)",
        paddingLeft: "1rem",
        marginLeft: 0,
        marginBottom: "1rem",
        color: "var(--text-secondary, #6b7280)",
        fontStyle: "italic",
      }}
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: (props) => (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid var(--border, #e5e7eb)",
        margin: "2rem 0",
      }}
      {...props}
    />
  ),
  // 표는 래퍼로 감싸 좁은 화면에서 표만 가로 스크롤되게 한다(본문이 밀리지 않도록)
  table: ({ children, ...props }) => (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", marginBottom: "1.5rem" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.9375rem",
          lineHeight: 1.6,
        }}
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead style={{ background: "var(--input-bg, #f9fafb)" }} {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th
      style={{
        padding: "0.625rem 0.75rem",
        fontSize: "0.875rem",
        fontWeight: 700,
        color: "var(--text-primary, #111)",
        textAlign: "left",
        borderBottom: "2px solid var(--border, #e5e7eb)",
      }}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      style={{
        padding: "0.625rem 0.75rem",
        color: "var(--text-primary, #111)",
        borderBottom: "1px solid var(--border-light, #f3f4f6)",
        verticalAlign: "top",
      }}
      {...props}
    >
      {children}
    </td>
  ),
  del: ({ children, ...props }) => (
    <del style={{ color: "var(--text-tertiary, #9ca3af)" }} {...props}>
      {children}
    </del>
  ),
  strong: ({ children, ...props }) => (
    <strong
      style={{
        fontWeight: 600,
        color: "var(--text-primary, #111)",
      }}
      {...props}
    >
      {children}
    </strong>
  ),
  };
}

/** ko 기본 세트 (기존 import 호환) */
export const mdxComponents: MDXComponents = getMdxComponents("ko");
