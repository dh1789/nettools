/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { JsonCsvConverter } from '../JsonCsvConverter';

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

// URL.createObjectURL mock
global.URL.createObjectURL = jest.fn(() => 'blob:mock');
global.URL.revokeObjectURL = jest.fn();

describe('JsonCsvConverter', () => {
  const validJson = JSON.stringify([{ name: 'Alice', age: 30 }]);

  function renderAndConvert(value = validJson) {
    render(<JsonCsvConverter />);
    const textarea = screen.getAllByRole('textbox')[0];
    fireEvent.change(textarea, { target: { value } });
    fireEvent.click(screen.getByRole('button', { name: /변환/i }));
  }

  test('기본 렌더링: 변환 버튼 존재', () => {
    render(<JsonCsvConverter />);
    expect(screen.getByRole('button', { name: /변환/i })).toBeInTheDocument();
  });

  test('변환 버튼 클릭 시 CSV 출력 텍스트에어리어 표시', () => {
    renderAndConvert();
    const outputs = screen.getAllByRole('textbox');
    expect(outputs.length).toBeGreaterThanOrEqual(2);
  });

  test('잘못된 JSON 입력 시 에러 표시', () => {
    render(<JsonCsvConverter />);
    const textarea = screen.getAllByRole('textbox')[0];
    fireEvent.change(textarea, { target: { value: 'not json' } });
    fireEvent.click(screen.getByRole('button', { name: /변환/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('지우기 버튼 클릭 시 입력 초기화', () => {
    render(<JsonCsvConverter />);
    const textarea = screen.getAllByRole('textbox')[0];
    fireEvent.change(textarea, { target: { value: validJson } });
    fireEvent.click(screen.getByRole('button', { name: /지우기/i }));
    expect((textarea as HTMLTextAreaElement).value).toBe('');
  });

  test('복사 버튼 클릭 시 클립보드에 복사', () => {
    renderAndConvert();
    fireEvent.click(screen.getByRole('button', { name: /클립보드에 복사/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  test('다운로드 버튼 클릭 시 다운로드 트리거', () => {
    renderAndConvert();
    // anchor click mock
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    fireEvent.click(screen.getByRole('button', { name: /CSV 파일 다운로드/i }));
    expect(URL.createObjectURL).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  test('구분자 변경 후 변환', () => {
    render(<JsonCsvConverter />);
    const textarea = screen.getAllByRole('textbox')[0];
    fireEvent.change(textarea, { target: { value: validJson } });
    // 탭 구분자로 변경
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '\t' } });
    fireEvent.click(screen.getByRole('button', { name: /변환/i }));
    const outputs = screen.getAllByRole('textbox');
    expect(outputs.length).toBeGreaterThanOrEqual(2);
  });

  test('행수/열수 통계 표시', () => {
    renderAndConvert();
    expect(screen.getByText(/1행|rows/i)).toBeInTheDocument();
  });
});
