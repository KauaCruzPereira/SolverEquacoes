import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Animated,
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
import Sparkles from "./src/assets/svg/sparkles";
import ChatModal from "./src/screens/ChatModal";

const TAB_CONTEXT: Record<TabId, string> = {
  calc: "O usuário está usando a calculadora básica com expressões matemáticas.",
  linear: "O usuário está resolvendo equações de 1º grau (ax + b = c).",
  quad: "O usuário está resolvendo equações de 2º grau (Bhaskara): ax² + bx + c = 0.",
  sistema: "O usuário está resolvendo sistemas de equações lineares 2×2.",
  pa: "O usuário está trabalhando com Progressões Aritméticas (PA).",
  pg: "O usuário está trabalhando com Progressões Geométricas (PG).",
  exp: "O usuário está resolvendo equações exponenciais.",
  porcent: "O usuário está calculando porcentagens.",
  regra3: "O usuário está aplicando regra de três simples.",
};

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
  const [chatVisible, setChatVisible] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const animX = React.useRef(new Animated.Value(40)).current;

  useEffect(() => {
    let showTimeout: NodeJS.Timeout | null = null;
    let hideTimeout: NodeJS.Timeout | null = null;

    const schedule = () => {
      const delay = 4000 + Math.random() * 6000;
      showTimeout = setTimeout(() => {
        setHintVisible(true);
        // animate in
        animX.setValue(40);
        Animated.timing(animX, {
          toValue: 0,
          duration: 420,
          useNativeDriver: true,
        }).start();

        hideTimeout = setTimeout(() => {
          Animated.timing(animX, {
            toValue: 40,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setHintVisible(false));
        }, 5000);

        schedule();
      }, delay);
    };

    schedule();

    return () => {
      if (showTimeout) clearTimeout(showTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
      animX.stopAnimation();
    };
  }, [animX]);

  const handleShowResult = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

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

      {hintVisible && (
        <Animated.View
          style={[
            styles.hintBubble,
            {
              transform: [{ translateX: animX }],
              opacity: animX.interpolate({
                inputRange: [0, 40],
                outputRange: [1, 0],
              }),
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.hintText}>Dúvidas? Nossa IA pode ajudar!</Text>

          <View style={styles.hintArrow} />
        </Animated.View>
      )}

      <TouchableOpacity
        style={styles.cornerDot}
        onPress={() => setChatVisible(true)}
      >
        <Sparkles color="white" />
      </TouchableOpacity>

      <ChatModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
        mathContext={TAB_CONTEXT[activeTab]}
      />
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
  cornerDot: {
    position: "absolute",
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 9999,
    bottom: spacing.lg,
    right: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 3,
    borderColor: colors.border,
  },
  hintBubble: {
    position: "absolute",

    right: spacing.lg + 70,
    bottom: spacing.lg + 10,

    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,

    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,

    zIndex: 20,
  },
  hintText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  hintArrow: {
    position: "absolute",
    right: -4,
    top: "50%",
    marginTop: -6,

    width: 12,
    height: 12,

    backgroundColor: colors.primary,

    transform: [{ rotate: "45deg" }],
  },
});
