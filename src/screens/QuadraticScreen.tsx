import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { InputField, Btn, ResultBox, SectionCard, ResultsText } from "../components";
import { solveQuadratic, SolverResult } from "../solvers";
import { colors, spacing } from "../theme";

type ScreenProps = {
  onShowResult?: () => void;
};

export default function QuadraticScreen({ onShowResult }: ScreenProps) {
  const [a, setA] = useState("1");
  const [b, setB] = useState("-5");
  const [c, setC] = useState("6");
  const [result, setResult] = useState<SolverResult | null>(null);

  useEffect(() => {
    if (result) onShowResult?.();
  }, [result, onShowResult]);

  const preview = () => {
    const bv = parseFloat(b);
    const cv = parseFloat(c);
    const bStr = !isNaN(bv) ? (bv < 0 ? `${bv}x` : `+ ${bv}x`) : "+ bx";
    const cStr = !isNaN(cv) ? (cv < 0 ? `${cv}` : `+ ${cv}`) : "+ c";
    return `${a || "a"}x² ${bStr} ${cStr} = 0`;
  };

  const { width } = useWindowDimensions();
  const isLarge = width >= 900;

  return (
    <View style={[styles.container, isLarge && styles.rowContainer]}>
      <View style={isLarge ? styles.leftPane : undefined}>
        <SectionCard label="Equação de 2º grau (Bhaskara)">
          <InputField
            label="a"
            value={a}
            onChangeText={setA}
            placeholder="coef. de x²"
          />
          <InputField
            label="b"
            value={b}
            onChangeText={setB}
            placeholder="coef. de x"
          />
          <InputField
            label="c"
            value={c}
            onChangeText={setC}
            placeholder="constante"
          />
          <Text style={styles.preview}>{preview()}</Text>
          <Btn
            label="Resolver (Bhaskara)"
            onPress={() =>
              setResult(
                solveQuadratic(parseFloat(a), parseFloat(b), parseFloat(c)),
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
