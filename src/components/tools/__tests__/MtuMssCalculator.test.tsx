/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MtuMssCalculator } from '../MtuMssCalculator';

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

describe('MtuMssCalculator', () => {
  test('기본 렌더: WireGuard 프리셋 결과 1440/1400 표시', () => {
    render(<MtuMssCalculator />);
    expect(screen.getAllByText('1440').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1400').length).toBeGreaterThan(0);
  });

  test('PPPoE 체크 추가 시 중첩 재계산 (1432/1392)', () => {
    render(<MtuMssCalculator />);
    fireEvent.click(screen.getByRole('checkbox', { name: /PPPoE/i }));
    expect(screen.getAllByText('1432').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1392').length).toBeGreaterThan(0);
  });

  test('링크 MTU 변경 반영 (9000 + WireGuard → 8940)', () => {
    render(<MtuMssCalculator />);
    fireEvent.change(screen.getByLabelText(/링크 MTU/i), { target: { value: '9000' } });
    expect(screen.getAllByText('8940').length).toBeGreaterThan(0);
  });

  test('명령 복사 클릭 → 클립보드 호출', () => {
    render(<MtuMssCalculator />);
    fireEvent.click(screen.getAllByRole('button', { name: /명령 복사/i })[0]);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  test('IPsec 프리셋 → 가변 경고 렌더', () => {
    render(<MtuMssCalculator />);
    fireEvent.click(screen.getByRole('button', { name: /사이트 간 IPsec/i }));
    expect(screen.getByText(/worst-case 값으로 계산/i)).toBeInTheDocument();
  });
});
