import { InteractEffect } from "@/store/use-interact-store";
import Background from "./game-area/background";
import Character from "./game-area/character";
import Monster from "./game-area/monster";
import React from "react";

const GameComponent = () => {

  // const MemoizedInteractEffect = React.memo(InteractEffect);
  return (
    <div className="flex w-full h-[200px] relative overflow-hidden">
      <InteractEffect />
      <div className="w-full h-full z-10">
        <Background />
      </div>
      
      <div className="w-full h-[200px] absolute left-[20%] top-0 z-50">
        <Character />
      </div>

      <div className="w-full h-full absolute inset-0 z-50">
        <Monster />
      </div>
    </div>
  )
}

export default GameComponent;