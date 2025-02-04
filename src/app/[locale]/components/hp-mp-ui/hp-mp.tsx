"use client";

import { useCharacterStore } from "@/store/use-character-store";
import { useMonsterStore } from "@/store/use-monster-store";
import Image from "next/image";

const HpAndMp = ({ type }: { type: "character" | "monster" }) => {
  const characterHP = useCharacterStore((state) => state.characterHP);
  const monsterHP = useMonsterStore((state) => state.monsterHP);

  const hp = type === "character" 
    ? characterHP
    : monsterHP

  return (
    <div className="flex flex-col w-full h-[100px]">
      <div 
        className="relative h-[12px] inline-block overflow-hidden"
        style={{
          width: `${Math.max((hp / 100) * 100, 0)}%`,
          transition: "width 0.3s ease-in-out"
        }}
      >
        <Image src="/game_images/UI/hp_bar.png" alt="hp" className="absolute top-0 left-0" layout="fill"/>
      </div>
    </div>
  );
};

export default HpAndMp;
