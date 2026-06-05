/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { webcrypto } from 'node:crypto';
import { TextEncoder, TextDecoder } from 'node:util';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// jsdom은 crypto.subtle / TextEncoder를 제공하지 않으므로 Node 구현을 주입 (실제 브라우저엔 존재)
if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto, configurable: true });
}
if (typeof globalThis.TextEncoder === 'undefined') {
  Object.assign(globalThis, { TextEncoder, TextDecoder });
}

import { JwtGenerator } from '../JwtGenerator';

jest.mock('@/lib/LocaleProvider', () => ({
  useLocale: () => ({
    locale: 'ko',
    t: (tr: { ko: string; en: string }) => tr.ko,
  }),
}));

jest.mock('@/lib/i18n', () => ({
  T: {
    copy: { ko: '복사', en: 'Copy' },
    copied: { ko: '복사됨', en: 'Copied' },
  },
}));

Object.assign(navigator, {
  clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
});

describe('JwtGenerator', () => {
  test('기본 렌더링: 입력 필드 + 생성 버튼 존재', () => {
    render(<JwtGenerator />);
    // textbox (header/payload/secret), 생성 버튼
    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(3);
    expect(screen.getByRole('button', { name: /생성/i })).toBeInTheDocument();
  });

  test('생성 버튼 클릭 시 JWT 토큰 출력 (3개 . 파트)', async () => {
    render(<JwtGenerator />);
    fireEvent.click(screen.getByRole('button', { name: /생성/i }));
    await waitFor(() => {
      const jwt = screen.getByText(/^eyJ[\w-]+\.[\w-]+\.[\w-]+$/);
      expect(jwt).toBeInTheDocument();
      expect(jwt.textContent!.split('.').length).toBe(3);
    });
  });

  test('잘못된 JSON 입력 시 에러 메시지 표시', async () => {
    render(<JwtGenerator />);
    const boxes = screen.getAllByRole('textbox');
    // payload textarea를 깨진 JSON으로
    fireEvent.change(boxes[1], { target: { value: '{invalid' } });
    fireEvent.click(screen.getByRole('button', { name: /생성/i }));
    await waitFor(() => {
      expect(screen.getByText(/올바른 JSON이 아닙니다|Invalid JSON/)).toBeInTheDocument();
    });
  });
});
