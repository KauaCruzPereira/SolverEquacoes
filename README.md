# SolverEquacoes

Aplicativo de resolução de equações feito com **Expo + React Native + TypeScript**.

## Funcionalidades

| Aba | O que resolve |
|---|---|
| 1º Grau | ax + b = c |
| 2º Grau | ax² + bx + c = 0 (Bhaskara) |
| Sistemas | Sistema 2×2 (Cramer) |
| PA | Progressão Aritmética (aₙ e Sₙ) |
| PG | Progressão Geométrica (aₙ e Sₙ) |
| Exponencial | aˣ = b → encontrar x |
| Porcentagem | X% de Y, acréscimo e desconto |
| Regra de 3 | Direta e inversa |

Todos os cálculos mostram os passos intermediários.

## Como rodar

### Pré-requisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- App **Expo Go** no celular (iOS ou Android)

### Instalação

```bash
cd SolverEquacoes
npm install
npx expo start
```

Escaneie o QR code com o Expo Go para rodar no celular.

### Android / iOS nativo

```bash
# Android
npm run android

# iOS (somente macOS)
npm run ios
```

## Estrutura do projeto

```
SolverEquacoes/
├── App.tsx                  # Raiz do app, roteamento por abas
├── src/
│   ├── components/
│   │   └── index.tsx        # InputField, Btn, ResultBox, TabBar, etc.
│   ├── screens/
│   │   ├── LinearScreen.tsx
│   │   ├── QuadraticScreen.tsx
│   │   ├── SistemaScreen.tsx
│   │   ├── PAScreen.tsx
│   │   ├── PGScreen.tsx
│   │   ├── ExponentialScreen.tsx
│   │   ├── PorcentagemScreen.tsx
│   │   └── Regra3Screen.tsx
│   ├── solvers/
│   │   └── index.ts         # Toda a lógica matemática (pura TS)
│   └── theme/
│       └── index.ts         # Cores, espaçamentos, tipografia
```
