import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";
import { useMonsterStore } from "./use-monster-store";
import { useCharacterStore } from "./use-character-store";
import { useEffect } from "react";

interface InteractStore {
  characterAction: "Idle" | "Walk" | "Run" | "Attack" | "Hurt" | "Dead" | "Skill";
  monsterAction: "Idle" | "Attack" | "Hurt" | "Dead";
  setCharacterAction: (action: InteractStore["characterAction"]) => void;
  setMonsterAction: (action: InteractStore["monsterAction"]) => void;
  useSpecial: boolean;
  setUseSpecial: (state: boolean) => void;
  inAction: boolean;
  setInActionToggle: () => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
}

export const useInteractStore = create<InteractStore>((set, get) => ({
  characterAction: "Idle",
  monsterAction: "Idle",
  setCharacterAction: (action) => set({ characterAction: action }),
  setMonsterAction: (action) => set({ monsterAction: action }),
  useSpecial: false,
  setUseSpecial: (state) => set({ useSpecial: state }),
  inAction: false,
  setInActionToggle: () => {
    const { inAction } = get();
    set({ inAction: !inAction });
  },
  isLoading: false,
  setIsLoading: (state) => {
    const { isLoading } = get();
    set({ isLoading: state });
  }
}));

export const InteractEffect = () => {
  const { setCharacterAction, setMonsterAction, isLoading, setUseSpecial, characterAction, useSpecial } = useInteractStore();
  const characterHP = useCharacterStore((state) => state.characterHP);
  const characterRecovery = useCharacterStore((state) => state.characterRecovery);
  const monsterHP = useMonsterStore((state) => state.monsterHP);
  const appearMonster = useMonsterStore((state) => state.appearMonster);
  const cpm = useTypingStore((state) => state.cpm);

  // useEffect(() => {
  //   if (isLoading) {
  //     setCharacterAction("Idle");
  //     setMonsterAction("Idle");
  //   }
  // }, [isLoading])

  useEffect(() => {
    const inBattle = characterHP > 0 && monsterHP > 0 && appearMonster;
    const monsterDied = characterHP > 0 && monsterHP <= 0 && appearMonster;
    const inUsual = !appearMonster && characterHP > 0;
  
    if (characterHP <= 0) {
      setCharacterAction("Dead");
      setMonsterAction("Idle");
      return;
    }
  
    if (inBattle) {
      if (cpm > 150) {
        setCharacterAction("Attack");
        setMonsterAction("Hurt");
      } else {
        setCharacterAction("Hurt");
        setMonsterAction("Attack");
      }
      return;
    }
  
    if (monsterDied) {
      setCharacterAction("Idle");
      setMonsterAction("Dead");

      setTimeout(() => {
        setMonsterAction("Idle");
        setCharacterAction(cpm > 150 ? "Run" : cpm > 0 ? "Walk" : "Idle");
      }, 1500);
    }
  
    if (inUsual) {
      if (cpm === 0) {
        setCharacterAction("Idle");
        // setMonsterAction("Idle");
      } else if (cpm > 150) {
        setCharacterAction("Run");
        // setMonsterAction("Idle");
      } else {
        setCharacterAction("Walk");
        // setMonsterAction("Idle");
      }
    }
  }, [characterHP, monsterHP, appearMonster, cpm, isLoading]);

  useEffect(() => {
    if (useSpecial && appearMonster) {
      setCharacterAction("Skill");
      setMonsterAction("Hurt");
      setUseSpecial(false); 
      // setIsLoading(true);
    } else if (useSpecial && !appearMonster) {
      characterRecovery();
      setUseSpecial(false);
      // setIsLoading(false);
    }
  }, [useSpecial, appearMonster])

  return null;
};
