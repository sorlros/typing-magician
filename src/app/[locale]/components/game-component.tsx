import { DotsProps } from "../../libs/types";
import Background from "./game-area/background";
import Character from "./game-area/character";
// { typingSpeed }: DotsProps
const GameComponent = () => {
  return (
    <div className="flex w-full h-[200px] relative">
      <div className="w-full h-full absolute">
        <Background />
      </div>
      
      <div>
        <Character />
      </div>
    </div>
  )
}

export default GameComponent;