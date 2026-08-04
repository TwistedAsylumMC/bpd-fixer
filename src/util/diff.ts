export function lineDiff(before: string, after: string): string {
  const a = before.split('\n');
  const b = after.split('\n');
  const out: string[] = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    if (a[i] === b[i]) continue;
    if (a[i] !== undefined) out.push('  - ' + a[i]);
    if (b[i] !== undefined) out.push('  + ' + b[i]);
  }
  return out.join('\n');
}
