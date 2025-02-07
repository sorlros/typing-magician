import anime from 'animejs';
import { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { useTypingStore } from '@/store/typing-store';
import { useMonsterStore } from '@/store/monster-store';
import useStageStore from '@/store/stage-store';

const Background = () => {
  const animeRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  const typingSpeed = useTypingStore(state => state.cpm);
  const appearMonster = useMonsterStore(state => state.appearMonster);
  const backgroundImage = useStageStore(state => state.stageImage);

  useEffect(() => {
    // console.log("appearMonster", appearMonster)

    if (animeRef.current) {
      if (!animationRef.current) {
        // 애니메이션 초기화
        animationRef.current = anime({
          targets: animeRef.current,
          translateX: ["0px", "-4200px"],
          easing: "linear",
          duration: 20000,
          loop: true,
          autoplay: true,
        });
      }

      if (appearMonster) {
        if (animationRef.current) {
          // 애니메이션 일시 정지
          animationRef.current.pause();
        }
      } else {
        if (typingSpeed > 0) {
          if (animationRef.current) {
            animationRef.current.play(); // 즉시 재개
          }
        } else {
          if (animationRef.current) {
            animationRef.current.pause(); // 타이핑 속도가 0일 때 정지
          }
        }
      }
    }
  }, [typingSpeed, appearMonster]);

  const backgroundImages = () => (
    <>
      {[...Array(6)].map((_, index) => (
        <Image
          key={index}
          src={backgroundImage}
          alt="background-image"
          width={700}
          height={200}
          className="w-[700px] h-[200px]"
        />
      ))}
    </>
  );

  return (
    <div className="w-full h-full overflow-hidden">
      <div ref={animeRef} className="flex w-[4200px] h-[200px]">
        {backgroundImages()}
      </div>
    </div>
  );
};

export default Background;
