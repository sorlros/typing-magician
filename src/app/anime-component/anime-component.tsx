import Background from "@/app/anime-component/background";
import { DotsProps } from "../libs/types";
import Character from "./character";

const DotsComponent = ({ typingSpeed }: DotsProps) => {
  return (
    <div className="flex w-full h-[200px]">
      <div className="w-full h-full">
        <Background typingSpeed={typingSpeed} />
      </div>
      
      <div>
        <Character typingSpeed={typingSpeed}/>
      </div>
    </div>
  )
}

export default DotsComponent;