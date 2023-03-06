

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
export function estimateIntegral(pdf: PDF, a: number, b: number): number {
  let sum = 0;

  for (let n = 1; n <= N; n += 1) {
    const x = a + (2 * n - 1) / (2 * N) * (b - a);
    sum += pdf(x)
  }

  return (b - a) / N * sum;
}

export function discreteCDF(pdf: PDF): CDF {
  return (a: number, b: number) => {
    a = Math.round(a);
    b = Math.floor(b);
    let res = 0;
    for (let x = a; x <= b; x++) {
      res += pdf(x);
    }
    return res;
  }
}

type PDF = (x: number) => number;
type CDF = (a: number, b: number) => number;

export function binomialpdf(n: number, p: number): PDF {
  return (x: number) => {
    if (x < 0) return 0;
    return combination(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
  }
}

export function binomialcdf(n: number, p: number): CDF {
  return discreteCDF(binomialpdf(n, p));
}

const sqrt2pi = Math.sqrt(2 * Math.PI);
export function normalpdf(m: number, s: number): PDF {
  return (x: number) => {
    return (1 / (s * sqrt2pi)) * Math.pow(Math.E, (-1 / 2) * Math.pow((x - m) / s, 2));
  }
}

export function normalcdf(m: number, s: number): CDF {
  return (a: number, b: number) => {
    return estimateIntegral(normalpdf(m, s), a, b);
  }
}


export function poissonpdf(l: number): PDF {
  return (x: number) => {
    if (x < 0) return 0;
    return Math.pow(Math.E, -l) * Math.pow(l, x) / factorial(x);
  }
}

export function poissoncdf(l: number): CDF {
  return discreteCDF(poissonpdf(l))
}


export function exponentialpdf(l: number): PDF {
  return (x: number) => {
    if (x < 0) return 0;
    return l * Math.pow(Math.E, -l * x);
  }
}

function exponentialcdf_lex(l: number, x: number) {
  if (x < 0) return 0;
  return 1 - Math.pow(Math.E, -l * x);
}

export function exponentialcdf(l: number): CDF {
  return (a: number, b: number) => {
    return exponentialcdf_lex(l, b) - exponentialcdf_lex(l, a);
  }
}


export function uniformpdf(a: number, b: number): PDF {
  return (x) => {
    if (x > b || x < a) return 0;
    return 1 / (b - a)
  }
}

export function uniformcdf(a: number, b: number): CDF {
  return (c: number, d: number) => {
    if ((c <= a && d <= a) || (c >= b && d >= b)) return 0;
    c = Math.max(c, a);
    d = Math.min(d, b);
    return (d - c) / (b - a);
  }
}


export function geometricpdf(p: number): PDF {
  return (k: number) => {
    if (k < 0) return 0;
    return Math.pow(1-p, k-1) * p;
  }
}

function geometriccdf_lex(p: number, k: number) {
  if (k < 0) return 0;
  return 1 - Math.pow(1-p, k); 
}

export function geometriccdf(p: number): CDF {
  return (a: number, b: number) => {
    return geometriccdf_lex(p, Math.floor(b)) - geometriccdf_lex(p, Math.ceil(a));
  }
}


export function nbinomialpdf(k: number, p: number): PDF {
  return (x: number) => {
    if (x < 0) return 0;
    return combination(x-1, k-1) * Math.pow(p, k) * Math.pow(1-p, x-k);
  }
}

export function nbinomialcdf(k: number, p: number): CDF {
  return discreteCDF(nbinomialpdf(k, p)); 
}


export function hypergeometricpdf(N: number, n: number, k: number): PDF {
  return (x: number) => {
    if (x < 0) return 0;
    return combination(k, x) * combination(N-k, n-x) / combination(N, n);
  }
}

export function hypergeometriccdf(N: number, n: number, k: number): CDF {
  return discreteCDF(hypergeometricpdf(N, n, k));
}
