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


import { Howl, Howler } from 'howler';
Howler.volume(0.7);

const initialSoundSettings = {
  volume: 0.7,
  backgroundMusic: {
    sound: null as any,
    isMuted: false,
  },
  ollieFx: {
    sound: null as any,
    isMuted: false,
  },
};

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

  const [soundSettings, setSoundSettings] = useState(initialSoundSettings);
  const [volume, setVolume] = useState(soundSettings.volume);

  // const soundSettings = JSON.parse(localStorage.getItem('soundSettings')) || initialSoundSettings;
  // const [volume, setVolume] = useState(soundSettings.volume);
  // const [soundSettingsState, setSoundSettings] = useState(soundSettings);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    Howler.volume(newVolume);
  };

  const handleToogleSound = (type: 'backgroundMusic' | 'ollieFx') => {
     if (soundSettings[type].sound) {
        const isMuted = !soundSettings[type].isMuted;
        soundSettings[type].isMuted = isMuted;
        soundSettings[type].sound.mute(isMuted);
     } else {
      if (type === 'backgroundMusic') {
        const backgroundMusic = new Howl({ src: ['/soundfx/skatepark.mp3'] });
        soundSettings[type].sound = backgroundMusic;
        backgroundMusic.once('load', () => {
          soundSettings[type].sound.loop(true);
          soundSettings[type].sound.play();
        });
        backgroundMusic.on('end', () => {
          // console.log('looping background music');
        });
      } else if (type === 'ollieFx') {
        const sfxOllie = new Howl({ src: ['/soundfx/ollie.mp3'] });
        soundSettings[type].sound = sfxOllie;
      }
    }
    setSoundSettings({ ...soundSettings });
  };

  useEffect(() => {
    if (soundSettings['backgroundMusic'].sound === null) {
      handleToogleSound('backgroundMusic');
    } else {
       soundSettings['backgroundMusic'].isMuted = false;
       soundSettings['backgroundMusic'].sound.mute(false);
       soundSettings['backgroundMusic'].sound.loop(true);
       soundSettings['backgroundMusic'].sound.play();
    }
    if (soundSettings['ollieFx'].sound === null) {
      handleToogleSound('ollieFx');
    }else {
      soundSettings['ollieFx'].isMuted = false;
      soundSettings['ollieFx'].sound.mute(false);
    }
  }, []);

  const stopSounds = () => {
    try {
      if (soundSettings['backgroundMusic'] && soundSettings['backgroundMusic'].sound) {
        const isMuted = true;
        soundSettings['backgroundMusic'].isMuted = isMuted;
        soundSettings['backgroundMusic'].sound.mute(isMuted);
      }
      if (soundSettings['ollieFx'] && soundSettings['ollieFx'].sound) {
        const isMuted = true
        soundSettings['ollieFx'].isMuted = isMuted;
        soundSettings['ollieFx'].sound.mute(isMuted);
      }
    } catch {
    }
  };

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

    const newRoundDescription_NoPicMode = 
`|${RoundX}|${selectedAttribute?.toUpperCase()}|${winner==="playerOne"?"🏆":"😡"} **${playerOne.selectedFighter?.name}**|${winner==="playerTwo"?"🏆":"😡"} **${playerTwo.selectedFighter?.name}**|`;

// `|Round ${RoundX}: ***${selectedAttribute?.toUpperCase()}***|||
// |**${playerOne.selectedFighter?.name}** ${winner === "playerOne" ? "🏆" : "😡"} |VS| **${playerTwo.selectedFighter?.name}** ${winner === "playerTwo" ? "🏆" : "😡"}|
// ||||`;

    setRoundDescriptions((prev) => [...prev, newRoundDescription_NoPicMode]);


/* OLD USING BIG TABLE
const newRoundDescription_NoPicMode = `|Round ${RoundX}: ***${selectedAttribute?.toUpperCase()}***|||
|**${playerOne.selectedFighter?.name}** ${winner === "playerOne" ? "🏆" : "😡"} |VS| **${playerTwo.selectedFighter?.name}** ${winner === "playerTwo" ? "🏆" : "😡"}|
||||`;
*/    

/*  OLD USING PROFILE PICTURE    
    const newRoundDescription_PictureMode = `
## Round ${RoundX}: ***${selectedAttribute?.toUpperCase()}***
\n
| ![${playerOne.selectedFighter?.name}](https://images.hive.blog/u/${playerOne.selectedFighter?.name}/avatar) | **VS** | ![${playerTwo.selectedFighter?.name}](https://images.hive.blog/u/${playerTwo.selectedFighter?.name}/avatar) |
|-|-|-|
| **${playerOne.selectedFighter?.name}** ${winner === "playerOne" ? "🏆" : "😡"} | | **${playerTwo.selectedFighter?.name}** ${winner === "playerTwo" ? "🏆" : "😡"} |
`;
    setRoundDescriptions((prev) => [...prev, newRoundDescription]);
*/
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

    // sfxOllie.play();
    soundSettings['ollieFx'].sound.play();

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

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
      const newRoundDescription = `
You Win! Congratulations **${capitalize(String(user))}** on your well-deserved victory!`;
      defineNextGameInterval('rest');
      setRoundDescriptions((prev) => [...prev, newRoundDescription]);
      return;
    } else if ((playerTwo.fighters.length === 19) && (playerTwo.isWinner)) {
      dispatch({ type: "setWinner", payload: "playerTwo" });
      dispatch({ type: "setIsEndGame", payload: true });
      const newRoundDescription = "## You Loose! Try harder next time!";
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

  function selectSponsorForPost() {
    const sponsoredBy = import.meta.env.VITE_SPONSORED_BY?.split(',');
    var selectedSponsor = "Skatehive";
    var link = "";
    if (sponsoredBy) {
      selectedSponsor = sponsoredBy[Math.floor(Math.random() * sponsoredBy.length)];
      if (selectedSponsor == "Skatehive"){
        //if skate hive send to main app page
        link = `<a target='_blank' href='https://www.skatehive.app/'>${selectedSponsor}</a>`;        
      } else {
        //if has hive user, send to profile page
        link = `<a target='_blank' href='https://www.skatehive.app/skater/${selectedSponsor.toLowerCase()}'>${selectedSponsor}</a>`;
      }
    } else {
      //if cant find env var, send to main skatehive page
      link = `<a target='_blank' href='https://www.skatehive.app/'>${selectedSponsor}</a>`;
    }
    return link;
  }

  function selectWordDefineForPost(finalRounds:number){
    if (finalRounds <= 10) {
      return "super easy";
    } else if (finalRounds <= 13) {
      return "easy";
    } else if (finalRounds <= 15) {
      return "relatively easy";
    } else if (finalRounds <= 17) {
      return "hard-fought";
    } else if (finalRounds <= 19) {
      return "difficult but manageable";
    } else if (finalRounds <= 21) {
      return "challenging";
    } else if (finalRounds <= 23) {
      return "very challenging";
    } else if (finalRounds <= 25) {
      return "extremely challenging";
    } else {
      return "electrifying";
    }
}


/* eslint-disable no-console */
function generatePostMarkdown(){
  // Join all roundDescriptions into a single markdown string
  var myResultsPost = roundDescriptions.join('\n');
  let finalRounds = roundDescriptions.length-1;
  
  const ipfsCoverImage = import.meta.env.VITE_COVER_IMAGE_IPFS 
                          || "https://images.hive.blog/p/4PYjjVwJ1UdtKnkrscpjxEPM6U94zw7F6Fwrn4rREDDWcQe613PHiB8Hc3s19MiKpHAr39sEQ243t7opobutvNVwt7DG2wR51c2bEWV1ZWG";
  const ipfsCoverSize = import.meta.env.VITE_COVER_IMAGE_SIZE 
                          || "?width=150&height=150format=match&mode=fit";
  const coverImage = `![](${ipfsCoverImage}${ipfsCoverSize})`;

  const wordDefine = selectWordDefineForPost(finalRounds);
  const selectedSponsor = selectSponsorForPost();
  const postIntro = 
`In another ${import.meta.env.VITE_APPNAME} competition sponsored by **${selectedSponsor}**, we had an ${wordDefine} match that came down to the wire! Check out the results below:`;
  
  const myResultsPostTitle = 
`## My ${finalRounds} Rounds ${import.meta.env.VITE_APPNAME} Result`;
  
  const tableHeader = 
`|#|Round|Skater 1|Skater 2|
| --- | --- | --- | --- |`;
  
  const footer = `<center>*Gear up, hit the ramps, and unleash your skills! Join the Xtreme-Heroes! Play Now:*
***<a href="https://xtreme-heroes.vercel.app/" target="_blank">xtreme-heroes.vercel.app</a>***</center>`;
  
  myResultsPost = 
`${coverImage}

${myResultsPostTitle}

${postIntro}

${tableHeader}
${myResultsPost}

${footer}
`;

  // Log the markdown for debugging
  console.log(myResultsPost);
  return myResultsPost;
}
/* eslint-enable no-console */


  async function handlePostResultsSkateHive() {
    try {
      const myResultsPost = generatePostMarkdown();
      shareResultsHive("", myResultsPost).then((results)=> {
        // console.log(results);
        if(results===false) return; // if user cancel posting, continue to modal ??? fail... stop or continue?
        handleEndGameButtonClick(); // sucess posting, Handle the end game button click  or wait to press continue
      })
    } catch (err) {
      console.log("check if keychain is enabled");
    }
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
      stopSounds();
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
            color: "white",
            textShadow: "2px 2px 4px black",
          }}
          onClick={() => handleQuitGame()}
        >
         I Quit!
          {/* {user ?? "Connect Wallet"} */}
        </button>

        <button
        style={{
          padding: '1rem 2rem',
          fontSize: '1em',
          fontFamily: 'creepster',
          border: '0px solid yellow',
          color: 'white',
          minWidth: '111px',
          textShadow: "2px 2px 4px black",
        }}
        onClick={() => handleToogleSound('backgroundMusic')}
      >
        {soundSettings['backgroundMusic'].isMuted ? 'Music Off' : 'Music On'}
      </button>
      <button
        style={{
          padding: '1rem 2rem',
          fontSize: '1em',
          fontFamily: 'creepster',
          border: '0px solid yellow',
          color: 'white',
          minWidth: '111px',
          textShadow: "2px 2px 4px black",
        }}
        onClick={() => handleToogleSound('ollieFx')}
      >
        {soundSettings['ollieFx'].isMuted ? 'Fx Off' : 'Fx On'}
      </button>

      <div style={{ position: 'relative', top: '0px' }}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="slider"
          style={{
            width: '100%',
            height: '20px',
            background: 'rgba(0,0,0,.5)',
            appearance: 'none',
          }}
        />
      </div>

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
