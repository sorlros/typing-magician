import { InteractEffect } from "@/store/use-interact-store";
import { DotsProps } from "../../libs/types";
import Background from "./game-area/background";
import Character from "./game-area/character";
import Monster from "./game-area/monster";
import HpAndSkills from "./hp-mp-ui/hp-mp";

const GameComponent = () => {
  return (
    <div className="flex w-full h-[200px] relative overflow-hidden">
      <InteractEffect />
      <div className="w-full h-full z-10">
        <Background />
      </div>
      
      <div className="w-full height-[200px] absolute left-[20%] top-0 z-50">
        <Character />
      </div>

      <div className="w-full h-full absolute inset-0 z-50">
        <Monster />
      </div>
    </div>
  )
}

export default GameComponent;