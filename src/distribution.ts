
function factorial(n: number, until: number = 1): number {
  let res = 1;
  for (let i = until; i <= n; i++) {
    res *= i;
  }
  return res;
}

function combination(n: number, k: number): number {
  if (k > n) return 0;
  return factorial(n, n - k + 1) / factorial(k);
}

export function binomial(n: number, p: number, x: number): number {
  return combination(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x); 
}

const sqrt2pi = Math.sqrt(2 * Math.PI);
export function normal(m: number, s: number, x: number): number {
  return (1/(s*sqrt2pi)) * Math.pow(Math.E, (-1/2)*Math.pow((x-m)/s, 2))
}

