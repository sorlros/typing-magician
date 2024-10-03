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

  const { totalFrames, frameWidth, frameHeight, frameDuration, monster, updateMonsterSettings } = useMonsterStore(state => ({
    monster: state.monster,
    totalFrames: state.totalFrames,
    frameWidth: state.frameWidth,
    frameHeight: state.frameHeight,
    frameDuration: state.frameDuration,
    updateMonsterSettings: state.updateMonsterSettings
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % totalFrames); // 다음 프레임으로 이동, 마지막 프레임 이후 첫 프레임으로
    }, frameDuration);

    return () => clearInterval(interval);
  }, [frameDuration, totalFrames]);

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
          className={`absolute inset-0 ${hidden ? "hidden" : "block"}`}
          style={{  
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            backgroundImage: `${monster.monsterImage}`,
            backgroundPosition: `-${frame * frameWidth + 300}px 0px`, // 프레임에 따라 위치 변경
            backgroundSize: `${frameWidth * totalFrames}px 200px`, // 전체 스프라이트 시트 크기
          }}
        />
      </div>
    </>
  )
}

export default Monster;