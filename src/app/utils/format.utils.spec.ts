import { formatNumber } from './format.utils';

describe('formatNumber', () => {
  it('should remove trailing zeroes', () => {
    expect(formatNumber(1.5)).toBe('1.5');
    expect(formatNumber(1.0)).toBe('1');
    expect(formatNumber(1.1)).toBe('1.1');
    expect(formatNumber(1.123456)).toBe('1.123456');
  });

  it('should respect maxDigits parameter', () => {
    expect(formatNumber(1.123456789, 2)).toBe('1.12');
    expect(formatNumber(1.999, 2)).toBe('2');
    expect(formatNumber(1.456, 2)).toBe('1.46');
  });

  it('should handle whole numbers', () => {
    expect(formatNumber(100)).toBe('100');
    expect(formatNumber(0)).toBe('0');
  });

  it('should handle very small numbers', () => {
    expect(formatNumber(0.000001)).toBe('0.000001');
    expect(formatNumber(0.0000001)).toBe('0');
  });
});
