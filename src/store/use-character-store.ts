import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";
import useSituationStore from "./use-situation-store";

interface CharacterState {
  totalFrames: number; // 스프라이트 시트에 있는 총 프레임 수
  frameWidth: number; // 각 프레임의 너비 (px)
  frameHeight: number; // 각 프레임의 높이 (px)
  frameDuration: number;
  characterImage: string;
  hp: number;
  updateCharacterSettings: () => void;
  reduceHp: (amount: number) => void;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  totalFrames: 7,
  frameWidth: 200,
  frameHeight: 200,
  frameDuration: 300,
  characterImage: `url("/game_images/character-wizard/Fire vizard/Idle.png")`,
  hp: 100,
  updateCharacterSettings: () => {
    const typingSpeed = useTypingStore.getState().cpm;
    const { inCombat, isDying, isHurt } = useSituationStore.getState();

    if (isDying) {
      set({
        totalFrames: 6,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: 300,
        characterImage: `url("/game_images/character-wizard/Fire vizard/Dead.png")`,
      });
    } else if (isHurt) {
      set({
        totalFrames: 3,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: 200,
        characterImage: `url("/game_images/character-wizard/Fire vizard/Hurt.png")`,
      });
    } else if (inCombat) {
      set({
        totalFrames: 14,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: 30000 / typingSpeed,
        characterImage: `url("/game_images/character-wizard/Fire vizard/Flame_jet.png")`,
      });
    } else if (typingSpeed > 200) {
      set({
        totalFrames: 8,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: 100,
        characterImage: `url("/game_images/character-wizard/Fire vizard/Run.png")`,
      });
    } else if (typingSpeed > 0) {
      set({
        totalFrames: 6,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: 200,
        characterImage: `url("/game_images/character-wizard/Fire vizard/Walk.png")`,
      });
    } else {
      set({
        totalFrames: 7,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: 300,
        characterImage: `url("/game_images/character-wizard/Fire vizard/Idle.png")`,
      });
    }
  },

  reduceHp: (amount) => {
    set((state) => {
      const newHp = Math.max(state.hp - amount, 0);
      return {
        hp: newHp,
        ...(newHp <= 0 && {
          totalFrames: 6,
          frameWidth: 200,
          frameHeight: 200,
          frameDuration: 300,
          characterImage: `url("/game_images/character-wizard/Fire vizard/Dead.png")`,
        })
      }
    })
  }
}))