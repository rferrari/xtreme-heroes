import { ReactNode, createContext, useContext, useReducer } from "react";

import { initAioha, Providers } from '@aioha/aioha'
import { AiohaProvider } from '@aioha/react-ui'
import '@aioha/react-ui/dist/build.css'

import UIfx from 'uifx';
import beepMp3 from './my-sounds/beep.mp3'

const beep = new UIfx(beepMp3)

const aioha = initAioha({
  hiveauth: {
    name: (import.meta.env.VITE_APPNAME || 'Xtreme-Heroes'),
    description: "Login " + import.meta.env.VITE_APPNAME + " Skatehive"
  },
});

aioha.deregisterProvider(Providers.HiveSigner);
aioha.deregisterProvider(Providers.PeakVault);
aioha.deregisterProvider(Providers.Ledger);
// aioha.deregisterProvider(Providers.Custom);

interface Attributes {
  style: number;
  agility: number;
  speed: number;
}

export interface Fighter {
  id: number;
  name: string;
  image: string;
  attributes: Attributes & {
    [attributeName: string]: number;
  };
}

/*
interface ItemAttributes {
  price: number;
  time: number;
}

export interface Item {
  id: number;
  name: string;
  image: string;
  attributes: ItemAttributes & {
    [attributeName: string]: number;
  };
}*/

export interface Player {
  selectedFighter: Fighter | null;
  fighters: Fighter[];
  isWinner: boolean | null;
}

export type PlayerName = "playerOne" | "playerTwo";

type Stage =
  | "fighterOne-selection"
  | "fighterTwo-selection"
  | "attribute-selection"
  | "round-result";

type GameAction =
  | { type: "setPlayerOneSelectedFighter"; payload: Fighter | null }
  | { type: "setPlayerTwoSelectedFighter"; payload: Fighter | null }
  | { type: "setPlayerOneFighters"; payload: Fighter }
  | { type: "setPlayerTwoFighters"; payload: Fighter }
  // | { type: "setPlayerOneSelectedItem"; payload: Fighter | null }
  // | { type: "setPlayerOneItem"; payload: Fighter }
  | { type: "setSelectedAttribute"; payload: string | null }
  | { type: "setWinner"; payload: PlayerName | null }
  | { type: "setTurn"; payload: PlayerName }
  | { type: "setIsEndGame"; payload: boolean }
  | { type: "setStage"; payload: Stage }
  | { type: "setRecoveryAt"; payload: Date | null }
  | { type: "resetGame" };

interface GameProviderProps {
  children: ReactNode;
}

interface GameState {
  playerOne: Player;
  playerTwo: Player;
  previewFighter: Fighter | null;
  selectedAttribute: string | null;
  stage: Stage;
  turn: PlayerName;
  isEndGame: boolean;
  recoveryAt: Date | null; // Add recoveryAt to state
}

const initialState: GameState = {
  playerOne: {
    selectedFighter: null,
    fighters: [],
    isWinner: null,
  },
  playerTwo: { selectedFighter: null, fighters: [], isWinner: null },
  previewFighter: null,
  selectedAttribute: "",
  stage: "fighterOne-selection",
  turn: "playerOne",
  isEndGame: false,
  recoveryAt: null, // Initialize as null
};

interface Context {
  state: GameState;
  dispatch: (action: GameAction) => void;
}

const GameContext = createContext({} as Context);

function getUpdatedFighters(currentFighters: Fighter[], newFighter: Fighter) {
  const isIncluded = currentFighters.some(({ id }) => id === newFighter!.id);

  if (isIncluded) {
    return currentFighters.filter(({ id }) => id !== newFighter.id);
  }
  return [...currentFighters, newFighter];
}

function GameReducer(state: GameState, action: GameAction) {
  switch (action.type) {
    case "setPlayerOneSelectedFighter":
      return {
        ...state,
        playerOne: { ...state.playerOne, selectedFighter: action.payload },
      };
      // case "setPlayerOneSelectedItem":
      //   return {
      //     ...state,
      //     playerOne: { ...state.playerOne, selectedItem: action.payload },
      //   };
    case "setPlayerTwoSelectedFighter":
      return {
        ...state,
        playerTwo: { ...state.playerTwo, selectedFighter: action.payload },
      };
      case "setPlayerOneFighters":
        const playerOneUpdatedFighters = getUpdatedFighters(
          state.playerOne.fighters,
          action.payload
        );
        return {
          ...state,
          playerOne: { ...state.playerOne, fighters: playerOneUpdatedFighters },
        };
        // case "setPlayerOneItems":
        //   const playerOneUpdatedItems = getUpdatedFighters(
        //     state.playerOne.fighters,
        //     action.payload
        //   );
        //   return {
        //     ...state,
        //     playerOne: { ...state.playerOne, fighters: playerOneUpdatedItems },
        //   };
    case "setPlayerTwoFighters":
      const playerTwoUpdatedFighters = getUpdatedFighters(
        state.playerTwo.fighters,
        action.payload
      );
      return {
        ...state,
        playerTwo: { ...state.playerTwo, fighters: playerTwoUpdatedFighters },
      };
    case "setSelectedAttribute":
      return {
        ...state,
        selectedAttribute: action.payload,
      };
    case "setWinner":
      let { playerOne, playerTwo } = state;

      if (!action.payload) {
        playerOne.isWinner = null;
        playerTwo.isWinner = null;
      } else if (action.payload === "playerOne") {
        playerOne.isWinner = true;
        playerTwo.isWinner = false;
      } else {
        playerTwo.isWinner = true;
        playerOne.isWinner = false;
      }

      return {
        ...state,
        playerOne,
        playerTwo,
      };
    case "setStage":
      return {
        ...state,
        stage: action.payload,
      };
    case "setTurn":
      return {
        ...state,
        turn: action.payload,
      };
    case "setIsEndGame":
      return {
        ...state,
        isEndGame: action.payload,
      };
    case "setRecoveryAt":
      return {
        ...state,
        recoveryAt: action.payload,
      };
    case "resetGame":
    default:
      return initialState;
  }
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(GameReducer, initialState);
  const value = { state, dispatch };

  // hack. not sure how to init the jail message
  // const [recoveryMessage, setRecoveryMessage] = useState("");
  // const restMessage = "Skateboarding life is tough! You need to get some rest."
  // const jailMessage = "Looks like the grind was too real! Welcome to your new sponsor: the county jail. Better brush up on your cell block ollies!"
  // const nextGameType = localStorage.getItem('recoveryType');// as NextGameInterval | null;
  // if (nextGameType && nextGameType === 'jail') setRecoveryMessage(jailMessage);
  // else setRecoveryMessage(restMessage); console.log("GameProvider hack: recovery message: "+recoveryMessage);

  return (
      <GameContext.Provider value={value}>
        <AiohaProvider aioha={aioha}>
          {children}
        </AiohaProvider>
      </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext);
}
