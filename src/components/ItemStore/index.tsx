/*
import { Item, useGame } from "../../hooks/useGame";
import { Container, FighterCard } from "./styles";
import { items } from "../../utils/items";

export function ItemsStore() {
  const {
    state: { playerOne, playerTwo, stage },
    dispatch,
  } = useGame();

  function getItems(id: number) {
    return items.find((items) => items.id === id)!;
  }

  function setPlayerOneSelectedFighter(item: Item | null) {
    dispatch({ type: "setPlayerOneSelectedItem", payload: Item });
  }

  function setPlayerOneFighters(newFighter: Item) {
    dispatch({ type: "setPlayerOneItem", payload: newFighter });
  }

  function handleFighterMouseOver(id: number) {
    const fighter: Item = getItems(id);
    setPlayerOneSelectedFighter(fighter);
  }

  function handleFighterMouseLeave() {
    if (stage !== "fighterOne-selection") return;
    setPlayerOneSelectedFighter(null);
  }

  function handleFighterClick(id: number) {
    if (stage === "fighterOne-selection") {
      const fighter: Item = getItems(id);
      setPlayerOneSelectedFighter(fighter);
      setPlayerOneFighters(fighter);
    } else if (stage === "attribute-selection") {
      const fighter: Item = getItems(id);
      setPlayerOneSelectedFighter(fighter);
    }
  }

  return (
    <Container>
      {items.map(({ id, image }) => {
        const isPlayerOne = playerOne.fighters.some(
          (fighter) => fighter.id === id
        );
        const isPlayerTwo = playerTwo.fighters.some(
          (fighter) => fighter.id === id
        );
        const isPlayer = isPlayerOne || isPlayerTwo;

        return (
          <FighterCard
            key={id}
            image={`/items/${image}`}
            isPlayerOne={isPlayerOne}
            isPlayerTwo={isPlayerTwo}
            disabled={stage !== "fighterOne-selection"}
            onMouseOver={() => handleFighterMouseOver(id)}
            onMouseLeave={handleFighterMouseLeave}
            onClick={() => handleFighterClick(id)}
          >
            {isPlayer && <span>{isPlayerOne ? "1P" : "2P"}</span>}
          </FighterCard>
        );
      })}
    </Container>
  );
}
*/