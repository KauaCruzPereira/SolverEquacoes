import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  InputField,
  Btn,
  ResultBox,
  SectionCard,
  Divider,
} from "../components";
import { solveSistema, SolverResult } from "../solvers";
import { colors, spacing } from "../theme";

type ScreenProps = {
  onShowResult?: () => void;
};

export default function SistemaScreen({ onShowResult }: ScreenProps) {
  const [a1, setA1] = useState("2");
  const [b1, setB1] = useState("1");
  const [c1, setC1] = useState("5");
  const [a2, setA2] = useState("4");
  const [b2, setB2] = useState("-1");
  const [c2, setC2] = useState("3");
  const [result, setResult] = useState<SolverResult | null>(null);

  useEffect(() => {
    if (result) onShowResult?.();
  }, [result, onShowResult]);

  return (
    <View style={styles.container}>
      <SectionCard label="Sistema 2x2">
        <Text style={styles.description}>Equação 1: a₁x + b₁y = c₁</Text>
        <InputField label="a₁" value={a1} onChangeText={setA1} />
        <InputField label="b₁" value={b1} onChangeText={setB1} />
        <InputField label="c₁" value={c1} onChangeText={setC1} />
        <Divider />
        <Text style={styles.description}>Equação 2: a₂x + b₂y = c₂</Text>
        <InputField label="a₂" value={a2} onChangeText={setA2} />
        <InputField label="b₂" value={b2} onChangeText={setB2} />
        <InputField label="c₂" value={c2} onChangeText={setC2} />
        <Btn
          label="Resolver"
          onPress={() =>
            setResult(
              solveSistema(
                parseFloat(a1),
                parseFloat(b1),
                parseFloat(c1),
                parseFloat(a2),
                parseFloat(b2),
                parseFloat(c2),
              ),
            )
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
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
});
