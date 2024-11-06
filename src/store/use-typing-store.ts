import { create } from "zustand";

interface TypingState {
  startTime: number | null;
  typedCharacters: number;
  wpm: number; // WPM (Words per minute)
  cpm: number;
  correctCharacters: number;
  updatedTypingSpeed: (newTypedCharacters: number, correctChars: number) => void;
  decreaseCPM: () => void;
  resetTyping: () => void;
  typeAccuracy: () => number;
}

export const useTypingStore = create<TypingState>((set, get) => ({
  startTime: null,
  typedCharacters: 0,
  wpm: 0,
  cpm: 0,
  correctCharacters: 0,
  updatedTypingSpeed: (newTypedCharacters: number, correctChars: number) => {
    const { startTime, typedCharacters, correctCharacters } = get();

    if (startTime === null) {
      set({
        startTime: Date.now(),
        typedCharacters: newTypedCharacters,
        correctCharacters: correctChars,
      });
      return;
    }

    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000; // 초 단위로 변경

    // 최소 1초 이상 경과한 경우에만 계산
    if (elapsedTime < 1) return;

    const minutesElapsed = elapsedTime / 60;
    const totalTypedCharacters = typedCharacters + newTypedCharacters;
    const totalCorrectCharacters = correctCharacters + correctChars; // ?
    
    const updatedWPM = Math.round((totalTypedCharacters / 5) / minutesElapsed); // 단어당 5글자 기준
    const updatedCPM = Math.round(totalTypedCharacters / minutesElapsed); 

    set({
      typedCharacters: totalTypedCharacters,
      correctCharacters: totalCorrectCharacters,
      wpm: updatedWPM,
      cpm: updatedCPM,
    });
  },
  decreaseCPM: () => {
    const { cpm } = get();
    set({
      cpm: Math.max(cpm - 10, 0),
    });
  },
  resetTyping: () => {
    set({
      startTime: null,
      typedCharacters: 0,
      correctCharacters: 0,
      wpm: 0,
      cpm: 0,
    });
  },
  typeAccuracy: () => {
    const { typedCharacters, correctCharacters } = get();

    console.log("총 타이핑수", typedCharacters);
    console.log("올바르게 타아핑된 수", correctCharacters);

    return typedCharacters > 0
      ? Math.round((correctCharacters / typedCharacters) * 100)
      : 100;
  }
}));
