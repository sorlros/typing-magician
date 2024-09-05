"use client";

import anime from 'animejs';
import { useEffect, useRef } from "react";
import Image from 'next/image';
import { useTypingStore } from '@/store/use-typing-store';

const Background = () => {
  const AnimeRef = useRef<HTMLDivElement | null>(null);
  const typingSpeed = useTypingStore(state => state.typingSpeed);

  useEffect(() => {
    if (AnimeRef.current) {
      const animation = anime({
        targets: AnimeRef.current,
        translateX: [0, -700], // 왼쪽으로 이동, 음수로 설정
        duration: 3000,
        easing: 'linear', // 부드럽게 반복
        loop: true, // 무한 반복
      });

      return () => {
        animation.pause();
      };
    }
  }, [typingSpeed]);

  return (
    <div className="w-full h-full overflow-hidden">
      <div ref={AnimeRef} className="flex w-[2100px] h-[200px]"> {/* 2개의 이미지를 나란히 배치 */}
        <Image 
          src={`/game_images/background/PNG/Battleground1/Bright/Battleground1.png`}
          alt="background-1"
          width={700}
          height={200}
          className="w-[700px] h-[200px]" // 각각의 이미지 크기를 설정
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
