import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";
import useCharacterSituationStore from "./use-character-situation-store";
import { useInteractStore } from "./use-interact-store";

interface CharacterState {
  totalFrames: number; // 스프라이트 시트에 있는 총 프레임 수
  frameWidth: number; // 각 프레임의 너비 (px)
  frameHeight: number; // 각 프레임의 높이 (px)
  frameDuration: number;
  characterImage: string;
  hp: number;
  updateCharacterSettings: (action: string) => void;
  reduceHp: (amount: number) => void;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  totalFrames: 7,
  frameWidth: 200,
  frameHeight: 200,
  frameDuration: 300,
  characterImage: `url("/game_images/character-wizard/Fire vizard/Idle.png")`,
  hp: 100,
  updateCharacterSettings: (characterAction) => {
    const typingSpeed = useTypingStore.getState().cpm;
    // const { inCombat, isDying, isHurt } = useCharacterSituationStore.getState();
    // const { characterAction } = useInteractStore.getState();
    console.log("current", characterAction);

    if (characterAction === "Dead") {
      set({
        totalFrames: 6,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: 300,
        characterImage: `url("/game_images/character-wizard/Fire vizard/Dead.png")`,
      });
    } else if (characterAction === "Hurt") {
      set({
        totalFrames: 3,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: 200,
        characterImage: `url("/game_images/character-wizard/Fire vizard/Hurt.png")`,
      });
    } else if (characterAction === "Attack") {
      set({
        totalFrames: 4,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: Math.max(100, Math.min(10000 / typingSpeed, 1000)),
        characterImage: `url("/game_images/character-wizard/Fire vizard/Attack_2.png")`,
      });
    } else if (characterAction === "Idle" && typingSpeed > 150) {
      set({
        totalFrames: 8,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: 100,
        characterImage: `url("/game_images/character-wizard/Fire vizard/Run.png")`,
      });
    } else if (characterAction === "Idle" && typingSpeed > 0) {
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