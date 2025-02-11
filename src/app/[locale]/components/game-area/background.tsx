import anime from 'animejs';
import { useEffect, useRef } from "react";
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

  const backgroundImages = () => (
    <>
      {[...Array(7)].map((_, index) => (
        <Image
          key={`first-${index}`}
          src={backgroundImage}
          alt="background-image"
          width={700}
          height={200}
          className="w-[700px] h-[200px]"
        />
      ))}
      {[...Array(7)].map((_, index) => (
        <Image
          key={`second-${index}`}
          src={backgroundImage}
          alt="background-image"
          width={700}
          height={200}
          className="w-[700px] h-[200px]"
        />
      ))}
    </>
  );

  useEffect(() => {
    if (animeRef.current) {
      if (!animationRef.current) {
        animationRef.current = anime({
          targets: animeRef.current,
          translateX: ["0px", "-4900px"],
          easing: "linear",
          duration: 20000,
          loop: true,
          autoplay: true,
        });
      }

      if (appearMonster) {
        animationRef.current.pause();
      } else {
        if (typingSpeed > 0) {
          animationRef.current.play();
        } else {
          animationRef.current.pause();
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

  return (
    <div className="w-full h-full overflow-hidden">
      <div ref={animeRef} className="flex w-[9800px] h-[200px]">
        {backgroundImages()}
      </div>
    </div>
  );
};

export default Background;
