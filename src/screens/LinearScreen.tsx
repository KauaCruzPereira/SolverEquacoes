import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { InputField, Btn, ResultBox, SectionCard } from "../components";
import { solveLinear, SolverResult } from "../solvers";
import { colors, spacing } from "../theme";

export default function LinearScreen() {
  const [a, setA] = useState("2");
  const [b, setB] = useState("3");
  const [c, setC] = useState("11");
  const [result, setResult] = useState<SolverResult | null>(null);

  const preview = () => {
    const av = a || "a";
    const bv = parseFloat(b);
    const bSign = !isNaN(bv) && bv < 0 ? "" : "+";
    return `${av}x ${bSign} ${b || "b"} = ${c || "c"}`;
  };

  return (
    <View style={styles.container}>
      <SectionCard label="Equação de 1º grau">
        <InputField
          label="a"
          value={a}
          onChangeText={setA}
          placeholder="coef. de x"
        />
        <InputField
          label="b"
          value={b}
          onChangeText={setB}
          placeholder="constante"
        />
        <InputField
          label="c"
          value={c}
          onChangeText={setC}
          placeholder="resultado"
        />
        <Text style={styles.preview}>{preview()}</Text>
        <Btn
          label="Resolver"
          onPress={() =>
            setResult(solveLinear(parseFloat(a), parseFloat(b), parseFloat(c)))
          }
        />
      </SectionCard>
      <ResultBox result={result} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    fontFamily: "monospace",
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
});
