import { useState, useEffect } from "react";
import { Game } from "./components/Game";
import { GameProvider } from "./hooks/useGame";
import { ThemeProvider } from "styled-components";
import { motion } from "framer-motion"; // Import framer-motion for animation
import GlobalStyles from "./styles/global";
import theme from "./styles/theme";


import { useAioha, AiohaModal } from '@aioha/react-ui'
import { KeyTypes } from '@aioha/aioha'
// import { Button, useColorMode } from '@chakra-ui/react'

const listVIP = [
  "vaipraonde", 
  "devferri", 
  "xvlad"
];

// Loading Screen
const LoadingScreen = () => {
  return (
    <div className="loading-container" 
          style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 1, color: "#fff", textAlign: "center", paddingTop: "20%" }}></div>
            <div style={{ fontSize: "10rem", textAlign: "center", 
                    color:"green", fontFamily:"creepster" }}>
              Loading...</div>;
    </div>
)};

// Login Screen with Framer Motion Animation
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [modalDisplayed, setModalDisplayed] = useState(false)
  const { user } = useAioha()
  const isVIP = user && listVIP.includes(user);

  return (
    <div
      className="login-container"
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      {/* Panoramic background effect */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: ["0%", "-80%"] }} // Panoramic effect
        transition={{ repeat: Infinity, duration: 120, ease: "linear" }} // Linear panoramic view
        style={{
          width: "200%",
          height: "100%",
          backgroundImage: "url('./skateparks/loading.jpeg')",
          backgroundSize: "fit",
          backgroundRepeat: "repeat-x",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
  
      {/* Login content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          color: "yellow",
          textAlign: "center",
          paddingTop: "10%",
        }}
      >
        <h1
          style={{
            marginBottom: "20px",
            fontFamily: "creepster",
            color: "green",
            fontSize: "32px",
            textShadow: "2px 2px 4px yellow",
            alignContent: "center",
          }}
        >
          Please Login
        </h1>
  
        <button
          style={{ padding: "1rem 2rem", 
            fontSize: "2.5rem", 
            fontFamily: "creepster",
            border: "1px solid yellow" }}
          onClick={() => setModalDisplayed(true)}
        >
          {user ?? "Connect Wallet"}
        </button>
  
        {/* VIP Logic */}
        {isVIP ? (
          <>
          <button
            onClick={onLogin}
            style={{
              padding: "1rem 2rem",
              border: "1px solid yellow",
              fontFamily: "creepster",
              fontSize: "2.5rem",
              marginLeft: "2em",
            }}
          >
            Start
          </button>
          <p style={{paddingBottom:"10em"}}></p>
          </>
        ) : user ? (
          <>
            <p
              style={{ 
                marginBottom: "20px",
                fontFamily: "creepster",
                fontSize: "32px",
                color: "white",
                textShadow: "2px 2px 4px yellow",
                alignContent: "center", padding: "1em", 
              }}
            >
              Sorry, {user}, you are not on the VIP list.
            </p>
            <button
              style={{
                padding: "1rem 2rem",
                fontFamily: "creepster",
                fontSize: "2.5rem",
                marginLeft: "2em",
                border: "1px solid",
              }}
              onClick={() => alert("Purchase Ticket")}
            >
              Purchase Ticket
            </button>
          </>
        ) : (
          <p style={{paddingBottom:"10em"}}></p>
        )}
  
        {/* Footer Credits */}
        <div
          style={{
            position: "relative",
            bottom: "-10em",
            textAlign: "center",
            color: "silver",
          }}
        >
          <p>
            Designed by @vaipraonde | Game Engine: JohnPetros | Skatehive Devs:
            @devferri @mengao @xvlad @alexandrefeliz @louzado @r4topunk
          </p>
        </div>
  
        {/* Modal for login */}
        <AiohaModal
          displayed={modalDisplayed}
          loginOptions={{
            msg: "Login",
            keyType: KeyTypes.Posting,
          }}
          onLogin={console.log}
          onClose={setModalDisplayed}
        />
      </div>
    </div>
  );
}

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
          <Game />
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
