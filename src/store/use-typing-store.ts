import { create } from "zustand";

interface TypingState {
  startTime: number | null;
  typedCharacters: number;
  typingSpeed: number; // WPM (Words per minute)
  updatedTypingSpeed: (typedCharacters: number) => void;
  resetTyping: () => void;
}

export const useTypingStore = create<TypingState>(( set, get ) => ({
  startTime: null,
  typedCharacters: 0,
  typingSpeed: 0,
  updatedTypingSpeed: (newTypedCharacters: number) => {
    const { startTime, typedCharacters } = get();

    if (startTime === null) {
      set({
        startTime: Date.now(),
        typedCharacters: newTypedCharacters,
      })
      return;
    }

    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000 / 60;
    const updatedTypingSpeed = (newTypedCharacters / 5) / elapsedTime;

    set({
      typedCharacters: newTypedCharacters,
      typingSpeed: updatedTypingSpeed,
    })
  },
  resetTyping: () => {
    set({
      startTime: null,
      typedCharacters: 0,
      typingSpeed: 0
    })
  }

}))