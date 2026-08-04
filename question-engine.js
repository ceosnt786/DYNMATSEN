(function (global) {
  "use strict";

  const VERSION = "2.0.0";

  const SUBJECT_LABELS = {
    mathematics: "Mathematics",
    math_literacy: "Mathematical Literacy"
  };

  const TOPICS = {
    mathematics: {
      7: {
        whole_numbers: ["calculations", "factors_multiples", "ratio_rate"],
        integers: ["operations", "order_operations"],
        fractions: ["operations", "conversions"],
        decimals: ["operations", "percentages"],
        exponents: ["basic_laws"],
        patterns: ["numeric_patterns", "geometric_patterns"],
        functions: ["input_output", "tables"],
        algebraic_expressions: ["like_terms", "substitution"],
        equations: ["one_step", "two_step"],
        geometry: ["straight_lines", "polygons", "transformations"],
        measurement: ["perimeter_area", "surface_area_volume"],
        data_handling: ["averages", "charts"],
        probability: ["simple_events"]
      },
      8: {
        integers: ["operations", "order_operations"],
        fractions: ["operations", "conversions"],
        decimals: ["operations", "percentages"],
        exponents: ["laws", "scientific_notation"],
        patterns: ["numeric_patterns", "geometric_patterns"],
        functions: ["input_output", "tables", "linear_relationships"],
        algebraic_expressions: ["like_terms", "multiply_monomials", "powers_monomials", "distribution", "substitution", "add_subtract_expressions"],
        equations: ["inspection", "inverse_operations", "variables_both_sides", "brackets", "fractional", "powers_roots", "word_problems"],
        geometry: ["straight_lines", "polygons", "transformations"],
        pythagoras: ["missing_side", "word_problems"],
        measurement: ["perimeter_area", "surface_area_volume"],
        data_handling: ["averages", "charts"],
        probability: ["simple_events"]
      },
      9: {
        integers: ["operations", "order_operations"],
        fractions: ["operations", "conversions"],
        exponents: ["laws", "scientific_notation"],
        patterns: ["linear_patterns", "geometric_patterns"],
        functions: ["linear_relationships", "graphs"],
        algebraic_expressions: ["polynomial_like_terms", "monomial_products", "brackets", "algebraic_fractions"],
        factorisation: ["common_factor", "difference_squares", "trinomials", "grouping", "algebraic_fractions"],
        equations: ["linear_brackets", "fractional_linear", "rational", "identity_no_solution", "word_problems"],
        geometry: ["straight_lines", "polygons", "transformations"],
        pythagoras: ["missing_side", "word_problems"],
        measurement: ["perimeter_area", "surface_area_volume"],
        data_handling: ["averages", "charts", "five_number_summary"],
        probability: ["simple_events", "combined_events"]
      },
      10: {
        algebraic_expressions: ["exponents", "surds", "algebraic_fractions"],
        equations: ["linear", "quadratic", "simultaneous", "inequalities"],
        factorisation: ["common_factor", "difference_squares", "trinomials", "grouping"],
        patterns: ["linear_patterns", "quadratic_patterns"],
        functions: ["linear", "quadratic", "hyperbola", "exponential"],
        finance: ["simple_interest", "compound_growth", "depreciation"],
        trigonometry: ["right_triangle", "special_angles", "identities"],
        analytical_geometry: ["gradient", "distance_midpoint", "equation_line"],
        euclidean_geometry: ["similarity", "congruency", "circle_basics"],
        measurement: ["surface_area_volume"],
        statistics: ["central_tendency", "quartiles", "variance_sd"],
        probability: ["combined_events", "venn_diagrams"]
      },
      11: {
        algebraic_expressions: ["exponents", "surds", "algebraic_fractions"],
        equations: ["quadratic", "simultaneous", "inequalities", "exponential_equations"],
        patterns: ["arithmetic_sequences", "geometric_sequences"],
        functions: ["quadratic", "hyperbola", "exponential", "trigonometric_graphs"],
        finance: ["compound_growth", "depreciation", "annuities_intro"],
        trigonometry: ["identities", "equations", "sine_cosine_area_rules"],
        analytical_geometry: ["gradient", "distance_midpoint", "equation_line", "parallel_perpendicular"],
        euclidean_geometry: ["circle_geometry", "similarity"],
        statistics: ["central_tendency", "quartiles", "variance_sd"],
        probability: ["combined_events", "dependent_independent"]
      },
      12: {
        algebraic_expressions: ["exponents", "surds", "algebraic_fractions"],
        equations: ["quadratic", "simultaneous", "inequalities", "exponential_equations"],
        patterns: ["arithmetic_sequences", "geometric_sequences", "series"],
        functions: ["quadratic", "hyperbola", "exponential", "inverse_functions", "trigonometric_graphs"],
        finance: ["compound_growth", "depreciation", "annuities", "present_future_value"],
        trigonometry: ["identities", "equations", "sine_cosine_area_rules", "two_dimensional_problems"],
        analytical_geometry: ["gradient", "distance_midpoint", "equation_line", "parallel_perpendicular", "circle_equation"],
        euclidean_geometry: ["circle_geometry", "proportionality"],
        statistics: ["central_tendency", "quartiles", "variance_sd", "regression"],
        probability: ["combined_events", "dependent_independent", "counting_principle"],
        calculus: ["first_principles", "differentiation", "tangents", "optimisation", "rate_of_change"]
      }
    },
    math_literacy: {
      10: {
        numbers_calculations: ["operations", "rounding", "ratios_rates"],
        finance: ["income_expenses", "budgets", "interest", "banking"],
        measurement: ["length_area_volume", "conversions", "perimeter_area"],
        maps_plans: ["scale", "floor_plans", "directions"],
        data_handling: ["tables_charts", "averages", "percentages"],
        probability: ["simple_probability"]
      },
      11: {
        numbers_calculations: ["operations", "ratios_rates", "percentages"],
        finance: ["income_expenses", "budgets", "interest", "tariffs", "tax_intro"],
        measurement: ["length_area_volume", "conversions", "perimeter_area"],
        maps_plans: ["scale", "floor_plans", "travel"],
        data_handling: ["tables_charts", "averages", "quartiles"],
        probability: ["simple_probability", "combined_events"]
      },
      12: {
        numbers_calculations: ["operations", "ratios_rates", "percentages"],
        finance: ["income_expenses", "budgets", "interest", "tariffs", "tax", "inflation"],
        measurement: ["length_area_volume", "conversions", "perimeter_area"],
        maps_plans: ["scale", "floor_plans", "travel", "models"],
        data_handling: ["tables_charts", "averages", "quartiles", "percentiles"],
        probability: ["simple_probability", "combined_events"]
      }
    }
  };

  const TOPIC_LABELS = {
    whole_numbers: "Whole numbers",
    integers: "Integers",
    fractions: "Common fractions",
    decimals: "Decimal fractions and percentages",
    exponents: "Exponents and scientific notation",
    patterns: "Patterns, sequences and series",
    functions: "Functions and relationships",
    algebraic_expressions: "Algebraic expressions",
    factorisation: "Factorisation",
    equations: "Equations and inequalities",
    geometry: "Geometry",
    pythagoras: "Pythagoras",
    measurement: "Measurement",
    data_handling: "Data handling",
    statistics: "Statistics",
    probability: "Probability",
    finance: "Finance, growth and decay",
    trigonometry: "Trigonometry",
    analytical_geometry: "Analytical geometry",
    euclidean_geometry: "Euclidean geometry",
    calculus: "Differential calculus",
    numbers_calculations: "Numbers and calculations",
    maps_plans: "Maps, plans and scale"
  };

  const SUBTOPIC_LABELS = {
    calculations: "Number calculations", factors_multiples: "Factors and multiples", ratio_rate: "Ratio and rate",
    operations: "Operations", order_operations: "Order of operations", conversions: "Conversions", percentages: "Percentages",
    basic_laws: "Basic exponent laws", laws: "Exponent laws", scientific_notation: "Scientific notation",
    numeric_patterns: "Numeric patterns", geometric_patterns: "Geometric patterns", linear_patterns: "Linear patterns", quadratic_patterns: "Quadratic patterns",
    arithmetic_sequences: "Arithmetic sequences", geometric_sequences: "Geometric sequences", series: "Series",
    input_output: "Input-output rules", tables: "Tables of values", linear_relationships: "Linear relationships", graphs: "Graphs",
    linear: "Linear functions/equations", quadratic: "Quadratic functions/equations", hyperbola: "Hyperbola", exponential: "Exponential functions",
    inverse_functions: "Inverse functions", trigonometric_graphs: "Trigonometric graphs",
    like_terms: "Collect like terms", polynomial_like_terms: "Collect polynomial like terms",
    multiply_monomials: "Multiply monomials", monomial_products: "Monomial products and powers", powers_monomials: "Powers of monomials",
    distribution: "Expand brackets", brackets: "Brackets and distribution", substitution: "Substitution",
    add_subtract_expressions: "Add and subtract expressions", algebraic_fractions: "Algebraic fractions", exponents: "Algebraic exponents", surds: "Surds",
    inspection: "Solve by inspection", inverse_operations: "Inverse operations", one_step: "One-step equations", two_step: "Two-step equations",
    variables_both_sides: "Variables on both sides", fractional: "Fractional equations", powers_roots: "Powers and roots", word_problems: "Word problems",
    linear_brackets: "Linear equations with brackets", fractional_linear: "Fractional linear equations", rational: "Rational equations",
    identity_no_solution: "Identity and no-solution equations", simultaneous: "Simultaneous equations", inequalities: "Inequalities",
    exponential_equations: "Exponential equations",
    common_factor: "Common factor", difference_squares: "Difference of two squares", trinomials: "Trinomials", grouping: "Factorisation by grouping",
    straight_lines: "Geometry of straight lines", polygons: "2D shapes and polygons", transformations: "Transformation geometry",
    missing_side: "Missing sides", perimeter_area: "Perimeter and area", surface_area_volume: "Surface area and volume",
    averages: "Averages", charts: "Tables and charts", five_number_summary: "Five-number summary", central_tendency: "Central tendency",
    quartiles: "Quartiles and box plots", variance_sd: "Variance and standard deviation", regression: "Regression and correlation",
    simple_events: "Simple probability", simple_probability: "Simple probability", combined_events: "Combined events",
    venn_diagrams: "Venn diagrams", dependent_independent: "Dependent and independent events", counting_principle: "Counting principle",
    simple_interest: "Simple interest", compound_growth: "Compound growth", depreciation: "Depreciation", annuities_intro: "Introduction to annuities",
    annuities: "Annuities", present_future_value: "Present and future value",
    right_triangle: "Right-triangle trigonometry", special_angles: "Special angles", identities: "Trigonometric identities",
    equations: "Trigonometric equations", sine_cosine_area_rules: "Sine, cosine and area rules", two_dimensional_problems: "2D trigonometry problems",
    gradient: "Gradient", distance_midpoint: "Distance and midpoint", equation_line: "Equation of a line",
    parallel_perpendicular: "Parallel and perpendicular lines", circle_equation: "Equation of a circle",
    similarity: "Similarity", congruency: "Congruency", circle_basics: "Circle geometry basics", circle_geometry: "Circle geometry", proportionality: "Proportionality",
    first_principles: "First principles", differentiation: "Differentiation", tangents: "Tangents and normals", optimisation: "Optimisation", rate_of_change: "Rate of change",
    rounding: "Rounding", ratios_rates: "Ratios and rates", income_expenses: "Income and expenditure", budgets: "Budgets",
    interest: "Interest", banking: "Banking", tariffs: "Tariffs and bills", tax_intro: "Introduction to tax", tax: "Tax", inflation: "Inflation",
    length_area_volume: "Length, area and volume", floor_plans: "Floor plans", scale: "Scale", directions: "Directions",
    travel: "Travel, speed and time", models: "Models", tables_charts: "Tables and charts", percentiles: "Percentiles"
  };

  const QUIZ_TYPES = [
    { id: "practice", label: "Practice drill" },
    { id: "mixed", label: "Mixed skills" },
    { id: "exam", label: "Exam-style" }
  ];

  function xmur3(text) {
    let h = 1779033703 ^ text.length;
    for (let i = 0; i < text.length; i += 1) { h = Math.imul(h ^ text.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return function () { h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return (h ^= h >>> 16) >>> 0; };
  }
  function mulberry32(seed) { return function () { let t = (seed += 0x6d2b79f5); t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function createRng(seedText) {
    const random = mulberry32(xmur3(String(seedText))());
    return {
      random,
      int(min, max) { return Math.floor(random() * (max - min + 1)) + min; },
      pick(items) { return items[this.int(0, items.length - 1)]; },
      bool() { return random() < 0.5; },
      shuffle(items) { const out = items.slice(); for (let i = out.length - 1; i > 0; i -= 1) { const j = this.int(0, i); [out[i], out[j]] = [out[j], out[i]]; } return out; }
    };
  }
  function gcd(a, b) { let x = Math.abs(Number(a)); let y = Math.abs(Number(b)); while (y) [x, y] = [y, x % y]; return x || 1; }
  function reduceFraction(n, d) { let nn = Number(n), dd = Number(d); if (!dd) return [0, 1]; if (dd < 0) { nn = -nn; dd = -dd; } const g = gcd(nn, dd); return [nn / g, dd / g]; }
  function round(value, dp = 2) { const p = 10 ** dp; return Math.round((Number(value) + Number.EPSILON) * p) / p; }
  function fmt(value) { const n = Number(value); return Number.isInteger(n) ? String(n) : String(round(n, 6)); }
  function money(value) { return `R${Number(value).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
  function signTerm(value, variable = "") { const n = Number(value); if (!n) return ""; return `${n < 0 ? " − " : " + "}${Math.abs(n) === 1 && variable ? "" : Math.abs(n)}${variable}`; }
  function term(value, variable = "") { const n = Number(value); if (!variable) return String(n); if (n === 1) return variable; if (n === -1) return `−${variable}`; return `${n}${variable}`; }
  function polynomialText(map, order) {
    let output = "";
    order.forEach((key) => {
      const coefficient = Number(map[key] || 0);
      if (!coefficient) return;
      const label = key === "const" ? "" : key;
      if (!output) output = term(coefficient, label);
      else output += signTerm(coefficient, label);
    });
    return output || "0";
  }
  function fractionHtml(n, d) { return `<span class="fraction"><span>${n}</span><span>${d}</span></span>`; }
  function pow(base, exponent) { return `${base}<sup>${exponent}</sup>`; }
  function seededDigits(rng, digits, allowNegative = false) {
    const d = Math.max(1, Math.min(6, Number(digits || 2)));
    const min = d === 1 ? 1 : 10 ** (d - 1);
    const max = 10 ** d - 1;
    const value = rng.int(min, max);
    return allowNegative && rng.bool() ? -value : value;
  }

  function baseQuestion(promptHtml, responseType, marks = 1, extra = {}) {
    return { promptHtml, responseType, marks, answerLabel: extra.answerLabel || "Answer", unit: extra.unit || "", contextHtml: extra.contextHtml || "", inputMode: extra.inputMode || "decimal", ...extra };
  }
  function qNumber(promptHtml, expected, explanationHtml, options = {}) {
    const marks = Number(options.marks || 1);
    return { question: baseQuestion(promptHtml, "number", marks, options), key: { type: "number", expected: Number(expected), tolerance: Number(options.tolerance || 0), marks, correctDisplay: options.correctDisplay || `${fmt(expected)}${options.unit ? ` ${options.unit}` : ""}`, explanationHtml } };
  }
  function qFraction(promptHtml, numerator, denominator, explanationHtml, options = {}) {
    const marks = Number(options.marks || 1); const reduced = reduceFraction(numerator, denominator);
    return { question: baseQuestion(promptHtml, "fraction", marks, options), key: { type: "fraction", numerator: reduced[0], denominator: reduced[1], requireSimplified: Boolean(options.requireSimplified), marks, correctDisplay: `${reduced[0]}/${reduced[1]}`, explanationHtml } };
  }
  function qChoice(promptHtml, choices, expected, explanationHtml, options = {}) {
    const marks = Number(options.marks || 1);
    return { question: baseQuestion(promptHtml, "choice", marks, { ...options, choices }), key: { type: "choice", expected: String(expected), marks, correctDisplay: String(expected), explanationHtml } };
  }
  function qPair(promptHtml, first, second, labels, explanationHtml, options = {}) {
    const marks = Number(options.marks || 2);
    return { question: baseQuestion(promptHtml, "pair", marks, { ...options, fields: [{ key: "a", label: labels[0] }, { key: "b", label: labels[1] }] }), key: { type: "pair", a: Number(first), b: Number(second), tolerance: Number(options.tolerance || 0), orderInsensitive: Boolean(options.orderInsensitive), marks, correctDisplay: options.correctDisplay || `(${fmt(first)}; ${fmt(second)})`, explanationHtml } };
  }
  function qCoefficientMap(promptHtml, expected, fields, explanationHtml, options = {}) {
    const marks = Number(options.marks || Math.max(1, fields.length));
    return { question: baseQuestion(promptHtml, "coefficient_map", marks, { ...options, fields }), key: { type: "coefficient_map", expected, marks, correctDisplay: options.correctDisplay || polynomialText(expected, fields.map((f) => f.key)), explanationHtml } };
  }
  function qFactorPair(promptHtml, p, q, explanationHtml, options = {}) {
    const marks = Number(options.marks || 2);
    return { question: baseQuestion(promptHtml, "factor_pair", marks, { ...options, fields: [{ key: "p", label: "First constant" }, { key: "q", label: "Second constant" }] }), key: { type: "factor_pair", p: Number(p), q: Number(q), orderInsensitive: true, marks, correctDisplay: `(x ${p < 0 ? "−" : "+"} ${Math.abs(p)})(x ${q < 0 ? "−" : "+"} ${Math.abs(q)})`, explanationHtml } };
  }

  function generateArithmetic(rng, settings, operation = null) {
    const first = seededDigits(rng, settings.firstDigits || 2, settings.allowNegative);
    let second = seededDigits(rng, settings.secondDigits || 2, settings.allowNegative);
    const op = operation || rng.pick(["+", "−", "×", "÷"]);
    if (op === "+") return qNumber(`${first} + ${second} = ?`, first + second, "Add the two numbers.");
    if (op === "−") return qNumber(`${first} − ${second} = ?`, first - second, "Subtract the second number from the first.");
    if (op === "×") return qNumber(`${first} × ${second} = ?`, first * second, "Multiply the two numbers.");
    second = Math.max(1, Math.abs(second)); const quotient = rng.int(2, 20); const dividend = second * quotient;
    return qNumber(`${dividend} ÷ ${second} = ?`, quotient, "Use the inverse relationship between multiplication and division.");
  }

  function generateDecimal(rng, settings) {
    const places = Math.max(1, Math.min(4, Number(settings.decimalPlaces || 2)));
    const scale = 10 ** places;
    const wholeDigits = Math.max(1, Math.min(4, Number(settings.wholeDigits || 2)));
    const max = 10 ** wholeDigits * scale;
    const make = () => { let n = rng.int(1, max) / scale; if (settings.allowNegative && rng.bool()) n = -n; return n; };
    const a = make(), b = make(); const op = rng.pick(["+", "−", "×"]);
    if (op === "+") return qNumber(`${fmt(a)} + ${fmt(b)} = ?`, round(a + b, places + 1), "Align decimal commas/points and add.", { tolerance: 1 / scale / 10 });
    if (op === "−") return qNumber(`${fmt(a)} − ${fmt(b)} = ?`, round(a - b, places + 1), "Align decimal commas/points and subtract.", { tolerance: 1 / scale / 10 });
    const small = rng.int(2, 12); return qNumber(`${fmt(a)} × ${small} = ?`, round(a * small, places + 1), "Multiply and place the decimal correctly.", { tolerance: 1 / scale / 10 });
  }

  function generateLikeTerms(rng, grade, variant = "linear") {
    if (variant === "multi") {
      const a1 = rng.int(-8, 8) || 2, a2 = rng.int(-8, 8) || -3, b1 = rng.int(-8, 8) || 4, b2 = rng.int(-8, 8) || 5;
      const prompt = `${term(a1, "a")}${signTerm(b1, "b")}${signTerm(b2, "b")}${signTerm(a2, "a")}`;
      const expected = { a: a1 + a2, b: b1 + b2 };
      return qCoefficientMap(`Simplify: <strong>${prompt}</strong>`, expected, [{ key: "a", label: "Coefficient of a" }, { key: "b", label: "Coefficient of b" }], "Collect the a-terms together and the b-terms together.", { correctDisplay: polynomialText(expected, ["a", "b"]) });
    }
    if (variant === "products") {
      const c1 = rng.int(-7, 7) || 2, c2 = rng.int(-7, 7) || 3, p1 = rng.int(1, 4), p2 = rng.int(1, 4);
      return qPair(`Simplify: <strong>(${term(c1, "x" + (p1 > 1 ? `<sup>${p1}</sup>` : ""))})(${term(c2, "x" + (p2 > 1 ? `<sup>${p2}</sup>` : ""))})</strong>`, c1 * c2, p1 + p2, ["Coefficient", "Exponent of x"], "Multiply the coefficients and add the exponents.", { correctDisplay: `${c1 * c2}x^${p1 + p2}` });
    }
    const fields = grade >= 9 ? [{ key: "x3", label: "Coefficient of x³" }, { key: "x2", label: "Coefficient of x²" }, { key: "x", label: "Coefficient of x" }, { key: "const", label: "Constant" }] : [{ key: "x", label: "Coefficient of x" }, { key: "const", label: "Constant" }];
    if (grade >= 9) {
      const values = Array.from({ length: 7 }, () => rng.int(-8, 8));
      const prompt = `${term(values[0], "x³")}${signTerm(values[1], "x²")}${signTerm(values[2], "x")}${signTerm(values[3])}${signTerm(values[4], "x³")}${signTerm(values[5], "x²")}${signTerm(values[6], "x")}`;
      const expected = { x3: values[0] + values[4], x2: values[1] + values[5], x: values[2] + values[6], const: values[3] };
      return qCoefficientMap(`Simplify: <strong>${prompt}</strong>`, expected, fields, "Collect terms with the same variable and exponent.", { correctDisplay: polynomialText({ "x³": expected.x3, "x²": expected.x2, x: expected.x, const: expected.const }, ["x³", "x²", "x", "const"]) });
    }
    const a = rng.int(-9, 9) || 2, b = rng.int(-9, 9) || 3, c = rng.int(-12, 12), d = rng.int(-12, 12);
    const expected = { x: a + b, const: c + d };
    return qCoefficientMap(`Simplify: <strong>${term(a, "x")}${signTerm(c)}${signTerm(b, "x")}${signTerm(d)}</strong>`, expected, fields, "Collect the x-terms and the constants.", { correctDisplay: polynomialText({ x: expected.x, const: expected.const }, ["x", "const"]) });
  }

  function generateDistribution(rng, grade) {
    const k = rng.int(-6, 6) || 2, a = rng.int(-5, 5) || 2, b = rng.int(-9, 9) || 3;
    const expected = { x: k * a, const: k * b };
    return qCoefficientMap(`Expand and simplify: <strong>${term(k)}(${term(a, "x")}${signTerm(b)})</strong>`, expected, [{ key: "x", label: "Coefficient of x" }, { key: "const", label: "Constant" }], "Multiply every term inside the bracket by the outside factor.", { correctDisplay: polynomialText({ x: expected.x, const: expected.const }, ["x", "const"]) });
  }

  function generateSubstitution(rng, grade) {
    const a = rng.int(-6, 6) || 2, b = rng.int(-8, 8), c = rng.int(-10, 10), x = rng.int(-5, 5);
    return qNumber(`If x = ${x}, find the value of <strong>${term(a, "x²")}${signTerm(b, "x")}${signTerm(c)}</strong>.`, a * x * x + b * x + c, "Substitute the value of x, then follow the order of operations.", { marks: grade >= 9 ? 2 : 1 });
  }

  function generateLinearEquation(rng, subtopic, settings) {
    const coefficientMax = Math.max(3, Math.min(20, Number(settings.coefficientMax || 9)));
    const solution = rng.int(-12, 12);
    if (["one_step", "inspection"].includes(subtopic)) {
      const operation = rng.pick(["add", "multiply", "divide"]);
      if (operation === "add") { const b = rng.int(-20, 20); return qNumber(`Solve for x: <strong>x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${solution + b}</strong>`, solution, "Use the inverse operation.", { answerLabel: "x =" }); }
      if (operation === "multiply") { const a = rng.int(2, coefficientMax); return qNumber(`Solve for x: <strong>${a}x = ${a * solution}</strong>`, solution, "Divide both sides by the coefficient of x.", { answerLabel: "x =" }); }
      const d = rng.int(2, coefficientMax); return qNumber(`Solve for x: <strong>${fractionHtml("x", d)} = ${solution}</strong>`, solution * d, "Multiply both sides by the denominator.", { answerLabel: "x =" });
    }
    if (subtopic === "powers_roots") {
      const root = rng.int(2, 12); const power = rng.pick([2, 3]);
      return qNumber(`Find the positive value of x: <strong>${pow("x", power)} = ${root ** power}</strong>`, root, `Take the ${power === 2 ? "square" : "cube"} root of both sides.`, { answerLabel: "x =" });
    }
    if (subtopic === "variables_both_sides") {
      let a = rng.int(2, coefficientMax), c = rng.int(-coefficientMax, coefficientMax); if (a === c) c += 1;
      const b = rng.int(-15, 15); const d = (a - c) * solution + b;
      return qNumber(`Solve for x: <strong>${term(a, "x")}${signTerm(b)} = ${term(c, "x")}${signTerm(d)}</strong>`, solution, "Collect x-terms on one side and constants on the other.", { answerLabel: "x =", marks: 2 });
    }
    if (["brackets", "linear_brackets"].includes(subtopic)) {
      const a = rng.int(2, 6), b = rng.int(-8, 8), c = rng.int(-10, 10); const rhs = a * (solution + b) + c;
      return qNumber(`Solve for x: <strong>${a}(x ${b < 0 ? "−" : "+"} ${Math.abs(b)}) ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${rhs}</strong>`, solution, "Expand the bracket, simplify, then isolate x.", { answerLabel: "x =", marks: 3 });
    }
    if (["fractional", "fractional_linear"].includes(subtopic)) {
      const d = rng.int(2, 8), b = rng.int(-8, 8); const rhs = solution + b;
      return qNumber(`Solve for x: <strong>${fractionHtml(`x ${b < 0 ? "−" : "+"} ${Math.abs(b)}`, d)} = ${fractionHtml(rhs, d)}</strong>`, solution, "Clear the denominator and solve the resulting equation.", { answerLabel: "x =", marks: 2 });
    }
    if (subtopic === "rational") {
      const forbidden = rng.int(-5, 5), k = rng.int(2, 8); const solution2 = forbidden + k;
      return qNumber(`Solve for x: <strong>${fractionHtml(k, `x ${forbidden < 0 ? "+" : "−"} ${Math.abs(forbidden)}`)} = 1</strong>`, solution2, "Multiply by the denominator, then check that the denominator is not zero.", { answerLabel: "x =", marks: 3 });
    }
    if (subtopic === "identity_no_solution") {
      const identity = rng.bool(); const a = rng.int(2, 8), b = rng.int(-8, 8), shift = identity ? b : b + rng.int(1, 6);
      return qChoice(`Classify the equation: <strong>${a}(x ${b < 0 ? "−" : "+"} ${Math.abs(b)}) = ${term(a, "x")}${signTerm(a * shift)}</strong>`, ["One solution", "No solution", "Infinitely many solutions"], identity ? "Infinitely many solutions" : "No solution", "Expand both sides and compare the resulting statements.", { marks: 2 });
    }
    if (subtopic === "word_problems") {
      const pages = rng.int(80, 200); const sum = pages * 2 + 1;
      return qNumber(`Two consecutive pages of a book have page numbers that add to ${sum}. What is the smaller page number?`, pages, "Let the smaller page be x and the next page x + 1. Solve x + (x + 1) = the given sum.", { marks: 3 });
    }
    const a = rng.int(2, coefficientMax), b = rng.int(-12, 12), rhs = a * solution + b;
    return qNumber(`Solve for x: <strong>${term(a, "x")}${signTerm(b)} = ${rhs}</strong>`, solution, "Undo the constant and divide by the coefficient.", { answerLabel: "x =", marks: 2 });
  }

  function generateFactorisation(rng, subtopic) {
    if (subtopic === "difference_squares") {
      const a = rng.int(1, 5), b = rng.int(1, 12);
      return qPair(`Factorise completely: <strong>${a * a}x² − ${b * b}</strong>`, a, b, ["Coefficient of x", "Constant"], "Use A² − B² = (A − B)(A + B).", { correctDisplay: `(${a}x − ${b})(${a}x + ${b})`, marks: 3 });
    }
    if (subtopic === "trinomials") {
      const p = rng.int(-9, 9) || 2, q = rng.int(-9, 9) || -3;
      return qFactorPair(`Factorise: <strong>x²${signTerm(p + q, "x")}${signTerm(p * q)}</strong>`, p, q, "Find two numbers whose sum is the x-coefficient and whose product is the constant.", { marks: 3 });
    }
    if (subtopic === "grouping") {
      const a = rng.int(2, 6), b = rng.int(2, 8), c = rng.int(2, 6);
      return qPair(`Factorise by grouping: <strong>${a * c}x² + ${a * b}x + ${c}x + ${b}</strong>`, a, c, ["First factor coefficient", "Second factor coefficient"], "Group the first two and last two terms, then factor the common binomial.", { correctDisplay: `(${a}x + 1)(${c}x + ${b})`, marks: 4 });
    }
    if (subtopic === "algebraic_fractions") {
      const a = rng.int(2, 8), b = rng.int(2, 8);
      return qChoice(`Simplify: <strong>${fractionHtml(`${a}x² − ${a * b}x`, `${a}x`)}</strong>`, [`x − ${b}`, `${a}x − ${b}`, `x + ${b}`, `${a}(x − ${b})`], `x − ${b}`, "Factor the numerator and cancel the common non-zero factor.", { marks: 3 });
    }
    const common = rng.int(2, 9), a = rng.int(1, 8), b = rng.int(-9, 9) || 3;
    return qPair(`Factorise completely: <strong>${common * a}x²${signTerm(common * b, "x")}</strong>`, common, a, ["Greatest common coefficient", "Coefficient of x inside bracket"], "Take out the greatest common factor.", { correctDisplay: `${common}x(${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)})`, marks: 2 });
  }


  function generateAdvancedEquation(rng, subtopic, settings) {
    if (subtopic === "quadratic") {
      const r1 = rng.int(-10, 10) || 2, r2 = rng.int(-10, 10) || -3;
      const b = -(r1 + r2), c = r1 * r2;
      return qPair(`Solve: <strong>x²${signTerm(b, "x")}${signTerm(c)} = 0</strong>`, r1, r2, ["First solution", "Second solution"], "Factorise the quadratic and set each factor equal to zero.", { orderInsensitive: true, correctDisplay: `x = ${r1} or x = ${r2}`, marks: 4 });
    }
    if (subtopic === "simultaneous") {
      const x = rng.int(-8, 8), y = rng.int(-8, 8), a = rng.int(1, 6), b = rng.int(1, 6), c = rng.int(1, 6), d = rng.int(-6, 6) || 2;
      const e = a * x + b * y, f = c * x + d * y;
      return qPair(`Solve simultaneously:<br><strong>${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)}y = ${e}</strong><br><strong>${c}x ${d < 0 ? "−" : "+"} ${Math.abs(d)}y = ${f}</strong>`, x, y, ["x", "y"], "Use elimination or substitution.", { marks: 5, correctDisplay: `x = ${x}, y = ${y}` });
    }
    if (subtopic === "inequalities") {
      const a = rng.int(2, 8), boundary = rng.int(-10, 10), b = rng.int(-12, 12), rhs = a * boundary + b;
      return qNumber(`Solve the inequality boundary: <strong>${a}x${signTerm(b)} > ${rhs}</strong>. Enter the boundary value.`, boundary, "Solve as an equation first. The solution is x greater than the boundary.", { answerLabel: "Boundary =", marks: 2, correctDisplay: `x > ${boundary}` });
    }
    if (subtopic === "exponential_equations") {
      const base = rng.pick([2, 3, 5]), exponent = rng.int(-3, 6), rhs = base ** exponent;
      return qNumber(`Solve for x: <strong>${base}<sup>x</sup> = ${fmt(rhs)}</strong>`, exponent, "Write both sides with the same base and equate exponents.", { answerLabel: "x =", tolerance: 0.000001, marks: 2 });
    }
    return generateLinearEquation(rng, subtopic, settings);
  }

  function generateAdvancedFunction(rng, subtopic, grade) {
    if (subtopic === "linear") {
      const m = rng.int(-8, 8) || 2, c = rng.int(-12, 12);
      return qPair(`For y = ${term(m, "x")}${signTerm(c)}, state the gradient and y-intercept.`, m, c, ["Gradient", "y-intercept"], "Read m and c from y = mx + c.", { marks: 2, correctDisplay: `m = ${m}, c = ${c}` });
    }
    if (subtopic === "quadratic") return generateFunction(rng, "quadratic", grade);
    if (subtopic === "hyperbola") {
      const a = rng.int(-12, 12) || 4, q = rng.int(-8, 8), x = rng.pick([-6,-4,-3,-2,-1,1,2,3,4,6]);
      return qNumber(`Given f(x) = ${fractionHtml(a, "x")} ${q < 0 ? "−" : "+"} ${Math.abs(q)}, calculate f(${x}).`, a / x + q, "Substitute the x-value into the hyperbola rule.", { tolerance: 0.001, marks: 2 });
    }
    if (subtopic === "exponential") {
      const a = rng.pick([2,3,4,5]), q = rng.int(-5,5), x = rng.int(-3,4);
      return qNumber(`Given f(x) = ${a}<sup>x</sup>${signTerm(q)}, calculate f(${x}).`, a ** x + q, "Substitute x into the exponential rule.", { tolerance: 0.001, marks: 2 });
    }
    if (subtopic === "inverse_functions") {
      const m = rng.int(2,8), c = rng.int(-10,10), y = rng.int(-8,8), x = (y - c) / m;
      return qNumber(`If f(x) = ${m}x${signTerm(c)}, calculate f⁻¹(${y}).`, x, "Swap x and y, then solve for y.", { tolerance: 0.001, marks: 3 });
    }
    if (subtopic === "trigonometric_graphs") {
      const fn = rng.pick(["sin", "cos"]), amplitude = rng.int(1, 8), multiplier = rng.int(1, 6);
      if (rng.bool()) return qNumber(`For f(x) = ${amplitude}${fn}(${multiplier}x), state the amplitude.`, amplitude, "The amplitude is the absolute value of the coefficient in front of the trigonometric function.", { marks: 1 });
      return qNumber(`For f(x) = ${amplitude}${fn}(${multiplier}x), calculate the period in degrees.`, 360 / multiplier, "For sine and cosine, period = 360° ÷ multiplier.", { tolerance: 0.01, unit: "°", marks: 2 });
    }
    return generateFunction(rng, subtopic, grade);
  }

  function generateAlgebraSenior(rng, subtopic, grade) {
    if (subtopic === "surds") {
      const root = rng.int(2, 15), factor = rng.int(2, 8), value = root * root * factor * factor;
      return qNumber(`Simplify the positive value: <strong>√${value}</strong>`, root * factor, "Use √(a²) = |a|.", { marks: 1 });
    }
    if (subtopic === "exponents") return generateExponents(rng, "laws", grade);
    if (subtopic === "algebraic_fractions") return generateFactorisation(rng, "algebraic_fractions");
    return generateLikeTerms(rng, grade, "linear");
  }

  function generateEuclidean(rng, subtopic) {
    if (subtopic === "similarity" || subtopic === "proportionality") {
      const scale = rng.int(2, 6), small = rng.int(3, 12), large = small * scale, other = rng.int(2, 10);
      return qNumber(`Two triangles are similar. A side ${small} cm corresponds to ${large} cm. If another side of the smaller triangle is ${other} cm, find the corresponding side of the larger triangle.`, other * scale, "Use the constant scale factor between corresponding sides.", { unit: "cm", marks: 2 });
    }
    if (subtopic === "congruency") {
      const valid = rng.pick(["SSS", "SAS", "AAS", "RHS"]), labels = rng.shuffle(["AAA", "SSS", "SAS", "AAS", "RHS", "Proportional sides"]).slice(0, 4);
      if (!labels.includes(valid)) labels[rng.int(0, labels.length - 1)] = valid;
      const u = rng.int(3,20), v = rng.int(3,20), w = rng.int(3,20), caseNo = rng.int(1,999);
      return qChoice(`Case ${caseNo}: Triangles ABC and PQR have corresponding measurements ${u}, ${v} and ${w}, arranged to satisfy ${valid}. Which congruency reason applies?`, labels, valid, `${valid} is a valid triangle congruency condition.`, { marks: 1 });
    }
    if (["circle_basics", "circle_geometry"].includes(subtopic)) {
      const centre = rng.int(40, 140);
      return qNumber(`An angle at the centre of a circle is ${centre}°. Find the angle at the circumference standing on the same arc.`, centre / 2, "The angle at the centre is twice the angle at the circumference.", { unit: "°", marks: 2 });
    }
    return generateGeometry(rng, subtopic);
  }

  function generateAdvancedTrig(rng, subtopic) {
    if (subtopic === "special_angles") {
      const angles = [0,30,45,60,90,120,135,150,180,210,225,240,270,300,315,330,360];
      const angle = rng.pick(angles), fn = rng.pick(["sin","cos"]), radians = angle * Math.PI / 180;
      return qNumber(`Calculate ${fn} ${angle}° to 3 decimal places.`, round(fn === "sin" ? Math.sin(radians) : Math.cos(radians),3), "Use the unit circle and the reference angle.", { tolerance: 0.001, marks: 1 });
    }
    if (subtopic === "identities") {
      const triples = [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[9,40,41]], [a0,b0,c0] = rng.pick(triples), scale = rng.int(1,12), a=a0*scale, b=b0*scale, c=c0*scale, askCos = rng.bool();
      if (askCos) return qFraction(`If θ is acute and sin θ = ${fractionHtml(a,c)}, determine cos θ.`, b, c, "Use sin²θ + cos²θ = 1 and choose the positive value for an acute angle.", { marks: 2 });
      return qFraction(`If θ is acute and cos θ = ${fractionHtml(b,c)}, determine sin θ.`, a, c, "Use sin²θ + cos²θ = 1 and choose the positive value for an acute angle.", { marks: 2 });
    }
    if (subtopic === "equations") {
      const angle = rng.int(5,85), fn = rng.pick(["sin","cos"]), value = round(fn === "sin" ? Math.sin(angle*Math.PI/180) : Math.cos(angle*Math.PI/180),3);
      return qNumber(`For 0° ≤ x ≤ 90°, solve ${fn} x = ${value}.`, angle, `Use the inverse ${fn} function in the stated interval.`, { tolerance: 0.2, unit: "°", marks: 2 });
    }
    if (subtopic === "sine_cosine_area_rules") {
      const a = rng.int(5,15), b = rng.int(5,15), angle = rng.pick([30,40,50,60,70]);
      const c = Math.sqrt(a*a+b*b-2*a*b*Math.cos(angle*Math.PI/180));
      return qNumber(`Two sides of a triangle are ${a} cm and ${b} cm with included angle ${angle}°. Calculate the third side to 2 decimal places.`, round(c,2), "Use the cosine rule.", { tolerance: 0.02, unit: "cm", marks: 4 });
    }
    if (subtopic === "two_dimensional_problems") {
      const distance = rng.int(20,100), angle = rng.pick([25,30,35,40,45,50]);
      const height = distance*Math.tan(angle*Math.PI/180);
      return qNumber(`From a point ${distance} m from a building, the angle of elevation to the top is ${angle}°. Calculate the building height to 1 decimal place.`, round(height,1), "Use tan θ = opposite/adjacent.", { tolerance: 0.1, unit: "m", marks: 4 });
    }
    return generateTrig(rng, subtopic);
  }

  function generateAnalyticalAdvanced(rng, subtopic) {
    if (subtopic === "equation_line") {
      const m = rng.int(-6,6)||2, c = rng.int(-10,10);
      return qPair(`State the gradient and y-intercept of the line y = ${term(m,"x")}${signTerm(c)}.`, m, c, ["Gradient","y-intercept"], "Compare with y = mx + c.", { marks:2 });
    }
    if (subtopic === "parallel_perpendicular") {
      let numerator = rng.int(-12,12) || 2, denominator = rng.int(1,9); if (numerator === 0) numerator = 2;
      const m = numerator / denominator;
      return qNumber(`A line has gradient ${fractionHtml(numerator,denominator)}. Find the gradient of a perpendicular line.`, -1/m, "Perpendicular gradients multiply to −1.", { tolerance:0.001, marks:2 });
    }
    if (subtopic === "circle_equation") {
      const h=rng.int(-6,6), k=rng.int(-6,6), r=rng.int(1,8);
      return qPair(`For the circle (x ${h<0?"+":"−"} ${Math.abs(h)})² + (y ${k<0?"+":"−"} ${Math.abs(k)})² = ${r*r}, state the centre.`,h,k,["x-coordinate","y-coordinate"],"Read the centre from (x−h)²+(y−k)²=r².",{marks:2});
    }
    return generateAnalytical(rng,subtopic);
  }

  function generateProbabilityAdvanced(rng, subtopic) {
    if (subtopic === "combined_events" || subtopic === "venn_diagrams") {
      const total=rng.int(30,80), a=rng.int(10,25), b=rng.int(10,25), overlap=rng.int(2,Math.min(a,b)-1);
      return qFraction(`In a group of ${total}, ${a} study Maths, ${b} study Science and ${overlap} study both. Find the probability that a randomly selected learner studies Maths or Science.`,a+b-overlap,total,"Use n(A∪B)=n(A)+n(B)−n(A∩B).",{marks:3});
    }
    if (subtopic === "dependent_independent") {
      const red=rng.int(3,8), blue=rng.int(3,8), total=red+blue;
      return qFraction(`A bag has ${red} red and ${blue} blue counters. Two counters are drawn without replacement. Find P(red then red).`,red*(red-1),total*(total-1),"Multiply the first probability by the changed second probability.",{marks:3});
    }
    if (subtopic === "counting_principle") {
      const shirts=rng.int(2,8),pants=rng.int(2,6),shoes=rng.int(2,5);
      return qNumber(`A learner has ${shirts} shirts, ${pants} pairs of pants and ${shoes} pairs of shoes. How many different outfits are possible?`,shirts*pants*shoes,"Use the fundamental counting principle.",{marks:2});
    }
    return generateProbability(rng,subtopic);
  }

  function generateStatsAdvanced(rng, subtopic) {
    if (subtopic === "variance_sd") {
      const base=rng.int(5,30),d=rng.int(1,6); const values=[base-d,base,base+d];
      const mean=base,variance=(d*d+0+d*d)/3,sd=Math.sqrt(variance);
      return qNumber(`Calculate the population standard deviation of ${values.join(", ")} to 2 decimal places.`,round(sd,2),"Find the mean, squared deviations, population variance and square root.",{tolerance:0.02,marks:4});
    }
    if (subtopic === "regression") {
      const r = rng.int(-99,99) / 100;
      const expected = Math.abs(r) < 0.2 ? "Very weak correlation" : Math.abs(r) < 0.6 ? (r < 0 ? "Moderate negative correlation" : "Moderate positive correlation") : (r < 0 ? "Strong negative correlation" : "Strong positive correlation");
      return qChoice(`A data set has correlation coefficient r = ${r.toFixed(2)}. Choose the best description.`,["Very weak correlation","Moderate negative correlation","Moderate positive correlation","Strong negative correlation","Strong positive correlation"],expected,"The sign gives direction and the magnitude gives strength.");
    }
    return generateStats(rng,subtopic);
  }

  function generateFinanceAdvanced(rng, subtopic, subjectTrack) {
    if (subtopic === "depreciation") {
      const value=rng.pick([120000,180000,250000]),rate=rng.pick([8,10,12,15]),years=rng.int(2,6); const final=value*(1-rate/100)**years;
      return qNumber(`An asset worth ${money(value)} depreciates by ${rate}% per year on the reducing-balance method for ${years} years. Find its value.`,round(final,2),"Use A=P(1−i)ⁿ.",{tolerance:0.05,correctDisplay:money(final),marks:3});
    }
    if (["annuities","annuities_intro","present_future_value"].includes(subtopic)) {
      const payment=rng.int(2,40)*100,months=rng.int(6,60);
      return qNumber(`A person deposits ${money(payment)} per month for ${months} months, ignoring interest. Calculate the total deposited.`,payment*months,"Multiply the regular payment by the number of payments.",{correctDisplay:money(payment*months),marks:2});
    }
    return generateFinance(rng,subtopic,subjectTrack);
  }

  function generateCalculusAdvanced(rng, subtopic) {
    const a=rng.int(-5,5)||2,b=rng.int(-8,8),c=rng.int(-10,10),x=rng.int(-4,5);
    if (subtopic === "first_principles") return qPair(`For f(x) = ${a}x²${signTerm(b,"x")}${signTerm(c)}, give the coefficients of f′(x)=Ax+B.`,2*a,b,["A","B"],"Use first principles or the power rule to obtain the derivative.",{marks:4,correctDisplay:`f′(x) = ${2*a}x${signTerm(b)}`});
    if (subtopic === "tangents") return qNumber(`For f(x) = ${a}x²${signTerm(b,"x")}${signTerm(c)}, find the gradient of the tangent at x=${x}.`,2*a*x+b,"Differentiate and substitute the x-coordinate.",{marks:3});
    if (subtopic === "rate_of_change") return qNumber(`The displacement is s(t)=${a}t²${signTerm(b,"t")}${signTerm(c)}. Find the instantaneous velocity at t=${x}.`,2*a*x+b,"Velocity is the derivative ds/dt.",{marks:3});
    return generateCalculus(rng,subtopic);
  }

  function generatePattern(rng, subtopic, grade) {
    if (["geometric_patterns", "geometric_sequences"].includes(subtopic)) {
      const first = rng.int(1, 6), ratio = rng.pick([2, 3, -2]); const n = rng.int(4, 8);
      return qNumber(`The sequence starts ${first}, ${first * ratio}, ${first * ratio ** 2}, … Find term ${n}.`, first * ratio ** (n - 1), "Use Tₙ = arⁿ⁻¹.", { marks: grade >= 11 ? 2 : 1 });
    }
    const first = rng.int(-10, 20), difference = rng.int(-8, 10) || 3, n = rng.int(8, 20);
    return qNumber(`The arithmetic sequence begins ${first}, ${first + difference}, ${first + 2 * difference}, … Find term ${n}.`, first + (n - 1) * difference, "Use Tₙ = a + (n − 1)d.", { marks: grade >= 10 ? 2 : 1 });
  }

  function generateFunction(rng, subtopic, grade) {
    if (["quadratic", "graphs"].includes(subtopic) && grade >= 10) {
      const h = rng.int(-5, 5), k = rng.int(-8, 8), a = rng.pick([-2, -1, 1, 2]);
      return qPair(`For f(x) = ${a}(x ${h < 0 ? "+" : "−"} ${Math.abs(h)})² ${k < 0 ? "−" : "+"} ${Math.abs(k)}, state the turning point.`, h, k, ["x-coordinate", "y-coordinate"], "Read the turning point from vertex form a(x − h)² + k.", { marks: 2 });
    }
    const m = rng.int(-8, 8) || 2, c = rng.int(-12, 12), x = rng.int(-5, 8);
    return qNumber(`Given f(x) = ${term(m, "x")}${signTerm(c)}, calculate f(${x}).`, m * x + c, "Substitute the x-value into the function rule.", { marks: 1 });
  }

  function generateExponents(rng, subtopic, grade) {
    if (subtopic === "scientific_notation") {
      const coefficient = rng.int(12, 98) / 10, exponent = rng.int(-5, 7);
      return qNumber(`Write ${coefficient} × 10<sup>${exponent}</sup> as an ordinary number.`, coefficient * 10 ** exponent, "Move the decimal point according to the power of ten.", { tolerance: Math.abs(coefficient * 10 ** exponent) * 1e-8 });
    }
    const a = rng.int(2, 9), m = rng.int(2, 8), n = rng.int(1, 6);
    return qNumber(`Simplify the exponent: ${pow(`x`, m)} × ${pow(`x`, n)} = ${pow(`x`, "?")}`, m + n, "When multiplying like bases, add the exponents.", { answerLabel: "Exponent =" });
  }

  function generateGeometry(rng, subtopic) {
    if (subtopic === "straight_lines") { const angle = rng.int(20, 160); return qNumber(`Two adjacent angles on a straight line are ${angle}° and x°. Find x.`, 180 - angle, "Angles on a straight line add to 180°.", { unit: "°" }); }
    if (subtopic === "polygons") {
      const n = rng.int(4, 30);
      if (rng.bool()) return qNumber(`Calculate the sum of the interior angles of a ${n}-sided polygon.`, (n - 2) * 180, "Use (n − 2) × 180°.", { unit: "°", marks: 2 });
      return qNumber(`A regular polygon has ${n} sides. Calculate one exterior angle.`, 360 / n, "Exterior angles of a polygon add to 360°.", { unit: "°", tolerance: 0.01, marks: 2 });
    }
    const x = rng.int(-20, 20), y = rng.int(-20, 20); return qPair(`Point A(${x}; ${y}) is reflected in the x-axis. Give the image A′.`, x, -y, ["x-coordinate", "y-coordinate"], "Reflection in the x-axis changes the sign of y.");
  }

  function generatePythagoras(rng) {
    const triples = [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[9,40,41],[12,35,37]];
    const base = rng.pick(triples), scale = rng.int(1, 9), a = base[0] * scale, b = base[1] * scale, c = base[2] * scale;
    if (rng.bool()) return qNumber(`A right triangle has perpendicular sides ${a} cm and ${b} cm. Find the hypotenuse.`, c, "Use a² + b² = c².", { unit: "cm", marks: 2 });
    return qNumber(`A right triangle has hypotenuse ${c} cm and one shorter side ${a} cm. Find the other shorter side.`, b, "Use b² = c² − a².", { unit: "cm", marks: 2 });
  }

  function generateMeasurement(rng, subtopic) {
    if (subtopic === "surface_area_volume") { const l = rng.int(3, 15), w = rng.int(2, 12), h = rng.int(2, 10); return qNumber(`Calculate the volume of a rectangular prism measuring ${l} cm × ${w} cm × ${h} cm.`, l * w * h, "Volume = length × width × height.", { unit: "cm³", marks: 2 }); }
    const l = rng.int(5, 30), w = rng.int(4, 20); return qNumber(`Calculate the area of a rectangle with length ${l} cm and width ${w} cm.`, l * w, "Area = length × width.", { unit: "cm²" });
  }

  function generateStats(rng, subtopic) {
    const values = Array.from({ length: 7 }, () => rng.int(5, 40)).sort((a, b) => a - b);
    if (["quartiles", "five_number_summary"].includes(subtopic)) return qNumber(`For the ordered data ${values.join(", ")}, determine the median.`, values[3], "The middle value is the median.");
    const sum = values.reduce((a, b) => a + b, 0); return qNumber(`Calculate the mean of ${values.join(", ")}.`, round(sum / values.length, 2), "Add all values and divide by the number of values.", { tolerance: 0.01, marks: 2 });
  }

  function generateProbability(rng, subtopic) {
    const red = rng.int(2, 10), blue = rng.int(2, 10), green = rng.int(1, 8), total = red + blue + green;
    return qFraction(`A bag contains ${red} red, ${blue} blue and ${green} green counters. Find P(red).`, red, total, "Probability = favourable outcomes ÷ total outcomes.");
  }

  function generateFinance(rng, subtopic, subjectTrack) {
    const principal = rng.pick([2500, 5000, 8000, 12000, 15000]), rate = rng.pick([5, 7.5, 8, 10, 12]), years = rng.int(2, 5);
    if (["simple_interest", "interest"].includes(subtopic)) { const interest = principal * rate / 100 * years; return qNumber(`Calculate the simple interest on ${money(principal)} at ${rate}% per year for ${years} years.`, interest, "Use I = Pin.", { tolerance: 0.01, correctDisplay: money(interest), marks: 3 }); }
    const amount = round(principal * (1 + rate / 100) ** years, 2);
    return qNumber(`${money(principal)} grows at ${rate}% compounded annually for ${years} years. Calculate the final amount.`, amount, "Use A = P(1 + i)ⁿ.", { tolerance: 0.03, correctDisplay: money(amount), marks: 3 });
  }

  function generateTrig(rng, subtopic) {
    const angle = rng.pick([30, 35, 40, 45, 50, 55, 60]), hyp = rng.pick([8, 10, 12, 15, 20]);
    const opposite = round(hyp * Math.sin(angle * Math.PI / 180), 2);
    return qNumber(`In a right triangle, the hypotenuse is ${hyp} cm and θ = ${angle}°. Calculate the side opposite θ to 2 decimal places.`, opposite, "Use opposite = hypotenuse × sin θ.", { tolerance: 0.02, unit: "cm", marks: 3 });
  }

  function generateAnalytical(rng, subtopic) {
    const x1 = rng.int(-8, 5), y1 = rng.int(-8, 5), x2 = x1 + rng.int(1, 8), y2 = y1 + rng.int(-8, 8);
    if (subtopic === "distance_midpoint") return qPair(`Find the midpoint of A(${x1}; ${y1}) and B(${x2}; ${y2}).`, (x1 + x2) / 2, (y1 + y2) / 2, ["x-coordinate", "y-coordinate"], "Average the x-coordinates and the y-coordinates.", { tolerance: 0.001, marks: 2 });
    return qNumber(`Calculate the gradient of the line through A(${x1}; ${y1}) and B(${x2}; ${y2}).`, (y2 - y1) / (x2 - x1), "Use m = (y₂ − y₁)/(x₂ − x₁).", { tolerance: 0.001, marks: 2 });
  }

  function generateCalculus(rng, subtopic) {
    const a = rng.int(-6, 6) || 2, b = rng.int(-8, 8), c = rng.int(-10, 10);
    if (subtopic === "optimisation") { const h = -b / (2 * a); return qNumber(`For f(x) = ${term(a, "x²")}${signTerm(b, "x")}${signTerm(c)}, determine the x-coordinate of the turning point.`, h, "Set f′(x) = 0 and solve.", { tolerance: 0.001, marks: 3 }); }
    const x = rng.int(-4, 5); return qNumber(`If f(x) = ${term(a, "x²")}${signTerm(b, "x")}${signTerm(c)}, calculate f′(${x}).`, 2 * a * x + b, "Differentiate, then substitute the x-value.", { marks: 3 });
  }

  function generateMathLit(rng, topic, subtopic) {
    if (topic === "finance") {
      if (subtopic === "budgets") { const income = rng.pick([8500, 12000, 15000]), rent = rng.pick([2500, 3500, 4500]), food = rng.pick([1800, 2400, 3200]), transport = rng.pick([900, 1200, 1600]); return qNumber(`A household earns ${money(income)} per month and spends ${money(rent)} on rent, ${money(food)} on food and ${money(transport)} on transport. Calculate the amount remaining.`, income - rent - food - transport, "Remaining = income − total expenses.", { correctDisplay: money(income - rent - food - transport), marks: 3 }); }
      if (subtopic === "tariffs") { const fixed = rng.pick([80, 100, 120]), rate = rng.pick([1.85, 2.2, 2.75]), units = rng.pick([120, 150, 180]); return qNumber(`A bill has a fixed charge of ${money(fixed)} plus ${money(rate)} per unit. Calculate the bill for ${units} units before VAT.`, fixed + rate * units, "Add the fixed charge and usage charge.", { tolerance: 0.01, correctDisplay: money(fixed + rate * units), marks: 3 }); }
      return generateFinance(rng, subtopic, "math_literacy");
    }
    if (topic === "maps_plans") { const scale = rng.pick([25000,50000,75000,100000,125000,250000,500000]), cm = rng.int(15, 140) / 10; const km = cm * scale / 100000; return qNumber(`A map has scale 1:${scale.toLocaleString("en-ZA")}. A route measures ${cm} cm. Calculate the actual distance in kilometres.`, km, "Use the scale and convert centimetres to kilometres.", { tolerance: 0.01, unit: "km", marks: 3 }); }
    if (topic === "measurement") return generateMeasurement(rng, subtopic);
    if (topic === "data_handling") return generateStats(rng, subtopic);
    if (topic === "probability") return generateProbability(rng, subtopic);
    if (subtopic === "percentages") { const value = rng.int(20, 250) * 10, pct = rng.pick([5,7.5,10,12.5,15,18,20,22.5,25,30,35,40]); return qNumber(`Calculate ${pct}% of ${value}.`, value * pct / 100, "Convert the percentage to a decimal and multiply.", { tolerance: 0.001 }); }
    return generateArithmetic(rng, { firstDigits: 3, secondDigits: 2, allowNegative: false }, rng.pick(["+", "−", "×", "÷"]));
  }

  function generatorFor(subjectTrack, grade, topic, subtopic, rng, settings) {
    if (subjectTrack === "math_literacy") return generateMathLit(rng, topic, subtopic);
    if (["whole_numbers", "integers"].includes(topic)) return generateArithmetic(rng, settings);
    if (topic === "decimals") return generateDecimal(rng, settings);
    if (topic === "fractions") { const d1 = rng.int(2, 12), d2 = rng.int(2, 12), n1 = rng.int(1, d1 - 1), n2 = rng.int(1, d2 - 1); return qFraction(`Calculate: ${fractionHtml(n1, d1)} + ${fractionHtml(n2, d2)}`, n1 * d2 + n2 * d1, d1 * d2, "Use a common denominator, add, then simplify.", { marks: 2 }); }
    if (topic === "algebraic_expressions") {
      if (grade >= 10) return generateAlgebraSenior(rng, subtopic, grade);
      if (["multiply_monomials", "monomial_products", "powers_monomials"].includes(subtopic)) return generateLikeTerms(rng, grade, "products");
      if (["distribution", "brackets"].includes(subtopic)) return generateDistribution(rng, grade);
      if (subtopic === "substitution") return generateSubstitution(rng, grade);
      if (subtopic === "add_subtract_expressions") return generateLikeTerms(rng, grade, "multi");
      if (subtopic === "algebraic_fractions") return generateFactorisation(rng, "algebraic_fractions");
      return generateLikeTerms(rng, grade, grade === 8 && rng.bool() ? "multi" : "linear");
    }
    if (topic === "equations") return grade >= 10 ? generateAdvancedEquation(rng, subtopic, settings) : generateLinearEquation(rng, subtopic, settings);
    if (topic === "factorisation") return generateFactorisation(rng, subtopic);
    if (topic === "patterns") return generatePattern(rng, subtopic, grade);
    if (topic === "functions") return grade >= 10 ? generateAdvancedFunction(rng, subtopic, grade) : generateFunction(rng, subtopic, grade);
    if (topic === "exponents") return generateExponents(rng, subtopic, grade);
    if (topic === "geometry") return generateGeometry(rng, subtopic);
    if (topic === "euclidean_geometry") return generateEuclidean(rng, subtopic);
    if (topic === "pythagoras") return generatePythagoras(rng);
    if (topic === "measurement") return generateMeasurement(rng, subtopic);
    if (topic === "data_handling") return generateStats(rng, subtopic);
    if (topic === "statistics") return generateStatsAdvanced(rng, subtopic);
    if (topic === "probability") return generateProbabilityAdvanced(rng, subtopic);
    if (topic === "finance") return generateFinanceAdvanced(rng, subtopic, subjectTrack);
    if (topic === "trigonometry") return generateAdvancedTrig(rng, subtopic);
    if (topic === "analytical_geometry") return generateAnalyticalAdvanced(rng, subtopic);
    if (topic === "calculus") return generateCalculusAdvanced(rng, subtopic);
    return generateArithmetic(rng, settings);
  }

  function examBundle(subjectTrack, grade, topic, subtopic, rng, settings) {
    if (subjectTrack === "mathematics" && topic === "algebraic_expressions" && grade === 8) {
      return [generateLikeTerms(rng, 8, "multi"), generateLikeTerms(rng, 8, "products"), generateDistribution(rng, 8), generateSubstitution(rng, 8)];
    }
    if (subjectTrack === "mathematics" && topic === "factorisation" && grade >= 9) {
      return [generateFactorisation(rng, "common_factor"), generateFactorisation(rng, "difference_squares"), generateFactorisation(rng, "trinomials"), generateFactorisation(rng, "algebraic_fractions")];
    }
    if (subjectTrack === "mathematics" && topic === "equations") {
      const subs = grade === 8 ? ["inspection", "variables_both_sides", "brackets", "fractional"] : grade === 9 ? ["linear_brackets", "fractional_linear", "rational", "identity_no_solution"] : [subtopic, "quadratic", "inequalities", "word_problems"];
      return subs.map((s) => generateLinearEquation(rng, s, settings));
    }
    if (topic === "functions" && grade >= 10) {
      const q1 = generateFunction(rng, "quadratic", grade); const q2 = generateFunction(rng, "linear", grade); const q3 = generateFunction(rng, "quadratic", grade); return [q1, q2, q3];
    }
    if (topic === "finance") return [generateFinance(rng, subtopic, subjectTrack), generateFinance(rng, "compound_growth", subjectTrack), generateFinance(rng, "simple_interest", subjectTrack)];
    return [generatorFor(subjectTrack, grade, topic, subtopic, rng, settings), generatorFor(subjectTrack, grade, topic, subtopic, rng, settings), generatorFor(subjectTrack, grade, topic, subtopic, rng, settings)];
  }

  function getTopics(subjectTrack, grade) {
    const data = TOPICS[subjectTrack]?.[Number(grade)] || {};
    return Object.keys(data).map((id) => ({ id, label: TOPIC_LABELS[id] || id }));
  }
  function getSubtopics(subjectTrack, grade, topic) {
    const ids = TOPICS[subjectTrack]?.[Number(grade)]?.[topic] || [];
    return ids.map((id) => ({ id, label: SUBTOPIC_LABELS[id] || id }));
  }
  function isAllowed(subjectTrack, grade, topic, subtopic) { return Boolean(TOPICS[subjectTrack]?.[Number(grade)]?.[topic]?.includes(subtopic)); }
  function getSettingSchema(topic, subtopic) {
    if (["whole_numbers", "integers", "numbers_calculations"].includes(topic)) return [
      { key: "firstDigits", label: "Digits in first number", type: "select", options: [1,2,3,4,5,6], default: 3 },
      { key: "secondDigits", label: "Digits in second number", type: "select", options: [1,2,3,4,5,6], default: 2 },
      { key: "allowNegative", label: "Allow negative values", type: "checkbox", default: topic === "integers" }
    ];
    if (topic === "decimals") return [
      { key: "wholeDigits", label: "Whole-number digits", type: "select", options: [1,2,3,4], default: 2 },
      { key: "decimalPlaces", label: "Decimal places", type: "select", options: [1,2,3,4], default: 2 },
      { key: "allowNegative", label: "Allow negative values", type: "checkbox", default: false }
    ];
    if (["algebraic_expressions", "equations", "factorisation", "functions"].includes(topic)) return [
      { key: "coefficientMax", label: "Maximum coefficient size", type: "select", options: [5,9,12,20], default: 9 },
      { key: "termCount", label: "Number of terms", type: "select", options: [2,3,4,5,6], default: 4 },
      { key: "steps", label: "Steps", type: "select", options: ["one", "multi"], optionLabels: { one: "One-step", multi: "Multi-step" }, default: "multi" },
      { key: "fractionalCoefficients", label: "Allow fractional coefficients", type: "checkbox", default: false }
    ];
    return [];
  }

  function generateAssignment(options) {
    const subjectTrack = String(options.subjectTrack || "mathematics");
    const grade = Number(options.grade);
    const topic = String(options.topic || "");
    const subtopic = String(options.subtopic || "");
    const quizType = ["practice", "mixed", "exam"].includes(options.quizType) ? options.quizType : "practice";
    const difficulty = ["easy", "standard", "challenge"].includes(options.difficulty) ? options.difficulty : "standard";
    const questionCount = Math.max(5, Math.min(20, Number(options.questionCount || 10)));
    const seed = String(options.seed || `${Date.now()}-${Math.random()}`);
    const settings = { ...(options.settings || {}) };
    if (!isAllowed(subjectTrack, grade, topic, subtopic)) throw new Error("That subtopic is not active for the selected grade and subject.");
    const rng = createRng(seed);
    const pairs = []; const seen = new Set(); let safety = 0;
    const add = (pair) => {
      const text = `${pair.question.contextHtml || ""}${pair.question.promptHtml}`.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      if (!seen.has(text) && pairs.length < questionCount) { seen.add(text); pairs.push(pair); }
    };
    if (quizType === "exam") {
      while (pairs.length < questionCount && safety++ < 100) examBundle(subjectTrack, grade, topic, subtopic, rng, settings).forEach(add);
    } else if (quizType === "mixed") {
      const subtopics = TOPICS[subjectTrack][grade][topic];
      while (pairs.length < questionCount && safety++ < 1000) add(generatorFor(subjectTrack, grade, topic, rng.pick(subtopics), rng, settings));
    } else {
      while (pairs.length < questionCount && safety++ < 1000) add(generatorFor(subjectTrack, grade, topic, subtopic, rng, settings));
    }
    if (pairs.length < questionCount) throw new Error("Not enough unique questions could be generated. Try fewer questions or different settings.");
    const questions = [], answerKey = [];
    pairs.forEach((pair, index) => { const id = `q${index + 1}`; questions.push({ id, number: index + 1, ...pair.question }); answerKey.push({ id, ...pair.key }); });
    return {
      generatorVersion: VERSION, seed, subjectTrack, grade, topic, subtopic, quizType, difficulty, settings,
      questionCount, totalMarks: answerKey.reduce((sum, key) => sum + Number(key.marks || 1), 0),
      title: `${SUBJECT_LABELS[subjectTrack]} Grade ${grade}: ${TOPIC_LABELS[topic]} — ${SUBTOPIC_LABELS[subtopic]}`,
      questions, answerKey
    };
  }

  global.SNTSeniorQuestionEngine = Object.freeze({
    VERSION, SUBJECT_LABELS, TOPIC_LABELS, SUBTOPIC_LABELS, QUIZ_TYPES,
    getTopics, getSubtopics, getSettingSchema, isAllowed, generateAssignment, reduceFraction
  });
})(typeof window !== "undefined" ? window : globalThis);
