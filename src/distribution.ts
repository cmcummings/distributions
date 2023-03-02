

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

const N = 1000;
function estimateIntegration(f: (x: number) => number, a: number, b: number): number {
  let sum = 0;

  for (let n = 1; n <= N; n += 1) {
    const x = a + (2 * n - 1) / (2 * N) * (b - a);
    sum += f(x)
  }

  return (b - a)/N * sum;
}

export function binomial(n: number, p: number, x: number): (x: number) => number {
  return (x: number) => {
    return combination(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x); 
  } 
}

const sqrt2pi = Math.sqrt(2 * Math.PI);
export function normal(m: number, s: number): (x: number) => number {
  return (x: number) => {
    return (1/(s*sqrt2pi)) * Math.pow(Math.E, (-1/2)*Math.pow((x-m)/s, 2))
  }
}

export function normalcdf(m: number, s: number, a: number, b: number): number {
  return estimateIntegration(normal(m, s), a, b); 
}