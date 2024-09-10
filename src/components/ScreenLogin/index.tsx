import { useState, useEffect } from "react";
import { useAioha, AiohaModal } from "@aioha/react-ui";
import { Asset, KeyTypes } from "@aioha/aioha";
import { motion } from "framer-motion";
import { fighters } from "../../utils/fighters";
import { fetchUserPurchasedVIPTicket } from "../../utils/transactions";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const { user, aioha } = useAioha()
  const [modalDisplayed, setModalDisplayed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vipMessage, setVipMessage] = useState("");
  const [purchasedVIP, setPurchasedVIP] = useState<string[]>([]);

  const listVIP = fighters.map(fighter => fighter.name);
  const combinedVIPList = [...listVIP, ...purchasedVIP];
  const isVIP = user && combinedVIPList.includes(user);
  // console.log(listVIP);

  // Function to fetch the updated VIP list
  let fetchCount = 0;
  async function fetchVIPList() {
    if (!user) return;
    if (fetchCount >= 3) return; // Don't fetch if already tried 3 times

    try {
      fetchUserPurchasedVIPTicket(user).then((result) => {
        if (result) {
          console.log("Xtreme-Heroes Skate Pass was found to: " + user);
          setPurchasedVIP([...purchasedVIP, user]);
          setVipMessage(user + " we found your Xtreme-Heroes Skate Pass!");
        }
        else {
          console.log('Xtreme-Heroes Skate Pass Not Found to ' + user);
        }
        setTimeout(() => setIsLoading(false), 3000);
      });
    } catch (error) {
      console.error('Error fetching VIP list:', error);
      fetchCount++;
    }
  }

  async function handlePurchaseVIPTicket() {
    if (!user) return;
    try {
      const VIP_RECEIVER: string = String(import.meta.env.VITE_PURCHASE_VIP_TO);
      const VIP_PRICE: number = Number(import.meta.env.VITE_PURCHASE_VIP_PRICE);
      const VIP_MEMO: string = String(import.meta.env.VITE_PURCHASE_VIP_MEMO);
      const xfer = await aioha.transfer(VIP_RECEIVER, VIP_PRICE, Asset.HIVE, VIP_MEMO);

      if (xfer.success !== true) {
        console.log(xfer.error);
        return;
      }

      if (xfer.success) {
        console.log(`Wait, validating ${user} Skate Pass`);
        setIsLoading(true);
        setTimeout(() => {
          fetchVIPList();  // Reload the updated VIP list after successfully adding the user
        }, 5000);          // wait to start search after 5 seconds. Hive blockchain 3s block transactions
      } else {
        console.log('Skate pass purchase failed: ' + user);
      }
    } catch (error) {
      console.error('Error Transfer failed:', error);
    }
  }

  // Fetch the VIP list when the component mounts
  useEffect(() => {
    if (user) {
      if (isVIP) setIsLoading(false)
      else fetchVIPList();
    }
  }, [user]);


  //
  // login render
  //
  return (
    <div className="login-container"
      style={{
        position: "relative", height: "100vh", overflow: "hidden",
        display: "flex", flexDirection: "column"
      }}
    >
      {/* Panoramic background effect */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: ["0%", "-100%"] }} // Panoramic effect
        transition={{ repeat: Infinity, duration: 60, ease: "easeInOut" }} // Linear panoramic view
        style={{
          width: "200%",
          height: "100%",
          backgroundImage: "url('./skateparks/loading.jpeg')",
          backgroundSize: "cover",
          backgroundRepeat: "repeat-x",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",   // Vertically center content
          alignItems: "center",       // Horizontally center content
          flex: 1,                    // Take up remaining space
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "creepster",
            color: "yellow",
            fontSize: "32px",
            textShadow: "2px 2px 4px black",
          }}
        >
          {user ? "Welcome to Xtreme-Heroes" : "Connect Wallet to Continue"}
        </h1>

        <button
          style={{
            padding: "1rem 2rem",
            fontSize: "2.5rem",
            fontFamily: "creepster",
            color: "yellow",
            marginBottom: "1.5em",
            textShadow: "2px 2px 4px black",
            border: "1px solid yellow"
          }}
          onClick={() => setModalDisplayed(true)}
        >
          {user ?? "Connect Wallet"}
        </button>

        {(isLoading && user) && (
          <p style={{
            marginBottom: "0.1em",
            fontFamily: "creepster",
            fontSize: "22px",
            fontWeight: "bold",
            color: "white",
            textShadow: "2px 2px 4px black",
            padding: "1em",
          }}>
            Searching your Skate Pass on Hive Blockchain...
          </p>
        )}

        {vipMessage != "" && (
          <p style={{
            marginBottom: "0.1em",
            fontFamily: "creepster",
            fontSize: "22px",
            fontWeight: "bold",
            color: "white",
            textShadow: "2px 2px 4px black",
            padding: "1em",
          }}>
            {vipMessage}
          </p>
        )}

        {/* VIP Logic */}
        {(isVIP && !isLoading) ? (
          <motion.button
            onClick={onLogin}
            style={{
              padding: "1rem 2rem",
              border: "1px solid white",
              color: "yellow",
              textShadow: "2px 2px 4px red",
              fontFamily: "creepster",
              fontSize: "2.5rem",
              margin: '1em auto',
            }}
            animate={{
              scale: [1, 1.1, 1], // Scale from 1 to 1.1 and back to 1
            }}
            transition={{
              duration: 1, // Duration of 1 second for the full pulse
              repeat: 20, // 20s Infinite loop
              repeatType: "loop", // Continuous looping
            }}
          >
            Kickflip In
          </motion.button>
        ) : (user && !isLoading) ? (
          <>
            <p style={{
              marginBottom: "0.1em",
              fontFamily: "creepster",
              fontSize: "22px",
              fontWeight: "bold",
              color: "white",
              textShadow: "2px 2px 4px black",
              padding: "1em",
            }}
            >
              Sorry, {user}, you are not on the Beta Testers VIP list.
              <span style={{ display: "block" }}>Wait for Game Release or <span style={{ color: "yellow" }}>Purchase Skate Pass</span></span>
              <span style={{ display: "block" }}>to support developers and have fun playing</span>
            </p>
            <motion.button
              style={{
                padding: "0.2rem 0.2rem",
                fontFamily: "creepster",
                color: "yellow",
                textShadow: "2px 2px 4px black",
                fontSize: "2.5rem",
                margin: '0em auto',               // Centers horizontally
                border: "0px solid",
              }}
              animate={{
                scale: [1, 1.1, 1],               // Scale from 1 to 1.1 and back to 1
              }}
              transition={{
                duration: 1,                      // Duration of 1 second for the full pulse
                repeat: 20,                       // save cpu
                repeatType: "loop",               // Continuous looping
              }}
              onClick={() => handlePurchaseVIPTicket()}
            >
              Shut up and take my money!!!
              <img
                src="/items/skate-pass.png"
                alt="Skate Pass Ticket"
                style={{
                  display: 'block',
                  margin: '0px auto',              // Centers horizontally
                  width: '158px',
                  height: 'auto'
                }}
              />
            </motion.button>
          </>
        ) : null}

        <div className='tip_screen_message'>
          <p>Mobile Detected, </p>
          <p>Click on 🖥️ icon, </p>
          <p>and flip ↷ your phone!</p>
        </div>

      </div>

      {/* Footer Credits */}
      <div
        style={{
          textAlign: "center",
          color: "silver",
          marginTop: "auto",                  // Pushes footer to the bottom
          paddingBottom: "1em",               // Adds some padding to the bottom
          zIndex: '1'
        }}
      >
        <p>
          Designed by Skatehive Devs: @vaipraonde @devferri @mengao @xvlad @alexandrefeliz @louzado @r4topunk | Game Engine by: JohnPetros
        </p>
      </div>

      {/* Modal for login */}
      <div className={'dark'}>
        <AiohaModal
          displayed={modalDisplayed}
          loginOptions={{
            msg: "Login",
            keyType: KeyTypes.Posting,
          }}
          // onLogin={console.log}
          onClose={setModalDisplayed}
        />
      </div>
    </div>
  );


}
