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
  // inAction: boolean;
  // setInActionToggle: () => void;
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
  // inAction: false,
  // setInActionToggle: () => {
  //   const { inAction } = get();
  //   set({ inAction: !inAction });
  // },
  isLoading: false,
  setIsLoading: (state) => set({ isLoading: state }),
}));

export const InteractEffect = () => {
  const { setCharacterAction, setMonsterAction, setUseSpecial, characterAction, useSpecial } = useInteractStore();
  const characterHP = useCharacterStore((state) => state.characterHP);
  const characterRecovery = useCharacterStore((state) => state.characterRecovery);
  const monsterHP = useMonsterStore((state) => state.monsterHP);
  const appearMonster = useMonsterStore((state) => state.appearMonster);
  const cpm = useTypingStore((state) => state.cpm);
  const totalFrames = useCharacterStore((state) => state.totalFrames);
  const frameDuration = useCharacterStore((state) => state.frameDuration);

  useEffect(() => {
    if (useSpecial) {
      if (appearMonster) {
        batch(() => {
          setCharacterAction("Skill");
          setMonsterAction("Hurt");
        });

        const timeout = setTimeout(() => {
          batch(() => {
            setCharacterAction("Idle");
            setUseSpecial(false);
          });
        }, totalFrames * frameDuration);

        return () => clearTimeout(timeout);
      } else {
        batch(() => {
          characterRecovery();
          setUseSpecial(false);
        });
      }
    }
  }, [useSpecial, appearMonster, totalFrames, frameDuration]);

  useEffect(() => {
    const inBattle = characterHP > 0 && monsterHP > 0 && appearMonster && !useSpecial;
    const monsterDied = characterHP > 0 && monsterHP <= 0 && appearMonster;
    const inUsual = !appearMonster && characterHP > 0 && !useSpecial;

    if (characterHP <= 0) {
      batch(() => {
        setCharacterAction("Dead");
        setMonsterAction("Idle");
      });
      return;
    }

    if (inBattle) {
      batch(() => {
        if (cpm > 150) {
          setCharacterAction("Attack");
          setMonsterAction("Hurt");
        } else {
          setCharacterAction("Hurt");
          setMonsterAction("Attack");
        }
      });
      return;
    }

    if (monsterDied) {
      batch(() => {
        setCharacterAction("Idle");
        setMonsterAction("Dead");
      });

      setTimeout(() => {
        batch(() => {
          setMonsterAction("Idle");
          setCharacterAction(cpm > 150 ? "Run" : cpm > 0 ? "Walk" : "Idle");
        });
      }, 1800);
      return;
    }

    if (inUsual) {
      batch(() => {
        if (cpm === 0) {
          setCharacterAction("Idle");
        } else if (cpm > 150) {
          setCharacterAction("Run");
        } else {
          setCharacterAction("Walk");
        }
      });
      return;
    }
  }, [characterHP, monsterHP, appearMonster, cpm]);

  

  return null;
};
