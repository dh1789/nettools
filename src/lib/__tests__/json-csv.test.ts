import { jsonToCsv } from '../json-csv';

describe('jsonToCsv', () => {
  // Happy Path
  test('단순 배열 변환', () => {
    const json = JSON.stringify([{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]);
    const result = jsonToCsv(json, ',');
    expect(result.error).toBeUndefined();
    expect(result.csv).toBe('name,age\nAlice,30\nBob,25');
    expect(result.rowCount).toBe(2);
    expect(result.colCount).toBe(2);
  });

  test('빈 배열 처리', () => {
    const result = jsonToCsv('[]', ',');
    expect(result.error).toBeUndefined();
    expect(result.csv).toBe('');
    expect(result.rowCount).toBe(0);
    expect(result.colCount).toBe(0);
  });

  // Boundary: RFC 4180 이스케이프
  test('값에 쉼표 포함 시 큰따옴표 감싸기', () => {
    const json = JSON.stringify([{ name: 'Smith, John', age: 40 }]);
    const result = jsonToCsv(json, ',');
    expect(result.error).toBeUndefined();
    expect(result.csv).toBe('name,age\n"Smith, John",40');
  });

  test('값에 개행 포함 시 큰따옴표 감싸기', () => {
    const json = JSON.stringify([{ desc: 'line1\nline2' }]);
    const result = jsonToCsv(json, ',');
    expect(result.error).toBeUndefined();
    expect(result.csv).toBe('desc\n"line1\nline2"');
  });

  test('값에 큰따옴표 포함 시 이스케이프', () => {
    const json = JSON.stringify([{ name: 'He said "hello"' }]);
    const result = jsonToCsv(json, ',');
    expect(result.error).toBeUndefined();
    expect(result.csv).toBe('name\n"He said ""hello"""');
  });

  test('null/undefined 값 처리', () => {
    const json = JSON.stringify([{ name: 'Alice', score: null }]);
    const result = jsonToCsv(json, ',');
    expect(result.error).toBeUndefined();
    expect(result.csv).toBe('name,score\nAlice,');
  });

  // Edge: 에러 처리
  test('배열이 아닌 JSON 입력 시 에러', () => {
    const result = jsonToCsv('{"key": "value"}', ',');
    expect(result.error).toBeDefined();
    expect(result.csv).toBe('');
  });

  test('유효하지 않은 JSON 입력 시 에러', () => {
    const result = jsonToCsv('not json', ',');
    expect(result.error).toBeDefined();
    expect(result.csv).toBe('');
  });

  test('중첩 객체 평탄화 (dot notation)', () => {
    const json = JSON.stringify([{ name: 'Alice', addr: { city: 'Seoul', zip: '12345' } }]);
    const result = jsonToCsv(json, ',');
    expect(result.error).toBeUndefined();
    expect(result.csv).toBe('name,addr.city,addr.zip\nAlice,Seoul,12345');
  });

  // Boundary: 구분자 옵션
  test('탭 구분자 사용', () => {
    const json = JSON.stringify([{ name: 'Alice', age: 30 }]);
    const result = jsonToCsv(json, '\t');
    expect(result.error).toBeUndefined();
    expect(result.csv).toBe('name\tage\nAlice\t30');
  });

  test('세미콜론 구분자 사용', () => {
    const json = JSON.stringify([{ name: 'Alice', age: 30 }]);
    const result = jsonToCsv(json, ';');
    expect(result.error).toBeUndefined();
    expect(result.csv).toBe('name;age\nAlice;30');
  });

  test('배열 요소가 객체가 아닌 경우 에러', () => {
    const result = jsonToCsv('[1, 2, 3]', ',');
    expect(result.error).toBeDefined();
    expect(result.csv).toBe('');
  });
});
