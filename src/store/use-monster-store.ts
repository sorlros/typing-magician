import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";

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

    if (typedCharacters > 100) {
      set({
        monster: {
          monsterNumber: 1,
          monsterImage: `url("/game_images/skeleton/Skeleton_Archer/Idle.png")`,
          monsterHP: 100,
        },
        totalFrames: 7,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: 100,
      });
    } else if (typedCharacters > 200) {
      set({
        monster: {
          monsterNumber: 2,
          monsterImage: `url("/game_images/skeleton/Skeleton_Spearman/Idle.png")`,
          monsterHP: 100,
        },
        totalFrames: 7,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: 100,
      });
    } else {
      set({
        monster: {
          monsterNumber: 3,
          monsterImage: `url("/game_images/skeleton/Skeleton_Warrior/Idle.png")`,
          monsterHP: 100,
        },
        totalFrames: 7,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: 100,
      });
    }
  }
}))