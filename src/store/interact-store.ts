import { create } from "zustand";
import { unstable_batchedUpdates as batch } from "react-dom";
import { useTypingStore } from "./typing-store";
import { useMonsterStore } from "./monster-store";
import { useCharacterStore } from "./character-store";
import { useEffect } from "react";

interface InteractStore {
  characterAction: "Idle" | "Walk" | "Run" | "Attack" | "Hurt" | "Dead" | "Skill";
  monsterAction: "Idle" | "Attack" | "Hurt" | "Dead";
  setCharacterAction: (action: InteractStore["characterAction"]) => void;
  setMonsterAction: (action: InteractStore["monsterAction"]) => void;
  useSpecial: boolean;
  setUseSpecial: (state: boolean) => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
}

export const useInteractStore = create<InteractStore>((set, get) => ({
  characterAction: "Idle",
  monsterAction: "Idle",
  setCharacterAction: (action) => {
    const currentAction = get().characterAction;
  
    //Skill 상태 중에는 다른 액션으로 전환 방지
    if (currentAction === "Skill" && action !== "Idle") {
      return;
    }
    set({ characterAction: action });

    if (action === "Skill") {
      const { totalFrames, frameDuration } = useCharacterStore.getState();
      const skillDuration = totalFrames * frameDuration;

      setTimeout(() => {
        // 현재 상태가 여전히 "Skill"인 경우에만 "Idle"로 변경
        if (get().characterAction === "Skill") {
          set({ characterAction: "Idle" });
        }
      }, skillDuration + 800);
    }
  },
  setMonsterAction: (action) => set({ monsterAction: action }),
  useSpecial: false,
  setUseSpecial: (state) => set({ useSpecial: state }),
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

  useEffect(() => {
    if (useSpecial) {
      // const currentTotalFrames = useCharacterStore.getState().totalFrames;
      // const currentFrameDuration = useCharacterStore.getState().frameDuration;

      if (appearMonster) {
        batch(() => {
          setCharacterAction("Skill");
          setMonsterAction("Hurt");
        });

        const timeout = setTimeout(() => {
          batch(() => {
            // setCharacterAction("Idle");
            setUseSpecial(false);
          });
        }, 0);

        return () => clearTimeout(timeout);
      } else {
        batch(() => {
          characterRecovery();
          setUseSpecial(false);
        });
      }
    }
  }, [useSpecial, appearMonster]);

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
