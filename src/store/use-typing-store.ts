import { create } from "zustand";

interface TypingState {
  startTime: number | null;
  typedCharacters: number;
  // totalTypedCharacters: number;
  wpm: number; // WPM (Words per minute)
  cpm: number;
  correctCharacters: number;
  accuracy: number;
  setCorrectCharacters: (correct: number) => void;
  setTypedCharacters: (char: number) => void;
  updatedTypingSpeed: (newTypedCharacters: number) => void;
  decreaseCPM: () => void;
  resetTyping: () => void;
}

export const useTypingStore = create<TypingState>((set, get) => ({
  startTime: null,
  typedCharacters: 0,
  // totalTypedCharacters: 0,
  wpm: 0,
  cpm: 0,
  correctCharacters: 0,
  accuracy: 100,
  setCorrectCharacters: (correct: number) => {
    set(() => ({
      correctCharacters: correct
    }));

    console.log("correctCharacters", correct);
  },
  setTypedCharacters: (char: number) => {
    set(() => ({
      typedCharacters: char
    }))

    console.log("typedCharacters", char);
  },
  
  // updatedTypingSpeed문 발동위치 개선할 것
  updatedTypingSpeed: () => {
    const { startTime, typedCharacters, correctCharacters, accuracy } = get();

    if (startTime === null) {
      set({
        startTime: Date.now(),
        // typedCharacters: Math.max(0, newTypedCharacters), 
      });
      return;
    }

    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000; // 초 단위로 변경

    // 최소 1초 이상 경과한 경우에만 계산
    if (elapsedTime < 1) return;

    const minutesElapsed = elapsedTime / 60;
    // const totalTypedCharacters = Math.max(0, typedCharacters + newTypedCharacters); // 음수 방지
    const totalCorrectCharacters = correctCharacters;

    // 정확도 계산
    const updatedAccuracy = typedCharacters > 0
      ? Math.round((totalCorrectCharacters / typedCharacters) * 100)
      : 0;
    
    // console.log("totalCorrectCharacters, totalTypedCharacters", totalCorrectCharacters, totalTypedCharacters)

    // const updatedWPM = Math.round((totalTypedCharacters / 5) / minutesElapsed); // 단어당 5글자 기준
    const roundedAccuracy = parseFloat((updatedAccuracy / 100).toFixed(2));
    const updatedCPM = Math.round((typedCharacters / minutesElapsed) * roundedAccuracy);

    set({
      // typedCharacters: totalTypedCharacters,
      // wpm: updatedWPM,
      cpm: updatedCPM,
      accuracy: updatedAccuracy, // 최신 정확도 업데이트
    });

    console.log("typedCharacters",typedCharacters);
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
      accuracy: 100,
    });
  },
}));
