import { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import { useTypingStore } from '@/store/use-typing-store';

const BackgroundCopy = () => {
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const [animationDuration, setAnimationDuration] = useState<number | null>(null);

  const typingSpeed = useTypingStore(state => state.cpm);
  const decreaseCPM = useTypingStore(state => state.decreaseCPM);

  useEffect(() => {
    const interval = setInterval(() => {
      decreaseCPM();
    }, 1000); // 1초마다 CPM 감소

    return () => clearInterval(interval);
  }, [decreaseCPM]);

  useEffect(() => {
    const getAnimationDuration = (speed: number) => {
      if (speed > 400) return 10;
      if (speed > 300) return 15;
      if (speed > 200) return 20;
      if (speed > 100) return 25;
      if (speed > 0) return 35;
      return null;
    };

    setAnimationDuration(getAnimationDuration(typingSpeed));
  }, [typingSpeed]);

  const backgroundImages = () => (
    <>
      {[...Array(3)].map((_, index) => (
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
      <div 
        ref={backgroundRef} 
        className="flex w-[2100px] h-[200px] animate-scroll"
        style={{
          animation: animationDuration 
            ? `scrollBackground ${animationDuration}s ease infinite` 
            : 'none'
        }}
      >
        {backgroundImages()}
      </div>
    </div>
  );
};

export default BackgroundCopy;
