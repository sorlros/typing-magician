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
  const { setCharacterAction, setMonsterAction, isLoading, setIsLoading } = useInteractStore();
  const characterHP = useCharacterStore((state) => state.characterHP);
  const monsterHP = useMonsterStore((state) => state.monsterHP);
  const appearMonster = useMonsterStore((state) => state.appearMonster);
  const cpm = useTypingStore((state) => state.cpm);

  useEffect(() => {
    const inBattle = characterHP > 0 && monsterHP > 0 && appearMonster;
    const monsterDied = characterHP > 0 && monsterHP <= 0 && appearMonster;
    const inUsual = appearMonster === false && characterHP > 0;

    // console.log("isLoading", isLoading)


    if (isLoading) {
      setCharacterAction("Idle");
      setMonsterAction("Idle");
    } else {
      if (characterHP <= 0) {
        setCharacterAction("Dead");
        setMonsterAction("Idle");
      } else if (inBattle) {
        if (cpm > 150) {
          setCharacterAction("Attack");
          setMonsterAction("Hurt");
        } else {
          setCharacterAction("Hurt");
          setMonsterAction("Attack");
        }
      } else if (monsterDied) {
        setCharacterAction("Idle");
        setMonsterAction("Dead");
      } else if (inUsual) {
        if (cpm === 0) {
          setCharacterAction("Idle");
          setMonsterAction("Idle");
        } else if (cpm > 150) {
          setCharacterAction("Run");
          setMonsterAction("Idle");
        } else {
          setCharacterAction("Walk");
          setMonsterAction("Idle");
        }
      }
    }
  }, [characterHP, monsterHP, appearMonster, cpm, setCharacterAction, setMonsterAction, isLoading, setIsLoading]);

  return null;
};
