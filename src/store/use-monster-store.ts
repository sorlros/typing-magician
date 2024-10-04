import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";

type MonsterDetails = {
  monsterNumber: number;
  monsterImage: string;
  monsterHP: number;
}

type MonsterCondition = {
  inCombat: boolean;
  isDying: boolean;
  isHurt: boolean;
}

interface MonsterState {
  monster: MonsterDetails;
  totalFrames: number; // 스프라이트 시트에 있는 총 프레임 수
  frameWidth: number; // 각 프레임의 너비 (px)
  frameHeight: number; // 각 프레임의 높이 (px)
  frameDuration: number;
  monsterCondition: MonsterCondition;
  updateMonsterSettings: () => void;
}

export const useMonsterStore = create<MonsterState>((set, get) => ({
  monster: {
    monsterNumber: 0,
    monsterImage: "",
    monsterHP: 100,
  },
  totalFrames: 7,
  frameWidth: 200,
  frameHeight: 200,
  frameDuration: 300,

  monsterCondition: {
    inCombat: false,
    isDying: false,
    isHurt: false,
  },

  updateMonsterSettings: () => {
    const typedCharacters = useTypingStore.getState().typedCharacters;
    const { monsterCondition } = get();

    let action: "Idle" | "Hurt" | "Dead" | "Attack";
    let monsterType: "Skeleton_Archer" | "Skeleton_Spearman" | "Skeleton_Warrior";
    let totalFrames: number;

    if (typedCharacters >= 300) {
      monsterType = "Skeleton_Warrior";
    } else if (typedCharacters >= 200) {
      monsterType = "Skeleton_Spearman";
    } else {
      monsterType = "Skeleton_Archer";
    }

    if (!monsterCondition.inCombat) {
      action = "Idle";
    } else if (monsterCondition.isHurt) {
      action = "Hurt";
    } else if (monsterCondition.isDying) {
      action = "Dead";
    } else {
      action = "Attack";
    }
  
    const framesMap = {
      Skeleton_Archer: { Idle: 7, Hurt: 2, Dead: 5, Attack: 5 },
      Skeleton_Spearman: { Idle: 7, Hurt: 3, Dead: 5, Attack: 4 },
      Skeleton_Warrior: { Idle: 7, Hurt: 2, Dead: 4, Attack: 5 },
    };

    totalFrames = framesMap[monsterType][action];

    set({
      monster: {
        monsterNumber: typedCharacters >= 300 ? 3 : (typedCharacters >= 200 ? 2 : 1),
        monsterImage: `url("/game_images/skeleton/${monsterType}/${action}.png")`,
        monsterHP: 100,
      },
      totalFrames,
      frameWidth: 200,
      frameHeight: 200,
      frameDuration: 100,
    });

    console.log('Updated monster settings:', { typedCharacters, monsterType, action }); // 디버깅용 로그 추가
  }
}))