"use client";

import { useEffect, useRef } from "react";
import { useCharacterStore } from "@/store/use-character-store";
import HpAndMp from "../hp-mp-ui/hp-mp";
import { useInteractStore } from "@/store/use-interact-store";
import { useShallow } from "zustand/react/shallow";
import { useFrameAnimation } from "@/app/hook/use-animation";

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

  const { characterAction, setCharacterAction, setUseSpecial, useSpecial } = useInteractStore();
  // const frame = useAnimation(totalFrames, frameDuration, characterAction);

  // const { frame } = useFrameAnimation({
  //   totalFrames,
  //   frameDuration,
  //   action: characterAction,
  //   onActionComplete: () => {
  //     setCharacterAction("Idle");
  //   }
  // });
  const { frame } = useFrameAnimation({
    totalFrames,
    frameDuration,
    action: characterAction,
    onActionComplete: () => {
      if (characterAction === "Skill") {
        console.log("SKILLLLLLLLLLLL")
        setCharacterAction("Idle"); // 스킬 실행 후 Idle로 전환
      }
    },
  });

  useEffect(() => {
    updateCharacterSettings(characterAction);
    // console.log(characterImage);
  }, [characterAction, updateCharacterSettings]);

  useEffect(() => {
    if (useSpecial && characterAction !== "Skill") {
      setCharacterAction("Skill"); // 스킬 실행
    }
  }, [useSpecial, characterAction, setCharacterAction]);

  useEffect(() => {
    if (characterAction === "Hurt" && frame === 0) {
      characterReduceHp(3);
    }
  }, [characterAction, frame, characterReduceHp]);

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
            imageRendering: "pixelated"
          }}
        />
      </div>
    </>
  );
};

export default Character;
