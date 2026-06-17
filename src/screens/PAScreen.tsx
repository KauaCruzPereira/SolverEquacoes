import React, { useEffect, useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { InputField, Btn, ResultBox, SectionCard, ResultsText } from "../components";
import { solvePA, SolverResult } from "../solvers";

type ScreenProps = {
  onShowResult?: () => void;
};

export default function PAScreen({ onShowResult }: ScreenProps) {
  const [a1, setA1] = useState("2");
  const [r, setR] = useState("3");
  const [n, setN] = useState("6");
  const [result, setResult] = useState<SolverResult | null>(null);

  useEffect(() => {
    if (result) onShowResult?.();
  }, [result, onShowResult]);

  const { width } = useWindowDimensions();
  const isLarge = width >= 900;

  return (
    <View style={[styles.container, isLarge && styles.rowContainer]}>
      <View style={isLarge ? styles.leftPane : undefined}>
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
      </View>

      <View style={isLarge ? styles.rightPane : undefined}>
        {result ? (
          <ResultBox result={result} />
        ) : (
          <View style={{ flex: 1, alignItems: "center" }}>
            <ResultsText />
          </View>
        )}{" "}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  leftPane: {
    flex: 0.4,
    marginRight: 16,
  },
  rightPane: {
    flex: 0.6,
  },
});
