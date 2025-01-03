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

  const { updateActions, characterAction } = useInteractStore();

  useEffect(() => {
    updateActions();
    updateCharacterSettings(characterAction);
    console.log("characterAction", characterAction);
  }, [characterAction, typingSpeed])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setFrame((prevFrame) => {
  //       // 캐릭터가 "Dead" 상태일 때 프레임 멈춤
  //       if (characterAction === "Dead") {
  //         if (prevFrame === totalFrames - 1) {
  //           clearInterval(interval); // Interval 정지
  //           console.log("캐릭터가 사망했습니다. 마지막 프레임에서 멈춥니다.");
  //           return prevFrame; // 마지막 프레임 유지
  //         }
  //         return prevFrame + 1; // 사망 애니메이션이 마지막 프레임에 도달할 때까지 증가
  //       }
  
  //       // Hurt 상태에서 체력 감소 로직 실행
  //       const nextFrame = (prevFrame + 1) % totalFrames;
  //       if (nextFrame === 0 && characterAction === "Hurt") {
  //         characterReduceHp(3); // 체력 감소
  //         console.log("캐릭터가 공격을 받았습니다.");
  //       }
  
  //       return nextFrame; // 기본 프레임 업데이트
  //     });
  //   }, frameDuration);
  
  //   return () => clearInterval(interval);
  // }, [frameDuration, totalFrames, characterAction]);
  useEffect(() => {
    let animationFrameId: number;
    let lastFrameTime = performance.now(); // 이전 프레임의 시간
  
    const updateFrame = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime; // 경과 시간 계산
  
      if (elapsed >= frameDuration) {
        setFrame((prevFrame) => {
          const nextFrame = (prevFrame + 1) % totalFrames;
  
          if (characterAction === "Dead" && prevFrame === totalFrames - 1) {
            console.log("캐릭터가 사망했습니다. 마지막 프레임에서 멈춥니다.");
            return prevFrame; // 마지막 프레임 유지
          }
  
          if (nextFrame === 0 && characterAction === "Hurt") {
            characterReduceHp(3);
            console.log("캐릭터가 공격을 받았습니다.");
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