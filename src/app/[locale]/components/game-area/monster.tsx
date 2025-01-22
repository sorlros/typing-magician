"use client";

import { useEffect, useState } from "react";
import { useTypingStore } from "@/store/use-typing-store";
import HpAndMp from "../hp-mp-ui/hp-mp";
import { useMonsterStore } from "@/store/use-monster-store";
import useStageStore from "@/store/use-stage-store";
import { useInteractStore } from "@/store/use-interact-store";
import { useShallow } from "zustand/react/shallow";
import { useFrameAnimation } from "@/app/hook/use-animation";

const Monster = () => {
  const [position, setPosition] = useState("110%");
  const [display, setDisplay] = useState("default");
  const [isSpawning, setIsSpawning] = useState(false);

  const {
    totalFrames,
    frameWidth,
    frameHeight,
    frameDuration,
    monsterNumber,
    setMonsterNumber,
    monsterImage,
    monsterHP,
    updateMonsterSettings,
    appearMonster,
    setAppearMonster,
    monsterReduceHp,
  } = useMonsterStore((state) => ({
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
  const {
    monsterAction,
    characterAction,
    setCharacterAction,
    setMonsterAction,
  } = useInteractStore();
  const { typingSpeed } = useTypingStore(
    useShallow((state) => ({ typingSpeed: state.cpm }))
  );

  const { frame } = useFrameAnimation({
    totalFrames,
    frameDuration,
    action: monsterAction,
    // onActionComplete: () => {
    //   if (characterAction === "Skill") {
    //     // "Skill" 상태가 끝난 후 "Idle" 상태로 전환
    //     setMonsterAction("Idle");
    //   }
    // },
  });

  useEffect(() => {
    updateMonsterSettings(monsterAction);
  }, [monsterAction]);

  useEffect(() => {
    if (frame === 0 && monsterAction === "Hurt") {
      monsterReduceHp(2);

      if (characterAction === "Skill") {
        monsterReduceHp(30);
        console.log("캐릭터가 스킬을 사용했습니다.");
      }
    }
  }, [frame, monsterAction, characterAction, monsterReduceHp]);

  useEffect(() => {
    if (appearMonster && modalState === "close") {
      setDisplay("visible");
      setPosition("110%");

      const timeoutId = setTimeout(() => {
        setPosition("50%");
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [appearMonster, modalState]);

  useEffect(() => {
    if (monsterHP === 0 && appearMonster) {
      setTimeout(() => {
        setDisplay("hidden");
        setTimeout(() => {
          setPosition("110%");
          setCharacterAction("Idle");
          setMonsterAction("Idle");
        }, 100);
      }, 1000);
    }
  }, [monsterHP, appearMonster]);

  useEffect(() => {
    const shouldSpawnMonster = () => {
      const hasMonsterDead = monsterHP === 0;
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
      }, 6000);
    }
  }, [typingSpeed, appearMonster, monsterHP, isSpawning]);

  const handleTransitionEnd = () => {
    if (position === "110%" && display === "hidden") {
      setTimeout(() => {
        setAppearMonster(false);
      }, 100);
      console.log("When the position is 110%");
    }
  };

  return (
    <div
      className="flex w-full h-full"
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
        className="absolute transform translate scale-x-[-1]"
        style={{
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
          backgroundImage: `${monsterImage}`,
          backgroundPosition: `-${frame * frameWidth}px 0px`,
          backgroundSize: `${frameWidth * totalFrames}px 200px`,
        }}
      />
    </div>
  );
};

export default Monster;
