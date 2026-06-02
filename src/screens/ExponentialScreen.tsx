import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { InputField, Btn, ResultBox, SectionCard } from "../components";
import { solveExponential, SolverResult } from "../solvers";
import { colors, spacing } from "../theme";

export default function ExponentialScreen() {
  const [a, setA] = useState("2");
  const [b, setB] = useState("32");
  const [result, setResult] = useState<SolverResult | null>(null);

  return (
    <View style={styles.container}>
      <SectionCard label="aˣ = b → encontrar x">
        <InputField
          label="a"
          value={a}
          onChangeText={setA}
          placeholder="base"
        />
        <InputField
          label="b"
          value={b}
          onChangeText={setB}
          placeholder="resultado"
        />
        <Text style={styles.note}>Usa logaritmo: x = log(b) / log(a)</Text>
        <Btn
          label="Resolver"
          onPress={() =>
            setResult(solveExponential(parseFloat(a), parseFloat(b)))
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
  note: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
});
