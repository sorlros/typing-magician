"use client";

import Image from "next/image";
import { DotsProps } from "../../../libs/types";
import { useEffect, useState } from "react";
import { useTypingStore } from "@/store/use-typing-store";
import { useCharacterStore } from "@/store/use-character-store";
import HpAndMp from "../hp-mp-ui/hp-mp";
import { useMonsterStore } from "@/store/use-monster-store";
import useMonsterSituationStore from "@/store/use-monster-situation-store";
import useCharacterSituationStore from "@/store/use-character-situation-store";

const Monster = () => {
  const [frame, setFrame] = useState(0); // 현재 프레임 인덱스
  const [hidden, setHidden] = useState<boolean>(true);
  const [position, setPosition] = useState("110%");

  const { typedCharacters } = useTypingStore();

  const typingSpeed = useTypingStore(state => state.cpm);

  const { totalFrames, frameWidth, frameHeight, frameDuration, monster, updateMonsterSettings, appearMonster } = useMonsterStore(state => ({
    monster: state.monster,
    totalFrames: state.totalFrames,
    frameWidth: state.frameWidth,
    frameHeight: state.frameHeight,
    frameDuration: state.frameDuration,
    updateMonsterSettings: state.updateMonsterSettings,
    appearMonster: state.appearMonster
  }));

  const monsterSituation = useMonsterSituationStore();
  const characterSituation = useCharacterSituationStore();

  useEffect(() => {
    updateMonsterSettings();
  }, [typedCharacters, updateMonsterSettings]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => {
        // console.log("111", monsterSituation.isHurt)
        const nextFrame = (prevFrame + 1) % totalFrames;
        
        // if (nextFrame === 0 && monsterSituation.inCombat) {
        //   console.log('마지막 프레임에 도달했습니다!');
        //   setTimeout(() => {
        //     monsterSituation.setMonsterSituations("isDying");
        //   }, 150);
        // }
        return nextFrame;
      });
    }, frameDuration);
  
    return () => clearInterval(interval);
  }, [frameDuration, totalFrames]);

  useEffect(() => {
    if (appearMonster) {
      setHidden(false);
      setTimeout(() => {
        setPosition("50%");
      }, 100);
    }
  }, [typedCharacters, appearMonster]);

  const handleTransitionEnd = () => {
    characterSituation.setCharacterSituations("inCombat");
    monsterSituation.setMonsterSituations("inCombat");
  } // 이 부분 수정할 것

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
      <div className="flex w-full h-full"
        style={{
          position: "absolute",
          left: position,
          transition: "left 3s ease",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* <div className="absolute top-12 left-[70px] z-50">
          <HpAndMp />
        </div> */}
        
        <div
          className={`absolute transform translate scale-x-[-1]`}
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