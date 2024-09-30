import React, { useEffect } from 'react'
import Image from 'next/image'

const HpAndMp = () => {
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