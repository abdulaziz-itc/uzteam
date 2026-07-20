/** Pick a localized column from a DB row: pickL(row, 'title', 'uz') → row.titleUz */
export function pickL<T extends Record<string, unknown>>(
  row: T,
  field: string,
  locale: string,
): string {
  const suffix = locale === 'uz' ? 'Uz' : locale === 'ru' ? 'Ru' : 'En';
  const val = row[`${field}${suffix}`] ?? row[`${field}En`];
  return typeof val === 'string' ? val : '';
}
