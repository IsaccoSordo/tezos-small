/**
 * Formats a number to string with specified decimal places, removing trailing zeroes.
 * @param value - The number to format
 * @param maxDigits - Maximum decimal places (defaults to 6)
 * @returns Formatted string without trailing zeroes
 */
export function formatNumber(value: number, maxDigits = 6): string {
  return Number(value.toFixed(maxDigits)).toString();
}
