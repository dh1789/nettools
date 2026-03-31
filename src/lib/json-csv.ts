export interface CsvResult {
  csv: string;
  rowCount: number;
  colCount: number;
  error?: string;
}

/**
 * JSON 배열을 CSV 문자열로 변환 (RFC 4180 준수)
 */
export function jsonToCsv(json: string, delimiter = ','): CsvResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json);
  } catch {
    return { csv: '', rowCount: 0, colCount: 0, error: '유효하지 않은 JSON입니다.' };
  }

  if (!Array.isArray(parsed)) {
    return { csv: '', rowCount: 0, colCount: 0, error: 'JSON 최상위 값이 배열이어야 합니다.' };
  }

  if (parsed.length === 0) {
    return { csv: '', rowCount: 0, colCount: 0 };
  }

  // 배열 요소가 모두 객체인지 확인
  for (const item of parsed) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      return { csv: '', rowCount: 0, colCount: 0, error: '배열의 각 요소는 객체여야 합니다.' };
    }
  }

  // 모든 행의 키를 수집하여 헤더 결정 (중첩 객체 평탄화 포함)
  const allKeys = new Set<string>();
  const flatRows: Record<string, string>[] = [];

  for (const item of parsed) {
    const flat = flattenObject(item as Record<string, unknown>);
    flatRows.push(flat);
    for (const key of Object.keys(flat)) {
      allKeys.add(key);
    }
  }

  const headers = Array.from(allKeys);
  const headerLine = headers.map((h) => escapeCsvValue(h, delimiter)).join(delimiter);

  const dataLines = flatRows.map((row) =>
    headers.map((h) => escapeCsvValue(row[h] ?? '', delimiter)).join(delimiter)
  );

  const csv = [headerLine, ...dataLines].join('\n');

  return {
    csv,
    rowCount: flatRows.length,
    colCount: headers.length,
  };
}

/**
 * 중첩 객체를 dot notation으로 평탄화
 */
function flattenObject(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const nested = flattenObject(value as Record<string, unknown>, fullKey);
      Object.assign(result, nested);
    } else if (value === null || value === undefined) {
      result[fullKey] = '';
    } else if (Array.isArray(value)) {
      result[fullKey] = JSON.stringify(value);
    } else {
      result[fullKey] = String(value);
    }
  }

  return result;
}

/**
 * RFC 4180: 구분자, 개행, 큰따옴표 포함 시 큰따옴표로 감싸기
 */
function escapeCsvValue(value: string, delimiter: string): string {
  const needsQuoting =
    value.includes(delimiter) ||
    value.includes('\n') ||
    value.includes('\r') ||
    value.includes('"');

  if (!needsQuoting) return value;

  // 큰따옴표는 두 개로 이스케이프
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}
