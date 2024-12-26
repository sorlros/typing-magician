import React, { useEffect } from 'react'
import Image from 'next/image'
import { useCharacterStore } from '@/store/use-character-store'
import { useMonsterStore } from '@/store/use-monster-store';

const HpAndMp = () => {
  const characterHP = useCharacterStore((state) => state.characterHP);
  const monsterHP = useMonsterStore((state) => state.monsterHP);

  // 해야 할것
  // 캐릭터가 "Skill" 상태일 때 로직
  // HP MP의 UI 유동적으로 변경 로직
  // typingArea컴포넌트의 loadNextSentence시 monsterNumber값 변경
  useEffect(() => {

  },[])

  return (
    <div className="flex flex-col w-full h-[100px] items-center">
      <div className="w-[90px] h-[12px] bg-transparent inline-block">
        <Image src="/game_images/UI/hp_bar.png" alt="hp" width={90} height={50} /> 
      </div>
      
      <div className="w-[90px] h-[12px] bg-transparent inline-block">
        <Image src="/game_images/UI/mp_bar.png" alt="hp" width={90} height={50} /> 
      </div>
    </div>
  )
}

export default HpAndMp