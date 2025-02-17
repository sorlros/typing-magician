"use client";

import { useEffect, useRef } from "react";
import { useCharacterStore } from "@/store/character-store";
import HpAndMp from "../hp-mp-ui/hp-mp";
import { useInteractStore } from "@/store/interact-store";
import { useShallow } from "zustand/react/shallow";
import { useFrameAnimation } from "@/app/hooks/use-animation";

const Character = () => {
  const {
    totalFrames,
    frameWidth,
    frameHeight,
    frameDuration,
    characterImage,
    characterHP,
    updateCharacterSettings,
    characterReduceHp,
  } = useCharacterStore(
    useShallow((state) => ({
      totalFrames: state.totalFrames,
      frameWidth: state.frameWidth,
      frameHeight: state.frameHeight,
      frameDuration: state.frameDuration,
      characterImage: state.characterImage,
      characterHP: state.characterHP,
      updateCharacterSettings: state.updateCharacterSettings,
      characterReduceHp: state.characterReduceHp,
    }))
  );

  const { characterAction, setCharacterAction, useSpecial } = useInteractStore();
  const { frame } = useFrameAnimation({
    totalFrames,
    frameDuration,
    action: characterAction,
    onActionComplete: () => {
      if (characterAction === "Skill") {
        setTimeout(() => {
          setCharacterAction("Idle");
        }, 0);
      }
    },
  });

  useEffect(() => {
    updateCharacterSettings(characterAction);
  }, [characterAction, updateCharacterSettings]);

  // useEffect(() => {
  //   if (useSpecial && characterAction !== "Skill") {
  //     setCharacterAction("Skill");
  //   }
  // }, [useSpecial, characterAction, setCharacterAction]);

  return (
    <>
      <div className="flex w-[254px] h-full relative">
        <div className="absolute top-12 left-10 right-10 z-50">
          <HpAndMp type="character" />
        </div>
        <div
          className="absolute left-5 top-0 bottom-0 right-5"
          style={{
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            backgroundImage: `${characterImage}`,
            backgroundPosition: `-${frame * frameWidth}px 0px`, // 프레임에 따라 위치 변경
            backgroundSize: `${frameWidth * totalFrames}px 200px`, // 전체 스프라이트 시트 크기
            imageRendering: "pixelated"
          }}
        />
      </div>
    </>
  );
};

export default Character;