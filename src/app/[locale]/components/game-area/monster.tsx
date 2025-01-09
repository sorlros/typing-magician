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
  const [display, setDisplay] = useState("none");
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
  const { monsterAction, characterAction, inAction, setInActionToggle, setIsLoading, isLoading } = useInteractStore();
  const { typingSpeed } = useTypingStore(useShallow((state) => ({ typingSpeed: state.cpm })),);

  useEffect(() => {
    updateMonsterSettings(monsterAction);
  }, [monsterAction]);

  useEffect(() => {
    let animationFrameId: number;
    let lastFrameTime = performance.now();
  
    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTime;
  
      if (elapsed >= frameDuration) {
        setFrame((prevFrame) => {
          const nextFrame = (prevFrame + 1) % totalFrames;
  
          // 모든 프레임이 끝난 후(마지막 프레임에서 첫 프레임으로 넘어가기 전)
          if (nextFrame === 0 && monsterAction === "Hurt") {
            monsterReduceHp(1);
            // console.log("몬스터가 공격을 받았습니다.");
  
            if (characterAction === "Skill") {
              monsterReduceHp(30);
              console.log("캐릭터가 스킬을 사용했습니다.");
            }
          }
  
          if (monsterAction === "Dead") {
            if (prevFrame === totalFrames - 1) {
              // console.log("몬스터가 사망했습니다.");
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
  
  
  // isLoading 값 위치 찾기
  useEffect(() => { 
    if (appearMonster && modalState === "close") {
      setIsLoading(true);
      setDisplay("block");

      setTimeout(() => {
        // setDisplay("block");
        setPosition("50%");
      }, 1500);
      setIsLoading(false);
    }
  }, [appearMonster, modalState, isLoading]);

  useEffect(() => {
    if (monsterHP === 0) {
      setTimeout(() => {
        setDisplay("none");
        setTimeout(() => {
          setPosition("110%");
        }, 100);
        setAppearMonster(false);
        setMonsterNumber();
      }, 1500);
    }
  }, [monsterHP]);

  useEffect(() => {
    const shouldSpawnMonster = () => {
      const hasMonsterDead = monsterAction === "Dead";
      // const enoughTimePassed = totalTypedCharacters > atLastMonster + 700;
      const isTypingActive = typingSpeed > 80;

      return hasMonsterDead && !appearMonster && isTypingActive;
    };

    if (shouldSpawnMonster()) {
      console.log("첫 spawn 지점 ㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐㅐ");
      setTimeout(() => {
        console.log("몬스터 출현 ㅁㅇㅁㅇㄴㅇㅁㅇㅇㅇㅇㅁㄴㅇ");
        // setMonsterNumber();
        setAppearMonster(true);
      }, 7000)
    }
  }, [typingSpeed, appearMonster, monsterHP]);

  // 첫번째 몬스터 이후 몬스터 UI가 나타나지 않는 문제

  const prevAppearMonster = useRef(appearMonster);

  // const handleTransitionEnd = () => {
  //   if (prevAppearMonster.current !== appearMonster) {
  //     // console.log("AAAAAAAAAA");
  //     setInActionToggle();
  //     console.log("mooo, appearMonster", appearMonster);
  //     console.log("mooo, actionToggle", inAction);
  //     prevAppearMonster.current = appearMonster; // 현재 상태값을 업데이트
      
  //   }
  // };
  
  return (
    <>
      <InteractEffect />
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