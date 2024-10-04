import { DotsProps } from "../../libs/types";
import Background from "./game-area/background";
import BackgroundCopy from "./game-area/background copy";
import Character from "./game-area/character";
import Monster from "./game-area/monster";
import HpAndSkills from "./hp-mp-ui/hp-mp";
// { typingSpeed }: DotsProps
const GameComponent = () => {
  return (
    <div className="flex w-full h-[200px] relative overflow-hidden">
      <div className="w-full h-full z-10">
        <BackgroundCopy />
      </div>
      
      <div className="w-full height-[200px] absolute left-10 top-0 z-50">
        <Character />
      </div>

      <div className="w-full h-full absolute right-10 top-0 z-50">
        <Monster />
      </div>
    </div>
  )
}

export default GameComponent;