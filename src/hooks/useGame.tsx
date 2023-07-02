import { ReactNode, createContext, useContext, useReducer } from "react";

export interface Fighter {
  id: number;
  name: string;
  image: string;
  attributes: {
    force: number;
    defense: number;
    mobility: number;
  };
}

export interface Player {
  score: number;
  fighter: Fighter | null;
}

type Stage =
  | "fighterOne-selection"
  | "fighterTwo-selection"
  | "attribute-selection";

type GameAction =
  | { type: "setPlayerOneFighter"; payload: Fighter }
  | { type: "setPlayerTwoFighter"; payload: Fighter }
  | { type: "setPreviewFighter"; payload: Fighter | null }
  | { type: "setSelectedAttribute"; payload: string | null };

interface GameProviderProps {
  children: ReactNode;
}

interface GameState {
  playerOne: Player;
  playerTwo: Player;
  previewFighter: Fighter | null;
  selectedAttribute: string | null;
  stage: Stage;
}

const initialState: GameState = {
  playerOne: { score: 0, fighter: null },
  playerTwo: { score: 0, fighter: null },
  previewFighter: null,
  selectedAttribute: "",
  stage: "fighterOne-selection",
};

interface Context {
  state: GameState;
  dispatch: (action: GameAction) => void;
}

const GameContext = createContext({} as Context);

function GameReducer(state: GameState, action: GameAction) {
  switch (action.type) {
    case "setPlayerOneFighter":
      return {
        ...state,
        stage: "attribute-selection",
        playerOne: { ...state.playerOne, fighter: action.payload },
      };
    case "setPlayerTwoFighter":
      return {
        ...state,
        playerOne: { ...state.playerTwo, fighter: action.payload },
      };
    case "setPreviewFighter":
      return {
        ...state,
        previewFighter: action.payload,
      };
    case "setSelectedAttribute":
      return {
        ...state,
        selectedAttribute: action.payload,
      };
    default:
      return state;
  }
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(GameReducer, initialState);

  const value = { state, dispatch };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  return useContext(GameContext);
}
