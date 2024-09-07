import { useState, useEffect, useRef } from "react";
import { useGame, Fighter, PlayerName } from "../../hooks/useGame";
import theme from "../../styles/theme";

import { Player } from "../Player";
import { Fighters } from "../Fighters";
// import { ItemsStore } from "../ItemStore";

import { Button } from "../Button";
import { Modal } from "../Modal";

import Success from "../../assets/animations/success.json";
import Fail from "../../assets/animations/fail.json";
import Draw from "../../assets/animations/draw.json";

import { Player as Animation } from "@lottiefiles/react-lottie-player";
import { Variants, motion } from "framer-motion";
import { Container } from "./styles";
import { fighters } from "../../utils/fighters";

import CountdownTimer from "../CountdownTimer";

import { useAioha } from '@aioha/react-ui';

type NextGameInterval =
  | "jail"
  | "rest";

  interface GameProps {
    setIsLoggedIn: (value: boolean) => void;
  }

// export function Game() {
export function Game({ setIsLoggedIn }: GameProps) {
  const { 
      state: { playerOne, playerTwo, stage, selectedAttribute, turn, isEndGame },
      dispatch,
  } = useGame();

  const { user, aioha } = useAioha();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [message, setMessage] = useState("Select 10 skaters");

  const [isFightButtonVisible, setIsFightButtonVisible] = useState(false);
  const [isRoundResultModalVisible, setIsRoundResultModalVisible] = useState(false);
  const selectedFightersIds = useRef<number[]>([]);
  const [taskMessage, setCoolTask] = useState('');
  
  const [isRecovered, setIsRecovered] = useState(true);
  const restMessage = "Skateboarding life is tough! You need to get some rest."
  const jailMessage = "Looks like the grind was too real! Welcome to your new sponsor: the county jail. Better brush up on your cell block ollies!"
  const [recoveryMessage, setRecoveryMessage] = useState(restMessage);

  // battle logs
  const [roundDescriptions, setRoundDescriptions] = useState<string[]>([]); // New state for round descriptions

  // Function to change the background image
  const changeBackground = () => {
   setCurrentLevel(prevLevel => {
     const nextLevel = prevLevel === 5 ? 1 : prevLevel + 1;
     return nextLevel;
   });
  };


  const agilitySentences = [
    "Obstacle ahead, time to show your",  "Can you dodge this? Let's see your",
    "Quick reflexes needed! Show your",   "Hurdle in your way, show your"
  ];
  
  const styleSentences = [
    "Sponsor's watching, show off your",            "Looking good, time to flash your",
    "Let's see if you've got that swag. Show your", "Sponsors love a show. Let's see some"
  ];
  
  const speedSentences = [
    "Cops are on your tail, bolt with your",    "Time to outrun the law, show your",
    "Can you keep up? Show your",               "No time to slow down, hit 'em with your"
  ];

  // Function to get a random sentence from the list
  function getRandomSentence(sentences: string[]): string {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
  }
  
  useEffect(() => {
    const levelImageUrl = `/skateparks/skate-park-l${currentLevel}.jpeg`;
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.backgroundImage = `url(${levelImageUrl})`;
    }
  }, [currentLevel]);

  function setWinner(winner: PlayerName | null) {
    dispatch({ type: "setWinner", payload: winner });
    dispatch({ type: "setStage", payload: "round-result" });

    // Generate markdown for each round
    let RoundX = roundDescriptions.length+1;

/*    
    const newRoundDescription_PictureMode = `
## Round ${RoundX}: ***${selectedAttribute?.toUpperCase()}***
\n
| ![${playerOne.selectedFighter?.name}](https://images.hive.blog/u/${playerOne.selectedFighter?.name}/avatar) | **VS** | ![${playerTwo.selectedFighter?.name}](https://images.hive.blog/u/${playerTwo.selectedFighter?.name}/avatar) |
|-|-|-|
| **${playerOne.selectedFighter?.name}** ${winner === "playerOne" ? "🏆" : "😡"} | | **${playerTwo.selectedFighter?.name}** ${winner === "playerTwo" ? "🏆" : "😡"} |
`;
    setRoundDescriptions((prev) => [...prev, newRoundDescription]);
*/

const newRoundDescription_NoPicMode = `|Round ${RoundX}: ***${selectedAttribute?.toUpperCase()}***|||
|**${playerOne.selectedFighter?.name}** ${winner === "playerOne" ? "🏆" : "😡"} |VS| **${playerTwo.selectedFighter?.name}** ${winner === "playerTwo" ? "🏆" : "😡"}|
||||`;

    setRoundDescriptions((prev) => [...prev, newRoundDescription_NoPicMode]);
  }

  const paragraphAnimation: Variants = {
    invisible: {
      opacity: 0,
      scale: 0.5,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  function compareFighters() {
    if (
      !selectedAttribute ||
      !playerOne.selectedFighter ||
      !playerTwo.selectedFighter
    )
      return;

    if (
      playerOne.selectedFighter.attributes[selectedAttribute] >
      playerTwo.selectedFighter.attributes[selectedAttribute]
    ) {
      setWinner("playerOne");
    } else if (
      playerOne.selectedFighter.attributes[selectedAttribute] ===
      playerTwo.selectedFighter.attributes[selectedAttribute]
    ) {
      setWinner(null);
    } else {
      setWinner("playerTwo");
    }
  }

  function getRandomFighter(fighters: Fighter[]) {
    let randomFighter = null;

    do {
      const randomIndex = Math.floor(Math.random() * fighters.length);
      randomFighter = fighters[randomIndex];
    } while (selectedFightersIds.current.includes(randomFighter.id));

    return randomFighter;
  }

  function getPlayerTwoFighter() {
    return new Promise<Fighter>((resolve, reject) => {
      setTimeout(() => {
        const fighter = getRandomFighter(playerTwo.fighters);
        if (fighter) {
          resolve(fighter);
        } else {
          reject("Fail to get the fighter");
        }
      }, 500);
    });
  }

  function setPlayerTwoSelectedFighter(fighter: Fighter) {
    dispatch({ type: "setPlayerTwoSelectedFighter", payload: fighter });
  }

  function canPlayAgain() {
    const nextGameTime = localStorage.getItem('recoveryAt');
    const nextGameType = localStorage.getItem('recoveryType') as NextGameInterval | null;

    if (!nextGameTime) {
      return true; // No countdown means the user can play
    }
  
    if (nextGameType && nextGameType === 'jail')
      setRecoveryMessage(jailMessage);

    const now = new Date();
    const countdownEnd = new Date(nextGameTime);
    return now >= countdownEnd; // True if the current time is after the countdown
  }
  
  //   const now = new Date();
  //   const countdownEnd = new Date(nextGameTime);
  //   const canPlay = now >= countdownEnd;

  //   console.log("is recovered? "+ isRecovered);
  //   console.log("can play? "+ canPlay);

  //   setisRecovered(canPlay);
  //   return canPlay; // Return true if the current time is after the countdown
  // } 

  async function handleFightButtonClick() {
    if (!canPlayAgain()) {
      setIsRecovered(false);  // Start the cooldown period
      // setCooldownSeconds(60); // Reset cooldown time
      // alert("You must wait until the cooldown ends to play again.");
      return;
    }

    dispatch({ type: "setStage", payload: "fighterTwo-selection" });

    try {
      selectedFightersIds.current = [];

      const times = playerTwo.fighters.length <= 5 ? 1 : 5;

      for (let i = 0; i < times; i++) {
        const playerTwoFighter = await getPlayerTwoFighter();
        setPlayerTwoSelectedFighter(playerTwoFighter);
        selectedFightersIds.current.push(playerTwoFighter.id);
      }

      dispatch({ type: "setStage", payload: "round-result" });
    } catch (error) {
      console.error(error);
    }
  }

  const handleCooldownComplete = () => {
    setIsRecovered(true);
  };

  // const handleCooldownCheck = () => {
  //   const nextGameType = localStorage.getItem('recoveryType') as NextGameInterval | null;
  //   if (nextGameType && nextGameType === 'jail')
  //     setRecoveryMessage(jailMessage);
  // };

  function getModalAnimation(isWinner: boolean | null) {
    if (isWinner !== null) {
      return isWinner ? Success : Fail;
    }
    return Draw;
  }

  function getModalMessage(isWinner: boolean | null): string {
    if (isWinner !== null) {
      return isWinner ? "You won!" : "You lost!";
    }
    return "We have a draw";
  }

  function getWinnerColor(isWinner: boolean | null): string {
    if (isWinner !== null) {
      return isWinner ? "green_300" : "red";
    }
    return "yellow";
  }

  function changeTurn() {
    const newTurn = turn === "playerOne" ? "playerTwo" : "playerOne";
    dispatch({ type: "setTurn", payload: newTurn });
  }

  function exchangeLoserFighter() {
    let loserFighter = null;

    if (playerOne.isWinner) {
      loserFighter = playerTwo.selectedFighter;
    } else {
      loserFighter = playerOne.selectedFighter;
    }

    dispatch({ type: "setPlayerOneFighters", payload: loserFighter! });
    dispatch({ type: "setPlayerTwoFighters", payload: loserFighter! });

    changeTurn();
  }

  function handleNextRoundButtonClick() {
    changeBackground();
    setIsRoundResultModalVisible(false);
    dispatch({ type: "setPlayerTwoSelectedFighter", payload: null });
    dispatch({ type: "setStage", payload: "attribute-selection" });
    if (playerOne.isWinner === null) {
      return;
    }
    exchangeLoserFighter();
    dispatch({ type: "setWinner", payload: null });

    if ((playerOne.fighters.length === 19) && (playerOne.isWinner)) {
      dispatch({ type: "setWinner", payload: "playerOne" });
      dispatch({ type: "setIsEndGame", payload: true });
      const newRoundDescription = "## Congratulations! You Win!";
      defineNextGameInterval('rest');
      setRoundDescriptions((prev) => [...prev, newRoundDescription]);
      return;
    } else if ((playerTwo.fighters.length === 19) && (playerTwo.isWinner)) {
      dispatch({ type: "setWinner", payload: "playerTwo" });
      dispatch({ type: "setIsEndGame", payload: true });
      const newRoundDescription = "## You Loose!";
      defineNextGameInterval('jail');
      setRoundDescriptions((prev) => [...prev, newRoundDescription]);
      return;
    }
  }

  async function shareResultsHive(title: string, post: string){
    const pa = import.meta.env.VITE_THREAD_AUTHOR || "skatedev";
    const pp = import.meta.env.VITE_THREAD_PERMLINK || "re-skatedev-sidr6t";
    const appname = import.meta.env.VITE_APPNAME || "Xtreme-Heroes";
    const appver = import.meta.env.VITE_APPVER || "1.0.1";
    
    const permlink = new Date()
    .toISOString()
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();

    // Get registered providers
    // console.log(aioha.getProviders())
    // Get current logged in user and provider name
    // if (aioha.isLoggedIn()) {
      // console.log(aioha.getCurrentUser(), aioha.getCurrentProvider())
    // }

    //need to send title blank
    title = "";
    const commentResponse = await aioha.comment(
      pa, pp, permlink, 
      title, post,
      { app:  `${appname}/${appver}`});

      if (commentResponse.success===false)
        console.error(commentResponse.error);

    return (commentResponse.success === true);
  }

  async function handlePostResultsSkateHive() {
    // Join all roundDescriptions into a single markdown string
    var myResultsPost = roundDescriptions.join('\n');
    let finalRounds = roundDescriptions.length-1;

    var word_define = "";
    if (finalRounds <= 10) {
      word_define = "easy";
    } else if (finalRounds > 10 && finalRounds <= 15) {
      word_define = "hard-fought";
    } else if (finalRounds > 15 && finalRounds <= 27) {
      word_define = "challenging";
    } else {
      word_define = "super incredible";
    }


    const myResultsPostTitle = 
`## My ${finalRounds-1} Rounds ${import.meta.env.VITE_APPNAME} Result`;

    myResultsPost = 
`${myResultsPostTitle}\n
In another **${import.meta.env.VITE_APPNAME}** competition sponsored by **Skatehive**, we had an ${word_define} match! Here are the results:
\n
||||
|-|-|-|
${myResultsPost}`;

    // Log the markdown for debugging
    //console.log(myResultsPostTitle);
    console.log(myResultsPost);

    shareResultsHive("", myResultsPost)
    .then((results)=> {
      console.log(results);
      // if(results===false)
        //return; //fail... stop or continue?
    })

    // Handle the end game button click
    handleEndGameButtonClick();
  }

  function defineNextGameInterval(timeoutType: NextGameInterval){
    // Determine the recovery time based on win/loss
    const now = new Date();
    const recoveryTime = timeoutType === "rest" ? 10 : 45; // 10 minutes for win, 45 for loss
    const recoveryAt = new Date(now.getTime() + recoveryTime * 60000); // Convert minutes to milliseconds
    // Store recovery time in state and localStorage
    dispatch({ type: "setRecoveryAt", payload: recoveryAt });
    localStorage.setItem('recoveryAt', recoveryAt.toISOString());
    localStorage.setItem('recoveryType', timeoutType);

    const recoveryMsg = timeoutType === "rest" ? restMessage : jailMessage; // 10 minutes for win, 45 for loss    
    setRecoveryMessage(recoveryMsg);

    setIsRecovered(false);  // Start the cooldown period
    //setCooldownSeconds(60); // Reset cooldown time    
  }

  function handleEndGameButtonClick() {
    setRoundDescriptions([]);
    setIsRoundResultModalVisible(false);
    dispatch({ type: "resetGame" });
  }

  function isPlayerOneFighter(fighter: Fighter) {
    return playerOne.fighters.some(({ id }) => id === fighter.id);
  }

  function selectPlayerTwoFighters() {
    const playerTwoFighters = fighters.filter(
      (fighter) => !isPlayerOneFighter(fighter)
    );

    for (const fighter of playerTwoFighters) {
      dispatch({
        type: "setPlayerTwoFighters",
        payload: fighter,
      });
    }
  }

  function getRandomAttribute() {
    const attributes = ["style", "agility", "speed"];
    const randomIndex = Math.floor(Math.random() * attributes.length);
    // return attributes[randomIndex];
    const attribute = attributes[randomIndex];

    if (turn === "playerTwo") {
      switch (attribute) {
        case "agility":
          setCoolTask(getRandomSentence(agilitySentences));
          // return "Obstacle ahead, time to show your";
          break;
        case "style":
          setCoolTask(getRandomSentence(styleSentences));
          //return "Sponsor's watching, show off your";
          break;
        case "speed":
          setCoolTask(getRandomSentence(speedSentences));
          // return "Cops are on your tail, bolt with your";
          break;
      }
    }
    return attribute;
  }

  useEffect(() => {
    setIsFightButtonVisible(
      !!selectedAttribute && stage == "attribute-selection"
    );
  }, [selectedAttribute, stage]);

  useEffect(() => {
    switch (stage) {
      case "attribute-selection":
        if (turn === "playerTwo") {
          const attribute = getRandomAttribute();
          dispatch({ type: "setSelectedAttribute", payload: attribute });
          setMessage("Select Skater");
          break;
        }
        dispatch({ type: "setSelectedAttribute", payload: null });
        setMessage("Select your Skater and Attribute");
        setCoolTask("");
        break;
      case "fighterTwo-selection":
        setMessage("Battling against...");
        break;
      case "round-result":
        setMessage("Result");
        compareFighters();
        setIsRoundResultModalVisible(true);
        break;
    }
  }, [stage]);

  useEffect(() => {
    if (stage !== "fighterOne-selection") return;

    setMessage(`@${user} select Skater ${10 - playerOne.fighters.length}`);

    if (playerOne.fighters.length === 10) {
      dispatch({ type: "setStage", payload: "attribute-selection" });
      dispatch({
        type: "setPlayerOneSelectedFighter",
        payload: playerOne.fighters[0],
      });

      selectPlayerTwoFighters();
    }
  }, [playerOne, stage]);

  function handleQuitGame() {
    const confirmation = window.confirm("You will lose the game. Are you sure you want to leave?");
  
    if (confirmation) {
      handleEndGameButtonClick();
      setIsLoggedIn(false); // Go back to login if the user confirms
    }
  }

  return (
    <Container>

      <div style={{position:'absolute', zIndex: "101",}}>
        <button
          style={{
            padding: "1rem 2rem",
            fontSize: "1em",
            fontFamily: "creepster",
            border: "0px solid yellow",
            color: "white"
          }}
          onClick={() => handleQuitGame()}
        >
         I Quit!
          {/* {user ?? "Connect Wallet"} */}
        </button>
      </div>

      <Player
        selectedFighter={playerOne.selectedFighter}
        fighters={playerOne.fighters}
        isWinner={playerOne.isWinner}
      />

      <div className="middle">

        <motion.p
          variants={paragraphAnimation}
          animate={selectedAttribute ? "visible" : "invisible"}
          transition={{ duration: 0.4 }}
          style={{ pointerEvents: selectedAttribute ? "auto" : "none" }}
          id="attribute"
        >

          <p style={{color:'yellow', fontSize:'0.9em'}}>
            {taskMessage}
          </p>
          
          {/* <span>{selectedAttribute}</span> */}

          { !isRecovered ? (
            <span>Recovering Breath</span>
          ) : (    
            <span>{selectedAttribute}</span>
          )}

        </motion.p>

        {!isRecovered ? (<>
          <p style={{ marginTop:'1.5em', fontSize: "1.5em" }}>
          {recoveryMessage}
          </p></>
        ) : (  
        <p style={{ marginTop:'1.5em', fontSize: "1.5em" }}>
          {message}
        </p>
        )}

        {!isRecovered ? (<></>
        // <ItemsStore />  
        ) : (  
        <Fighters />
        )}

        {!isRecovered ? (
          <CountdownTimer onComplete={handleCooldownComplete} 
          // onCheck={handleCooldownCheck} 
          />
        ) : (
          <Button title="Battle!!"
            onClick={handleFightButtonClick}
            isVisible={isFightButtonVisible}
          />
        )}

        {/*!isRecovered ? (
            <CountdownTimer />
        ) : (*/}
          {/* <Button title="Battle!!"
            onClick={handleFightButtonClick}
            isVisible={isFightButtonVisible}
          /> */}
      </div>

      <Player
        selectedFighter={playerTwo.selectedFighter}
        fighters={playerTwo.fighters}
        isBot={true}
        isWinner={playerTwo.isWinner}
      />

      {isRoundResultModalVisible && (
        <Modal>
          <Animation
            autoplay
            keepLastFrame
            style={{ width: "12rem", height: "12rem" }}
            src={getModalAnimation(playerOne.isWinner)}
          ></Animation>
          <strong
            style={{
              color: theme.colors[getWinnerColor(playerOne.isWinner)],
            }}
          >
            {getModalMessage(playerOne.isWinner)}
          </strong>
          <Button title="Next Round" onClick={handleNextRoundButtonClick} />
        </Modal>
      )}

{isEndGame && (
  <Modal>
    <Animation
      autoplay
      keepLastFrame
      style={{ width: "24rem", height: "24rem" }}
      src={
        playerOne.isWinner
          ? "https://assets9.lottiefiles.com/packages/lf20_touohxv0.json"
          : "https://assets4.lottiefiles.com/packages/lf20_q1i4uDv2pj.json"
      }
    ></Animation>
    <strong
      style={{
        color: theme.colors[playerOne.isWinner ? "yellow" : "red"],
      }}
    >
      {playerOne.isWinner ? "You're the champion!" 
                          : "You're Busted!"}
    </strong>
    <Button title="Share Results" onClick={handlePostResultsSkateHive} />
    <Button title="Continue" onClick={handleEndGameButtonClick} />
    
  </Modal>
)}
    </Container>
  );
}
