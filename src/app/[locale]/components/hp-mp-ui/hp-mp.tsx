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
    <div className="flex flex-col w-[98px] h-[12px]">
      <div 
        className="relative w-full h-full inline-block overflow-hidden"
        style={{
          width: `${Math.max((hp / 100) * 100, 0)}%`,
          transition: "width 0.3s ease-in-out"
        }}
      >
        <Image src="/game_images/UI/hp_bar.png" alt="hp" fill />
      </div>
    </div>
  );
};

export default HpAndMp;
