"use client";

import { useEffect, useState } from "react";
import { useTypingStore } from "@/store/use-typing-store";
import { useCharacterStore } from "@/store/use-character-store";
import HpAndMp from "../hp-mp-ui/hp-mp";
import { useInteractStore } from "@/store/use-interact-store";
import { useShallow } from 'zustand/react/shallow';

const Character = () => {
  const [frame, setFrame] = useState(0);
  const [atFirst, setAtFirst] = useState(true);

  const typingSpeed = useTypingStore(state => state.cpm);

  const {
    totalFrames,
    frameWidth,
    frameHeight,
    frameDuration,
    characterImage,
    updateCharacterSettings,
    characterReduceHp
  } = useCharacterStore(
    useShallow((state) => ({
      totalFrames: state.totalFrames,
      frameWidth: state.frameWidth,
      frameHeight: state.frameHeight,
      frameDuration: state.frameDuration,
      characterImage: state.characterImage,
      updateCharacterSettings: state.updateCharacterSettings,
      characterReduceHp: state.characterReduceHp
    }))
  );

  const { updateActions, characterAction } = useInteractStore();

  useEffect(() => {
    updateCharacterSettings(characterAction);
  }, [characterAction, typingSpeed])

  useEffect(() => {
    updateActions();
  }, [typingSpeed])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setFrame((prevFrame) => (prevFrame + 1) % totalFrames);
  //   }, frameDuration);

  //   return () => clearInterval(interval); 
  // }, [frameDuration, totalFrames]);
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => {
        const nextFrame = (prevFrame + 1) % totalFrames;
  
        // 모든 프레임이 끝난 후(마지막 프레임에서 첫 프레임으로 넘어가기 전)
        if (nextFrame === 0 && characterAction === "Hurt") {
          // 체력 감소 로직 실행
          characterReduceHp(5); // 캐릭터의 체력 감소
          console.log("캐릭터가 공격을 받았습니다.");
        }
  
        return nextFrame;
      });
    }, frameDuration);
  
    return () => clearInterval(interval);
  }, [frameDuration, totalFrames, characterAction]);
  

  return (
    <>
      <div className="flex w-full h-full relative">
        <div className="absolute top-12 left-[70px] z-50">
          <HpAndMp />
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