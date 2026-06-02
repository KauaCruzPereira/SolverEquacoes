import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { InputField, Btn, ResultBox, SectionCard } from "../components";
import { solvePA, SolverResult } from "../solvers";

export default function PAScreen() {
  const [a1, setA1] = useState("2");
  const [r, setR] = useState("3");
  const [n, setN] = useState("6");
  const [result, setResult] = useState<SolverResult | null>(null);

  return (
    <View style={styles.container}>
      <SectionCard label="Progressão Aritmética">
        <InputField
          label="a₁"
          value={a1}
          onChangeText={setA1}
          placeholder="primeiro termo"
        />
        <InputField
          label="r"
          value={r}
          onChangeText={setR}
          placeholder="razão"
        />
        <InputField
          label="n"
          value={n}
          onChangeText={setN}
          placeholder="nº de termos"
        />
        <Btn
          label="Calcular"
          onPress={() =>
            setResult(solvePA(parseFloat(a1), parseFloat(r), parseInt(n)))
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
});
