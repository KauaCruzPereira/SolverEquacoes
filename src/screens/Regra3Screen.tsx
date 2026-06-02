import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Btn, ResultBox, SectionCard } from "../components";
import { solveRegra3, SolverResult } from "../solvers";
import { colors, spacing, radius } from "../theme";

type ScreenProps = {
  onShowResult?: () => void;
};

export default function Regra3Screen({ onShowResult }: ScreenProps) {
  const [a, setA] = useState("4");
  const [b, setB] = useState("10");
  const [c, setC] = useState("6");
  const [x, setX] = useState("");
  const [result, setResult] = useState<SolverResult | null>(null);

  useEffect(() => {
    if (result) onShowResult?.();
  }, [result, onShowResult]);

  const solve = (tipo: "dir" | "inv") => {
    const r = solveRegra3(parseFloat(a), parseFloat(b), parseFloat(c), tipo);
    setResult(r);
    if (r.ok) setX(r.value.replace("x = ", ""));
  };

  return (
    <View style={styles.container}>
      <SectionCard label="Regra de 3 simples">
        <View style={styles.grid}>
          <View style={styles.cell}>
            <Text style={styles.cellLabel}>A</Text>
            <TextInput
              style={styles.input}
              value={a}
              onChangeText={setA}
              keyboardType="numeric"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellLabel}>B</Text>
            <TextInput
              style={styles.input}
              value={b}
              onChangeText={setB}
              keyboardType="numeric"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellLabel}>C</Text>
            <TextInput
              style={styles.input}
              value={c}
              onChangeText={setC}
              keyboardType="numeric"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellLabel}>x = ?</Text>
            <TextInput
              style={[styles.input, styles.inputResult]}
              value={x}
              editable={false}
            />
          </View>
        </View>
        <Text style={styles.description}>Se A → B, então C → x</Text>
        <View style={styles.btnRow}>
          <Btn label="Direta" onPress={() => solve("dir")} flex={1} />
          <Btn
            label="Inversa"
            variant="secondary"
            onPress={() => solve("inv")}
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cell: {
    flex: 1,
    minWidth: "45%",
  },
  cellLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  input: {
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
  inputResult: {
    backgroundColor: "#E6F1FB",
    borderColor: "#B5D4F4",
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  btnRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
});
