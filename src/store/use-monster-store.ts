import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";
import useMonsterSituationStore from "./use-character-situation-store";

type MonsterDetails = {
  monsterNumber: number;
  monsterImage: string;
  monsterHP: number;
}

interface MonsterState {
  monster: MonsterDetails;
  totalFrames: number; // 스프라이트 시트에 있는 총 프레임 수
  frameWidth: number; // 각 프레임의 너비 (px)
  frameHeight: number; // 각 프레임의 높이 (px)
  frameDuration: number;
  updateMonsterSettings: () => void;
  appearMonster: boolean;
  setAppearMonster: (value: boolean) => void;
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
  updateMonsterSettings: () => {
    const typedCharacters = useTypingStore.getState().typedCharacters;
    const monster = useMonsterStore.getState().monster;
    const { inUsual ,inCombat, isHurt, isDying } = useMonsterSituationStore.getState();

    let action: "Idle" | "Hurt" | "Dead" | "Attack_1" = "Idle";
    let monsterType: "Skeleton_Archer" | "Skeleton_Spearman" | "Skeleton_Warrior";
    let totalFrames: number;
    
    if (monster.monsterNumber === 0) {
      monsterType = "Skeleton_Archer";
    } else if (monster.monsterNumber === 1) {
      monsterType = "Skeleton_Spearman";
    } else if (monster.monsterNumber === 2) {
      monsterType = "Skeleton_Warrior";
    } else {
      monsterType = "Skeleton_Archer"; // 기본 값
    }

    if (isDying) {
      action = "Dead";
    } else if (isHurt && inCombat && !inUsual) {
      action = "Hurt";
    } else if (!isHurt && inCombat && !inUsual) {
      action = "Attack_1";
    } else if (inUsual) {
      action = "Idle";
    }
  
    const framesMap = {
      Skeleton_Archer: { Idle: 7, Hurt: 2, Dead: 5, Attack_1: 5 },
      Skeleton_Spearman: { Idle: 7, Hurt: 3, Dead: 5, Attack_1: 4 },
      Skeleton_Warrior: { Idle: 7, Hurt: 2, Dead: 4, Attack_1: 5 },
    };

    totalFrames = framesMap[monsterType][action];

    set({
      monster: {
        monsterNumber: typedCharacters >= 300 ? 2 : (typedCharacters >= 200 ? 1 : 0),
        monsterImage: `url("/game_images/skeleton/${monsterType}/${action}.png")`,
        monsterHP: 100,
      },
      totalFrames,
      frameWidth: 200,
      frameHeight: 200,
      frameDuration: 200,
    });

    // console.log('Updated monster settings:', { typedCharacters, monsterType, action });
  },
  appearMonster: false,
  setAppearMonster: (value) => {
    set({
      appearMonster: value
    })
  }
}))