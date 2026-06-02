import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Btn, ResultBox, SectionCard } from "../components";
import { solvePorcentagem, SolverResult } from "../solvers";
import { colors, spacing, radius } from "../theme";

export default function PorcentagemScreen() {
  const [val, setVal] = useState("250");
  const [pct, setPct] = useState("15");
  const [result, setResult] = useState<SolverResult | null>(null);

  return (
    <View style={styles.container}>
      <SectionCard label="Calcular Porcentagem">
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={val}
            onChangeText={setVal}
            placeholder="valor"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
          />
          <Text style={styles.sep}>×</Text>
          <TextInput
            style={styles.input}
            value={pct}
            onChangeText={setPct}
            placeholder="%"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
          />
          <Text style={styles.sep}>%</Text>
        </View>
        <View style={styles.btnRow}>
          <Btn
            label="X% de Y"
            onPress={() =>
              setResult(
                solvePorcentagem(parseFloat(val), parseFloat(pct), "of"),
              )
            }
            flex={1}
          />
          <Btn
            label="Adicionar %"
            variant="secondary"
            onPress={() =>
              setResult(
                solvePorcentagem(parseFloat(val), parseFloat(pct), "add"),
              )
            }
            flex={1}
          />
          <Btn
            label="Subtrair %"
            variant="secondary"
            onPress={() =>
              setResult(
                solvePorcentagem(parseFloat(val), parseFloat(pct), "sub"),
              )
            }
            flex={1}
          />
        </View>
      </SectionCard>
      <ResultBox result={result} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 14,
    fontFamily: "monospace",
    fontSize: 16,
    color: colors.textPrimary,
  },
  sep: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  btnRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
});
