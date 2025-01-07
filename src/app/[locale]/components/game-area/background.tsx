import anime from 'animejs';
import { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { useTypingStore } from '@/store/use-typing-store';
import useCharacterSituationStore from '@/store/use-character-situation-store';
import { useMonsterStore } from '@/store/use-monster-store';

const Background = () => {
  const animeRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  const typingSpeed = useTypingStore(state => state.cpm);
  const situation = useCharacterSituationStore();
  const appearMonster = useMonsterStore(state => state.appearMonster);

  const [currentSpeedLevel, setCurrentSpeedLevel] = useState(0);

  useEffect(() => {
    const getSpeedLevel = (speed: number): number => {
      if (speed > 400) return 5;
      if (speed > 300) return 4;
      if (speed > 200) return 3;
      if (speed > 100) return 2;
      if (speed > 0) return 1;
      return 0;
    };

    const newSpeedLevel = getSpeedLevel(typingSpeed);

    if (animeRef.current) {
      if (!animationRef.current) {
        // 애니메이션 초기화
        animationRef.current = anime({
          targets: animeRef.current,
          translateX: ["0%", "-100%"],
          easing: "linear",
          duration: 20000,
          loop: true,
          autoplay: false,
        });
      }

      // appearMonster에 따라 애니메이션 조정
      if (appearMonster) {
        if (animationRef.current) {
          anime({
            targets: animeRef.current,
            easing: "easeOutQuad",
            duration: 2000,
            update: () => {
              if (animationRef.current) {
                animationRef.current.pause();
              }
            },
          });
        }
      } else {
        if (newSpeedLevel !== currentSpeedLevel) {
          setCurrentSpeedLevel(newSpeedLevel);

          if (newSpeedLevel > 0) {
            const newDuration = 20000 / newSpeedLevel;
            if (animationRef.current) {
              animationRef.current.duration = newDuration;
              animationRef.current.play();
            }
          } else {
            animationRef.current?.pause();
          }
        }
      }
    }
  }, [typingSpeed, currentSpeedLevel, appearMonster]);

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
