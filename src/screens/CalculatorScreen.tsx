import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Btn, ResultBox, ResultsText, SectionCard } from "../components";
import { solveCalculator, SolverResult } from "../solvers";
import { colors, radius, spacing, typography } from "../theme";

type ScreenProps = {
  onShowResult?: () => void;
};

const BUTTON_ROWS = [
  ["7", "8", "9", "÷"],
  ["4", "5", "6", "×"],
  ["1", "2", "3", "-"],
  ["0", ".", "(", ")", "+"],
];

export default function CalculatorScreen({ onShowResult }: ScreenProps) {
  const [expression, setExpression] = useState("0");
  const [result, setResult] = useState<SolverResult | null>(null);
  const { width } = useWindowDimensions();
  const isLarge = width >= 900;

  useEffect(() => {
    if (result) onShowResult?.();
  }, [result, onShowResult]);

  const append = (value: string) => {
    setExpression((prev) => {
      if (prev === "0" && value !== "." && !["×", "÷", ")"].includes(value)) {
        return value;
      }
      return prev + value;
    });
    setResult(null);
  };

  const handleClear = () => {
    setExpression("0");
    setResult(null);
  };

  const handleDelete = () => {
    setExpression((prev) => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
    setResult(null);
  };

  const handleEvaluate = () => {
    const r = solveCalculator(expression);
    setResult(r);
  };

  return (
    <View style={[styles.container, isLarge && styles.rowContainer]}>
      <View style={isLarge ? styles.leftPane : undefined}>
        <SectionCard label="Calculadora básica">
          <View style={styles.displayCard}>
            <Text style={styles.displayExpression}>{expression}</Text>
          </View>

          <View style={styles.buttonGrid}>
            {BUTTON_ROWS.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.buttonRow}>
                {row.map((label) => (
                  <Btn
                    key={label}
                    label={label}
                    onPress={() => append(label)}
                    flex={1}
                  />
                ))}
              </View>
            ))}
            <View style={styles.buttonRow}>
              <Btn
                label="C"
                variant="secondary"
                onPress={handleClear}
                flex={1}
              />
              <Btn
                label="DEL"
                variant="secondary"
                onPress={handleDelete}
                flex={1}
              />
              <Btn label="=" onPress={handleEvaluate} flex={2} />
            </View>
          </View>
        </SectionCard>
      </View>

      <View style={isLarge ? styles.rightPane : undefined}>
        {result ? (
          <ResultBox result={result} />
        ) : (
          <View style={{ flex: 1, alignItems: "center" }}>
            <ResultsText/>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  displayCard: {
    backgroundColor: colors.inputBg,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 90,
    justifyContent: "center",
  },
  displayExpression: {
    ...typography.monoLarge,
    color: colors.textPrimary,
    textAlign: "right",
  },
  presets: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  buttonGrid: {
    gap: spacing.sm,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
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
