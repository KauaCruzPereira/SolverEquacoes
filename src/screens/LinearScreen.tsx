import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { InputField, Btn, ResultBox, SectionCard, ResultsText } from "../components";
import { solveLinear, SolverResult } from "../solvers";
import { colors, spacing } from "../theme";

type ScreenProps = {
  onShowResult?: () => void;
};

export default function LinearScreen({ onShowResult }: ScreenProps) {
  const [a, setA] = useState("2");
  const [b, setB] = useState("3");
  const [c, setC] = useState("11");
  const [result, setResult] = useState<SolverResult | null>(null);

  useEffect(() => {
    if (result) onShowResult?.();
  }, [result, onShowResult]);

  const preview = () => {
    const av = a || "a";
    const bv = parseFloat(b);
    const bSign = !isNaN(bv) && bv < 0 ? "" : "+";
    return `${av}x ${bSign} ${b || "b"} = ${c || "c"}`;
  };

  const { width } = useWindowDimensions();
  const isLarge = width >= 900;

  return (
    <View style={[styles.container, isLarge && styles.rowContainer]}>
      <View style={isLarge ? styles.leftPane : undefined}>
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
              setResult(
                solveLinear(parseFloat(a), parseFloat(b), parseFloat(c)),
              )
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
  preview: {
    fontFamily: "monospace",
    fontSize: 16,
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
