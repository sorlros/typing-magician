"use client";

import { useEffect, useRef, useState } from "react";
import { useTypingStore } from "@/store/use-typing-store";
import HpAndMp from "../hp-mp-ui/hp-mp";
import { useMonsterStore } from "@/store/use-monster-store";
import useStageStore from "@/store/use-stage-store";
import { InteractEffect, useInteractStore } from "@/store/use-interact-store";
import { useShallow } from "zustand/react/shallow";

const Monster = () => {
  const [frame, setFrame] = useState(0); // 현재 프레임 인덱스
  const [position, setPosition] = useState("110%");
  const [display, setDisplay] = useState("default");
  const [isSpawning, setIsSpawning] = useState(false);
  // const [atLastMonster, setAtLastMonster] = useState<number>(0);

  const { totalFrames, frameWidth, frameHeight, frameDuration, monsterNumber, setMonsterNumber, monsterImage, monsterHP, updateMonsterSettings, appearMonster, setAppearMonster, monsterReduceHp } = useMonsterStore(state => ({
    monsterNumber: state.monsterNumber,
    setMonsterNumber: state.setMonsterNumber,
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
  const { monsterAction, characterAction, inAction, setInActionToggle, setIsLoading, isLoading, setCharacterAction, setMonsterAction } = useInteractStore();
  const { typingSpeed } = useTypingStore(useShallow((state) => ({ typingSpeed: state.cpm })),);

  useEffect(() => {
    updateMonsterSettings(monsterAction);
  }, [monsterAction]);

  useEffect(() => {
    let animationFrameId: number;
    let lastFrameTime = performance.now();
    let hasUsedSkill = false; // 스킬 사용 여부를 추적하는 로컬 변수
  
    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime;
  
      if (elapsed >= frameDuration) {
        setFrame((prevFrame) => {
          const nextFrame = (prevFrame + 1) % totalFrames;
  
          // 모든 프레임이 끝난 후(마지막 프레임에서 첫 프레임으로 넘어가기 전)
          if (nextFrame === 0 && monsterAction === "Hurt") {
            monsterReduceHp(2);
            // console.log("몬스터가 공격을 받았습니다.");
  
            if (characterAction === "Skill" && !hasUsedSkill) {
              monsterReduceHp(30);
              console.log("캐릭터가 스킬을 사용했습니다.");
              hasUsedSkill = true; // 스킬 사용 상태를 업데이트
            }
          }
  
          if (monsterAction === "Dead") {
            if (prevFrame === totalFrames - 1) {
              return prevFrame; // 마지막 프레임 유지
            }
            return prevFrame + 1; // 마지막 프레임에 도달하기까지 계속 증가
          }
  
          return nextFrame;
        });
  
        lastFrameTime = currentTime;
      }
  
      animationFrameId = requestAnimationFrame(animate);
    };
  
    animationFrameId = requestAnimationFrame(animate);
  
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [frameDuration, totalFrames, monsterAction, characterAction, monsterReduceHp]);
  
  
  useEffect(() => { 
    if (appearMonster && modalState === "close") {
      // console.log("현재 상태 in", appearMonster, modalState, isLoading)
      setDisplay("visible");
      setPosition("110%");
    
      const timeoutId = setTimeout(() => {
        // setAppearMonster(true);
        setPosition("50%");
        // setIsLoading(false);
        // console.log("현재 상태 out", appearMonster, modalState, isLoading)
      }, 1000)
      
      return () => clearTimeout(timeoutId)
      // setIsLoading(false);
    }
  }, [appearMonster, modalState]);

  useEffect(() => {
    if (monsterHP === 0 && appearMonster) {
      setTimeout(() => {
        setDisplay("hidden");
        setTimeout(() => {
          setPosition("110%");
          setCharacterAction("Idle"); // 캐릭터 상태 초기화
          setMonsterAction("Idle"); // 몬스터 상태 초기화
        }, 100);
        
        // setAppearMonster(false);
        // console.log("몬스터체력 0", appearMonster);
        // setMonsterNumber();
      }, 1000);
    }
  }, [monsterHP, appearMonster]);

  // 몬스터 제거후 appearMonster 타이밍 재조정할 것
  useEffect(() => {
    const shouldSpawnMonster = () => {
      const hasMonsterDead = monsterHP === 0;
      // const enoughTimePassed = totalTypedCharacters > atLastMonster + 700;
      const isTypingActive = typingSpeed > 80;
      const hidden = display === "hidden";

      return hasMonsterDead && !appearMonster && isTypingActive && hidden && !isSpawning;
    };

    if (shouldSpawnMonster()) {
      setIsSpawning(true);
      console.log("첫 spawn 지점");

      setTimeout(() => {
        setMonsterNumber();
        setAppearMonster(true);
        setIsSpawning(false);
      }, 6000)
    }
  }, [typingSpeed, appearMonster, monsterHP, isSpawning]);

  const handleTransitionEnd = () => {
    if (position === "110%" && display === "hidden") {
      setTimeout(() => {
        setAppearMonster(false); // 애니메이션 완료 후 상태 업데이트
      }, 100);
      console.log("When the position is 110%");
    }
  };
  
  return (
    <>
      {/* <InteractEffect /> */}
      <div className="flex w-full h-full"
        style={{
          position: "absolute",
          left: position,
          opacity: display === "hidden" ? 0 : 1,
          transition: "left 1.5s ease, opacity 0.7s ease",
        }}
        onTransitionEnd={handleTransitionEnd}
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