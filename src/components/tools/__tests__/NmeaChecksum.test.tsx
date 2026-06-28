/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NmeaChecksum } from '../NmeaChecksum';

// LocaleProvider mock
jest.mock('@/lib/LocaleProvider', () => ({
  useLocale: () => ({
    locale: 'ko',
    t: (tr: { ko: string; en: string }) => tr.ko,
  }),
}));

// i18n T mock
jest.mock('@/lib/i18n', () => ({
  T: {
    copy: { ko: '복사', en: 'Copy' },
    copied: { ko: '복사됨', en: 'Copied' },
  },
}));

// clipboard mock
Object.assign(navigator, {
  clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
});

const GPGGA = 'GPGGA,092750.000,5321.6802,N,00630.3372,W,1,8,1.03,61.7,M,55.2,M,,';

function run(value: string) {
  render(<NmeaChecksum />);
  const textarea = screen.getAllByRole('textbox')[0];
  fireEvent.change(textarea, { target: { value } });
  fireEvent.click(screen.getByRole('button', { name: /검증|계산/i }));
}

describe('NmeaChecksum', () => {
  test('기본 렌더링: 실행 버튼 존재', () => {
    render(<NmeaChecksum />);
    expect(screen.getByRole('button', { name: /검증|계산/i })).toBeInTheDocument();
  });

  test('유효 문장 입력 시 계산 체크섬 + ✅ 렌더', () => {
    run('$' + GPGGA + '*76');
    expect(screen.getByText('✅')).toBeInTheDocument();
    expect(screen.getAllByText(/76/).length).toBeGreaterThan(0);
  });

  test('틀린 체크섬 입력 시 ❌ + 올바른 체크섬(76) 렌더', () => {
    run('$' + GPGGA + '*99');
    expect(screen.getByText('❌')).toBeInTheDocument();
    expect(screen.getAllByText(/76/).length).toBeGreaterThan(0);
  });

  test('* 없는 본문 입력 시 계산 모드 결과 렌더', () => {
    run('$' + GPGGA);
    // 완성 문장(*76)이 어딘가 렌더
    expect(screen.getAllByText(/\*76/).length).toBeGreaterThan(0);
  });

  test('복사 버튼 클릭 시 클립보드 호출', () => {
    run('$' + GPGGA + '*76');
    const copyBtn = screen.getAllByRole('button', { name: /복사/i })[0];
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
