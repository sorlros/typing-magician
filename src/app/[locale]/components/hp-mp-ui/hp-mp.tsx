"use client";

import React from 'react'
import Image from 'next/image'

interface HpState {
  hp: number;
}

const HpAndMp = ({ hp }: HpState) => {
  const getHpWidth = (hp: number) => {
    return Math.max((hp / 100) * 100, 0); // 최소값 0
  };

  return (
    <div className="flex flex-col w-full h-[100px]">
      <div 
        className="relative h-[12px] inline-block overflow-hidden"
        style={{
          width: `${getHpWidth(hp)}%`,
          transition: "width 0.3s ease-in-out"
        }}  
      >
        <Image src="/game_images/UI/hp_bar.png" alt="hp" className="absolute top-0 left-0" layout="fill"/>
        {/* <div className="absolute top-0 left-0 w-[90px] h-[7px] bg-white" /> */}
      </div>
      
      <div className="w-[90px] h-[12px] bg-transparent inline-block">
        {/* <Image src="/game_images/UI/mp_bar.png" alt="hp" width={100} height={50} className="object-cover"/>  */}
      </div>
    </div>
  )
}

export default HpAndMp