import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { TabBar, TabId } from "./src/components";
import { colors, spacing, radius } from "./src/theme";

import LinearScreen from "./src/screens/LinearScreen";
import QuadraticScreen from "./src/screens/QuadraticScreen";
import SistemaScreen from "./src/screens/SistemaScreen";
import PAScreen from "./src/screens/PAScreen";
import PGScreen from "./src/screens/PGScreen";
import ExponentialScreen from "./src/screens/ExponentialScreen";
import PorcentagemScreen from "./src/screens/PorcentagemScreen";
import Regra3Screen from "./src/screens/Regra3Screen";
import CalculatorScreen from "./src/screens/CalculatorScreen";

const SCREENS: Record<
  TabId,
  (props: { onShowResult?: () => void }) => React.ReactNode
> = {
  calc: (props) => <CalculatorScreen {...props} />,
  linear: (props) => <LinearScreen {...props} />,
  quad: (props) => <QuadraticScreen {...props} />,
  sistema: (props) => <SistemaScreen {...props} />,
  pa: (props) => <PAScreen {...props} />,
  pg: (props) => <PGScreen {...props} />,
  exp: (props) => <ExponentialScreen {...props} />,
  porcent: (props) => <PorcentagemScreen {...props} />,
  regra3: (props) => <Regra3Screen {...props} />,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("calc");
  const scrollRef = useRef<React.ElementRef<typeof ScrollView> | null>(null);

  const handleShowResult = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Solucionador</Text>
        <Text style={styles.headerSub}>Equações passo a passo</Text>
      </View>

      <View style={styles.tabWrapper}>
        <TabBar active={activeTab} onChange={setActiveTab} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {SCREENS[activeTab]({ onShowResult: handleShowResult })}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    marginBottom: spacing.sm,
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  headerSub: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  tabWrapper: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
});
