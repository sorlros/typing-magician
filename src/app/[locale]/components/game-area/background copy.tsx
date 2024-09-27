import anime from 'animejs';
import { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { useTypingStore } from '@/store/use-typing-store';

const Background = () => {
  const animeRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  const typingSpeed = useTypingStore(state => state.cpm);

  const [currentSpeedLevel, setCurrentSpeedLevel] = useState(0);

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

    if (animeRef.current) {
      // 애니메이션 인스턴스가 없을 때 초기화
      if (!animationRef.current) {
        animationRef.current = anime({
          targets: animeRef.current,
          translateX: ['0%', '-100%'], // 왼쪽으로 이동
          easing: 'linear',
          duration: 20000, // 기본 속도 설정, 나중에 조정
          loop: true, // 반복
          autoplay: false, // 자동 실행 방지
        });
      }

      // 새로운 속도 레벨을 반영
      if (newSpeedLevel !== currentSpeedLevel) {
        setCurrentSpeedLevel(newSpeedLevel);

        if (newSpeedLevel > 0) {
          // 속도가 0보다 크면 애니메이션 재생 및 속도 조정
          const newDuration = 20000 / newSpeedLevel; // 속도에 따른 duration 재조정
          animationRef.current.duration = newDuration;

          // 타이핑 속도가 증가하면 애니메이션 재개
          animationRef.current.play();
        } else {
          // 속도가 0이면 애니메이션 멈춤
          animationRef.current.pause();
        }
      }
    }
  }, [typingSpeed, currentSpeedLevel]);

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
