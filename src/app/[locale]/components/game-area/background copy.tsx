import anime from 'animejs';
import { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { useTypingStore } from '@/store/use-typing-store';
import useSituationStore from '@/store/use-situation-store';

const Background = () => {
  const animeRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  const typingSpeed = useTypingStore(state => state.cpm);
  const situation = useSituationStore();

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
      // 애니메이션 인스턴스가 없을 때 초기화
      if (!animationRef.current) {
        animationRef.current = anime({
          targets: animeRef.current,
          translateX: ["0%", "-100%"], // 왼쪽으로 이동
          easing: "linear",
          duration: 20000,
          loop: true,
          autoplay: false,
        });
      }

      if (situation.inCombat) {
        animationRef.current.pause();
      } else {
        if (newSpeedLevel !== currentSpeedLevel) {
          setCurrentSpeedLevel(newSpeedLevel);

          if (newSpeedLevel > 0) {
            const newDuration = 20000 / newSpeedLevel; 
            animationRef.current.duration = newDuration;
            animationRef.current.play();
          } else {
            animationRef.current.pause();
          }
        }
      }
    }

  }, [typingSpeed, currentSpeedLevel, situation.inCombat]);

  useEffect(() => {
    console.log("typingSpeed", typingSpeed);
  }, [typingSpeed])

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
