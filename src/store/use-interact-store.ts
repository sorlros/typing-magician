import { create } from "zustand";
import { unstable_batchedUpdates as batch } from "react-dom";
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
  setIsLoading: (state) => set({ isLoading: state }),
}));

export const InteractEffect = () => {
  const { setCharacterAction, setMonsterAction, monsterAction, setUseSpecial, characterAction, useSpecial } = useInteractStore();
  const characterHP = useCharacterStore((state) => state.characterHP);
  const characterRecovery = useCharacterStore((state) => state.characterRecovery);
  const monsterHP = useMonsterStore((state) => state.monsterHP);
  const appearMonster = useMonsterStore((state) => state.appearMonster);
  const cpm = useTypingStore((state) => state.cpm);

  useEffect(() => {
    if (useSpecial) {
      if (appearMonster) {
        batch(() => {
          if (characterAction !== "Skill") setCharacterAction("Skill");
          if (monsterAction !== "Hurt") setMonsterAction("Hurt");
        });
  
        const timeout = setTimeout(() => {
          batch(() => {
            setUseSpecial(false);
          });
        }, 2000);
  
        return () => clearTimeout(timeout);
      } else {
        batch(() => {
          characterRecovery();
          setUseSpecial(false);
        });
      }
    }
  }, [useSpecial, appearMonster, characterAction, monsterAction]);
  
  useEffect(() => {
    const inBattle = characterHP > 0 && monsterHP > 0 && appearMonster;
    const monsterDied = characterHP > 0 && monsterHP <= 0 && appearMonster;
    const inUsual = !appearMonster && characterHP > 0;
  
    if (characterHP <= 0) {
      batch(() => {
        if (characterAction !== "Dead") setCharacterAction("Dead");
        if (monsterAction !== "Idle") setMonsterAction("Idle");
      });
      return;
    }
  
    if (inBattle) {
      batch(() => {
        if (cpm > 150 && characterAction !== "Attack") {
          setCharacterAction("Attack");
        }
        if (cpm > 150 && monsterAction !== "Hurt") {
          setMonsterAction("Hurt");
        }
        if (cpm <= 150 && characterAction !== "Hurt") {
          setCharacterAction("Hurt");
        }
        if (cpm <= 150 && monsterAction !== "Attack") {
          setMonsterAction("Attack");
        }
      });
      return;
    }
  
    if (monsterDied) {
      batch(() => {
        if (characterAction !== "Idle") setCharacterAction("Idle");
        if (monsterAction !== "Dead") setMonsterAction("Dead");
      });
  
      setTimeout(() => {
        batch(() => {
          if (monsterAction !== "Idle") setMonsterAction("Idle");
          if (cpm > 150 && characterAction !== "Run") {
            setCharacterAction("Run");
          } else if (cpm > 0 && characterAction !== "Walk") {
            setCharacterAction("Walk");
          } else if (cpm === 0 && characterAction !== "Idle") {
            setCharacterAction("Idle");
          }
        });
      }, 1800);
      return;
    }
  
    if (inUsual) {
      batch(() => {
        if (cpm === 0 && characterAction !== "Idle") {
          setCharacterAction("Idle");
        } else if (cpm > 150 && characterAction !== "Run") {
          setCharacterAction("Run");
        } else if (cpm > 0 && characterAction !== "Walk") {
          setCharacterAction("Walk");
        }
      });
    }
  }, [characterHP, monsterHP, appearMonster, cpm, characterAction, monsterAction]);
  
  return null;
};
