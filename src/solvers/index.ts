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

  type NumNode = { type: "number"; value: number; grouped?: boolean };
  type OpNode = {
    type: "op";
    op: string;
    left: Node;
    right: Node;
    grouped?: boolean;
  };
  type UnaryNode = {
    type: "unary";
    op: "+" | "-";
    operand: Node;
    grouped?: boolean;
  };
  type Node = NumNode | OpNode | UnaryNode;

  function tokenize(s: string): string[] {
    const tokens: string[] = [];
    let i = 0;
    const isUnaryContext = () =>
      tokens.length === 0 ||
      tokens[tokens.length - 1] === "(" ||
      tokens[tokens.length - 1] === "+" ||
      tokens[tokens.length - 1] === "-" ||
      tokens[tokens.length - 1] === "*" ||
      tokens[tokens.length - 1] === "/";

    while (i < s.length) {
      const ch = s[i];
      if (ch === " ") {
        i++;
        continue;
      }
      if ((ch === "+" || ch === "-") && isUnaryContext()) {
        let sign = 1;
        while (i < s.length && (s[i] === "+" || s[i] === "-")) {
          if (s[i] === "-") sign *= -1;
          i++;
        }
        if (i < s.length && /[0-9.]/.test(s[i])) {
          let j = i;
          while (j < s.length && /[0-9.]/.test(s[j])) j++;
          const number = s.slice(i, j);
          tokens.push(sign < 0 ? `-${number}` : number);
          i = j;
          continue;
        }
        if (i < s.length && s[i] === "(") {
          if (sign < 0) {
            tokens.push("-");
          }
          continue;
        }
      }
      if (/[0-9.]/.test(ch)) {
        let j = i;
        while (j < s.length && /[0-9.]/.test(s[j])) j++;
        tokens.push(s.slice(i, j));
        i = j;
        continue;
      }
      if (/[+\-*/()]/.test(ch)) {
        tokens.push(ch);
        i++;
        continue;
      }
      i++;
    }
    return tokens;
  }

  function precedence(op: string) {
    if (op === "+" || op === "-") return 1;
    if (op === "*" || op === "/") return 2;
    return 0;
  }

  function formatNodeExpr(n: Node): string {
    if (n.type === "number") {
      return n.value < 0 ? `(${fmt(n.value)})` : fmt(n.value);
    }
    return treeToString(n);
  }

  function parseExpression(tokens: string[]): Node {
    let pos = 0;

    const peek = () => tokens[pos];
    const next = () => tokens[pos++];

    function parseFactor(): Node {
      const token = peek();
      if (token === "+" || token === "-") {
        const sign = next();
        const node = parseFactor();
        if (sign === "-") {
          if (node.type === "number") {
            return { type: "number", value: -node.value };
          }
          return { type: "unary", op: "-", operand: node };
        }
        return node;
      }

      if (token === "(") {
        next();
        const node = parseExpr();
        if (peek() !== ")") throw new Error("Missing closing parenthesis");
        next();
        return { ...node, grouped: true };
      }

      if (/^-?[0-9]+(?:\.[0-9]+)?$/.test(token)) {
        next();
        return { type: "number", value: parseFloat(token) };
      }

      throw new Error("Expressão inválida.");
    }

    function parseTerm(): Node {
      let node = parseFactor();
      while (peek() === "*" || peek() === "/") {
        const op = next();
        const right = parseFactor();
        node = { type: "op", op, left: node, right };
      }
      return node;
    }

    function parseExpr(): Node {
      let node = parseTerm();
      while (peek() === "+" || peek() === "-") {
        const op = next();
        const right = parseTerm();
        node = { type: "op", op, left: node, right };
      }
      return node;
    }

    const root = parseExpr();
    if (pos < tokens.length) throw new Error("Expressão inválida.");
    return root;
  }

  function treeToString(n: Node): string {
    if (n.type === "number") return formatNodeExpr(n);
    if (n.type === "unary") {
      const operand = n.operand;
      const operandStr =
        operand.type === "op" || operand.type === "unary"
          ? `(${treeToString(operand)})`
          : formatNodeExpr(operand);
      return n.op === "-" ? `-${operandStr}` : `+${operandStr}`;
    }
    const left = n.left;
    const right = n.right;
    const leftStr =
      left.type === "op" && precedence(left.op) < precedence(n.op)
        ? `(${treeToString(left)})`
        : formatNodeExpr(left);
    let rightStr =
      right.type === "op" &&
      (precedence(right.op) < precedence(n.op) ||
        (n.op === "/" && right.type === "op"))
        ? `(${treeToString(right)})`
        : formatNodeExpr(right);
    if (n.op === "-" && right.type === "number" && right.value < 0) {
      rightStr = `(${fmt(right.value)})`;
    }
    if (n.op === "/" && right.type === "number" && right.value < 0) {
      rightStr = `(${fmt(right.value)})`;
    }
    const sym = n.op === "*" ? "×" : n.op === "/" ? "÷" : n.op;
    return `${leftStr} ${sym} ${rightStr}`;
  }

  function compute(op: string, a: number, b: number): number {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return a / b;
    throw new Error("op");
  }

  function opName(op: string) {
    if (op === "+") return "Somar";
    if (op === "-") return "Subtrair";
    if (op === "*") return "Multiplicar";
    if (op === "/") return "Dividir";
    return "Operação";
  }

  function signRuleInfo(
    op: string,
    a: number,
    b: number,
    subExpr: string,
  ):
    | {
        identifyTitle: string;
        identifyText: string;
        ruleTitle: string;
        ruleText: string;
        original: string;
        transformed: string;
        computeTitle: string;
        computeOp: string;
        computeA: number;
        computeB: number;
      }
    | undefined {
    if (op === "-" && b < 0) {
      return {
        identifyTitle: "Identificar sinais",
        identifyText:
          "Identificar que existe uma subtração de número negativo.",
        ruleTitle: "Aplicar a regra dos sinais",
        ruleText: "a - (-b) = a + b",
        original: subExpr,
        transformed: `${fmt(a)} + ${fmt(Math.abs(b))}`,
        computeTitle: "Efetuar a soma",
        computeOp: "+",
        computeA: a,
        computeB: Math.abs(b),
      };
    }
    if (op === "+" && b < 0) {
      return {
        identifyTitle: "Identificar sinais",
        identifyText: "Identificar que existe uma soma com número negativo.",
        ruleTitle: "Aplicar a regra dos sinais",
        ruleText: "a + (-b) = a - b",
        original: subExpr,
        transformed: `${fmt(a)} - ${fmt(Math.abs(b))}`,
        computeTitle: "Efetuar a subtração",
        computeOp: "-",
        computeA: a,
        computeB: Math.abs(b),
      };
    }
    return undefined;
  }

  function reduceOnce(root: Node): {
    newRoot: Node;
    subExpr: string;
    op: string;
    a: number;
    b: number;
    res: number;
  } | null {
    function rec(n: Node): {
      node: Node;
      step?: { subExpr: string; op: string; a: number; b: number; res: number };
    } {
      if (n.type === "number") return { node: n };
      if (n.type === "unary") {
        const operandRes = rec(n.operand);
        n.operand = operandRes.node;
        if (operandRes.step) return { node: n, step: operandRes.step };
        if (n.operand.type === "number") {
          const a = n.operand.value;
          const res = n.op === "-" ? -a : a;
          const subExpr = treeToString(n);
          return {
            node: { type: "number", value: res },
            step: { subExpr, op: n.op, a, b: 0, res },
          };
        }
        return { node: n };
      }
      const leftRes = rec(n.left);
      n.left = leftRes.node;
      if (leftRes.step) return { node: n, step: leftRes.step };
      const rightRes = rec(n.right);
      n.right = rightRes.node;
      if (rightRes.step) return { node: n, step: rightRes.step };
      if (n.left.type === "number" && n.right.type === "number") {
        const a = n.left.value;
        const b = n.right.value;
        const res = compute(n.op, a, b);
        const subExpr = treeToString(n);
        return {
          node: { type: "number", value: res },
          step: { subExpr, op: n.op, a, b, res },
        };
      }
      return { node: n };
    }
    const r = rec(root);
    if (r.step) return { newRoot: r.node, ...r.step };
    return null;
  }

  try {
    const tokens = tokenize(cleaned);
    if (tokens.length === 0) throw new Error("empty");
    const ast = parseExpression(tokens);
    const steps: string[] = [];
    steps.push(stepHeader(1, "Expressão"));
    steps.push(expression);

    let current: Node = ast;
    let stepNumber = 2;
    while (true) {
      const red = reduceOnce(current);
      if (!red) break;

      const signInfo = signRuleInfo(red.op, red.a, red.b, red.subExpr);
      if (signInfo) {
        steps.push(stepHeader(stepNumber, signInfo.identifyTitle));
        steps.push(signInfo.identifyText);
        stepNumber++;
        steps.push(stepHeader(stepNumber, signInfo.ruleTitle));
        steps.push(signInfo.ruleText);
        steps.push(signInfo.original);
        steps.push(signInfo.transformed);
        stepNumber++;
      }

      const title =
        red.subExpr.startsWith("(") && red.subExpr.endsWith(")")
          ? "Resolver o parêntese"
          : signInfo
            ? signInfo.computeTitle
            : opName(red.op);
      steps.push(stepHeader(stepNumber, title));
      const opUsed = signInfo ? signInfo.computeOp : red.op;
      const aUsed = signInfo ? signInfo.computeA : red.a;
      const bUsed = signInfo ? signInfo.computeB : red.b;
      const sym = opUsed === "*" ? "×" : opUsed === "/" ? "÷" : opUsed;
      steps.push(
        `Operação: ${opName(opUsed)} (${fmt(aUsed)} ${sym} ${fmt(bUsed)})`,
      );
      const expl =
        title === "Resolver o parêntese"
          ? `Aqui resolvemos a expressão dentro do parêntese: ${red.subExpr} = ${fmt(red.res)}`
          : `Realizamos a operação ${fmt(aUsed)} ${sym} ${fmt(bUsed)} = ${fmt(red.res)}`;
      steps.push(`Explicação: ${expl}`);
      steps.push(`Resultado: ${fmt(red.res)}`);
      current = red.newRoot;
      steps.push(`Expressão atual: ${treeToString(current)}`);
      stepNumber++;
    }

    if (current.type !== "number") {
      return {
        ok: false,
        title: "Erro",
        value: "Não foi possível avaliar completamente.",
        steps: [],
      };
    }
    steps.push(stepHeader(stepNumber, "Resultado final"));
    steps.push(fmt(current.value));
    return { ok: true, title: "Resultado", value: fmt(current.value), steps };
  } catch (err) {
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
