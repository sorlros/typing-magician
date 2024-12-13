import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";
import { useMonsterStore } from "./use-monster-store";

interface InteractStore {
  characterAction: "Idle" | "Attack" | "Hurt" | "Dead";
  monsterAction: "Idle" | "Attack" | "Hurt" | "Dead";
  characterHp: number;
  monsterHp: number;
  setCharacterAction: (action: InteractStore["characterAction"]) => void;
  setMonsterAction: (action: InteractStore["monsterAction"]) => void;
  updateActions: () => void;
  reduceCharacterHp: (amount: number) => void;
  reduceMonsterHp: (amount: number) => void;
}

export const useInteractStore = create<InteractStore>((set, get) => ({
  characterAction: "Idle",
  monsterAction: "Idle",
  characterHp: 100,
  monsterHp: 100,

  setCharacterAction: (action) =>
    set((state) => ({
      characterAction: action,
      ...(action === "Attack" && { monsterAction: "Hurt" }),
    })),

  setMonsterAction: (action) =>
    set((state) => ({
      monsterAction: action,
      ...(action === "Attack" && { characterAction: "Hurt" }),
    })),

  updateActions: () => {
    const { cpm } = useTypingStore.getState(); // 타이핑 속도 가져오기
    const { characterHp, monsterHp } = get();

    // 캐릭터 또는 몬스터가 죽었는지 확인
    if (characterHp <= 0) {
      set({ characterAction: "Dead" });
      return;
    }
    if (monsterHp <= 0) {
      set({ monsterAction: "Dead" });
      return;
    }

    const { appearMonster } = useMonsterStore.getState();
    // 몬스터가 공격 가능한 조건: 타이핑 속도 100 이하

    if (appearMonster) {
      if (cpm <= 100 && monsterHp > 0 && characterHp > 0) {
        set({ monsterAction: "Attack", characterAction: "Hurt" });
      } else if (cpm > 100) {
        // 타이핑 속도가 높을 경우 캐릭터가 공격
        set({ characterAction: "Attack", monsterAction: "Hurt" });
      } else {
        // 기본 Idle 상태
        set({ characterAction: "Idle", monsterAction: "Idle" });
      }
    } else {
      set({ characterAction: "Idle", monsterAction: "Idle" });
    }
    
  },

  reduceCharacterHp: (amount) =>
    set((state) => ({
      characterHp: Math.max(state.characterHp - amount, 0),
    })),

  reduceMonsterHp: (amount) =>
    set((state) => ({
      monsterHp: Math.max(state.monsterHp - amount, 0),
    })),
}));
