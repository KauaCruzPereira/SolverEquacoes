export function fmt(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(6)).toString();
}

export function wrapNeg(n: number | string, forPower = false) {
  const s = typeof n === "number" ? fmt(n) : String(n);
  if (s.startsWith("-")) return forPower ? `(${s})` : `(${s})`;
  return s;
}

export function multiply(...parts: string[]) {
  return parts.join(" × ");
}

export function fraction(numer: number, denom: number) {
  const gcd = (a: number, b: number): number =>
    b === 0 ? Math.abs(a) : gcd(b, a % b);
  const g = gcd(numer, denom);
  const sn = numer / g;
  const sd = denom / g;
  return { raw: `${numer} / ${denom}`, simplified: `${sn} / ${sd}` };
}

export function approx(n: number) {
  return fmt(n);
}

export function sqrtExactApprox(n: number) {
  const exact = `√${n}`;
  const approxVal = approx(Math.sqrt(n));
  return { exact, approx: approxVal };
}

export function stepHeader(stepNumber: number, title: string) {
  return `Passo ${stepNumber}: ${title}`;
}
