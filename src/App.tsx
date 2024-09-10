import { useState, useEffect, lazy } from "react";
import { ThemeProvider } from "styled-components";
import { Game } from "./components/Game";

const GameProvider = lazy(() =>     // import { GameProvider } from "./hooks/useGame";
import("./hooks/useGame").then((module) => ({ default: module.GameProvider })));

const LoadingScreen = lazy(() =>    //import LoadingScreen from "./components/ScreenLoading";
import("./components/ScreenLoading").then((module) => ({ default: module.LoadingScreen })));

const LoginScreen = lazy(() =>    //import LoginScreen from "./components/ScreenLogin";
import("./components/ScreenLogin").then((module) => ({ default: module.LoginScreen })));

const SpeedInsights = lazy(() =>    //import LoginScreen from "./components/ScreenLogin";
import("@vercel/speed-insights/next").then((module) => ({ default: module.SpeedInsights })));

import { initAioha, Providers } from '@aioha/aioha'
import { AiohaProvider } from '@aioha/react-ui'
import '@aioha/react-ui/dist/build.css'

import GlobalStyles from "./styles/global";
import theme from "./styles/theme";

const aioha = initAioha({
  hiveauth: {
    name: (import.meta.env.VITE_APPNAME || 'Xtreme-Heroes'),
    description: "Login " + import.meta.env.VITE_APPNAME + " Skatehive"
  },
});

aioha.deregisterProvider(Providers.HiveSigner);
aioha.deregisterProvider(Providers.PeakVault);
aioha.deregisterProvider(Providers.Ledger);

export function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {             // Simulate loading screen for 2 seconds
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {    // Handle login
    setIsLoggedIn(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <AiohaProvider aioha={aioha}>
        <GameProvider>
          <GlobalStyles />
          {loading ? (
            <LoadingScreen />
          ) : !isLoggedIn ? (
            <LoginScreen onLogin={handleLogin} />
          ) : (
            // Passing setIsLoggedIn to Game can go back to login screen
            // <Game /> //old game with no propos
            <Game setIsLoggedIn={setIsLoggedIn} />
          )}
        </GameProvider>
        <SpeedInsights />
      </AiohaProvider>
    </ThemeProvider>
  );
}
