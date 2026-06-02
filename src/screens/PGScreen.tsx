import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { InputField, Btn, ResultBox, SectionCard } from "../components";
import { solvePG, SolverResult } from "../solvers";

type ScreenProps = {
  onShowResult?: () => void;
};

export default function PGScreen({ onShowResult }: ScreenProps) {
  const [a1, setA1] = useState("3");
  const [q, setQ] = useState("2");
  const [n, setN] = useState("5");
  const [result, setResult] = useState<SolverResult | null>(null);

  useEffect(() => {
    if (result) onShowResult?.();
  }, [result, onShowResult]);

  return (
    <View style={styles.container}>
      <SectionCard label="Progressão Geométrica">
        <InputField
          label="a₁"
          value={a1}
          onChangeText={setA1}
          placeholder="primeiro termo"
        />
        <InputField
          label="q"
          value={q}
          onChangeText={setQ}
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
            setResult(solvePG(parseFloat(a1), parseFloat(q), parseInt(n)))
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
