import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";
import { subscribeWithSelector } from "zustand/middleware";
import { useCharacterStore } from "./use-character-store";

interface MonsterState {
  monsterNumber: number;
  monsterImage: string;
  monsterHP: number
  setMonsterNumber: (newNumber: number) => void;
  totalFrames: number; // 스프라이트 시트에 있는 총 프레임 수
  frameWidth: number; // 각 프레임의 너비 (px)
  frameHeight: number; // 각 프레임의 높이 (px)
  frameDuration: number;
  updateMonsterSettings: (actionState: string) => void;
  appearMonster: boolean;
  setAppearMonster: (value: boolean) => void;
  monsterReduceHp: (amount: number) => void;
}

export const useMonsterStore = create(subscribeWithSelector<MonsterState>((set, get) => ({
  // monster: {
  //   // monsterNumber: 0,
  //   monsterImage: "",
  //   monsterHP: 100,
  // },
  monsterNumber: 0,
  monsterImage: "",
  monsterHP: 100,
  setMonsterNumber: (newNumber) => {
    set({ monsterNumber: newNumber });
  },
  totalFrames: 7,
  frameWidth: 200,
  frameHeight: 200,
  frameDuration: 300,
  updateMonsterSettings: (monsterAction) => {
    const typedCharacters = useTypingStore.getState().typedCharacters;
    const monsterNumber = useMonsterStore.getState().monsterNumber;
    const monsterHP = useMonsterStore.getState().monsterHP;

    let action: "Idle" | "Hurt" | "Dead" | "Attack_1" = "Idle";
    let monsterType: "Skeleton_Archer" | "Skeleton_Spearman" | "Skeleton_Warrior";
    let totalFrames: number;
    
    if (monsterNumber === 0) {
      monsterType = "Skeleton_Archer";
    } else if (monsterNumber === 1) {
      monsterType = "Skeleton_Spearman";
    } else if (monsterNumber === 2) {
      monsterType = "Skeleton_Warrior";
    } else {
      monsterType = "Skeleton_Archer"; // 기본 값
    }

    if (monsterAction === "Dead") {
      action = "Dead";
    } else if (monsterAction === "Hurt") {
      action = "Hurt";
    } else if (monsterAction === "Attack") {
      action = "Attack_1";
    } else if (monsterAction === "Idle") {
      action = "Idle";
    }
  
    const framesMap = {
      Skeleton_Archer: { Idle: 7, Hurt: 2, Dead: 5, Attack_1: 5 },
      Skeleton_Spearman: { Idle: 7, Hurt: 3, Dead: 5, Attack_1: 4 },
      Skeleton_Warrior: { Idle: 7, Hurt: 2, Dead: 4, Attack_1: 5 },
    };

    totalFrames = framesMap[monsterType][action];

    set({
      monsterNumber: monsterNumber,
      monsterImage: `url("/game_images/skeleton/${monsterType}/${action}.png")`,
      monsterHP: monsterHP,
      totalFrames,
      frameWidth: 200,
      frameHeight: 200,
      frameDuration: 100,
    });

    // console.log('Updated monster settings:', { typedCharacters, monsterType, action });
  },
  appearMonster: false,
  setAppearMonster: (value) => {
    set({
      appearMonster: value
    })
  },
  monsterReduceHp: (amount) => {
    set((state) => {
      const newHp = Math.max(state.monsterHP - amount, 0);

      return {
        monsterHP: newHp,
      }
    });
  }
})));

useMonsterStore.subscribe(
  (state) => state.monsterHP, // hp 상태 변화 감지
  (monsterHP) => {
    if (monsterHP <= 0) {
      console.log("캐릭터 사망: Dead 상태로 전환됩니다.");
      useMonsterStore.getState().updateMonsterSettings("Dead");
      // useCharacterStore.getState().updateCharacterSettings("Idle");
    }
  }
);