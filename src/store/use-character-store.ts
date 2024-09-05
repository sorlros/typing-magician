import { create } from "zustand";
import { useTypingStore } from "./use-typing-store";

interface CharacterState {
  typingSpeed: number; // WPM (Words per minute)
  totalFrames: number; // 스프라이트 시트에 있는 총 프레임 수
  frameWidth: number; // 각 프레임의 너비 (px)
  frameHeight: number; // 각 프레임의 높이 (px)
  frameDuration: number;
  characterImage: string;
  updateCharacterSettings: () => void;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  typingSpeed: 0, // 기본값 설정
  totalFrames: 6,
  frameWidth: 200,
  frameHeight: 200,
  frameDuration: 300,
  characterImage: `url("/game_images/character-wizard/Fire vizard/Idle.png")`,
  updateCharacterSettings: () => {
    const typingSpeed = useTypingStore.getState().typingSpeed;

    if (typingSpeed > 0) {
      set({
        totalFrames: 6,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: 300
      });
    } else if (typingSpeed > 100) {
      set({
        totalFrames: 8,
        frameWidth: 200,
        frameHeight: 200,
        frameDuration: 300
      });
    }
  }
}))