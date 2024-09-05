import { FileContentArray } from "@/app/libs/types";

interface TypingAreaProps {
  text: FileContentArray;
}

const TypingArea = ({ text }: TypingAreaProps) => {
  console.log("text", text)
  return (
    <div>
      <div>
        asdasd
      </div>
    </div> 
  )
}

export default TypingArea;