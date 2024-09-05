import { DotsProps } from "../../libs/types";
import Background from "./game-area/background";
import Character from "./game-area/character";
// { typingSpeed }: DotsProps
const GameComponent = () => {
  return (
    <div className="flex w-full h-[200px] relative overflow-hidden">
      <div className="w-full h-full z-10">
        <Background />
      </div>
      
      <div className="w-full height-[200px] absolute left-10 bottom-5 z-50">
        <Character />
      </div>
    </div>
  )
}

export default GameComponent;