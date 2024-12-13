import { create } from "zustand";

interface TypingState {
  startTime: number | null;
  typedCharacters: number;
  wpm: number; // WPM (Words per minute)
  cpm: number;
  correctCharacters: number;
  accuracy: number;
  setAccuracy: () => number;
  setCorrectCharacters: (correct: number) => void;
  setTypedCharacters: (char: number) => void;
  updatedTypingSpeed: () => number;
  decreaseCPM: () => void;
  resetTyping: () => void;
}

export const useTypingStore = create<TypingState>((set, get) => ({
  startTime: null,
  typedCharacters: 0,
  wpm: 0,
  cpm: 0,
  correctCharacters: 0,
  accuracy: 100,
  setAccuracy: () => {
    const { typedCharacters, correctCharacters } = get();
  
    const updatedAccuracy = typedCharacters > 0
      ? Math.round((correctCharacters / typedCharacters) * 100)
      : 0;

    const roundedAccuracy = parseFloat((updatedAccuracy / 100).toFixed(2));
    
    set(() => ({
      accuracy: roundedAccuracy
    }))

    // console.log("타이핑 정확도", roundedAccuracy);
    return roundedAccuracy;
  },
  setCorrectCharacters: (correct: number) => {
    set(() => ({
      correctCharacters: correct
    }));

    // console.log("correctCharacters", correct);
  },
  setTypedCharacters: (char: number) => {
    set(() => ({
      typedCharacters: char
    }))

    // console.log("typedCharacters", char);
  },
  
  // updatedTypingSpeed문 발동위치 개선할 것
  updatedTypingSpeed: () => {
    const { startTime, typedCharacters, accuracy } = get();

    if (startTime === null) {
      set({
        startTime: Date.now(),
      });
      return 0;
    }

    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000; // 초 단위로 변경

    // 최소 1초 이상 경과한 경우에만 계산
    if (elapsedTime < 1) return 0;

    const minutesElapsed = elapsedTime / 60;
    const updatedCPM = Math.round((typedCharacters / minutesElapsed) * accuracy);

    set({
      cpm: updatedCPM,
    });

    // console.log("실시간 cpm", updatedCPM);
    return updatedCPM;
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
      accuracy: 0,
    });
  },
}));
