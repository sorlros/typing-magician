import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";
import { useMonsterStore } from "./use-monster-store";
import { useCharacterStore } from "./use-character-store";

interface InteractStore {
  characterAction: "Idle" | "Walk" | "Run" | "Attack" | "Hurt" | "Dead" | "Skill";
  monsterAction: "Idle" | "Attack" | "Hurt" | "Dead";
  characterHp: number;
  monsterHp: number;
  setCharacterAction: (action: InteractStore["characterAction"]) => void;
  setMonsterAction: (action: InteractStore["monsterAction"]) => void;
  updateActions: () => void;
}

export const useInteractStore = create<InteractStore>((set, get) => ({
  characterAction: "Idle",
  monsterAction: "Idle",
  characterHp: 100,
  monsterHp: 100,
  setCharacterAction: (action) => set({ characterAction: action }),
  setMonsterAction: (action) => set({ monsterAction: action }),

  updateActions: () => {
    const cpm = useTypingStore.getState().cpm;
    const { characterAction, monsterAction, setCharacterAction, setMonsterAction } = get();
    const characterHP = useCharacterStore.getState().characterHP;
    const monsterHP = useMonsterStore.getState().monsterHP;
    const appearMonster = useMonsterStore.getState().appearMonster;

    // 캐릭터 행동 결정 함수
    const determineCharacterAction = (): InteractStore["characterAction"] => {
      if (characterHP <= 0) return "Dead";
      if (monsterAction === "Dead" || monsterHP <= 0 || cpm === 0 || appearMonster) return "Idle";
      if (cpm > 100 && appearMonster && monsterHP > 0) return "Attack";
      if (characterAction === "Dead" || characterAction === "Hurt" || characterAction === "Skill") {
        return characterAction;
      }

      if (cpm > 150 && !appearMonster) return "Run";
      if (cpm > 0 && !appearMonster) return "Walk";
      // if (cpm === 0 || appearMonster) return "Idle";

      return characterAction;
    };

    // 몬스터 행동 결정 함수
    const determineMonsterAction = (): InteractStore["monsterAction"] => {
      if (monsterHP <= 0) return "Dead";
      if (characterHP <= 0) return "Idle";

      if (appearMonster && characterHP > 0) {
        if (cpm <= 100) return "Attack";
        return "Hurt";
      }

      return "Idle";
    };

    // 캐릭터와 몬스터 상태 업데이트
    const newCharacterAction = determineCharacterAction();
    const newMonsterAction = determineMonsterAction();

    setCharacterAction(newCharacterAction);
    setMonsterAction(newMonsterAction);

    // 추가 로직: 캐릭터와 몬스터가 죽었는지 확인 후 처리
    if (newCharacterAction === "Dead") {
      set({ monsterAction: "Idle" });
    }

    if (newMonsterAction === "Dead") {
      set({ characterAction: "Idle" });
    }
  },
}));
