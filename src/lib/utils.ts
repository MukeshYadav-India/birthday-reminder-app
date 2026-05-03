export function isValidDate(month: number, day: number) {
  if (!Number.isInteger(month) || !Number.isInteger(day)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const test = new Date(2000, month - 1, day);
  return test.getMonth() === month - 1 && test.getDate() === day;
}