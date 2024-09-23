"use client";

import anime from 'animejs';
import { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { useTypingStore } from '@/store/use-typing-store';

const Background = () => {
  const animeRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  const typingSpeed = useTypingStore(state => state.cpm);
  const decreaseCPM = useTypingStore(state => state.decreaseCPM);

  const [currentSpeedLevel, setCurrentSpeedLevel] = useState(0);
  const [currentTranslateX, setCurrentTranslateX] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      decreaseCPM();
    }, 1000); // 1초마다 CPM 감소

    return () => clearInterval(interval);
  }, [decreaseCPM]);

  useEffect(() => {
    const getSpeedLevel = (speed: number) => {
      if (speed > 400) return 5;
      if (speed > 300) return 4;
      if (speed > 200) return 3;
      if (speed > 100) return 2;
      if (speed > 0) return 1;
      return 0;
    };

    const newSpeedLevel = getSpeedLevel(typingSpeed);

    if (newSpeedLevel !== currentSpeedLevel) {
      setCurrentSpeedLevel(newSpeedLevel);

      if (animeRef.current) {
        if (animationRef.current) {
          animationRef.current.pause();
        }

        const distance = -1000 * newSpeedLevel;
        
        animationRef.current = anime({
          targets: animeRef.current,
          translateX: [currentTranslateX, distance],
          easing: "linear",
          duration: 5000,
          loop: true,
          update: function(anim) {
            setCurrentTranslateX(Number(anim.animations[0].currentValue));
          },
          loopComplete: function(anim) {
            const newTranslateX = Number(anim.animations[0].currentValue);
            setCurrentTranslateX(newTranslateX);
            // 애니메이션을 재시작하는 대신 새로운 애니메이션 인스턴스를 생성
            animationRef.current = anime({
              targets: animeRef.current,
              translateX: [newTranslateX, distance],
              easing: "linear",
              duration: 5000,
              loop: true,
              update: function(anim) {
                setCurrentTranslateX(Number(anim.animations[0].currentValue));
              }
            });
          }
        });

        if (newSpeedLevel > 0) {
          animationRef.current.play();
        }
      }
    }
  }, [typingSpeed, currentSpeedLevel, currentTranslateX]);

  const backgroundImages = () => (
    <>
      {[...Array(6)].map((_, index) => (
        <Image
          key={index}
          src={`/game_images/background/PNG/Battleground1/Bright/Battleground1.png`}
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
