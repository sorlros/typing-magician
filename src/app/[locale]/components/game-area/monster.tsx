"use client";

import Image from "next/image";
import { DotsProps } from "../../../libs/types";
import { useEffect, useState } from "react";
import { useTypingStore } from "@/store/use-typing-store";
import { useCharacterStore } from "@/store/use-character-store";
import HpAndMp from "../hp-mp-ui/hp-mp";
import { useMonsterStore } from "@/store/use-monster-store";

const Monster = () => {
  const [frame, setFrame] = useState(0); // 현재 프레임 인덱스
  const [hidden, setHidden] = useState(true);

  const { typedCharacters } = useTypingStore();

  const typingSpeed = useTypingStore(state => state.cpm);

  const { totalFrames, frameWidth, frameHeight, frameDuration, monster, updateMonsterSettings, monsterCondition } = useMonsterStore(state => ({
    monster: state.monster,
    totalFrames: state.totalFrames,
    frameWidth: state.frameWidth,
    frameHeight: state.frameHeight,
    frameDuration: state.frameDuration,
    updateMonsterSettings: state.updateMonsterSettings,
    monsterCondition: state.monsterCondition
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % totalFrames); // 다음 프레임으로 이동, 마지막 프레임 이후 첫 프레임으로
    }, frameDuration);

    return () => clearInterval(interval);
  }, [frameDuration, totalFrames]);

  useEffect(() => {
    updateMonsterSettings();
  }, [typedCharacters, monsterCondition, updateMonsterSettings]);

  useEffect(() => {
    if (monster.monsterNumber !== 0) {
      setHidden(false);
    }
  }, [monster.monsterNumber])
  
  return (
    <>
      <div className="flex w-full h-full relative">
        {/* <div className="absolute top-12 left-[70px] z-50">
          <HpAndMp />
        </div> */}
        <div
          className={`absolute right-10 transform scale-x-[-1] ${hidden ? "hidden" : "block"}`}
          style={{  
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            backgroundImage: `${monster.monsterImage}`,
            backgroundPosition: `-${frame * frameWidth}px 0px`,
            backgroundSize: `${frameWidth * totalFrames}px 200px`,
          }}
        />
      </div>
    </>
  )
}

export default Monster;