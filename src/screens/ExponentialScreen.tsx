import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { InputField, Btn, ResultBox, SectionCard, ResultsText } from "../components";
import { solveExponential, SolverResult } from "../solvers";
import { colors, spacing } from "../theme";

type ScreenProps = {
  onShowResult?: () => void;
};

export default function ExponentialScreen({ onShowResult }: ScreenProps) {
  const [a, setA] = useState("2");
  const [b, setB] = useState("32");
  const [result, setResult] = useState<SolverResult | null>(null);

  useEffect(() => {
    if (result) onShowResult?.();
  }, [result, onShowResult]);

  const { width } = useWindowDimensions();
  const isLarge = width >= 900;

  return (
    <View style={[styles.container, isLarge && styles.rowContainer]}>
      <View style={isLarge ? styles.leftPane : undefined}>
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
      </View>

      <View style={isLarge ? styles.rightPane : undefined}>
        {result ? (
          <ResultBox result={result} />
        ) : (
          <View style={{ flex: 1, alignItems: "center" }}>
            <ResultsText />{" "}
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
  note: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  leftPane: {
    flex: 0.4,
    marginRight: spacing.md,
  },
  rightPane: {
    flex: 0.6,
  },
});
