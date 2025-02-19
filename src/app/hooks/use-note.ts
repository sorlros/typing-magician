import { useTypingStore } from "@/store/typing-store";
import { useState } from "react";

type SoundKey = "high" | "middle" | "low";

const celloSounds: Record<SoundKey, string[]> = {
  high: ["/sounds/high/b4-b3.wav", "/sounds/high/c4-c3.wav", "/sounds/high/d5-d4.wav", "/sounds/high/e5-e4.wav"],
  middle: ["/sounds/middle/a3-a2.wav", "/sounds/middle/e3-f2.wav", "/sounds/middle/e4-e3.wav", "/sounds/middle/f4-g3.wav"],
  low: ["/sounds/low/b2-b1.wav", "/sounds/low/c2-c1.wav", "/sounds/low/d3-d2.wav", "/sounds/low/e2-e1.wav", "/sounds/low/f2-g1.wav"],
};

const useNote = () => {
  const cpm = useTypingStore((state => state.cpm));

  const handleTyping = () => {
    const speed:SoundKey = cpm >= 250 ? "high" : cpm >= 150 ? "middle" : "low";

    playRandomCelloSound(speed);
  }

  const playRandomCelloSound = (speed: SoundKey) => {
    const soundArray = celloSounds[speed];
    if (!soundArray || soundArray.length === 0) return; // 유효성 검사
  
    const randomIndex = Math.floor(Math.random() * soundArray.length); // 랜덤 인덱스 선택
    const soundFile = soundArray[randomIndex];

    const audio = new Audio(soundFile);
  
    // 오디오가 로드되지 않거나 에러가 날 경우
    audio.addEventListener("error", () => {
      console.error(`해당 사운드파일 재생 오류: ${soundFile}`);
    });
  
    // 오디오가 종료 종료 후
    audio.addEventListener("ended", () => {
      audio.remove();
    });
  
    audio.play().catch((error) => {
      console.error("오디오 재생 오류", error);
    });
  };

  return { handleTyping };
}

export default useNote;