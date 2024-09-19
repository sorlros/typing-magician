"use client";

import anime from 'animejs';
import { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { useTypingStore } from '@/store/use-typing-store';

const Background = () => {
  const animeRef = useRef<HTMLDivElement | null>(null);
  const typingSpeed = useTypingStore(state => state.cpm);
  const animationRef = useRef<any>(null);
  const [currentTranslateX, setCurrentTranslateX] = useState(0);

  useEffect(() => {
    if (animeRef.current) {
      const newTranslateX = typingSpeed === 0 ? currentTranslateX : currentTranslateX - (typingSpeed / 10); // 예시로 속도에 따라 이동 거리 조정
      animationRef.current = anime({
        targets: animeRef.current,
        translateX: [0, newTranslateX], // 현재 위치에서 새로운 위치로 이동
        easing: "linear",
        duration: typingSpeed === 0 ? Infinity : 10000,
        loop: false,
      });
  
      // 애니메이션이 끝날 때마다 위치 업데이트
      animationRef.current.finished.then(() => {
        setCurrentTranslateX(newTranslateX); // 새로운 위치로 업데이트
      });
    }
  }, [animeRef, currentTranslateX, typingSpeed]);

  return (
    <div className="w-full h-full overflow-hidden">
      <div ref={animeRef} className="flex w-[2100px] h-[200px]">
        <Image 
          src={`/game_images/background/PNG/Battleground1/Bright/Battleground1.png`}
          alt="background-1"
          width={700}
          height={200}
          className="w-[700px] h-[200px]"
        />
        <Image 
          src={`/game_images/background/PNG/Battleground1/Bright/Battleground1.png`}
          alt="background-2"
          width={700}
          height={200}
          className="w-[700px] h-[200px]"
        />
        <Image 
          src={`/game_images/background/PNG/Battleground1/Bright/Battleground1.png`}
          alt="background-3"
          width={700}
          height={200}
          className="w-[700px] h-[200px]"
        />
      </div>
    </div>
  );
};

export default Background;
