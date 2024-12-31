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
import useStageStore from "@/store/use-stage-store";
import { useInteractStore } from "@/store/use-interact-store";

const Monster = () => {
  const [frame, setFrame] = useState(0); // 현재 프레임 인덱스
  // const [hidden, setHidden] = useState<boolean>(true);
  const [position, setPosition] = useState("110%");
  const [display, setDisplay] = useState("none");

  const { typedCharacters } = useTypingStore();

  const typingSpeed = useTypingStore(state => state.cpm);

  const { totalFrames, frameWidth, frameHeight, frameDuration, monsterNumber, setMonsterNumber, monsterImage, monsterHP, updateMonsterSettings, appearMonster, setAppearMonster, monsterReduceHp } = useMonsterStore(state => ({
    monsterNumber: state.monsterNumber,
    setMonsterNumber: state.appearMonster,
    monsterImage: state.monsterImage,
    monsterHP: state.monsterHP,
    totalFrames: state.totalFrames,
    frameWidth: state.frameWidth,
    frameHeight: state.frameHeight,
    frameDuration: state.frameDuration,
    updateMonsterSettings: state.updateMonsterSettings,
    appearMonster: state.appearMonster,
    setAppearMonster: state.setAppearMonster,
    monsterReduceHp: state.monsterReduceHp,
  }));

  const { modalState } = useStageStore();
  const { updateActions, monsterAction, characterAction } = useInteractStore();
  // const characterAction = useCharacterStore(state => state.characterAction)

  useEffect(() => {
    updateMonsterSettings(monsterAction);
  }, [typedCharacters, updateMonsterSettings, monsterAction]);

  useEffect(() => {
    updateActions();
  }, [typingSpeed])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => {
        const nextFrame = (prevFrame + 1) % totalFrames;
  
        // 모든 프레임이 끝난 후(마지막 프레임에서 첫 프레임으로 넘어가기 전)
        if (nextFrame === 0 && monsterAction === "Hurt") {
          monsterReduceHp(1);
          console.log("몬스터가 공격을 받았습니다.");

          if (characterAction === "Skill") {
            monsterReduceHp(30);
            console.log("캐릭터가 스킬을 사용");
          }
        }

        if (monsterAction === "Dead") {
          if (prevFrame === totalFrames - 1) {
            clearInterval(interval); // Interval 정지
            console.log("몬스터가 사망했습니다.");
            return prevFrame; // 마지막 프레임 유지
          }
          return prevFrame + 1; // 마지막 프레임에 도달하기까지 계속 증가
        }
  
        return nextFrame;
      });
    }, frameDuration);
  
    return () => clearInterval(interval);
  }, [frameDuration, totalFrames, monsterAction]);

  useEffect(() => {
    if (appearMonster && modalState === "close") {
      setDisplay("block");

      setTimeout(() => {
        setPosition("50%");
      }, 500);
    }
  }, [typedCharacters, appearMonster]);

  useEffect(() => {
    if (monsterHP === 0) {
      console.log("000000000")
      setAppearMonster(false);
      // setMonsterNumber();
      setTimeout(() => {
        setDisplay("none");
        setPosition("110%");
      }, 1500)
    }
  }, [monsterHP]);

  // const handleTransitionEnd = () => {
  //   characterSituation.setCharacterSituations("inCombat");
  //   monsterSituation.setMonsterSituations("inCombat");
  // } // 이 부분 수정할 것

  // useEffect(() => {
  //   if (monsterCondition.isDying) {
  //     // 몬스터 사망 시 로직 (예: 사라지거나, 죽는 애니메이션 실행)
  //     setHidden(true);
  //   }
  // }, [monsterCondition]);
  
  return (
    <>
      <div className="flex w-full h-full"
        style={{
          position: "absolute",
          left: position,
          display: display,
          transition: "left 3s ease",
        }}
        // onTransitionEnd={handleTransitionEnd}
      >
       <div className="absolute top-12 left-[70px] z-50">
          <HpAndMp hp={monsterHP} />
        </div>
        
        <div
          className={`absolute transform translate scale-x-[-1]`}
          style={{ 
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            backgroundImage: `${monsterImage}`,
            backgroundPosition: `-${frame * frameWidth}px 0px`,
            backgroundSize: `${frameWidth * totalFrames}px 200px`,
          }}
        />
      </div>
    </>
  )
}

export default Monster;