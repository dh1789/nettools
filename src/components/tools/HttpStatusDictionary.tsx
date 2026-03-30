"use client";

import { useState } from "react";
import { useLocale } from "@/lib/LocaleProvider";

interface StatusEntry {
  code: number;
  name: string;
  category: "1xx" | "2xx" | "3xx" | "4xx" | "5xx";
  description: { ko: string; en: string };
  detail: { ko: string; en: string };
}

const STATUS_DATABASE: StatusEntry[] = [
  // 1xx
  { code: 100, name: "Continue", category: "1xx", description: { ko: "계속", en: "Continue" }, detail: { ko: "요청의 첫 부분을 받았으며, 계속 진행해도 됩니다.", en: "The server has received the request headers and the client should proceed to send the request body." } },
  { code: 101, name: "Switching Protocols", category: "1xx", description: { ko: "프로토콜 전환", en: "Switching Protocols" }, detail: { ko: "서버가 클라이언트 요청에 따라 프로토콜을 전환합니다. WebSocket 업그레이드 시 사용됩니다.", en: "The server agrees to switch protocols as requested. Used for WebSocket upgrades." } },
  { code: 102, name: "Processing", category: "1xx", description: { ko: "처리 중", en: "Processing" }, detail: { ko: "서버가 요청을 받아 처리 중이지만 아직 응답이 없습니다. (WebDAV)", en: "The server has received and is processing the request, but no response is available yet. (WebDAV)" } },
  { code: 103, name: "Early Hints", category: "1xx", description: { ko: "조기 힌트", en: "Early Hints" }, detail: { ko: "Link 헤더로 리소스를 미리 로드하도록 클라이언트에 알립니다.", en: "Used to return some response headers before the final HTTP message." } },
  // 2xx
  { code: 200, name: "OK", category: "2xx", description: { ko: "성공", en: "OK" }, detail: { ko: "요청이 성공적으로 처리되었습니다. GET, POST 등에서 가장 흔히 반환됩니다.", en: "The request succeeded. The result depends on the HTTP method used." } },
  { code: 201, name: "Created", category: "2xx", description: { ko: "생성됨", en: "Created" }, detail: { ko: "요청이 성공적으로 처리되어 새 리소스가 생성되었습니다. POST 요청 후 주로 반환됩니다.", en: "The request succeeded and a new resource was created. Typically returned after a POST request." } },
  { code: 202, name: "Accepted", category: "2xx", description: { ko: "수락됨", en: "Accepted" }, detail: { ko: "요청이 처리를 위해 수락되었으나 처리가 완료되지 않았습니다. 비동기 작업에 사용됩니다.", en: "The request has been accepted for processing but is not completed yet. Used for async processing." } },
  { code: 204, name: "No Content", category: "2xx", description: { ko: "콘텐츠 없음", en: "No Content" }, detail: { ko: "요청이 성공했지만 반환할 콘텐츠가 없습니다. DELETE 성공 후 자주 반환됩니다.", en: "The request succeeded but there is no content to return. Often used after a successful DELETE." } },
  { code: 206, name: "Partial Content", category: "2xx", description: { ko: "부분 콘텐츠", en: "Partial Content" }, detail: { ko: "Range 요청에 대한 부분 응답입니다. 파일 다운로드 재개나 스트리밍에 사용됩니다.", en: "Partial response for a Range request. Used for resumable downloads or streaming." } },
  // 3xx
  { code: 301, name: "Moved Permanently", category: "3xx", description: { ko: "영구 이동", en: "Moved Permanently" }, detail: { ko: "요청한 리소스가 영구적으로 새 URL로 이동했습니다. SEO에서 중요한 리다이렉트입니다.", en: "The requested resource has been permanently moved to a new URL. Important for SEO redirects." } },
  { code: 302, name: "Found", category: "3xx", description: { ko: "임시 이동", en: "Found" }, detail: { ko: "요청한 리소스가 임시로 다른 URL로 이동했습니다. 원래 URL이 유지됩니다.", en: "The requested resource is temporarily located at a different URL. The original URL should remain." } },
  { code: 303, name: "See Other", category: "3xx", description: { ko: "다른 곳 보기", en: "See Other" }, detail: { ko: "POST/PUT 후 GET 요청으로 다른 페이지를 조회하도록 리다이렉트합니다.", en: "Redirect to another resource using GET after POST/PUT." } },
  { code: 304, name: "Not Modified", category: "3xx", description: { ko: "수정되지 않음", en: "Not Modified" }, detail: { ko: "캐시된 버전을 사용해도 됩니다. If-None-Match 또는 If-Modified-Since 헤더와 함께 사용됩니다.", en: "Use the cached version. Used with If-None-Match or If-Modified-Since headers." } },
  { code: 307, name: "Temporary Redirect", category: "3xx", description: { ko: "임시 리다이렉트", en: "Temporary Redirect" }, detail: { ko: "원래 HTTP 메서드를 유지하며 임시로 리다이렉트합니다. 302와 달리 메서드가 변경되지 않습니다.", en: "Temporary redirect preserving the original HTTP method, unlike 302." } },
  { code: 308, name: "Permanent Redirect", category: "3xx", description: { ko: "영구 리다이렉트", en: "Permanent Redirect" }, detail: { ko: "원래 HTTP 메서드를 유지하며 영구적으로 리다이렉트합니다. 301과 달리 메서드가 변경되지 않습니다.", en: "Permanent redirect preserving the original HTTP method, unlike 301." } },
  // 4xx
  { code: 400, name: "Bad Request", category: "4xx", description: { ko: "잘못된 요청", en: "Bad Request" }, detail: { ko: "서버가 요청을 이해하지 못했습니다. 잘못된 문법, 유효하지 않은 요청 메시지가 원인입니다.", en: "The server cannot process the request due to client error, e.g., malformed request syntax." } },
  { code: 401, name: "Unauthorized", category: "4xx", description: { ko: "인증 필요", en: "Unauthorized" }, detail: { ko: "인증이 필요합니다. 로그인하지 않았거나 토큰이 만료된 경우 반환됩니다.", en: "Authentication is required. Returned when not logged in or token has expired." } },
  { code: 403, name: "Forbidden", category: "4xx", description: { ko: "금지됨", en: "Forbidden" }, detail: { ko: "서버가 요청을 이해했지만 권한이 없습니다. 401과 달리 인증해도 접근할 수 없습니다.", en: "The server understood the request but refuses to authorize it. Unlike 401, authentication won't help." } },
  { code: 404, name: "Not Found", category: "4xx", description: { ko: "찾을 수 없음", en: "Not Found" }, detail: { ko: "요청한 리소스를 찾을 수 없습니다. URL이 잘못되었거나 리소스가 삭제된 경우입니다.", en: "The requested resource could not be found. The URL may be wrong or the resource deleted." } },
  { code: 405, name: "Method Not Allowed", category: "4xx", description: { ko: "허용되지 않는 메서드", en: "Method Not Allowed" }, detail: { ko: "요청한 HTTP 메서드(GET, POST 등)가 해당 리소스에서 허용되지 않습니다.", en: "The HTTP method (GET, POST, etc.) is not allowed for the requested resource." } },
  { code: 408, name: "Request Timeout", category: "4xx", description: { ko: "요청 시간 초과", en: "Request Timeout" }, detail: { ko: "서버가 요청을 기다리다 시간이 초과되었습니다. 클라이언트가 응답하지 않은 경우입니다.", en: "The server timed out waiting for the request. The client did not send a request in time." } },
  { code: 409, name: "Conflict", category: "4xx", description: { ko: "충돌", en: "Conflict" }, detail: { ko: "현재 서버 상태와 충돌하여 요청을 처리할 수 없습니다. 중복 데이터나 버전 충돌이 원인입니다.", en: "The request conflicts with the current server state, e.g., duplicate data or version conflict." } },
  { code: 410, name: "Gone", category: "4xx", description: { ko: "사라짐", en: "Gone" }, detail: { ko: "리소스가 영구적으로 삭제되어 더 이상 사용할 수 없습니다. 404와 달리 영구 삭제를 의미합니다.", en: "The resource is permanently gone. Unlike 404, indicates intentional permanent removal." } },
  { code: 422, name: "Unprocessable Entity", category: "4xx", description: { ko: "처리 불가 엔티티", en: "Unprocessable Entity" }, detail: { ko: "요청 형식은 올바르지만 내용이 유효하지 않습니다. 입력 유효성 검사 실패 시 반환됩니다.", en: "The request format is correct but the content is invalid. Returned on input validation failure." } },
  { code: 429, name: "Too Many Requests", category: "4xx", description: { ko: "너무 많은 요청", en: "Too Many Requests" }, detail: { ko: "일정 시간 내 너무 많은 요청을 보냈습니다. API 속도 제한(Rate Limiting)에서 자주 반환됩니다.", en: "Too many requests in a given time. Common in API rate limiting." } },
  // 5xx
  { code: 500, name: "Internal Server Error", category: "5xx", description: { ko: "서버 내부 오류", en: "Internal Server Error" }, detail: { ko: "서버 내부에서 예상치 못한 오류가 발생했습니다. 서버 버그나 예외 처리 실패가 원인입니다.", en: "The server encountered an unexpected condition. Caused by server bugs or unhandled exceptions." } },
  { code: 501, name: "Not Implemented", category: "5xx", description: { ko: "구현되지 않음", en: "Not Implemented" }, detail: { ko: "서버가 해당 요청 메서드를 지원하지 않습니다.", en: "The server does not support the functionality required to fulfill the request." } },
  { code: 502, name: "Bad Gateway", category: "5xx", description: { ko: "불량 게이트웨이", en: "Bad Gateway" }, detail: { ko: "게이트웨이/프록시 서버가 업스트림 서버로부터 유효하지 않은 응답을 받았습니다. Nginx 앞단 설정 오류 시 자주 발생합니다.", en: "The gateway or proxy received an invalid response from the upstream server. Common with Nginx proxy misconfigurations." } },
  { code: 503, name: "Service Unavailable", category: "5xx", description: { ko: "서비스 불가", en: "Service Unavailable" }, detail: { ko: "서버가 일시적으로 과부하 상태이거나 유지보수 중입니다. Retry-After 헤더로 재시도 시간을 알려줄 수 있습니다.", en: "The server is temporarily unavailable due to overload or maintenance. May include a Retry-After header." } },
  { code: 504, name: "Gateway Timeout", category: "5xx", description: { ko: "게이트웨이 시간 초과", en: "Gateway Timeout" }, detail: { ko: "게이트웨이/프록시 서버가 업스트림 서버로부터 응답을 기다리다 시간이 초과되었습니다.", en: "The gateway or proxy did not receive a timely response from an upstream server." } },
  { code: 505, name: "HTTP Version Not Supported", category: "5xx", description: { ko: "지원되지 않는 HTTP 버전", en: "HTTP Version Not Supported" }, detail: { ko: "서버가 요청에 사용된 HTTP 버전을 지원하지 않습니다.", en: "The HTTP version used in the request is not supported by the server." } },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: { ko: string; en: string } }> = {
  "1xx": { bg: "#eff6ff", text: "#3b82f6", label: { ko: "정보", en: "Informational" } },
  "2xx": { bg: "#f0fdf4", text: "#16a34a", label: { ko: "성공", en: "Success" } },
  "3xx": { bg: "#fefce8", text: "#ca8a04", label: { ko: "리다이렉트", en: "Redirection" } },
  "4xx": { bg: "#fef2f2", text: "#dc2626", label: { ko: "클라이언트 오류", en: "Client Error" } },
  "5xx": { bg: "#fdf4ff", text: "#9333ea", label: { ko: "서버 오류", en: "Server Error" } },
};

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} style={{ background: "var(--warning-bg, #fef3c7)", color: "var(--text-primary, #111)", borderRadius: "2px", padding: "0 1px" }}>
        {part}
      </mark>
    ) : part
  );
}

const inputStyle: React.CSSProperties = {
  padding: "0.625rem 0.875rem",
  fontSize: "1rem",
  fontFamily: "monospace",
  border: "1px solid var(--border, #d1d5db)",
  borderRadius: "8px",
  background: "var(--input-bg, #f9fafb)",
  color: "var(--text-primary, #111)",
  outline: "none",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary, #6b7280)",
  marginBottom: "0.25rem",
  display: "block",
};

export function HttpStatusDictionary() {
  const { t } = useLocale();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const query = search.trim().toLowerCase();
  const filtered = STATUS_DATABASE.filter((entry) => {
    const matchesFilter = filter === "all" || entry.category === filter;
    if (!matchesFilter) return false;
    if (!query) return true;
    return (
      String(entry.code).includes(query) ||
      entry.name.toLowerCase().includes(query) ||
      entry.description.ko.includes(query) ||
      entry.description.en.toLowerCase().includes(query) ||
      entry.detail.ko.includes(query) ||
      entry.detail.en.toLowerCase().includes(query)
    );
  });

  const categories = ["all", "1xx", "2xx", "3xx", "4xx", "5xx"];

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={labelStyle}>{t({ ko: "상태 코드 또는 이름 검색", en: "Search by status code or name" })}</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t({ ko: "예: 404, Not Found, timeout", en: "e.g. 404, Not Found, timeout" })}
          style={inputStyle}
        />
      </div>

      {/* Category Filter */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        {categories.map((cat) => {
          const isActive = filter === cat;
          const color = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: "0.375rem 0.875rem",
                fontSize: "0.8125rem",
                fontWeight: isActive ? 700 : 400,
                border: `1px solid ${isActive && color ? color.text : "var(--border, #d1d5db)"}`,
                borderRadius: "20px",
                background: isActive && color ? color.bg : "transparent",
                color: isActive && color ? color.text : "var(--text-secondary, #6b7280)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {cat === "all" ? t({ ko: "전체", en: "All" }) : cat}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <div style={{ fontSize: "0.8125rem", color: "var(--text-tertiary, #9ca3af)", marginBottom: "0.75rem" }}>
        {filtered.length}{t({ ko: "개 항목", en: " items" })}
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {filtered.map((entry) => {
            const color = CATEGORY_COLORS[entry.category];
            const isExpanded = expanded === entry.code;
            return (
              <div
                key={entry.code}
                style={{
                  background: "var(--result-bg, #f9fafb)",
                  border: "1px solid var(--border-light, #f3f4f6)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => setExpanded(isExpanded ? null : entry.code)}
              >
                <div style={{ display: "flex", alignItems: "center", padding: "0.75rem 1rem", gap: "0.75rem" }}>
                  <span style={{
                    fontFamily: "monospace",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: color.text,
                    background: color.bg,
                    padding: "0.25rem 0.625rem",
                    borderRadius: "6px",
                    minWidth: "3.5rem",
                    textAlign: "center",
                    flexShrink: 0,
                  }}>
                    {entry.code}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text-primary, #111)" }}>
                      {highlightMatch(entry.name, search)}
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary, #6b7280)" }}>
                      {highlightMatch(t(entry.description), search)}
                    </div>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary, #9ca3af)", flexShrink: 0 }}>
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>
                {isExpanded && (
                  <div style={{
                    padding: "0.75rem 1rem 0.875rem",
                    borderTop: "1px solid var(--border-light, #f3f4f6)",
                    fontSize: "0.875rem",
                    color: "var(--text-secondary, #6b7280)",
                    lineHeight: 1.6,
                  }}>
                    {highlightMatch(t(entry.detail), search)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: "var(--info-bg, #eff6ff)", borderRadius: "8px", padding: "2rem", textAlign: "center", color: "var(--text-secondary, #6b7280)", fontSize: "0.875rem" }}>
          {t({ ko: "검색 결과가 없습니다. 다른 키워드로 검색해 보세요.", en: "No results found. Try a different search term." })}
        </div>
      )}
    </div>
  );
}
