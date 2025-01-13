"use client";

import { useEffect, useState } from "react";
import { useCharacterStore } from "@/store/use-character-store";
import HpAndMp from "../hp-mp-ui/hp-mp";
import { InteractEffect, useInteractStore } from "@/store/use-interact-store";
import { useShallow } from 'zustand/react/shallow';
import { useMonsterStore } from "@/store/use-monster-store";
import useStageStore from "@/store/use-stage-store";

const Character = () => {
  const [frame, setFrame] = useState(0);
  const {
    totalFrames,
    frameWidth,
    frameHeight,
    frameDuration,
    characterImage,
    characterHP,
    updateCharacterSettings,
    characterReduceHp
  } = useCharacterStore(
    useShallow((state) => ({
      totalFrames: state.totalFrames,
      frameWidth: state.frameWidth,
      frameHeight: state.frameHeight,
      frameDuration: state.frameDuration,
      characterImage: state.characterImage,
      characterHP: state.characterHP,
      updateCharacterSettings: state.updateCharacterSettings,
      characterReduceHp: state.characterReduceHp
    }))
  );

  const { characterAction, isLoading, setIsLoading } = useInteractStore();
  const appearMonster = useMonsterStore.getState().appearMonster;
  const modalState = useStageStore.getState().modalState;

  useEffect(() => {
    if (!isLoading) {
      updateCharacterSettings(characterAction);
    }
    // updateCharacterSettings(characterAction);
    // console.log("characterAction", characterAction);
  }, [characterAction, isLoading])

  useEffect(() => { 
    if (appearMonster && modalState === "close" && isLoading) {
      // setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
      }, 2500);
    } else {
      setIsLoading(false);
    }
  }, [appearMonster]);

  // useEffect(() => {
  //   console.log("isLoading in chacracter", isLoading);
  // }, [isLoading])

  useEffect(() => {
    let animationFrameId: number;
    let lastFrameTime = performance.now(); // 이전 프레임의 시간
  
    const updateFrame = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime; // 경과 시간 계산
  
      if (elapsed >= frameDuration) {
        setFrame((prevFrame) => {
          const nextFrame = (prevFrame + 1) % totalFrames;
  
          if (characterAction === "Dead" && prevFrame === totalFrames - 1) {
            return prevFrame; // 마지막 프레임 유지
          }
  
          if (nextFrame === 0 && characterAction === "Hurt") {
            characterReduceHp(3);
            // console.log("캐릭터가 공격을 받았습니다.");
          }
  
          return nextFrame;
        });
  
        lastFrameTime = currentTime; // 마지막 프레임 시간 갱신
      }
  
      animationFrameId = requestAnimationFrame(updateFrame);
    };
  
    animationFrameId = requestAnimationFrame(updateFrame);
  
    return () => cancelAnimationFrame(animationFrameId);
  }, [totalFrames, frameDuration, characterAction, characterReduceHp]);

  return (
    <>
      <InteractEffect />
      <div className="flex w-full h-full relative">
        <div className="absolute top-12 left-[70px] z-50">
          <HpAndMp hp={characterHP} />
        </div>
        <div
          className="absolute left-10 top-0 bottom-0 right-10"
          style={{  
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            backgroundImage: `${characterImage}`,
            backgroundPosition: `-${frame * frameWidth}px 0px`, // 프레임에 따라 위치 변경
            backgroundSize: `${frameWidth * totalFrames}px 200px`, // 전체 스프라이트 시트 크기
          }}
        />
      </div>
    </>
  )
}

export default Character;