import {
  fmt as fmtSteps,
  wrapNeg,
  multiply,
  fraction,
  approx as approxSteps,
  sqrtExactApprox,
  stepHeader,
} from "./steps";

export type SolverResult = {
  ok: boolean;
  title: string;
  value: string;
  steps: string[];
};

function fmt(n: number): string {
  return fmtSteps(n);
}

export function solveLinear(a: number, b: number, c: number): SolverResult {
  if (isNaN(a) || isNaN(b) || isNaN(c))
    return {
      ok: false,
      title: "Erro",
      value: "Preencha todos os campos.",
      steps: [],
    };
  if (a === 0)
    return {
      ok: false,
      title: "Erro",
      value: 'Coeficiente "a" não pode ser zero.',
      steps: [],
    };
  const x = (c - b) / a;
  const steps: string[] = [];
  steps.push(stepHeader(1, "Identificar os valores"));
  steps.push(`a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}`);
  steps.push(stepHeader(2, "Aplicar a fórmula"));
  steps.push("ax + b = c");
  steps.push(stepHeader(3, "Substituir os valores"));
  steps.push(`${fmt(a)}x + ${wrapNeg(b)} = ${fmt(c)}`);
  steps.push(stepHeader(4, "Resolver os cálculos intermediários"));
  const right = c - b;
  steps.push(`${fmt(a)}x = ${fmt(c)} - ${wrapNeg(b)} = ${fmt(right)}`);
  steps.push(stepHeader(5, "Apresentar o resultado final"));
  steps.push(`x = ${fmt(right)} ÷ ${fmt(a)} = ${fmt(x)}`);
  return { ok: true, title: "Solução", value: `x = ${fmt(x)}`, steps };
}

export function solveQuadratic(a: number, b: number, c: number): SolverResult {
  if (isNaN(a) || isNaN(b) || isNaN(c))
    return {
      ok: false,
      title: "Erro",
      value: "Preencha todos os campos.",
      steps: [],
    };
  if (a === 0)
    return {
      ok: false,
      title: "Erro",
      value: 'Coeficiente "a" não pode ser zero.',
      steps: [],
    };
  const steps: string[] = [];
  steps.push(stepHeader(1, "Identificar os valores"));
  steps.push(`a = ${fmt(a)}, b = ${fmt(b)}, c = ${fmt(c)}`);

  steps.push(stepHeader(2, "Aplicar a fórmula do discriminante"));
  steps.push("Δ = b² - 4 × a × c");

  steps.push(stepHeader(3, "Substituir os valores"));
  steps.push(`Δ = ${wrapNeg(b, true)}² - 4 × ${fmt(a)} × ${fmt(c)}`);

  const delta = b * b - 4 * a * c;
  steps.push(stepHeader(4, "Resolver os cálculos intermediários"));
  steps.push(`Δ = ${fmt(b * b)} - ${fmt(4 * a * c)}`);
  steps.push(`Δ = ${fmt(delta)}`);

  if (delta < 0) {
    return {
      ok: false,
      title: "Sem raízes reais",
      value: `Δ = ${fmt(delta)} < 0`,
      steps,
    };
  }

  steps.push(stepHeader(5, "Aplicar a fórmula de Bhaskara"));
  steps.push("x = (-b ± √Δ) / (2 × a)");

  if (delta === 0) {
    const x = -b / (2 * a);
    steps.push(stepHeader(3, "Substituir os valores (Δ = 0)"));
    steps.push(`x = (-${wrapNeg(b)}) / (${fmt(2 * a)}) = ${fmt(x)}`);
    return { ok: true, title: "Raiz dupla", value: `x = ${fmt(x)}`, steps };
  }

  const sqrtD = Math.sqrt(delta);
  const x1 = (-b + sqrtD) / (2 * a);
  const x2 = (-b - sqrtD) / (2 * a);

  const sqrtInfo = sqrtExactApprox(delta);
  steps.push(`√Δ = ${sqrtInfo.exact}`);
  steps.push(`√Δ ≈ ${sqrtInfo.approx}`);

  steps.push(stepHeader(4, "Substituir e mostrar frações antes de aproximar"));
  const denom = 2 * a;
  steps.push(`x₁ = (${wrapNeg(-b)} + ${sqrtInfo.exact}) / (${fmt(denom)})`);
  steps.push(`x₂ = (${wrapNeg(-b)} - ${sqrtInfo.exact}) / (${fmt(denom)})`);

  steps.push("Agora calculamos os valores:");
  steps.push(`x₁ ≈ ${fmt(x1)}`);
  steps.push(`x₂ ≈ ${fmt(x2)}`);

  return {
    ok: true,
    title: "Duas raízes reais",
    value: `x₁ = ${fmt(x1)}   x₂ = ${fmt(x2)}`,
    steps,
  };
}

export function solveSistema(
  a1: number,
  b1: number,
  c1: number,
  a2: number,
  b2: number,
  c2: number,
): SolverResult {
  const steps: string[] = [];
  steps.push(stepHeader(1, "Identificar os valores"));
  steps.push(`a₁ = ${fmt(a1)}, b₁ = ${fmt(b1)}, c₁ = ${fmt(c1)}`);
  steps.push(`a₂ = ${fmt(a2)}, b₂ = ${fmt(b2)}, c₂ = ${fmt(c2)}`);

  steps.push(stepHeader(2, "Calcular o determinante"));
  const det = a1 * b2 - a2 * b1;
  steps.push(
    `Det = a₁×b₂ - a₂×b₁ = ${fmt(a1)}×${fmt(b2)} - ${fmt(a2)}×${fmt(b1)}`,
  );
  steps.push(`Det = ${fmt(det)}`);

  if (det === 0)
    return {
      ok: false,
      title: "Sistema indeterminado",
      value: "Determinante = 0",
      steps,
    };

  steps.push(stepHeader(3, "Aplicar Cramer para x"));
  const nx = c1 * b2 - c2 * b1;
  steps.push(`x = (c₁×b₂ - c₂×b₁) / Det`);
  steps.push(
    `x = (${fmt(c1)}×${fmt(b2)} - ${fmt(c2)}×${fmt(b1)}) / ${fmt(det)}`,
  );
  steps.push(`x = ${fmt(nx)} / ${fmt(det)}`);
  steps.push(`x = ${fmt(nx / det)}`);

  steps.push(stepHeader(4, "Aplicar Cramer para y"));
  const ny = a1 * c2 - a2 * c1;
  steps.push(`y = (a₁×c₂ - a₂×c₁) / Det`);
  steps.push(
    `y = (${fmt(a1)}×${fmt(c2)} - ${fmt(a2)}×${fmt(c1)}) / ${fmt(det)}`,
  );
  steps.push(`y = ${fmt(ny)} / ${fmt(det)}`);
  steps.push(`y = ${fmt(ny / det)}`);

  return {
    ok: true,
    title: "Solução do Sistema",
    value: `x = ${fmt(nx / det)}   y = ${fmt(ny / det)}`,
    steps,
  };
}

export function solvePA(a1: number, r: number, n: number): SolverResult {
  if (isNaN(a1) || isNaN(r) || isNaN(n) || n < 1)
    return { ok: false, title: "Erro", value: "Valores inválidos.", steps: [] };
  const an = a1 + (n - 1) * r;
  const sn = (n * (a1 + an)) / 2;
  const termos =
    Array.from({ length: Math.min(n, 8) }, (_, i) => fmt(a1 + i * r)).join(
      ", ",
    ) + (n > 8 ? ", ..." : "");
  const steps: string[] = [];
  steps.push(stepHeader(1, "Identificar os valores"));
  steps.push(`a₁ = ${fmt(a1)}, r = ${fmt(r)}, n = ${fmt(n)}`);
  steps.push(stepHeader(2, "Aplicar fórmula do termo n"));
  steps.push("aₙ = a₁ + (n - 1) × r");
  steps.push(stepHeader(3, "Substituir os valores"));
  steps.push(`aₙ = ${fmt(a1)} + (${n - 1}) × ${fmt(r)}`);
  steps.push(stepHeader(4, "Resolver os cálculos intermediários"));
  steps.push(`aₙ = ${fmt(an)}`);
  steps.push(stepHeader(5, "Apresentar resultado do somatório"));
  steps.push("Sₙ = n × (a₁ + aₙ) / 2");
  steps.push(`Sₙ = ${fmt(n)} × (${fmt(a1)} + ${fmt(an)}) / 2 = ${fmt(sn)}`);
  steps.push(`Termos: ${termos}`);
  return {
    ok: true,
    title: "PA Calculada",
    value: `aₙ = ${fmt(an)}   Sₙ = ${fmt(sn)}`,
    steps,
  };
}

export function solvePG(a1: number, q: number, n: number): SolverResult {
  if (isNaN(a1) || isNaN(q) || isNaN(n) || n < 1)
    return { ok: false, title: "Erro", value: "Valores inválidos.", steps: [] };
  if (q === 0)
    return {
      ok: false,
      title: "Erro",
      value: "A razão não pode ser zero.",
      steps: [],
    };
  const an = a1 * Math.pow(q, n - 1);
  const sn = q === 1 ? a1 * n : (a1 * (1 - Math.pow(q, n))) / (1 - q);
  const termos =
    Array.from({ length: Math.min(n, 6) }, (_, i) =>
      fmt(a1 * Math.pow(q, i)),
    ).join(", ") + (n > 6 ? ", ..." : "");
  const steps: string[] = [];
  steps.push(stepHeader(1, "Identificar os valores"));
  steps.push(`a₁ = ${fmt(a1)}, q = ${fmt(q)}, n = ${fmt(n)}`);
  steps.push(stepHeader(2, "Calcular aₙ"));
  steps.push("aₙ = a₁ × qⁿ⁻¹");
  steps.push(`aₙ = ${fmt(a1)} × ${fmt(q)}^${n - 1} = ${fmt(an)}`);
  steps.push(stepHeader(3, "Calcular Sₙ"));
  if (q === 1) steps.push(`Sₙ = a₁ × n = ${fmt(a1)} × ${fmt(n)} = ${fmt(sn)}`);
  else steps.push(`Sₙ = a₁ × (1 - qⁿ) / (1 - q) = ${fmt(sn)}`);
  steps.push(`Termos: ${termos}`);
  return {
    ok: true,
    title: "PG Calculada",
    value: `aₙ = ${fmt(an)}   Sₙ = ${fmt(sn)}`,
    steps,
  };
}

export function solveExponential(a: number, b: number): SolverResult {
  if (isNaN(a) || isNaN(b) || a <= 0 || a === 1 || b <= 0)
    return {
      ok: false,
      title: "Erro",
      value: "Base > 0, base ≠ 1 e resultado > 0.",
      steps: [],
    };
  const steps: string[] = [];
  steps.push(stepHeader(1, "Identificar os valores"));
  steps.push(`a = ${fmt(a)}, b = ${fmt(b)}`);
  steps.push(stepHeader(2, "Aplicar a fórmula"));
  steps.push("aˣ = b  →  x = log(b) / log(a)");
  steps.push(stepHeader(3, "Substituir os valores"));
  steps.push(`x = log(${fmt(b)}) / log(${fmt(a)})`);
  const num = Math.log(b);
  const den = Math.log(a);
  const x = num / den;
  steps.push(stepHeader(4, "Resolver os cálculos intermediários"));
  steps.push(`log(${fmt(b)}) ≈ ${fmt(num)}`);
  steps.push(`log(${fmt(a)}) ≈ ${fmt(den)}`);
  steps.push(`x ≈ ${fmt(num)} / ${fmt(den)} ≈ ${fmt(x)}`);
  return {
    ok: true,
    title: "Expoente encontrado",
    value: `x = ${fmt(x)}`,
    steps,
  };
}

export function solveCalculator(expression: string): SolverResult {
  const cleaned = expression.replace(/×/g, "*").replace(/÷/g, "/").trim();
  if (!cleaned) {
    return {
      ok: false,
      title: "Erro",
      value: "Digite uma expressão.",
      steps: [],
    };
  }
  if (/[^0-9+\-*/().\s]/.test(cleaned)) {
    return {
      ok: false,
      title: "Erro",
      value: "Expressão inválida.",
      steps: [],
    };
  }

  try {
    const result = Function(`"use strict"; return (${cleaned})`)();
    if (typeof result !== "number" || !Number.isFinite(result)) {
      return {
        ok: false,
        title: "Erro",
        value: "Expressão inválida.",
        steps: [],
      };
    }
    const steps: string[] = [];
    steps.push(stepHeader(1, "Expressão"));
    steps.push(`${expression}`);
    steps.push(stepHeader(2, "Avaliar a expressão"));
    steps.push(`${expression} = ${fmt(result)}`);
    return { ok: true, title: "Resultado", value: fmt(result), steps };
  } catch (error) {
    return {
      ok: false,
      title: "Erro",
      value: "Expressão inválida.",
      steps: [],
    };
  }
}

export function solvePorcentagem(
  v: number,
  p: number,
  tipo: "of" | "add" | "sub",
): SolverResult {
  if (isNaN(v) || isNaN(p))
    return {
      ok: false,
      title: "Erro",
      value: "Preencha os valores.",
      steps: [],
    };
  const pct = (v * p) / 100;
  const steps: string[] = [];
  steps.push(stepHeader(1, "Identificar os valores"));
  steps.push(`Valor = ${fmt(v)}, Porcentagem = ${fmt(p)}%`);
  steps.push(stepHeader(2, "Aplicar fórmula"));
  steps.push("Porcentagem = Valor × (p / 100)");
  steps.push(stepHeader(3, "Substituir os valores"));
  steps.push(`${fmt(v)} × ${fmt(p)}/100 = ${fmt(v)} × ${fmt(p / 100)}`);
  steps.push(stepHeader(4, "Resolver os cálculos intermediários"));
  steps.push(`${fmt(pct)}`);

  if (tipo === "of")
    return { ok: true, title: "Resultado", value: `${fmt(pct)}`, steps };

  if (tipo === "add") {
    const total = v + pct;
    steps.push(stepHeader(5, "Valor com acréscimo"));
    steps.push(`${fmt(v)} + ${fmt(pct)} = ${fmt(total)}`);
    return {
      ok: true,
      title: "Valor com acréscimo",
      value: `${fmt(total)}`,
      steps,
    };
  }

  const total = v - pct;
  steps.push(stepHeader(5, "Valor com desconto"));
  steps.push(`${fmt(v)} - ${fmt(pct)} = ${fmt(total)}`);
  return {
    ok: true,
    title: "Valor com desconto",
    value: `${fmt(total)}`,
    steps,
  };
}

export function solveRegra3(
  a: number,
  b: number,
  c: number,
  tipo: "dir" | "inv",
): SolverResult {
  if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0)
    return {
      ok: false,
      title: "Erro",
      value: "Valores inválidos (A ≠ 0).",
      steps: [],
    };
  const steps: string[] = [];
  steps.push(stepHeader(1, "Identificar os valores"));
  steps.push(`A = ${fmt(a)}, B = ${fmt(b)}, C = ${fmt(c)}`);

  if (tipo === "dir") {
    steps.push(stepHeader(2, "Aplicar a relação (proporção direta)"));
    steps.push("A / B = C / x  →  x = (B × C) / A");
    steps.push(stepHeader(3, "Substituir os valores"));
    steps.push(`x = (${fmt(b)} × ${fmt(c)}) / ${fmt(a)}`);
    const x = (b * c) / a;
    steps.push(stepHeader(4, "Resolver os cálculos intermediários"));
    const fr = fraction(b * c, a);
    steps.push(`x = ${fr.raw}`);
    if (fr.simplified !== fr.raw) steps.push(`x = ${fr.simplified}`);
    steps.push(`x = ${fmt(x)}`);
    return {
      ok: true,
      title: "Proporcional Direta",
      value: `x = ${fmt(x)}`,
      steps,
    };
  }

  steps.push(stepHeader(2, "Aplicar a relação (proporção inversa)"));
  steps.push("A × B = C × x  →  x = (A × B) / C");
  steps.push(stepHeader(3, "Substituir os valores"));
  steps.push(`x = (${fmt(a)} × ${fmt(b)}) / ${fmt(c)}`);
  const x = (a * b) / c;
  const fr2 = fraction(a * b, c);
  steps.push(stepHeader(4, "Resolver os cálculos intermediários"));
  steps.push(`x = ${fr2.raw}`);
  if (fr2.simplified !== fr2.raw) steps.push(`x = ${fr2.simplified}`);
  steps.push(`x = ${fmt(x)}`);
  return {
    ok: true,
    title: "Proporcional Inversa",
    value: `x = ${fmt(x)}`,
    steps,
  };
}
