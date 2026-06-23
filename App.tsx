import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TabBar, TabId } from "./src/components";
import { colors, radius, spacing } from "./src/theme";

import Sparkles from "./src/assets/svg/sparkles";
import CalculatorScreen from "./src/screens/CalculatorScreen";
import ChatModal from "./src/screens/ChatModal";
import ExponentialScreen from "./src/screens/ExponentialScreen";
import LinearScreen from "./src/screens/LinearScreen";
import PAScreen from "./src/screens/PAScreen";
import PGScreen from "./src/screens/PGScreen";
import PorcentagemScreen from "./src/screens/PorcentagemScreen";
import QuadraticScreen from "./src/screens/QuadraticScreen";
import Regra3Screen from "./src/screens/Regra3Screen";
import SistemaScreen from "./src/screens/SistemaScreen";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationHeader } from "./src/components/header";

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
    <View style={{ flex: 1 }}>
      <NavigationHeader/>
      <LinearGradient
        colors={["#F7F1EB", "#EFE5DC", "#E6D8CC"]}
        style={{ flex: 1 }}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />

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
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
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
  navHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButtonsContainer: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "center",
  },
  navButtonsContainerMobile: {
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    justifyContent: "space-between",
  },
  navButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    position: "relative",
    overflow: "hidden",
  },
  navButtonMobile: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.tabActiveText,
    borderRadius: radius.md,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.tabActiveText,
    zIndex: 1,
  },
  navButtonTextMobile: {
    fontSize: 11,
    fontWeight: "600" as const,
    textAlign: "center",
  },
  navButtonTextActive: {
    fontWeight: "700" as const,
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
    borderColor: "white",
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
