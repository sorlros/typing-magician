"use client";

import anime from 'animejs';
import { useEffect, useRef, useState } from "react";
import { DotsProps } from '../../../libs/types';
import Image from 'next/image';
import { useTypingStore } from '@/store/use-typing-store';

const Background = () => {
  const AnimeRef = useRef<HTMLDivElement | null>(null);
  // const [speed, setSpeed] = useState(typingSpeed);
  const typingSpeed = useTypingStore(state => state.typingSpeed);


  useEffect(() => {
    if (AnimeRef.current) {
      const animation = anime({
        targets: AnimeRef.current,
        translateX: [-1024, 0],
        // rotate: '1turn',
        duration: 20000,
        easing: 'easeInOutSine',
        loop: true
      })

      return () => {
        animation.pause();
      };
    }
  }, [])


  return (
    <div ref={AnimeRef} className="w-full h-full overflow-hidden">
      <div className="flex">
        <Image 
          src={`/game_images/background/PNG/Battleground1/Bright/Battleground1.png`}
          alt="background-1"
          width={1024}
          height={200}
        />
        <Image 
          src={`/game_images/background/PNG/Battleground1/Bright/Battleground1.png`}
          alt="background-1"
          width={1024}
          height={200}
        />
      </div>
    </div>
  )
}

export default Background;