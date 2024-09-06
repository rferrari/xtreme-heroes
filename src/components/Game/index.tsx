import { useState, useEffect, useRef } from "react";
import { useGame, Fighter, PlayerName } from "../../hooks/useGame";
import theme from "../../styles/theme";

import { Player } from "../Player";
import { Fighters } from "../Fighters";
import { ItemsStore } from "../ItemStore";

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

import { useAioha } from '@aioha/react-ui'

export function Game() {
  const { state: { playerOne, playerTwo, stage, selectedAttribute, turn, isEndGame },
      dispatch,
  } = useGame();

  const { user } = useAioha();

  const [currentLevel, setCurrentLevel] = useState(1);
  const [message, setMessage] = useState("Select 10 skaters");
  const [isFightButtonVisible, setIsFightButtonVisible] = useState(false);
  const [isRoundResultModalVisible, setIsRoundResultModalVisible] = useState(false);
  const selectedFightersIds = useRef<number[]>([]);
  const [isRecovered, setIsRecovered] = useState(false);
  // const [cooldownSeconds, setCooldownSeconds] = useState(60); // Set your cooldown time in seconds


  // const agilitySentences = [
  //   "Obstacle ahead, time to show your",
  //   "Can you dodge this? Let's see your",
  //   "Quick reflexes needed! Show your",
  //   "Hurdle in your way, show your"
  // ];
  
  // const styleSentences = [
  //   "Sponsor's watching, show off your",
  //   "Looking good, time to flash your",
  //   "Let's see if you've got that swag. Show your",
  //   "Sponsors love a show. Let's see some"
  // ];
  
  // const speedSentences = [
  //   "Cops are on your tail, bolt with your",
  //   "Time to outrun the law, show your",
  //   "Can you keep up? Show your",
  //   "No time to slow down, hit 'em with your"
  // ];

  // Function to get a random sentence from the list
  // function getRandomSentence(sentences: string[]): string {
  //   const randomIndex = Math.floor(Math.random() * sentences.length);
  //   return sentences[randomIndex];
  // }

  // battle logs
  const [roundDescriptions, setRoundDescriptions] = useState<string[]>([]); // New state for round descriptions

 // Function to change the background image
  const changeBackground = () => {
    setCurrentLevel(prevLevel => {
      const nextLevel = prevLevel === 5 ? 1 : prevLevel + 1;
      return nextLevel;
    });
  };

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
    const newRoundDescription = `
## Round ${RoundX}: ***${selectedAttribute?.toUpperCase()}***
\n
| ![${playerOne.selectedFighter?.name}](https://images.hive.blog/u/${playerOne.selectedFighter?.name}/avatar) | **VS** | ![${playerTwo.selectedFighter?.name}](https://images.hive.blog/u/${playerTwo.selectedFighter?.name}/avatar) |
|-|-|-|
| **${playerOne.selectedFighter?.name}** ${winner === "playerOne" ? "🏆" : "😡"} | | **${playerTwo.selectedFighter?.name}** ${winner === "playerTwo" ? "🏆" : "😡"} |
`;

    setRoundDescriptions((prev) => [...prev, newRoundDescription]);
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
    if (!nextGameTime) {
      return true; // No countdown means the user can play
    }
  
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
      alert("You must wait until the cooldown ends to play again.");
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
      setRoundDescriptions((prev) => [...prev, newRoundDescription]);
      return;
    } else if ((playerTwo.fighters.length === 19) && (playerTwo.isWinner)) {
      dispatch({ type: "setWinner", payload: "playerTwo" });
      dispatch({ type: "setIsEndGame", payload: true });
      const newRoundDescription = "## You Loose!";
      setRoundDescriptions((prev) => [...prev, newRoundDescription]);
      return;
    }
  }

  function handlePostResultsSkateHive() {
    // Join all roundDescriptions into a single markdown string
    var myResultsPost = roundDescriptions.join('\n');
    let finalRounds = roundDescriptions.length-1;

    var word_define = "";
    if (finalRounds <= 10) {
      word_define = "easy";
    } else if (finalRounds > 10 && finalRounds <= 15) {
      word_define = "challenging";
    } else if (finalRounds > 15 && finalRounds <= 20) {
      word_define = "hard-fought";
    } else {
      word_define = "super incredible";
    }

    const myResultsPostTitle = `My ${finalRounds-1} Rounds ${import.meta.env.VITE_APPNAME} Result`;
    myResultsPost = `In another **${import.meta.env.VITE_APPNAME}** competition sponsored by **Skatehive**, we had an ${word_define} match! Here are the results:`
                    +myResultsPost

    // Log the markdown for debugging
    console.log(myResultsPostTitle);
    console.log(myResultsPost);
    // Handle the end game button click or any other logic
    handleEndGameButtonClick();
  }

  function handleEndGameButtonClick() {

    // Determine the recovery time based on win/loss
    const now = new Date();
    const recoveryTime = playerOne.isWinner === true ? 10 : 45; // 10 minutes for win, 45 for loss
    const recoveryAt = new Date(now.getTime() + recoveryTime * 60000); // Convert minutes to milliseconds
    // Store recovery time in state and localStorage
    dispatch({ type: "setRecoveryAt", payload: recoveryAt });
    localStorage.setItem('recoveryAt', recoveryAt.toISOString());

    setIsRecovered(false);  // Start the cooldown period
    //setCooldownSeconds(60); // Reset cooldown time

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
    return attributes[randomIndex];
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
    //if(!canPlayAgain()) return;
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

  return (
    <Container>
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
          {(() => {
            if (turn === "playerOne") return;
            switch (selectedAttribute) {
              case "agility":
                // return getRandomSentence(agilitySentences);
                return "Obstacle ahead, time to show your";
              case "style":
                // return getRandomSentence(styleSentences);
                return "Sponsor's watching, show off your";
              case "speed":
                // return getRandomSentence(speedSentences);
                return "Cops are on your tail, bolt with your";
              default:
                return `The attribute of this round is: ${selectedAttribute}`;
            }
          })()}</p><span>{selectedAttribute}</span>
          {/* !isRecovered ? (
            <span>Recovering Breath</span>
          ) : (    
            <span>{selectedAttribute}</span>
          ) */}
        </motion.p>

        <p style={{ marginTop:'1.5em', fontSize: "1.5em" }}>{message}</p>

        {!isRecovered ? (
        <ItemsStore />  
        ) : (  
        <Fighters />
        )}

        {!isRecovered ? (
          <CountdownTimer onComplete={handleCooldownComplete} />
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
      {playerOne.isWinner ? "You're the champion! Now you need a 10 minutes break to catch your breath" 
                          : "You're Busted! Will spend 45 minutes in Jail."}
    </strong>
    <Button title="Share Results" onClick={handlePostResultsSkateHive} />
    <Button title="Close" onClick={handleEndGameButtonClick} />
    
  </Modal>
)}
    </Container>
  );
}
