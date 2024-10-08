"use client";

import Image from "next/image";
import { DotsProps } from "../../../libs/types";
import { useEffect, useState } from "react";
import { useTypingStore } from "@/store/use-typing-store";
import { useCharacterStore } from "@/store/use-character-store";
import HpAndMp from "../hp-mp-ui/hp-mp";
import { useMonsterStore } from "@/store/use-monster-store";
import useSituationStore from "@/store/use-situation-store";

const Monster = () => {
  const [frame, setFrame] = useState(0); // 현재 프레임 인덱스
  const [hidden, setHidden] = useState<boolean>(true);
  const [position, setPosition] = useState("110%");

  const { typedCharacters } = useTypingStore();

  const typingSpeed = useTypingStore(state => state.cpm);

  const { totalFrames, frameWidth, frameHeight, frameDuration, monster, updateMonsterSettings } = useMonsterStore(state => ({
    monster: state.monster,
    totalFrames: state.totalFrames,
    frameWidth: state.frameWidth,
    frameHeight: state.frameHeight,
    frameDuration: state.frameDuration,
    updateMonsterSettings: state.updateMonsterSettings,
  }));

  const { inUsual, inCombat, isDying, isHurt, setSituations } = useSituationStore(state => ({
    inUsual: state.inUsual,
    inCombat: state.inCombat,
    isDying: state.isDying,
    isHurt: state.isHurt,
    setSituations: state.setSituations
  }))

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % totalFrames); // 다음 프레임으로 이동, 마지막 프레임 이후 첫 프레임으로
    }, frameDuration);

    return () => clearInterval(interval);
  }, [frameDuration, totalFrames]);

  useEffect(() => {
    updateMonsterSettings();
  }, [typedCharacters, updateMonsterSettings]);

  useEffect(() => {
    if (typedCharacters > 99) {
      setHidden(false);
      setPosition("70%");
    }
  }, [typedCharacters]);

  // useEffect(() => {
  //   if (monsterCondition.isDying) {
  //     // 몬스터 사망 시 로직 (예: 사라지거나, 죽는 애니메이션 실행)
  //     setHidden(true);
  //   }
  // }, [monsterCondition]);

  if (hidden || !monster.monsterImage) {
    return null;
  }
  
  return (
    <>
      <div className="flex w-full h-full relative">
        {/* <div className="absolute top-12 left-[70px] z-50">
          <HpAndMp />
        </div> */}
        
        <div
          className={`absolute transform translate scale-x-[-1] ${position === "70%" ? "transition-all duration-3000 left-[70%]" : ""}`}
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