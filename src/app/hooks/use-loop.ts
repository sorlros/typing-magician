import { useEffect, useRef } from 'react';
import { useInteractStore } from "@/store/use-interact-store";
import { useCharacterStore } from '@/store/use-character-store';
import { useMonsterStore } from '@/store/use-monster-store';

const useGameLoop = () => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef(performance.now());
  const { characterAction, monsterAction, setCharacterAction, setMonsterAction } = useInteractStore();
  const { characterHP, characterReduceHp } = useCharacterStore();
  const { monsterReduceHp } = useMonsterStore();

  const gameLoop = (time: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;

      if (characterAction === 'Hurt') {
        characterReduceHp(3);
        setCharacterAction('Idle');
        console.log("loop cha")
      }

      if (monsterAction === 'Hurt') {
        monsterReduceHp(4);
        setMonsterAction('Idle');
        console.log("loop mon")
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const cancelAnimation = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimation();
    }
  }, [characterAction, monsterAction]);
};

export default useGameLoop;
