import { useState, useEffect, lazy } from "react";

 import { Game } from "./components/Game";
// const Game = lazy(() =>
//   // named export
//   import("./components/Game").then((module) => ({ default: module.Game }))
// );


// import { GameProvider } from "./hooks/useGame";
const GameProvider = lazy(() =>
  // named export
  import("./hooks/useGame").then((module) => ({ default: module.GameProvider }))
);

import { ThemeProvider } from "styled-components";
// import { motion } from "framer-motion"; // Import framer-motion for animation

import GlobalStyles from "./styles/global";
import theme from "./styles/theme";

//import LoadingScreen from "./components/ScreenLoading";

// Dynamic imports
const LoadingScreen = lazy(() =>
  // named export
  import("./components/ScreenLoading").then((module) => ({ default: module.LoadingScreen }))
);

//import LoginScreen from "./components/ScreenLogin";
// Dynamic imports
const LoginScreen = lazy(() =>
  // named export
  import("./components/ScreenLogin").then((module) => ({ default: module.LoginScreen }))
);

import { AiohaModal } from '@aioha/react-ui'
import { KeyTypes } from '@aioha/aioha'
// import { Background } from "./components/Player/styles";

// import { fighters } from "./utils/fighters";
// import { fetchUserPurchasedVIPTicket } from "./utils/transactions";


export function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalDisplayed, setModalDisplayed] = useState(false)

  // Simulate loading screen for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <GameProvider>
        <GlobalStyles />
        {loading ? (
          <LoadingScreen />
        ) : !isLoggedIn ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          // <Game />
          <Game setIsLoggedIn={setIsLoggedIn} /> // Pass setIsLoggedIn as a prop to Game
        )}


        <AiohaModal
          displayed={modalDisplayed}
          loginOptions={{
            msg: 'Login',
            keyType: KeyTypes.Posting
          }}
          onLogin={console.log}
          onClose={setModalDisplayed}
        />

      </GameProvider>
    </ThemeProvider>
  );
}
