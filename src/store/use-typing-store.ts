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
  decreaseCPM: () => void;
  resetTyping: () => void;
  sentenceNumber: number;
  addSentenceNumber: () => void;
}

export const useTypingStore = create<TypingState>((set, get) => ({
  startTime: null,
  lastTypedTime: Date.now(),
  typedCharacters: 0,
  totalTypedCharacters: 0, // 초기화
  totalElapsedTime: 0, // 초기화
  cpm: 0,
  correctCharacters: 0,
  accuracy: 100,
  sentenceNumber: 0,
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
    const { startTime, cpm, totalTypedCharacters, totalElapsedTime, accuracy } = get();

    if (startTime === null) {
      set({
        startTime: Date.now(),
      });
      return 0;
    }

    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000; // 초 단위

    // 최소 1초 이상 경과한 경우에만 계산
    if (elapsedTime < 1) return cpm;

    const totalTime = (totalElapsedTime + elapsedTime) / 60; // 분 단위로 변환
    const adjustedAccuracy = accuracy / 100; // accuracy를 0~1 범위로 조정

    const updatedCPM = Math.round(totalTypedCharacters / totalTime * adjustedAccuracy);


    set({
      cpm: updatedCPM,
    });

    return updatedCPM;
  },
  decreaseCPM: () => {
    const { cpm } = get();
    set({
      cpm: Math.max(cpm - 10, 0),
    });
  },
  resetTyping: () => {
    const { totalTypedCharacters, totalElapsedTime, startTime } = get();

    // 새로운 문장이 시작될 때 누적 데이터는 유지
    const currentTime = Date.now();
    const sessionElapsedTime = startTime ? (currentTime - startTime) / 1000 : 0;

    set({
      startTime: Date.now(),
      lastTypedTime: Date.now(),
      typedCharacters: 0,
      totalElapsedTime: totalElapsedTime + sessionElapsedTime, // 누적 시간 업데이트
      correctCharacters: 0,
      accuracy: 100,
      cpm: 0, // updatedTypingSpeed 호출 시 재계산됨
    });
  },
}));
