import { create } from "zustand";

interface TypingState {
  startTime: number | null;
  lastTypedTime: number;
  typedCharacters: number;
  totalTypedCharacters: number; // 추가: 누적된 입력된 문자 수
  totalElapsedTime: number; // 추가: 누적된 경과 시간
  cpm: number;
  correctCharacters: number;
  accuracy: number;
  setAccuracy: () => number;
  setCorrectCharacters: (correct: number) => void;
  setTypedCharacters: (char: number) => void;
  updatedTypingSpeed: () => number;
  // decreaseCPM: () => void;
  resetTyping: () => void;
  sentenceNumber: number;
  addSentenceNumber: () => void;
}

const initialState = {
  startTime: null,
  lastTypedTime: Date.now(),
  typedCharacters: 0,
  totalTypedCharacters: 0,
  totalElapsedTime: 0,
  cpm: 0,
  correctCharacters: 0,
  accuracy: 100,
  sentenceNumber: 0,
};


export const useTypingStore = create<TypingState>((set, get) => ({
  ...initialState,
  addSentenceNumber: () => {
    set((state) => ({
      sentenceNumber: state.sentenceNumber + 1,
    }));
  },
  setAccuracy: () => {
    const { typedCharacters, correctCharacters } = get();
  
    const updatedAccuracy = typedCharacters > 0
      ? Math.round((correctCharacters / typedCharacters) * 100)
      : 0;

    const roundedAccuracy = parseFloat((updatedAccuracy / 100).toFixed(2));
    
    set(() => ({
      accuracy: roundedAccuracy
    }))

    return roundedAccuracy;
  },
  setCorrectCharacters: (correct: number) => {
    set(() => ({
      correctCharacters: correct
    }));
  },
  setTypedCharacters: (char: number) => {
    const { totalTypedCharacters } = get();
    set(() => ({
      typedCharacters: char,
      totalTypedCharacters: totalTypedCharacters + char,
      lastTypedTime: Date.now(),
    }));
  },
  updatedTypingSpeed: () => {
    const { startTime, cpm, totalTypedCharacters, totalElapsedTime, accuracy, lastTypedTime } = get();

    if (startTime === null) {
      set({
        startTime: Date.now(),
      });
      return 0;
    }

    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000; // 초 단위
    // const elapsedTime = (currentTime - startTime) / 60000;

    // 최소 1초 이상 경과한 경우에만 계산
    if (elapsedTime < 1) return cpm;

    const totalTime = (totalElapsedTime + elapsedTime) / 60; // 분 단위로 변환
    const adjustedAccuracy = accuracy / 100; // accuracy를 0~1 범위로 조정

    const updatedCPM = Math.round(totalTypedCharacters / totalTime * adjustedAccuracy);


    set({
      cpm: updatedCPM,
    });

    if (currentTime - lastTypedTime > 1500) {
      set({
        cpm: Math.max(cpm - 10, 0),
      });
    }
  
    return get().cpm;

    // return updatedCPM;
  },
  resetTyping: () => {
    set({
      ...initialState,
      startTime: Date.now(),
      lastTypedTime: Date.now(),
    });
  },
}));
