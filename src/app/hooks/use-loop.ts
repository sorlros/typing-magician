import { useEffect, useRef } from "react";
import { useInteractStore } from "@/store/interact-store";
import { useCharacterStore } from "@/store/character-store";
import { useMonsterStore } from "@/store/monster-store";

const useGameLoop = () => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>(performance.now());
  const { characterAction, monsterAction, setCharacterAction, setMonsterAction } = useInteractStore();
  const { characterReduceHp } = useCharacterStore();
  const { monsterReduceHp } = useMonsterStore();

  const gameLoop = (time: number) => {
    const deltaTime = time - previousTimeRef.current;

    if (deltaTime >= 800) {
      if (characterAction === "Hurt") {
        characterReduceHp(3);
        setCharacterAction("Idle");
        // console.log("loop cha");
      }

      if (monsterAction === "Hurt") {
        monsterReduceHp(4);
        setMonsterAction("Idle");
        // console.log("loop mon");
      }

      previousTimeRef.current = time;
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [characterAction, monsterAction]);
};

export default useGameLoop;
