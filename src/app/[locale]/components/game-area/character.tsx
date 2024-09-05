"use client";

import Image from "next/image";
import { DotsProps } from "../../../libs/types";
import { useEffect, useState } from "react";
import { useTypingStore } from "@/store/use-typing-store";
import { useCharacterStore } from "@/store/use-character-store";



const character = () => {
  const [frame, setFrame] = useState(0); // 현재 프레임 인덱스
  const [image, setImage] = useState(0);

  const typingSpeed = useTypingStore(state => state.typingSpeed);

    const { totalFrames, frameWidth, frameHeight, frameDuration, characterImage, updateCharacterSettings } = useCharacterStore(state => ({
      totalFrames: state.totalFrames,
      frameWidth: state.frameWidth,
      frameHeight: state.frameHeight,
      frameDuration: state.frameDuration,
      characterImage: state.characterImage,
      updateCharacterSettings: state.updateCharacterSettings
  }));

  useEffect(() => {
    // 타이핑 속도가 변경될 때 상태 업데이트 호출
    updateCharacterSettings();
  }, [typingSpeed, updateCharacterSettings]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % totalFrames); // 다음 프레임으로 이동, 마지막 프레임 이후 첫 프레임으로
    }, frameDuration);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 해제
  }, []);
  
  return (
    <>
      <div
        style={{
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
          backgroundImage: `${characterImage}`,
          backgroundPosition: `-${frame * frameWidth}px 0px`, // 프레임에 따라 위치 변경
          backgroundSize: `1400px`, // 전체 스프라이트 시트 크기
        }}
      />
    </>
  )
}

export default character;