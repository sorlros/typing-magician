import { create } from "zustand";

interface TypingState {
  startTime: number | null;
  typedCharacters: number;
  wpm: number; // WPM (Words per minute)
  cpm: number;
  updatedTypingSpeed: (typedCharacters: number) => void;
  resetTyping: () => void;
}

export const useTypingStore = create<TypingState>(( set, get ) => ({
  startTime: null,
  typedCharacters: 0,
  wpm: 0,
  cpm: 0,
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
    const updatedWPM = Math.round((newTypedCharacters / 5) / elapsedTime);
    const updatedCPM = Math.round(newTypedCharacters / elapsedTime);

    set({
      typedCharacters: newTypedCharacters,
      wpm: updatedWPM,
      cpm: updatedCPM,
    })
  },
  resetTyping: () => {
    set({
      startTime: null,
      typedCharacters: 0,
      wpm: 0,
      cpm: 0,
    })
  }

}))