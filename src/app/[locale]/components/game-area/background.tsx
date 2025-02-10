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
  const monsterNumber = useMonsterStore(state => state.monsterNumber);
  const monsterHP = useMonsterStore(state => state.monsterHP);
  const setNextStage = useStageStore(state => state.setNextStage);

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
          animationRef.current.pause();
        }
      } else {
        if (typingSpeed > 0) {
          if (animationRef.current) {
            animationRef.current.play();
          }
        } else {
          if (animationRef.current) {
            animationRef.current.pause();
          }
        }
      }
    }
  }, [typingSpeed, appearMonster]);

  useEffect(() => {
    if (monsterNumber === 2 && monsterHP === 0) {
      const timeout = setTimeout(() => {
        setNextStage();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [monsterNumber, monsterHP]);

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
