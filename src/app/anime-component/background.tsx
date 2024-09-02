"use client";

import anime from 'animejs';
import { useEffect, useRef, useState } from "react";
import { DotsProps } from '../libs/types';
import Image from 'next/image';

const Background = ({ typingSpeed }: DotsProps) => {
  const AnimeRef = useRef<HTMLDivElement | null>(null);
  const [speed, setSpeed] = useState(typingSpeed);

  useEffect(() => {
    if (AnimeRef.current) {
      anime({
        targets: AnimeRef.current,
        translateX: 250,
        rotate: '1turn',
        duration: 800,
        easing: 'easeInOutSine'
      })
    }
  }, [])


  return (
    <div ref={AnimeRef} className="w-[">
      <Image 
        src={}
      />
    </div>
  )
}

export default Background;